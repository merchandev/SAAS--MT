import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function BookingPaymentErrorPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const code = searchParams.code as string;

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <section className="max-w-md w-full rounded-xl border bg-white p-8 text-center shadow-lg">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600">
          <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>

        <h1 className="mb-2 text-2xl font-bold text-gray-900">Pago no completado</h1>
        <p className="mb-6 text-gray-600">
          Redsys no ha confirmado el pago para la reserva:
        </p>

        <div className="bg-gray-50 border border-dashed border-gray-300 rounded-lg py-4 px-6 mb-8 inline-block">
          <span className="text-3xl font-black tracking-widest text-red-600">{code || 'DESCONOCIDA'}</span>
        </div>

        <p className="text-sm text-gray-500 mb-8">
          Puedes volver a intentarlo o contactar con el equipo de MeTransfers si necesitas ayuda.
        </p>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          {code && (
            <Link href={`/booking/${code}/payment`} className="rounded-md bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700">
              Reintentar Pago
            </Link>
          )}
          <Link href="/" className="rounded-md border px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
            Volver al inicio
          </Link>
        </div>
      </section>
    </main>
  );
}
