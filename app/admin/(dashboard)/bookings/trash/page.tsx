import Link from "next/link";
import { ArrowLeft, Eye, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { bookingsQueries } from "@/modules/bookings/bookings.queries";
import { BookingTrashActions } from "../BookingTrashActions";

export const dynamic = "force-dynamic";

export default async function BookingTrashPage() {
  const bookings = await bookingsQueries.getDeletedBookings();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <Link href="/admin/bookings" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900">
            <ArrowLeft className="w-4 h-4" />
            Traslados registrados
          </Link>
          <h3 className="mt-2 text-2xl font-bold tracking-tight">Papelera de traslados</h3>
          <p className="text-gray-500">Reservas ocultas del listado principal que todavía pueden restaurarse.</p>
        </div>
        <div className="h-10 w-10 rounded-lg bg-red-50 text-red-700 flex items-center justify-center">
          <Trash2 className="w-5 h-5" />
        </div>
      </div>

      <div className="border border-gray-200 rounded-xl shadow-sm bg-white overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50/80">
            <tr>
              <th className="px-5 py-4 text-left font-bold text-gray-500 uppercase tracking-wider text-xs">ID / Eliminación</th>
              <th className="px-5 py-4 text-left font-bold text-gray-500 uppercase tracking-wider text-xs">Cliente</th>
              <th className="px-5 py-4 text-left font-bold text-gray-500 uppercase tracking-wider text-xs">Ruta</th>
              <th className="px-5 py-4 text-left font-bold text-gray-500 uppercase tracking-wider text-xs">Precio / Estado</th>
              <th className="px-5 py-4 text-right font-bold text-gray-500 uppercase tracking-wider text-xs">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {bookings.map((booking) => (
              <tr key={booking.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-5 py-4 whitespace-nowrap">
                  <div className="font-bold text-[#003049] tracking-wide">{booking.publicCode}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {booking.deletedAt ? new Date(booking.deletedAt).toLocaleDateString("es-ES") : "-"}
                  </div>
                  <div className="text-xs text-gray-400">
                    {booking.deletedAt
                      ? new Date(booking.deletedAt).toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })
                      : "-"}
                  </div>
                </td>
                <td className="px-5 py-4">
                  <div className="font-semibold text-gray-900">{booking.customer.fullName}</div>
                  <div className="text-xs text-gray-500 mt-1">{booking.customer.phone || "-"}</div>
                  <div className="text-xs text-gray-400 truncate max-w-[180px]" title={booking.customer.email}>
                    {booking.customer.email}
                  </div>
                </td>
                <td className="px-5 py-4">
                  <div className="max-w-[320px] space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
                      <span className="text-xs font-medium text-gray-700 truncate" title={booking.originAddress}>
                        {booking.originAddress}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
                      <span className="text-xs font-medium text-gray-700 truncate" title={booking.destinationAddress}>
                        {booking.destinationAddress}
                      </span>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 mt-2 font-medium">
                    {Number(booking.distanceKm).toFixed(1)} km • {booking.vehicle.name}
                  </div>
                </td>
                <td className="px-5 py-4 whitespace-nowrap">
                  <div className="font-bold text-[#D4AF37] text-base mb-1">
                    {booking.currency} {Number(booking.finalPrice).toFixed(2)}
                  </div>
                  <div className="text-xs text-gray-500">{booking.bookingStatus}</div>
                </td>
                <td className="px-5 py-4 whitespace-nowrap text-right">
                  <div className="flex flex-col gap-2 items-end">
                    <Link href={`/admin/bookings/${booking.id}`}>
                      <Button variant="ghost" size="sm" className="w-[140px] justify-start text-xs text-gray-600">
                        <Eye className="w-3.5 h-3.5 mr-2" />
                        Ver detalles
                      </Button>
                    </Link>
                    <BookingTrashActions
                      bookingId={booking.id}
                      mode="restore"
                      label="Restaurar"
                      className="w-[140px] justify-start text-xs"
                    />
                  </div>
                </td>
              </tr>
            ))}
            {bookings.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center">
                  <p className="text-gray-500 mb-2">La papelera está vacía.</p>
                  <Link href="/admin/bookings">
                    <Button variant="outline" size="sm">Volver a traslados</Button>
                  </Link>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
