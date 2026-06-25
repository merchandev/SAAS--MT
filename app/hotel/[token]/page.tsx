import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import HotelBookingFormClient from "./HotelBookingFormClient";
import Image from "next/image";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{
    token: string;
  }>;
}

export default async function HotelPortalPage({ params }: Props) {
  const { token } = await params;
  const hotel = await prisma.hotel.findUnique({
    where: { token },
  });

  if (!hotel || !hotel.isActive) {
    notFound();
  }

  const vehicles = await prisma.vehicle.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });

  // Safe passing of data
  const hotelData = {
    ...hotel,
    commissionValue: Number(hotel.commissionValue),
    discountValue: Number(hotel.discountValue),
    routesSettings: typeof hotel.routesSettings === 'string' 
      ? JSON.parse(hotel.routesSettings) 
      : hotel.routesSettings,
  };

  return (
    <div className="min-h-screen bg-[#111111] flex flex-col">
      {/* HEADER ELEGANTE */}
      <header className="bg-[#111111] text-white py-6 px-6 sticky top-0 z-50 border-b border-white/10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <span className="font-bold text-2xl tracking-widest text-[#D4AF37]">ME<span className="text-white">TRANSFERS</span></span>
              <span className="text-xs text-gray-400 tracking-widest">PRIVATE TRANSFER</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-[#D4AF37] uppercase tracking-widest">Servicio exclusivo para</p>
            <p className="font-bold text-lg text-white">{hotel.name}</p>
          </div>
        </div>
      </header>

      <main className="flex-grow flex items-start justify-center p-4 md:p-8 bg-gray-50">
        <div className="w-full max-w-7xl">
          <HotelBookingFormClient vehicles={vehicles} hotel={hotelData} />
        </div>
      </main>
    </div>
  );
}
