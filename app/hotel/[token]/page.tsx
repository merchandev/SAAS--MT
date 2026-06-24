import { notFound } from "next/navigation";
import { b2bQueries } from "@/modules/b2b/b2b.queries";
import { Button } from "@/components/ui/button";

interface Props {
  params: {
    token: string;
  };
}

export default async function HotelPortalPage({ params }: Props) {
  // 1. Validar el token mágico del hotel
  const hotel = await b2bQueries.getHotelByToken(params.token);

  if (!hotel || !hotel.isActive) {
    notFound(); // Lanza página 404 si el token es inválido o el hotel está desactivado
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-sm py-4 px-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 bg-blue-600 rounded-md flex items-center justify-center text-white font-bold">
            MT
          </div>
          <span className="font-semibold text-lg">MeTransfers B2B</span>
        </div>
        <div className="text-sm text-gray-600 font-medium bg-gray-100 px-3 py-1 rounded-full">
          Portal Recepción: {hotel.name}
        </div>
      </header>

      <main className="flex-grow p-6 max-w-5xl mx-auto w-full">
        <div className="bg-white rounded-xl shadow-sm border p-8 mb-6 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Bienvenido, equipo de {hotel.name}</h1>
          <p className="text-gray-500 mb-8 max-w-2xl mx-auto">
            Desde este portal puedes reservar traslados para tus huéspedes de forma rápida. 
            Todas las reservas hechas desde este enlace acumulan un {Number(hotel.commissionValue)}% de comisión para el hotel.
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" className="px-8">
              Nueva Reserva para Huésped
            </Button>
            <Button size="lg" variant="outline" className="px-8">
              Ver Historial de Reservas
            </Button>
          </div>
        </div>

        <h2 className="text-xl font-bold mb-4">Últimas Reservas Gestionadas</h2>
        <div className="bg-white rounded-md shadow-sm border overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Referencia</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ruta</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Comisión Estimada</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {hotel.bookings.map((b) => {
                const commission = (Number(b.finalPrice) * Number(hotel.commissionValue)) / 100;
                return (
                  <tr key={b.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">{b.publicCode}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 truncate max-w-xs">{b.originAddress} ⬇ {b.destinationAddress}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(b.serviceDate).toLocaleDateString()} a las {b.serviceTime}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {b.bookingStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                      +€{commission.toFixed(2)}
                    </td>
                  </tr>
                );
              })}
              {hotel.bookings.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
                    Todavía no has realizado ninguna reserva.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
