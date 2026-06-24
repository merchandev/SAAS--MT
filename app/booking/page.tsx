import { vehiclesQueries } from "@/modules/vehicles/vehicles.queries";
import BookingFormClient from "./BookingFormClient";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Reservar Traslado | MeTransfers VIP",
  description: "Reserva tu traslado privado con la flota más exclusiva.",
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
    <div className="min-h-screen bg-[#0B0C10] flex flex-col font-sans text-gray-100 selection:bg-[#D4AF37] selection:text-black">
      <header className="bg-[#08090C]/90 backdrop-blur-md sticky top-0 z-50 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="h-10 w-10 bg-gradient-to-br from-[#D4AF37] to-[#AA8B2C] rounded-sm flex items-center justify-center text-[#0B0C10] font-serif font-bold text-xl shadow-lg shadow-[#D4AF37]/20">
              MT
            </div>
            <span className="font-serif font-bold text-xl tracking-widest text-white uppercase hidden sm:block">MeTransfers</span>
          </Link>
          <nav className="hidden md:flex gap-8 font-medium text-xs tracking-widest uppercase text-gray-400">
            <Link href="/" className="hover:text-[#D4AF37] transition-colors">Inicio</Link>
            <a href="#" className="hover:text-[#D4AF37] transition-colors">Servicios VIP</a>
            <a href="#" className="hover:text-[#D4AF37] transition-colors">Flota</a>
          </nav>
        </div>
      </header>

      <main className="flex-grow flex flex-col lg:flex-row max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 gap-12">
        {/* Left Side: Booking Form */}
        <div className="w-full lg:w-2/3">
          <div className="mb-10">
            <h2 className="text-[#D4AF37] uppercase tracking-[0.2em] text-xs font-semibold mb-3">Reservación Privada</h2>
            <h1 className="text-4xl lg:text-5xl font-serif font-bold text-white mb-4 leading-tight">
              Asegure su <span className="italic text-gray-300">traslado.</span>
            </h1>
            <p className="mt-2 text-gray-400 font-light text-lg">
              Cotice al instante y garantice un servicio de excelencia. Para "Disposición por horas" contacte al Concierge.
            </p>
            {hotelToken && (
              <div className="mt-6 inline-flex items-center gap-3 px-5 py-3 bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[#D4AF37] rounded-sm font-medium text-sm">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                Reserva exclusiva afiliada a su Hotel / Agencia
              </div>
            )}
          </div>

          <BookingFormClient vehicles={activeVehicles} hotelToken={hotelToken} />
        </div>

        {/* Right Side: Trust & Value Proposition */}
        <div className="w-full lg:w-1/3 hidden lg:block">
          <div className="sticky top-32 bg-[#13151A] rounded-sm shadow-2xl border border-white/5 p-8 overflow-hidden relative">
            {/* Subtle glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37] rounded-full blur-[80px] opacity-[0.03] -z-10"></div>
            
            <h3 className="text-lg font-serif font-bold text-white mb-8 tracking-wide">El Estándar MeTransfers</h3>
            
            <div className="space-y-8">
              <div className="flex gap-5">
                <div className="flex-shrink-0 h-12 w-12 border border-[#D4AF37]/30 bg-[#D4AF37]/5 rounded-full flex items-center justify-center text-[#D4AF37]">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
                <div>
                  <h4 className="font-bold text-white">Puntualidad Absoluta</h4>
                  <p className="text-sm text-gray-400 mt-1 font-light leading-relaxed">Monitoreamos el estado de su vuelo para sincronizar la recogida a la perfección.</p>
                </div>
              </div>
              
              <div className="flex gap-5">
                <div className="flex-shrink-0 h-12 w-12 border border-[#D4AF37]/30 bg-[#D4AF37]/5 rounded-full flex items-center justify-center text-[#D4AF37]">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                </div>
                <div>
                  <h4 className="font-bold text-white">Cotización Cerrada</h4>
                  <p className="text-sm text-gray-400 mt-1 font-light leading-relaxed">Tarifa final confirmada sin sorpresas ni suplementos de última hora.</p>
                </div>
              </div>

              <div className="flex gap-5">
                <div className="flex-shrink-0 h-12 w-12 border border-[#D4AF37]/30 bg-[#D4AF37]/5 rounded-full flex items-center justify-center text-[#D4AF37]">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <div>
                  <h4 className="font-bold text-white">Flexibilidad VIP</h4>
                  <p className="text-sm text-gray-400 mt-1 font-light leading-relaxed">Modifique o cancele su reservación con 24h de antelación sin cargos.</p>
                </div>
              </div>
            </div>

            <div className="mt-10 pt-8 border-t border-white/10">
              <p className="text-sm text-center text-gray-400 italic font-serif">
                &quot;Servicio impecable. El vehículo era espectacular y el trato del chófer, extraordinario.&quot;
              </p>
              <div className="flex justify-center text-[#D4AF37] mt-4 tracking-widest text-sm">
                ★★★★★
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
