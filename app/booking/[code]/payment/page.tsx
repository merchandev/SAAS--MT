import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { redsysService } from "@/modules/payments/redsys.service";
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

  if (booking.paymentStatus === "PAID") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0B0C10] font-sans">
        <div className="max-w-md w-full bg-[#13151A] border border-white/5 p-8 rounded-sm shadow-2xl text-center">
          <div className="w-16 h-16 bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-serif font-bold text-white mb-2">Reserva Confirmada</h2>
          <p className="text-gray-400 font-light mb-8">Esta reserva ya ha sido procesada y abonada exitosamente.</p>
          <Link href="/" className="inline-block bg-[#D4AF37] text-[#0B0C10] hover:bg-[#C5A059] px-8 py-3 rounded-sm font-medium transition-all">
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  const payment = await prisma.$transaction(async (tx) => {
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
