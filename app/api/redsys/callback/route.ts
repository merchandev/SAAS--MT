import { NextRequest, NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";
import { redsysService } from '@/modules/payments/redsys.service';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const dsSignatureVersion = formData.get('Ds_SignatureVersion') as string;
    const dsMerchantParameters = formData.get('Ds_MerchantParameters') as string;
    const dsSignature = formData.get('Ds_Signature') as string;

    if (!dsMerchantParameters || !dsSignature) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    // 1. Decodificar parámetros
    const decodedParams = redsysService.decodeResponse(dsMerchantParameters);
    const orderId = decodedParams.Ds_Order;
    const responseCode = parseInt(decodedParams.Ds_Response, 10);

    // 2. Verificar firma (Seguridad)
    const expectedSignature = redsysService.createSignature(dsMerchantParameters, orderId);
    
    // Comparar firma recibida de forma segura
    const isSignatureValid = expectedSignature === dsSignature;

    // 3. Registrar Log Crudo
    await prisma.redsysLog.create({
      data: {
        orderId: orderId,
        transactionType: "NOTIFICATION",
        rawPayload: dsMerchantParameters,
        responseCode: decodedParams.Ds_Response,
        isSignatureValid: isSignatureValid,
      }
    });

    if (!isSignatureValid) {
      console.error("[Redsys] Invalid signature received");
      return new NextResponse('OK', { status: 200 }); // Responder 200 siempre al webhook bancario
    }

    // 4. Buscar Payment por Order ID (Idempotencia)
    const payment = await prisma.payment.findFirst({
      where: { providerOrderId: orderId },
      include: { booking: true }
    });

    if (!payment) {
      console.error(`[Redsys] Payment with orderId ${orderId} not found`);
      return new NextResponse('OK', { status: 200 });
    }

    // Si ya fue procesado, ignorar (Idempotencia robusta)
    if (payment.status !== "PENDING") {
      console.log(`[Redsys] Payment ${orderId} already processed with status ${payment.status}`);
      return new NextResponse('OK', { status: 200 });
    }

    // 5. Procesar éxito o fallo
    const isSuccess = responseCode >= 0 && responseCode <= 99;

    await prisma.$transaction(async (tx) => {
      // Actualizar Payment
      await tx.payment.update({
        where: { id: payment.id },
        data: {
          status: isSuccess ? "PAID" : "FAILED",
          responseCode: decodedParams.Ds_Response,
          signatureValid: true,
          paidAt: isSuccess ? new Date() : null,
        }
      });

      // Actualizar Booking solo si el pago es exitoso
      if (isSuccess) {
        await tx.booking.update({
          where: { id: payment.bookingId },
          data: {
            paymentStatus: "PAID",
            bookingStatus: "CONFIRMADA",
          }
        });
      }
    });

    return new NextResponse('OK', { status: 200 });
  } catch (error) {
    console.error("[Redsys Error]", error);
    return new NextResponse('OK', { status: 200 }); // Evitar reintentos masivos de Redsys
  }
}
