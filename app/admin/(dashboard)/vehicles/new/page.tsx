import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createVehicleAction } from "@/modules/vehicles/vehicles.actions";

export const dynamic = "force-dynamic";

export default async function NewVehiclePage() {
  const categories = await prisma.vehicleCategory.findMany();

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h3 className="text-2xl font-bold tracking-tight">Nuevo Vehículo</h3>
        <p className="text-gray-500">Añade un nuevo vehículo a la flota.</p>
      </div>

      <form action={async (formData) => {
        "use server";
        
        const data = {
          name: formData.get("name") as string,
          slug: formData.get("slug") as string,
          imageUrl: formData.get("imageUrl") as string,
          categoryId: formData.get("categoryId") as string,
          passengerCapacity: Number(formData.get("passengerCapacity")),
          luggageCapacity: Number(formData.get("luggageCapacity")),
          pricePerKmOneWay: Number(formData.get("pricePerKmOneWay")),
          pricePerKmRoundTrip: Number(formData.get("pricePerKmRoundTrip")),
          pricePerHour: Number(formData.get("pricePerHour")),
          minimumPrice: Number(formData.get("minimumPrice")),
          sortOrder: Number(formData.get("sortOrder")),
        };
        
        const res = await createVehicleAction(data as any);
        if (res.success) redirect("/admin/vehicles");
      }} className="bg-white shadow-sm border rounded-md p-6 space-y-4">
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nombre</label>
            <input name="name" required className="w-full p-2 border rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Slug Único</label>
            <input name="slug" required className="w-full p-2 border rounded-md" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Categoría</label>
          <select name="categoryId" required className="w-full p-2 border rounded-md">
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
            {categories.length === 0 && <option value="">No hay categorías - Créalas en DB primero</option>}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Imagen</label>
          <input name="imageUrl" placeholder="/images/vehicles/economic-class.png" className="w-full p-2 border rounded-md" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Pasajeros</label>
            <input name="passengerCapacity" type="number" required min="1" defaultValue="4" className="w-full p-2 border rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Maletas</label>
            <input name="luggageCapacity" type="number" required min="0" defaultValue="2" className="w-full p-2 border rounded-md" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Precio/Km Ida (€)</label>
            <input name="pricePerKmOneWay" type="number" step="0.01" required className="w-full p-2 border rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Precio/Km Ida y Vuelta (€)</label>
            <input name="pricePerKmRoundTrip" type="number" step="0.01" required className="w-full p-2 border rounded-md" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Precio Mínimo (€)</label>
            <input name="minimumPrice" type="number" step="0.01" required className="w-full p-2 border rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Precio Hora (€)</label>
            <input name="pricePerHour" type="number" step="0.01" required defaultValue="0" className="w-full p-2 border rounded-md" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Orden</label>
          <input name="sortOrder" type="number" required defaultValue="0" className="w-full p-2 border rounded-md" />
        </div>

        <div className="pt-4 flex justify-end gap-2">
          <a href="/admin/vehicles" className="px-4 py-2 border rounded-md text-sm font-medium hover:bg-gray-50">Cancelar</a>
          <Button type="submit">Guardar Vehículo</Button>
        </div>
      </form>
    </div>
  );
}
