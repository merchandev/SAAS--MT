import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { redsysService } from "@/modules/payments/redsys.service";
import { paymentRateLimiter } from "@/lib/rate-limit";
import { headers } from "next/headers";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function PaymentPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;

  const booking = await prisma.booking.findUnique({
    where: { publicCode: code },
    include: {
      payments: true,
      vehicle: true,
    }
  });

  if (!booking) {
    notFound();
  }

  // Si ya está pagada o en un estado posterior, redirigir al recibo
  const paidStatuses = ["PAID", "CONFIRMADA", "ASIGNADA", "EN_CURSO", "COMPLETADA"];
  if (paidStatuses.includes(booking.bookingStatus) || booking.paymentStatus === "PAID") {
    redirect(`/booking/${booking.publicCode}/receipt`);
  }

  const ip = (await headers()).get("x-forwarded-for") || "unknown";
  if (!paymentRateLimiter.check(ip)) {
    return (
      <div className="min-h-screen bg-[#0B0C10] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-2xl font-serif font-bold text-white mb-4">Demasiados intentos</h2>
        <p className="text-gray-400 font-light">Por favor, espera unos minutos antes de intentar el pago de nuevo.</p>
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

  const redsysFormHtml = redsysService.generateHtmlForm(booking, payment.providerOrderId || undefined);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B0C10] font-sans">
      <div className="max-w-md w-full bg-[#13151A] border border-white/5 p-10 rounded-sm shadow-2xl text-center">
        <div className="animate-spin w-12 h-12 border-4 border-[#D4AF37] border-t-transparent rounded-full mx-auto mb-8" />
        <h2 className="text-2xl font-serif font-bold text-white mb-3">Conexión Segura</h2>
        <p className="text-gray-400 font-light mb-8">
          Por favor, espere. Será redirigido a nuestra pasarela encriptada para procesar el pago de{" "}
          <span className="font-medium text-[#D4AF37]">{Number(booking.finalPrice).toFixed(2)}€</span>.
        </p>

        <div className="hidden" dangerouslySetInnerHTML={{ __html: redsysFormHtml }} />
      </div>
    </div>
  );
}
