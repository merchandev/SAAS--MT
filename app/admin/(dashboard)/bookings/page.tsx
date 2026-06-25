import Link from "next/link";
import { bookingsQueries } from "@/modules/bookings/bookings.queries";
import { Button } from "@/components/ui/button";
import StatusSelectClient from "./StatusSelectClient";
import { FileText, Mail, Eye } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function BookingsPage() {
  const bookings = await bookingsQueries.getAllBookings();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold tracking-tight">Traslados Registrados</h3>
          <p className="text-gray-500">Gestión de todas las reservas de la plataforma.</p>
        </div>
        <Link href="/admin/bookings/new">
          <Button className="bg-[#003049] hover:bg-[#002236] text-white shadow-sm">+ Nueva Reserva Manual</Button>
        </Link>
      </div>

      <div className="border border-gray-200 rounded-xl shadow-sm bg-white overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50/80">
            <tr>
              <th className="px-5 py-4 text-left font-bold text-gray-500 uppercase tracking-wider text-xs">ID / Fecha</th>
              <th className="px-5 py-4 text-left font-bold text-gray-500 uppercase tracking-wider text-xs">Cliente</th>
              <th className="px-5 py-4 text-left font-bold text-gray-500 uppercase tracking-wider text-xs">Ruta / Distancia</th>
              <th className="px-5 py-4 text-left font-bold text-gray-500 uppercase tracking-wider text-xs">Detalles</th>
              <th className="px-5 py-4 text-left font-bold text-gray-500 uppercase tracking-wider text-xs">Precio / Pago</th>
              <th className="px-5 py-4 text-left font-bold text-gray-500 uppercase tracking-wider text-xs">Estado</th>
              <th className="px-5 py-4 text-right font-bold text-gray-500 uppercase tracking-wider text-xs">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {bookings.map((b) => (
              <tr key={b.id} className="hover:bg-gray-50/50 transition-colors">
                
                {/* ID / Fecha */}
                <td className="px-5 py-4 whitespace-nowrap">
                  <div className="font-bold text-[#003049] tracking-wide">{b.publicCode}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {new Date(b.createdAt).toLocaleDateString()}
                  </div>
                  <div className="text-xs text-gray-400">
                    {new Date(b.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </td>

                {/* Cliente */}
                <td className="px-5 py-4">
                  <div className="font-semibold text-gray-900">{b.customer.fullName}</div>
                  <div className="text-xs text-gray-500 mt-1">{b.customer.phone}</div>
                  <div className="text-xs text-gray-400 truncate max-w-[150px]" title={b.customer.email}>{b.customer.email}</div>
                </td>

                {/* Ruta / Distancia */}
                <td className="px-5 py-4">
                  <div className="max-w-[200px]">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0"></span>
                      <span className="text-xs font-medium text-gray-700 truncate" title={b.originAddress}>{b.originAddress}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0"></span>
                      <span className="text-xs font-medium text-gray-700 truncate" title={b.destinationAddress}>{b.destinationAddress}</span>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 mt-2 font-medium">
                    {Number(b.distanceKm).toFixed(1)} km • {b.vehicle.name}
                  </div>
                </td>

                {/* Detalles Pasajeros / Maletas */}
                <td className="px-5 py-4 whitespace-nowrap text-center">
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <span className="text-xs text-gray-500 uppercase tracking-wider mb-1">Pax</span>
                      <span className="font-bold text-gray-800">{b.passengers}</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-xs text-gray-500 uppercase tracking-wider mb-1">Maletas</span>
                      <span className="font-bold text-gray-800">{b.luggage}</span>
                    </div>
                  </div>
                  {b.flightNumber && (
                    <div className="text-xs text-gray-500 mt-2 bg-gray-100 inline-block px-2 py-0.5 rounded">
                      ✈️ {b.flightNumber}
                    </div>
                  )}
                </td>

                {/* Precio / Pago */}
                <td className="px-5 py-4 whitespace-nowrap">
                  <div className="font-bold text-[#D4AF37] text-base mb-1">
                    {b.currency} {Number(b.finalPrice).toFixed(2)}
                  </div>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest ${
                    b.paymentStatus === 'COMPLETED' ? 'bg-green-100 text-green-800' : 
                    b.paymentStatus === 'FAILED' ? 'bg-red-100 text-red-800' : 
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {({
                      PENDING: "PENDIENTE",
                      PAID: "PAGADO",
                      COMPLETED: "COMPLETADO",
                      FAILED: "FALLIDO",
                      REFUNDED: "REEMBOLSADO"
                    }[b.paymentStatus as string] || b.paymentStatus)}
                  </span>
                </td>

                {/* Estado */}
                <td className="px-5 py-4 whitespace-nowrap">
                  <StatusSelectClient bookingId={b.id} initialStatus={b.bookingStatus} />
                </td>

                {/* Acciones */}
                <td className="px-5 py-4 whitespace-nowrap text-right space-y-2">
                  <div className="flex flex-col gap-2 items-end">
                    <Link href={`/booking/${b.publicCode}/receipt`} target="_blank">
                      <Button variant="outline" size="sm" className="w-[140px] justify-start text-xs border-blue-200 text-blue-700 hover:bg-blue-50">
                        <FileText className="w-3.5 h-3.5 mr-2" />
                        Recibo
                      </Button>
                    </Link>
                    <Button variant="outline" size="sm" className="w-[140px] justify-start text-xs border-indigo-200 text-indigo-700 hover:bg-indigo-50">
                      <Mail className="w-3.5 h-3.5 mr-2" />
                      Notificar
                    </Button>
                    <Link href={`/admin/bookings/${b.id}`}>
                      <Button variant="ghost" size="sm" className="w-[140px] justify-start text-xs text-gray-600">
                        <Eye className="w-3.5 h-3.5 mr-2" />
                        Ver Detalles
                      </Button>
                    </Link>
                  </div>
                </td>
                
              </tr>
            ))}
            {bookings.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center">
                  <p className="text-gray-500 mb-2">No hay traslados registrados en el sistema.</p>
                  <Link href="/admin/bookings/new">
                    <Button variant="outline" size="sm">Crear primera reserva</Button>
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
