import Link from "next/link";
import { bookingsQueries } from "@/modules/bookings/bookings.queries";
import { Button } from "@/components/ui/button";
import { Eye, Mail, MessageCircle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AbandonedBookingsPage() {
  const abandonedBookings = await bookingsQueries.getAbandonedBookings();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-2xl font-bold tracking-tight">Viajes Abandonados / Incompletos</h3>
          <p className="text-gray-500">Reservas que se quedaron a medias o en proceso de pago.</p>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-2">
          <Link href="/admin/bookings">
            <Button variant="outline">Volver a Reservas</Button>
          </Link>
        </div>
      </div>

      <div className="border border-gray-200 rounded-xl shadow-sm bg-white overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50/80">
            <tr>
              <th className="px-5 py-4 text-left font-bold text-gray-500 uppercase tracking-wider text-xs">ID / Fecha de Intento</th>
              <th className="px-5 py-4 text-left font-bold text-gray-500 uppercase tracking-wider text-xs">Cliente</th>
              <th className="px-5 py-4 text-left font-bold text-gray-500 uppercase tracking-wider text-xs">Ruta</th>
              <th className="px-5 py-4 text-left font-bold text-gray-500 uppercase tracking-wider text-xs">Precio Total</th>
              <th className="px-5 py-4 text-left font-bold text-gray-500 uppercase tracking-wider text-xs">Estado</th>
              <th className="px-5 py-4 text-right font-bold text-gray-500 uppercase tracking-wider text-xs">Contacto</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {abandonedBookings.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-gray-500">
                  No hay reservas abandonadas.
                </td>
              </tr>
            ) : (
              abandonedBookings.map((b) => (
                <tr key={b.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-4 whitespace-nowrap">
                    <div className="font-bold text-[#003049] tracking-wide">{b.publicCode}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {new Date(b.createdAt).toLocaleDateString("es-ES")}
                    </div>
                    <div className="text-xs text-gray-400">
                      {new Date(b.createdAt).toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <div className="font-semibold text-gray-900">{b.customer.fullName}</div>
                    <div className="text-xs text-gray-500 mt-1">{b.customer.phone || "Sin teléfono"}</div>
                    <div className="text-xs text-gray-400 truncate max-w-[150px]" title={b.customer.email}>
                      {b.customer.email}
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <div className="max-w-[200px]">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
                        <span className="text-xs font-medium text-gray-700 truncate" title={b.originAddress}>
                          {b.originAddress}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
                        <span className="text-xs font-medium text-gray-700 truncate" title={b.destinationAddress}>
                          {b.destinationAddress}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4 whitespace-nowrap">
                    <div className="font-bold text-gray-900">
                      {Number(b.finalPrice).toLocaleString("es-ES", { style: "currency", currency: b.currency || "EUR" })}
                    </div>
                  </td>

                  <td className="px-5 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      {b.bookingStatus}
                    </span>
                  </td>

                  <td className="px-5 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`mailto:${b.customer.email}?subject=Tu reserva de traslado con MT Transfers&body=Hola ${b.customer.fullName}, notamos que no completaste tu reserva...`} target="_blank">
                        <Button variant="outline" size="sm" className="h-8 w-8 p-0" title="Enviar Email">
                          <Mail className="w-4 h-4 text-gray-500" />
                        </Button>
                      </Link>
                      {b.customer.phone && (
                        <Link href={`https://wa.me/${b.customer.phone.replace(/\D/g, '')}?text=Hola%20${encodeURIComponent(b.customer.fullName)},%20notamos%20que%20tu%20reserva%20de%20traslado%20no%20se%20complet%C3%B3.%20%C2%BFEn%20qu%C3%A9%20podemos%20ayudarte?`} target="_blank">
                          <Button variant="outline" size="sm" className="h-8 w-8 p-0" title="Contactar por WhatsApp">
                            <MessageCircle className="w-4 h-4 text-green-600" />
                          </Button>
                        </Link>
                      )}
                      <Link href={`/admin/bookings/${b.id}`}>
                        <Button variant="outline" size="sm" className="h-8 w-8 p-0" title="Ver reserva">
                          <Eye className="w-4 h-4 text-[#003049]" />
                        </Button>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
