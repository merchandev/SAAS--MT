import { vehiclesQueries } from "@/modules/vehicles/vehicles.queries";
import BookingFormClient from "./BookingFormClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Reservar Traslado | MeTransfers",
  description: "Reserva tu traslado privado con conductores profesionales. Viaje cómodo, seguro y al mejor precio garantizado.",
};

export default async function PublicBookingPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;

  // Recuperar todos los vehículos activos
  const activeVehicles = await vehiclesQueries.getActiveVehicles();
  
  // Si venimos de un link QR de hotel, el token estará en la URL (?hotel=TOKEN)
  const hotelToken = searchParams.hotel as string | undefined;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-black rounded-lg flex items-center justify-center text-white font-bold text-xl">
              MT
            </div>
            <span className="font-bold text-2xl tracking-tight text-gray-900">MeTransfers</span>
          </div>
          <nav className="hidden md:flex gap-6 font-medium text-gray-600">
            <a href="#" className="hover:text-black transition">Servicios</a>
            <a href="#" className="hover:text-black transition">Flota</a>
            <a href="#" className="hover:text-black transition">Contacto</a>
          </nav>
        </div>
      </header>

      <main className="flex-grow flex flex-col md:flex-row max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 gap-8">
        {/* Left Side: Booking Form */}
        <div className="w-full md:w-2/3">
          <div className="mb-8">
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl mb-4">
              Reserva tu traslado privado
            </h1>
            <p className="mt-4 text-gray-500">
              Usa nuestro sistema para cotizar al instante. Si necesitas viajes especiales, o &quot;Disposición por horas&quot;, contacta a soporte.
            </p>
            {hotelToken && (
              <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full font-medium text-sm">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                Reserva afiliada a tu Hotel / Agencia
              </div>
            )}
          </div>

          <BookingFormClient vehicles={activeVehicles} hotelToken={hotelToken} />
        </div>

        {/* Right Side: Trust & Value Proposition */}
        <div className="w-full md:w-1/3 hidden lg:block">
          <div className="sticky top-24 bg-white rounded-2xl shadow-xl border border-gray-100 p-6 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -z-10"></div>
            
            <h3 className="text-xl font-bold text-gray-900 mb-6">¿Por qué viajar con nosotros?</h3>
            
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 h-12 w-12 bg-black rounded-full flex items-center justify-center text-white">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Puntualidad Garantizada</h4>
                  <p className="text-sm text-gray-500 mt-1">Monitoreamos tu vuelo para ajustar la hora de recogida automáticamente.</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex-shrink-0 h-12 w-12 bg-black rounded-full flex items-center justify-center text-white">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Precios Transparentes</h4>
                  <p className="text-sm text-gray-500 mt-1">El precio que ves es el que pagas. Sin cargos ocultos ni sorpresas de última hora.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 h-12 w-12 bg-black rounded-full flex items-center justify-center text-white">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Cancelación Gratuita</h4>
                  <p className="text-sm text-gray-500 mt-1">Cancela o modifica tu reserva hasta 24 horas antes sin penalización.</p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t">
              <p className="text-sm text-center text-gray-500 italic">
                &quot;El mejor servicio de traslados que he probado. El conductor llegó 10 minutos antes y el vehículo estaba impecable.&quot;
              </p>
              <div className="flex justify-center text-yellow-400 mt-2">
                ★★★★★
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
