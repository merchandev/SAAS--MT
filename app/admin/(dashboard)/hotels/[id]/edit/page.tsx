import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { HotelEditForm } from "./HotelEditForm";

export const dynamic = "force-dynamic";

export default async function EditHotelPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const hotel = await prisma.hotel.findUnique({
    where: { id: params.id }
  });

  if (!hotel) {
    notFound();
  }

  const rawVehicles = await prisma.vehicle.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' }
  });

  const vehicles = rawVehicles.map(v => ({
    ...v,
    pricePerKmOneWay: Number(v.pricePerKmOneWay),
    pricePerKmRoundTrip: Number(v.pricePerKmRoundTrip),
    pricePerHour: Number(v.pricePerHour),
    minimumPrice: Number(v.minimumPrice),
    airportSurcharge: Number(v.airportSurcharge),
    nightSurcharge: Number(v.nightSurcharge),
  }));

  // Convert decimal to number for the client component
  const hotelData = {
    ...hotel,
    commissionValue: Number(hotel.commissionValue),
    discountValue: Number(hotel.discountValue)
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Link href="/admin/hotels" className="text-gray-500 hover:text-gray-900">
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <div>
          <h3 className="text-2xl font-bold tracking-tight text-gray-900">Editar Hotel: {hotel.name}</h3>
          <p className="text-gray-500">Modifica las reglas de negocio, contacto y comisiones.</p>
        </div>
      </div>

      <HotelEditForm hotel={hotelData} vehicles={vehicles} />
    </div>
  );
}
