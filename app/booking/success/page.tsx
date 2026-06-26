import Link from "next/link";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { verifyReceiptAccessToken } from "@/modules/bookings/receipt-access";

export default async function BookingSuccessPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const code = searchParams.code as string;
  const tokenParam = searchParams.token;
  const receiptToken = Array.isArray(tokenParam) ? tokenParam[0] : tokenParam;

  if (!code) {
    redirect("/booking/error");
  }

  const booking = await prisma.booking.findUnique({
    where: { publicCode: code },
    select: {
      id: true,
      publicCode: true,
      paymentStatus: true,
      bookingStatus: true,
    },
  });

  if (!booking || booking.paymentStatus !== "PAID") {
    return (
      <div className="min-h-screen bg-[#0B0C10] flex items-center justify-center p-4 font-sans text-gray-100">
        <div className="max-w-md w-full bg-[#13151A] rounded-sm shadow-2xl p-10 text-center border border-red-900/30">
          <div className="w-20 h-20 bg-red-950/50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-900/50">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </div>
          <h1 className="text-2xl font-serif font-bold text-white mb-3">Pago No Confirmado</h1>
          <p className="text-gray-400 font-light mb-8">
            No hemos podido verificar el pago de tu reserva. Si crees que esto es un error, por favor contacta a nuestro Concierge.
          </p>
          <Link href="/">
            <Button size="lg" className="w-full h-14 text-lg bg-[#1F2833] hover:bg-red-950/80 text-white rounded-sm transition-all border border-white/5">Volver al Inicio</Button>
          </Link>
        </div>
      </div>
    );
  }

  const hasReceiptAccess = await verifyReceiptAccessToken(receiptToken, booking);

  return (
    <div className="min-h-screen bg-[#0B0C10] flex items-center justify-center p-4 font-sans text-gray-100">
      <div className="max-w-md w-full bg-[#13151A] rounded-sm shadow-2xl p-10 text-center border border-[#D4AF37]/20 relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-[#D4AF37] rounded-full blur-[80px] opacity-10 pointer-events-none"></div>

        <div className="w-20 h-20 bg-[#D4AF37]/10 text-[#D4AF37] rounded-full flex items-center justify-center mx-auto mb-6 border border-[#D4AF37]/30 relative z-10">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        
        <h1 className="text-2xl font-serif font-bold text-white mb-2 relative z-10">Reserva Confirmada</h1>
        <p className="text-gray-400 font-light mb-6 relative z-10">
          Su pago ha sido procesado con éxito. El código de su trayecto privado es:
        </p>
        
        <div className="bg-[#0B0C10] border border-white/10 rounded-sm py-4 px-6 mb-8 inline-block relative z-10 shadow-inner">
          <span className="text-3xl font-serif font-bold tracking-widest text-[#D4AF37]">{booking.publicCode}</span>
        </div>

        <p className="text-sm text-gray-400 font-light mb-8 relative z-10">
          Ha recibido un correo con los detalles de la confirmación. Su chófer le contactará a la brevedad.
        </p>

        <div className="relative z-10 space-y-3">
          {hasReceiptAccess && (
            <Link href={`/booking/${booking.publicCode}/receipt?token=${encodeURIComponent(receiptToken!)}`}>
              <Button size="lg" className="w-full h-14 text-lg bg-[#D4AF37] hover:bg-[#C5A059] text-[#0B0C10] rounded-sm transition-all font-medium">Ver Recibo</Button>
            </Link>
          )}

          <Link href="/">
            <Button size="lg" variant="outline" className="w-full h-14 text-lg rounded-sm transition-all font-medium">Volver al Inicio</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
