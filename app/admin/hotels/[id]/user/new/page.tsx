import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { HotelUserForm } from "./HotelUserForm";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function NewHotelUserPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const hotel = await prisma.hotel.findUnique({
    where: { id: params.id }
  });

  if (!hotel) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/hotels" className="text-gray-500 hover:text-gray-900">
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <div>
          <h3 className="text-2xl font-bold tracking-tight">Crear Acceso B2B</h3>
          <p className="text-gray-500">Asignar un nuevo usuario administrador para el hotel: {hotel.name}</p>
        </div>
      </div>

      <HotelUserForm hotelId={hotel.id} hotelName={hotel.name} hotelEmail={hotel.email} />
    </div>
  );
}
