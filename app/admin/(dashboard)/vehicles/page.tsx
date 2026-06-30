import Link from "next/link";
import Image from "next/image";
import { vehiclesQueries } from "@/modules/vehicles/vehicles.queries";
import { Button } from "@/components/ui/button";
import { getVehicleImageSrc } from "@/lib/fleet-images";

export const dynamic = "force-dynamic";

export default async function VehiclesPage() {
  const vehicles = await vehiclesQueries.getAllVehicles();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold tracking-tight">Vehículos</h3>
          <p className="text-gray-500">Gestiona la flota y los precios base de los coches.</p>
        </div>
        <Link href="/admin/vehicles/new">
          <Button>+ Nuevo Vehículo</Button>
        </Link>
      </div>

      <div className="border rounded-md shadow-sm bg-white overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Imagen</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoría</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capacidad</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio/Km</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {vehicles.map((v) => (
              <tr key={v.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{v.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="relative h-12 w-20 overflow-hidden rounded-md bg-gray-100">
                    <Image
                      src={getVehicleImageSrc(v)}
                      alt={`${v.name} de MeTransfers`}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{v.category.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {v.passengerCapacity} Pax / {v.luggageCapacity} Maletas
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  €{Number(v.pricePerKmOneWay).toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    v.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {v.isActive ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link href={`/admin/vehicles/${v.id}/edit`}>
                    <Button variant="outline" size="sm" className="mr-2">Editar</Button>
                  </Link>
                </td>
              </tr>
            ))}
            {vehicles.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-10 text-center text-gray-500">
                  No hay vehículos registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
