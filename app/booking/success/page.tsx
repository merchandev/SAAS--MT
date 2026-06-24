import Link from "next/link";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function BookingSuccessPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const code = searchParams.code as string;

  if (!code) {
    redirect("/booking/error");
  }

  const booking = await prisma.booking.findUnique({
    where: { publicCode: code },
    select: {
      publicCode: true,
      paymentStatus: true,
      bookingStatus: true,
    },
  });

  if (!booking || booking.paymentStatus !== "PAID") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center border border-gray-100">
          <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Pago No Confirmado</h1>
          <p className="text-gray-500 mb-8">
            No hemos podido verificar el pago de tu reserva. Si crees que esto es un error, por favor contacta a soporte.
          </p>
          <Link href="/">
            <Button size="lg" className="w-full h-12 text-lg">Volver al Inicio</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center border border-gray-100">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2">¡Pago Confirmado!</h1>
        <p className="text-gray-500 mb-6">
          Hemos recibido el pago exitosamente. Tu código de reserva es:
        </p>
        
        <div className="bg-gray-50 border border-dashed border-gray-300 rounded-lg py-4 px-6 mb-8 inline-block">
          <span className="text-3xl font-black tracking-widest text-blue-600">{booking.publicCode}</span>
        </div>

        <p className="text-sm text-gray-500 mb-8">
          Te hemos enviado un correo con el resumen de la reserva. Tu conductor se asignará en breve.
        </p>

        <Link href="/">
          <Button size="lg" className="w-full h-12 text-lg">Volver al Inicio</Button>
        </Link>
      </div>
    </div>
  );
}
