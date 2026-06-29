import { vehiclesQueries } from "@/modules/vehicles/vehicles.queries";
import BookingFormClient from "./BookingFormClient";
import Link from "next/link";
import Image from "next/image";
import MarketingHeader from "@/components/marketing/MarketingHeader";

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
      <MarketingHeader />

      <main className="flex-grow flex flex-col max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-28 pb-12 gap-12 fade-in-up">
        {/* Full Width Booking Wizard */}
        <div className="w-full">
          <BookingFormClient vehicles={activeVehicles} hotelToken={hotelToken} />
        </div>
      </main>
    </div>
  );
}
