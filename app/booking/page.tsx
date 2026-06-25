import { vehiclesQueries } from "@/modules/vehicles/vehicles.queries";
import BookingFormClient from "./BookingFormClient";
import Link from "next/link";
import Image from "next/image";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Reservar Traslado | MeTransfers VIP",
  description: "Reserva tu traslado privado con la flota más exclusiva.",
};

export default async function PublicBookingPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;

  // Recuperar todos los vehículos activos y convertirlos a plain objects
  const rawVehicles = await vehiclesQueries.getActiveVehicles();
  const activeVehicles = rawVehicles.map((v: any) => ({
    ...v,
    pricePerKmOneWay: Number(v.pricePerKmOneWay),
    pricePerKmRoundTrip: Number(v.pricePerKmRoundTrip),
    pricePerHour: Number(v.pricePerHour),
    minimumPrice: Number(v.minimumPrice),
    airportSurcharge: Number(v.airportSurcharge),
    nightSurcharge: Number(v.nightSurcharge),
  }));
  
  // Si venimos de un link QR de hotel, el token estará en la URL (?hotel=TOKEN)
  const hotelToken = searchParams.hotel as string | undefined;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900 selection:bg-[#D4AF37] selection:text-white">
      <header className="bg-white/90 backdrop-blur-md sticky top-0 z-50 border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="h-10 w-10 bg-gradient-to-br from-[#D4AF37] to-[#AA8B2C] rounded-sm flex items-center justify-center text-white font-serif font-bold text-xl shadow-lg">
              MT
            </div>
            <span className="font-serif font-bold text-xl tracking-widest text-gray-900 uppercase hidden sm:block">MeTransfers</span>
          </Link>
          <nav className="hidden md:flex gap-8 font-bold text-sm tracking-widest uppercase text-gray-700">
            <Link href="/" className="hover:text-[#D4AF37] transition-colors">Inicio</Link>
            <a href="/#servicios" className="hover:text-[#D4AF37] transition-colors">Servicios VIP</a>
            <a href="/#flota" className="hover:text-[#D4AF37] transition-colors">Flota</a>
          </nav>
        </div>
      </header>

      <main className="flex-grow flex flex-col max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 gap-12 fade-in-up">
        {/* Full Width Booking Wizard */}
        <div className="w-full">
          <BookingFormClient vehicles={activeVehicles} hotelToken={hotelToken} />
        </div>
      </main>
    </div>
  );
}
