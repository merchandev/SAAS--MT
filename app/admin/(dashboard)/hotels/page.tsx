import Link from "next/link";
import { b2bQueries } from "@/modules/b2b/b2b.queries";
import { Button } from "@/components/ui/button";
import { QRDialogButton } from "@/components/ui/qr-dialog-button";

export const dynamic = "force-dynamic";

export default async function HotelsPage() {
  const hotels = await b2bQueries.getAllHotels();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold tracking-tight">Hoteles (B2B)</h3>
          <p className="text-gray-500">Generación de enlaces mágicos y códigos QR para recepcionistas.</p>
        </div>
        <Link href="/admin/hotels/new">
          <Button>+ Nuevo Hotel</Button>
        </Link>
      </div>

      <div className="border rounded-md shadow-sm bg-white overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contacto</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Comisión</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reservas</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Enlace QR</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {hotels.map((h) => (
              <tr key={h.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{h.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {h.contactName || "Sin contacto"}<br/>
                  <span className="text-xs text-gray-400">{h.email}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {Number(h.commissionValue)}%
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {h._count.bookings}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    h.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {h.isActive ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                  <QRDialogButton token={h.token} hotelName={h.name} />
                  <Link href={`/admin/hotels/${h.id}/edit`}>
                    <Button variant="secondary" size="sm">Editar</Button>
                  </Link>
                  <Link href={`/admin/hotels/${h.id}/user/new`}>
                    <Button variant="outline" size="sm">+ Usuario</Button>
                  </Link>
                </td>
              </tr>
            ))}
            {hotels.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                  No hay hoteles registrados en la red.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
