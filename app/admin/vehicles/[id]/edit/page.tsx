import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";

const prisma = new PrismaClient();

export default async function EditVehiclePage({ params }: { params: { id: string } }) {
  const vehicle = await prisma.vehicle.findUnique({
    where: { id: params.id },
  });

  const categories = await prisma.vehicleCategory.findMany();

  if (!vehicle) {
    notFound();
  }

  // En una versión interactiva usaríamos un Client Component para el formulario.
  // Aquí pintamos la maqueta funcional como indicaba el plan.
  
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Editar Vehículo</h1>
          <p className="text-gray-500">Actualiza las capacidades y tarifas de {vehicle.name}.</p>
        </div>
        <Button variant="outline" onClick={() => {}} className="pointer-events-none">
          Volver
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border p-6">
        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nombre Público</label>
              <input 
                type="text" 
                defaultValue={vehicle.name} 
                className="w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Identificador Único (Slug)</label>
              <input 
                type="text" 
                defaultValue={vehicle.slug} 
                className="w-full rounded-md border border-gray-300 px-3 py-2 bg-gray-50"
                readOnly
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Pasajeros Máximos</label>
              <input 
                type="number" 
                defaultValue={vehicle.passengerCapacity} 
                className="w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Maletas Máximas</label>
              <input 
                type="number" 
                defaultValue={vehicle.luggageCapacity} 
                className="w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Precio por Km (€)</label>
              <input 
                type="number" 
                step="0.01"
                defaultValue={Number(vehicle.pricePerKmOneWay)} 
                className="w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Precio Base Mínimo (€)</label>
              <input 
                type="number" 
                step="0.01"
                defaultValue={Number(vehicle.minimumPrice)} 
                className="w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>
          </div>
          
          <div className="pt-6 border-t flex justify-end gap-3">
            <Button variant="outline" type="button">Cancelar</Button>
            <Button type="button">Guardar Cambios</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
