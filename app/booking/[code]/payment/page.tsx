import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { redsysService } from "@/modules/payments/redsys.service";
import { paymentRateLimiter } from "@/lib/rate-limit";
import { headers } from "next/headers";
import { buildRateLimitKey, getRequestMeta } from "@/lib/request-meta";
import { verifyReceiptAccessToken } from "@/modules/bookings/receipt-access";

export const dynamic = "force-dynamic";

export default async function PaymentPage({
  params,
  searchParams,
}: {
  params: Promise<{ code: string }>;
  searchParams: Promise<{ token?: string | string[] }>;
}) {
  try {
    const { code } = await params;
    const { token: tokenParam } = await searchParams;
    const receiptToken = Array.isArray(tokenParam) ? tokenParam[0] : tokenParam;

    const booking = await prisma.booking.findFirst({
      where: { publicCode: code, deletedAt: null },
      include: {
        payments: true,
        vehicle: true,
      }
    });

    if (!booking) {
      notFound();
    }

    const hasValidReceiptToken = await verifyReceiptAccessToken(receiptToken, booking);

    // Si ya está pagada o en un estado posterior, redirigir al recibo
    const paidStatuses = ["PAID", "CONFIRMADA", "ASIGNADA", "EN_CURSO", "COMPLETADA"];
    if (paidStatuses.includes(booking.bookingStatus) || booking.paymentStatus === "PAID") {
      if (hasValidReceiptToken) {
        redirect(`/booking/${booking.publicCode}/receipt?token=${encodeURIComponent(receiptToken!)}`);
      }
      redirect(`/booking/success?code=${booking.publicCode}`);
    }

    const requestMeta = getRequestMeta(await headers());
    
    // Rate Limiting
    if (!(await paymentRateLimiter.check(buildRateLimitKey("payment", requestMeta, booking.id)))) {
      return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
          <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center space-y-4">
            <h1 className="text-2xl font-bold text-red-600">Demasiados Intentos</h1>
            <p className="text-gray-600">Por favor, espera unos minutos antes de volver a intentar procesar el pago.</p>
          </div>
        </div>
      );
    }

    let payment;
    try {
      payment = await prisma.$transaction(async (tx) => {
        const existing = await tx.payment.findFirst({
          where: { bookingId: booking.id, status: "PENDING" },
        });

        if (existing) return existing;

        const orderId = redsysService.createOrderId(booking);
        return tx.payment.create({
          data: {
            bookingId: booking.id,
            provider: "REDSYS",
            amount: booking.finalPrice,
            currency: "EUR",
            status: "PENDING",
            providerOrderId: orderId,
          }
        });
      });
    } catch (error: any) {
      if (error.code === 'P2002') {
        // Race condition hit: another request created the payment with the same providerOrderId.
        const existing = await prisma.payment.findFirst({
          where: { bookingId: booking.id, status: "PENDING" },
        });
        if (existing) {
          payment = existing;
        } else {
          throw new Error("Error concurrente al generar el pago. Por favor, recarga la página.");
        }
      } else {
        throw error;
      }
    }

    const redsysFormHtml = redsysService.generateHtmlForm(booking, payment.providerOrderId || undefined, {
      receiptToken: hasValidReceiptToken ? receiptToken : undefined,
    });

    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 flex flex-col items-center justify-center">
        <div className="w-full max-w-md bg-white border border-gray-100 rounded-2xl shadow-xl p-8 text-center space-y-6">
          
          <div className="w-16 h-16 bg-[#111111] rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse shadow-lg">
            <span translate="no" className="notranslate material-symbols-outlined text-white text-3xl">lock</span>
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-900 uppercase tracking-wide">Conectando...</h1>
            <p className="text-gray-500 mt-2 font-medium">Será redirigido al TPV Virtual Seguro de Redsys.</p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-sm font-medium text-gray-700">
            Reserva <span className="font-bold text-gray-900">{booking.publicCode}</span>
            <div className="text-xl font-bold text-[#D4AF37] mt-1">€{Number(booking.finalPrice).toFixed(2)}</div>
          </div>

          <div className="flex justify-center pt-4 opacity-50">
            <svg className="animate-spin h-8 w-8 text-gray-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>

          {/* Formulario invisible que se auto-envía */}
          <div dangerouslySetInnerHTML={{ __html: redsysFormHtml }} />
        </div>
      </div>
    );
  } catch (error: any) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-left space-y-4">
          <h1 className="text-2xl font-bold text-red-600">Error en el servidor</h1>
          <p className="text-gray-600 text-sm">Ocurrió un error al procesar la página de pago. Detalles:</p>
          <pre className="bg-gray-100 p-4 rounded text-xs text-red-500 overflow-auto whitespace-pre-wrap font-mono">
            {error.message}
            {"\n"}
            {error.stack}
          </pre>
        </div>
      </div>
    );
  }
}
