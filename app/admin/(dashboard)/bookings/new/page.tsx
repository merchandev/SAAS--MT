import { prisma } from "@/lib/prisma";
import NewAdminBookingClient from "./NewAdminBookingClient";
import { requireRole } from "@/modules/auth/permissions";

export const metadata = {
  title: "Nueva Reserva Manual | Admin",
};

export const dynamic = "force-dynamic";

export default async function NewAdminBookingPage() {
  await requireRole(["SUPER_ADMIN", "ADMIN"]);

  const vehicles = await prisma.vehicle.findMany({
    where: { isActive: true },
    select: {
      id: true,
      name: true,
      passengerCapacity: true,
    },
    orderBy: {
      sortOrder: "asc"
    }
  });

  return <NewAdminBookingClient vehicles={vehicles} />;
}
