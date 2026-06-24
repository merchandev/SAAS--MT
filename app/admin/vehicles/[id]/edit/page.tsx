import { notFound, redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { updateVehicleAction } from "@/modules/vehicles/vehicles.actions";

export default async function EditVehiclePage({ params }: { params: { id: string } }) {
  const vehicle = await prisma.vehicle.findUnique({
    where: { id: params.id }
  });

  if (!vehicle) {
    notFound();
  }

  const categories = await prisma.vehicleCategory.findMany();

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h3 className="text-2xl font-bold tracking-tight">Editar Vehículo: {vehicle.name}</h3>
        <p className="text-gray-500">Actualiza los datos del vehículo y los precios.</p>
      </div>

      <form action={async (formData) => {
        "use server";
        
        const data = {
          name: formData.get("name") as string,
          slug: formData.get("slug") as string,
          categoryId: formData.get("categoryId") as string,
          passengerCapacity: Number(formData.get("passengerCapacity")),
          luggageCapacity: Number(formData.get("luggageCapacity")),
          pricePerKmOneWay: Number(formData.get("pricePerKmOneWay")),
          pricePerKmRoundTrip: Number(formData.get("pricePerKmRoundTrip")),
          pricePerHour: Number(formData.get("pricePerHour")),
          minimumPrice: Number(formData.get("minimumPrice")),
        };
        
        const res = await updateVehicleAction(vehicle.id, data as any);
        if (res.success) redirect("/admin/vehicles");
      }} className="bg-white shadow-sm border rounded-md p-6 space-y-4">
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nombre</label>
            <input name="name" defaultValue={vehicle.name} required className="w-full p-2 border rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Slug Único</label>
            <input name="slug" defaultValue={vehicle.slug} required className="w-full p-2 border rounded-md" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Categoría</label>
          <select name="categoryId" defaultValue={vehicle.categoryId} required className="w-full p-2 border rounded-md">
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Pasajeros</label>
            <input name="passengerCapacity" type="number" defaultValue={vehicle.passengerCapacity} required min="1" className="w-full p-2 border rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Maletas</label>
            <input name="luggageCapacity" type="number" defaultValue={vehicle.luggageCapacity} required min="0" className="w-full p-2 border rounded-md" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Precio/Km Ida (€)</label>
            <input name="pricePerKmOneWay" type="number" step="0.01" defaultValue={Number(vehicle.pricePerKmOneWay)} required className="w-full p-2 border rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Precio/Km Ida y Vuelta (€)</label>
            <input name="pricePerKmRoundTrip" type="number" step="0.01" defaultValue={Number(vehicle.pricePerKmRoundTrip)} required className="w-full p-2 border rounded-md" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Precio Mínimo (€)</label>
            <input name="minimumPrice" type="number" step="0.01" defaultValue={Number(vehicle.minimumPrice)} required className="w-full p-2 border rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Precio Hora (€)</label>
            <input name="pricePerHour" type="number" step="0.01" defaultValue={Number(vehicle.pricePerHour)} required className="w-full p-2 border rounded-md" />
          </div>
        </div>

        <div className="pt-4 flex justify-end gap-2">
          <a href="/admin/vehicles" className="px-4 py-2 border rounded-md text-sm font-medium hover:bg-gray-50">Cancelar</a>
          <Button type="submit">Actualizar Vehículo</Button>
        </div>
      </form>
    </div>
  );
}
