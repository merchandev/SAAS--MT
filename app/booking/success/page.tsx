import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function BookingSuccessPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const code = searchParams.code as string;

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
          <span className="text-3xl font-black tracking-widest text-blue-600">{code || 'CONFIRMADA'}</span>
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
