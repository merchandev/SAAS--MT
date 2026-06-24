import Link from "next/link";
import { bookingsQueries } from "@/modules/bookings/bookings.queries";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function BookingsPage() {
  const bookings = await bookingsQueries.getAllBookings();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold tracking-tight">Reservas</h3>
          <p className="text-gray-500">Gestión central de reservas de traslados.</p>
        </div>
        <Link href="/admin/bookings/new">
          <Button>+ Nueva Reserva Manual</Button>
        </Link>
      </div>

      <div className="border rounded-md shadow-sm bg-white overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ref</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ruta</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vehículo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Precio</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {bookings.map((b) => (
              <tr key={b.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                  {b.publicCode}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {b.customer.fullName}
                  <div className="text-xs text-gray-500">{b.customer.phone}</div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate" title={`${b.originAddress} -> ${b.destinationAddress}`}>
                  <span className="block truncate">{b.originAddress}</span>
                  <span className="block truncate">⬇ {b.destinationAddress}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(b.serviceDate).toLocaleDateString()}
                  <div className="text-xs font-semibold">{b.serviceTime}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {b.vehicle.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {b.currency} {Number(b.finalPrice).toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    {b.bookingStatus}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link href={`/admin/bookings/${b.id}`}>
                    <Button variant="outline" size="sm">Ver Detalles</Button>
                  </Link>
                </td>
              </tr>
            ))}
            {bookings.length === 0 && (
              <tr>
                <td colSpan={8} className="px-6 py-10 text-center text-gray-500">
                  No hay reservas registradas en el sistema.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
