import { NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";
import { redsysService } from '@/modules/payments/redsys.service';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    
    const paramsBase64 = formData.get('Ds_MerchantParameters') as string;
    const signature = formData.get('Ds_Signature') as string;

    if (!paramsBase64 || !signature) {
      return new NextResponse('Faltan parámetros', { status: 400 });
    }

    // 1. Decodificar la respuesta del banco
    const params = redsysService.decodeResponse(paramsBase64);
    const orderId = params.Ds_Order;
    const responseCode = parseInt(params.Ds_Response, 10);

    // 2. Validar que la firma que envía el banco coincide con nuestra clave secreta
    const expectedSignature = redsysService.createSignature(paramsBase64, orderId);
    
    // Convertir firmas a base64url para comparación segura (Redsys a veces cambia el padding)
    const secureSignature = signature.replace(/\+/g, '-').replace(/\//g, '_');
    const secureExpected = expectedSignature.replace(/\+/g, '-').replace(/\//g, '_');

    const isSignatureValid = secureSignature === secureExpected;

    // Buscar la reserva basándonos en el orderId codificado (ej. MT2026A8F2)
    // Para simplificar MVP, buscamos cual reserva lo contiene
    const bookings = await prisma.booking.findMany({
      where: { bookingStatus: 'PENDING_PAYMENT' }
    });
    
    const booking = bookings.find(b => b.publicCode.replace(/[^A-Za-z0-9]/g, '').includes(orderId));

    // Guardar el log crudo siempre por seguridad
    await prisma.redsysLog.create({
      data: {
        bookingId: booking?.id,
        orderId: orderId,
        transactionType: 'WEBHOOK',
        rawPayload: paramsBase64,
        responseCode: params.Ds_Response,
        isSignatureValid,
      }
    });

    if (!isSignatureValid) {
      console.error('ALERTA DE SEGURIDAD: Firma Redsys inválida', { orderId });
      return new NextResponse('Firma inválida', { status: 400 });
    }

    // 3. Procesar el resultado
    if (booking) {
      if (responseCode >= 0 && responseCode <= 99) {
        // Pago Autorizado Exitoso
        await prisma.$transaction(async (tx) => {
          await tx.booking.update({
            where: { id: booking.id },
            data: {
              paymentStatus: 'PAID',
              bookingStatus: 'CONFIRMADA' // O 'POR_CONFIRMAR' según regla de negocio
            }
          });
          
          await tx.payment.create({
            data: {
              bookingId: booking.id,
              provider: 'REDSYS',
              providerOrderId: orderId,
              amount: booking.finalPrice,
              currency: booking.currency,
              status: 'PAID',
              responseCode: params.Ds_Response,
              signatureValid: true,
              paidAt: new Date()
            }
          });
        });
      } else {
        // Pago Denegado
        await prisma.booking.update({
          where: { id: booking.id },
          data: { paymentStatus: 'FAILED' }
        });
      }
    }

    // Redsys espera un HTTP 200 limpio si recibe el Webhook bien
    return new NextResponse('OK', { status: 200 });

  } catch (error) {
    console.error('Error procesando Webhook Redsys:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
