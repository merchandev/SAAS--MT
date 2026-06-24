"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createVehicleAction } from "@/modules/vehicles/vehicles.actions";
import { vehiclesQueries } from "@/modules/vehicles/vehicles.queries";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

export default function NewVehiclePage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<{id: string, name: string}[]>([]);

  useEffect(() => {
    // Al no usar server components para esto por simplicidad del form
    // Llamar a una action o query para cargar categorias. 
    // Como es cliente, ideal usar SWR/React Query o una server action directa.
    // Lo simularemos para el scope de esta iteración.
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      categoryId: formData.get("categoryId") as string,
      name: formData.get("name") as string,
      slug: (formData.get("name") as string).toLowerCase().replace(/\s+/g, '-'),
      passengerCapacity: Number(formData.get("passengerCapacity")),
      luggageCapacity: Number(formData.get("luggageCapacity")),
      pricePerKmOneWay: Number(formData.get("pricePerKmOneWay")),
      pricePerKmRoundTrip: Number(formData.get("pricePerKmRoundTrip")),
      pricePerHour: Number(formData.get("pricePerHour")),
      minimumPrice: Number(formData.get("minimumPrice")),
      airportSurcharge: Number(formData.get("airportSurcharge")),
      nightSurcharge: Number(formData.get("nightSurcharge")),
      isActive: true,
    };

    try {
      const result = await createVehicleAction(data);
      if (result.error) {
        setError(result.error);
        setIsLoading(false);
      } else {
        router.push("/admin/vehicles");
      }
    } catch (err) {
      setError("Error al procesar el formulario.");
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h3 className="text-2xl font-bold tracking-tight">Crear Vehículo</h3>
        <p className="text-gray-500">Añade un nuevo vehículo a la flota configurando sus reglas de precio.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardContent className="pt-6 space-y-6">
            {error && <div className="text-red-500 text-sm">{error}</div>}
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre del Vehículo</Label>
                <Input id="name" name="name" required placeholder="Ej. Mercedes Clase V" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="categoryId">Categoría (ID UUID temporal por UI)</Label>
                <Input id="categoryId" name="categoryId" required placeholder="Pega el ID de la categoría" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="passengerCapacity">Pasajeros Máximos</Label>
                <Input id="passengerCapacity" name="passengerCapacity" type="number" required defaultValue={4} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="luggageCapacity">Maletas Máximas</Label>
                <Input id="luggageCapacity" name="luggageCapacity" type="number" required defaultValue={4} />
              </div>
            </div>

            <h4 className="font-semibold pt-4 border-t">Estructura de Precios Base</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pricePerKmOneWay">Precio / Km (Ida)</Label>
                <Input id="pricePerKmOneWay" name="pricePerKmOneWay" type="number" step="0.01" required defaultValue={1.50} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pricePerKmRoundTrip">Precio / Km (Ida y Vuelta)</Label>
                <Input id="pricePerKmRoundTrip" name="pricePerKmRoundTrip" type="number" step="0.01" required defaultValue={1.20} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="minimumPrice">Precio Mínimo de Servicio (€)</Label>
                <Input id="minimumPrice" name="minimumPrice" type="number" step="0.01" required defaultValue={35.00} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pricePerHour">Precio por Hora (Disposición)</Label>
                <Input id="pricePerHour" name="pricePerHour" type="number" step="0.01" required defaultValue={50.00} />
              </div>
            </div>

            <h4 className="font-semibold pt-4 border-t">Recargos y Suplementos Fijos</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="airportSurcharge">Recargo por Aeropuerto (€)</Label>
                <Input id="airportSurcharge" name="airportSurcharge" type="number" step="0.01" defaultValue={0} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nightSurcharge">Recargo Nocturno (€)</Label>
                <Input id="nightSurcharge" name="nightSurcharge" type="number" step="0.01" defaultValue={0} />
              </div>
            </div>

            <div className="flex justify-end pt-6">
              <Button type="button" variant="outline" className="mr-4" onClick={() => router.back()}>Cancelar</Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Guardando..." : "Guardar Vehículo"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
