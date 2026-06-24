import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { redsysService } from "@/modules/payments/redsys.service";

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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg text-center">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Reserva ya pagada</h2>
          <p className="text-gray-600 mb-6">Esta reserva ya ha sido procesada exitosamente.</p>
          <a href="/booking" className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md font-medium">
            Volver al inicio
          </a>
        </div>
      </div>
    );
  }

  const payment = await prisma.$transaction(async (tx) => {
    let existing = await tx.payment.findFirst({
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg text-center">
        <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-6" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Redirigiendo a pasarela segura...</h2>
        <p className="text-gray-600 mb-6">
          Por favor, no cierres esta ventana. Vas a ser redirigido a Redsys para completar el pago de{" "}
          {Number(booking.finalPrice).toFixed(2)}€.
        </p>

        <div dangerouslySetInnerHTML={{ __html: redsysFormHtml }} />
      </div>
    </div>
  );
}
