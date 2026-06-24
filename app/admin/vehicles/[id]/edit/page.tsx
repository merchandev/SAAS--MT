import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { updateVehicleAction } from "@/modules/vehicles/vehicles.actions";

export const dynamic = "force-dynamic";

export default async function EditVehiclePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const vehicle = await prisma.vehicle.findUnique({
    where: { id }
  });

  if (!vehicle) {
    notFound();
  }

  const categories = await prisma.vehicleCategory.findMany();

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h3 className="text-2xl font-bold tracking-tight">Editar Vehículo</h3>
        <p className="text-gray-500">Modifica los detalles y precios de este vehículo.</p>
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
          airportSurcharge: Number(formData.get("airportSurcharge")),
          nightSurcharge: Number(formData.get("nightSurcharge")),
          isActive: formData.get("isActive") === "on",
        };
        
        const res = await updateVehicleAction(id, data as any);
        if (res.success) redirect("/admin/vehicles");
      }} className="bg-white shadow-sm border rounded-md p-6 space-y-4">
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nombre</label>
            <input name="name" required defaultValue={vehicle.name} className="w-full p-2 border rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Slug Único</label>
            <input name="slug" required defaultValue={vehicle.slug} className="w-full p-2 border rounded-md" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Categoría</label>
          <select name="categoryId" required defaultValue={vehicle.categoryId} className="w-full p-2 border rounded-md">
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Pasajeros</label>
            <input name="passengerCapacity" type="number" required min="1" defaultValue={vehicle.passengerCapacity} className="w-full p-2 border rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Maletas</label>
            <input name="luggageCapacity" type="number" required min="0" defaultValue={vehicle.luggageCapacity} className="w-full p-2 border rounded-md" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Precio/Km Ida (€)</label>
            <input name="pricePerKmOneWay" type="number" step="0.01" required defaultValue={Number(vehicle.pricePerKmOneWay)} className="w-full p-2 border rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Precio/Km Ida y Vuelta (€)</label>
            <input name="pricePerKmRoundTrip" type="number" step="0.01" required defaultValue={Number(vehicle.pricePerKmRoundTrip)} className="w-full p-2 border rounded-md" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Precio Mínimo (€)</label>
            <input name="minimumPrice" type="number" step="0.01" required defaultValue={Number(vehicle.minimumPrice)} className="w-full p-2 border rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Precio Hora (€)</label>
            <input name="pricePerHour" type="number" step="0.01" required defaultValue={Number(vehicle.pricePerHour)} className="w-full p-2 border rounded-md" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Recargo Aeropuerto (€)</label>
            <input name="airportSurcharge" type="number" step="0.01" required defaultValue={Number(vehicle.airportSurcharge)} className="w-full p-2 border rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Recargo Nocturno (€)</label>
            <input name="nightSurcharge" type="number" step="0.01" required defaultValue={Number(vehicle.nightSurcharge)} className="w-full p-2 border rounded-md" />
          </div>
        </div>

        <div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" name="isActive" defaultChecked={vehicle.isActive} className="w-4 h-4" />
            <span className="text-sm font-medium">Vehículo Activo</span>
          </label>
        </div>

        <div className="pt-4 flex justify-end gap-2">
          <a href="/admin/vehicles" className="px-4 py-2 border rounded-md text-sm font-medium hover:bg-gray-50">Cancelar</a>
          <Button type="submit">Actualizar Vehículo</Button>
        </div>
      </form>
    </div>
  );
}
