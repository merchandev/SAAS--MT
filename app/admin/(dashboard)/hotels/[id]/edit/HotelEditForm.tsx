"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateHotelAction } from "@/modules/b2b/b2b.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import PlaceAutocompleteInput from "@/components/maps/PlaceAutocompleteInput";
import { Plus, Trash2 } from "lucide-react";

export function HotelEditForm({ hotel, vehicles }: { hotel: any, vehicles: any[] }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [address, setAddress] = useState(hotel.address || "");
  const [placeId, setPlaceId] = useState(hotel.placeId || "");

  const [destinations, setDestinations] = useState<any[]>(
    hotel.routesSettings?.destinations || []
  );

  const handleAddDestination = () => {
    setDestinations([
      ...destinations,
      {
        id: crypto.randomUUID(),
        name: "",
        address: "",
        placeId: "",
        prices: {} // { vehicleId: priceOneWay }
      }
    ]);
  };

  const handleRemoveDestination = (id: string) => {
    setDestinations(destinations.filter(d => d.id !== id));
  };

  const updateDestination = (id: string, field: string, value: any) => {
    setDestinations(prev => prev.map(d => d.id === id ? { ...d, [field]: value } : d));
  };

  const updateDestinationPrice = (destinationId: string, vehicleId: string, price: number) => {
    setDestinations(prev => prev.map(d => {
      if (d.id === destinationId) {
        return {
          ...d,
          prices: {
            ...d.prices,
            [vehicleId]: price
          }
        };
      }
      return d;
    }));
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      contactName: formData.get("contactName") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      address,
      placeId,
      routesSettings: { destinations: JSON.parse(JSON.stringify(destinations)) },
      commissionValue: Number(formData.get("commissionValue")),
      discountValue: Number(formData.get("discountValue")),
      isActive: formData.get("isActive") === "on",
    };

    try {
      const result = await updateHotelAction(hotel.id, data);
      if (result.error) {
        setError(result.error);
        setIsLoading(false);
      } else {
        router.push("/admin/hotels");
        router.refresh();
      }
    } catch (err) {
      setError("Error crítico al actualizar el hotel.");
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="border-gray-200 shadow-sm">
        <CardContent className="pt-6 space-y-6">
          {error && <div className="text-red-500 text-sm bg-red-50 p-3 rounded">{error}</div>}
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 col-span-2">
              <Label htmlFor="name" className="text-gray-700">Nombre del Hotel / Cadena</Label>
              <Input id="name" name="name" required defaultValue={hotel.name} className="text-gray-900 bg-white" />
            </div>
            <div className="space-y-2 col-span-2">
              <Label className="text-gray-700">Dirección del Hotel</Label>
              <PlaceAutocompleteInput 
                value={address}
                onChange={setAddress}
                onSelectPlace={(place) => {
                  setAddress(place.address);
                  setPlaceId(place.placeId);
                }}
                placeholder="Ej. Calle Principal 123, Ciudad"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contactName" className="text-gray-700">Persona de Contacto</Label>
              <Input id="contactName" name="contactName" defaultValue={hotel.contactName || ""} className="text-gray-900 bg-white" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-gray-700">Teléfono del Hotel</Label>
              <Input id="phone" name="phone" defaultValue={hotel.phone || ""} className="text-gray-900 bg-white" />
            </div>
            <div className="space-y-2 col-span-2">
              <Label htmlFor="email" className="text-gray-700">Correo Electrónico</Label>
              <Input id="email" name="email" type="email" defaultValue={hotel.email || ""} className="text-gray-900 bg-white" />
            </div>
          </div>

          <h4 className="font-semibold pt-4 border-t text-gray-900">Reglas de Negocio</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="commissionValue" className="text-gray-700">Comisión para el Hotel (%)</Label>
              <Input id="commissionValue" name="commissionValue" type="number" step="0.1" defaultValue={Number(hotel.commissionValue)} required className="text-gray-900 bg-white" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="discountValue" className="text-gray-700">Descuento aplicado al Cliente (%)</Label>
              <Input id="discountValue" name="discountValue" type="number" step="0.1" defaultValue={Number(hotel.discountValue)} required className="text-gray-900 bg-white" />
            </div>
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <input type="checkbox" id="isActive" name="isActive" defaultChecked={hotel.isActive} className="w-4 h-4 text-[#D4AF37] bg-white border-gray-300 rounded focus:ring-[#D4AF37]" />
            <Label htmlFor="isActive" className="text-gray-700 font-medium">Hotel Activo (Puede recibir reservas)</Label>
          </div>
        </CardContent>
      </Card>

      <Card className="border-gray-200 shadow-sm">
        <CardContent className="pt-6 space-y-6">
          <div className="flex justify-between items-center">
            <h4 className="font-semibold text-gray-900">Rutas y Precios Fijos</h4>
            <Button type="button" size="sm" variant="outline" onClick={handleAddDestination} className="gap-2">
              <Plus className="h-4 w-4" /> Añadir Destino Fijo
            </Button>
          </div>
          <p className="text-sm text-gray-500">
            Define destinos comunes (Ej: Aeropuerto, Puerto) y el precio fijo por vehículo.
          </p>

          <div className="space-y-6">
            {destinations.map((dest, index) => (
              <div key={dest.id} className="p-4 border rounded-lg bg-gray-50 relative">
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="icon" 
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700 hover:bg-red-50"
                  onClick={() => handleRemoveDestination(dest.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <Label className="text-gray-700">Nombre Público del Destino</Label>
                    <Input 
                      value={dest.name} 
                      onChange={(e) => updateDestination(dest.id, "name", e.target.value)} 
                      placeholder="Ej: Aeropuerto de Barcelona"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-700">Dirección Exacta (Google Maps)</Label>
                    <PlaceAutocompleteInput 
                      value={dest.address}
                      onChange={(val) => updateDestination(dest.id, "address", val)}
                      onSelectPlace={(place) => {
                        updateDestination(dest.id, "address", place.address);
                        updateDestination(dest.id, "placeId", place.placeId);
                      }}
                      placeholder="Ej. Terminal 1..."
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <Label className="text-gray-700 font-bold mb-3 block">Precios Fijos por Vehículo (€)</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {vehicles.map(v => (
                      <div key={v.id} className="space-y-1">
                        <Label className="text-xs text-gray-500">{v.name}</Label>
                        <Input 
                          type="number" 
                          min="0" 
                          step="0.01" 
                          placeholder="€"
                          value={dest.prices[v.id] || ""}
                          onChange={(e) => updateDestinationPrice(dest.id, v.id, Number(e.target.value))}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
            
            {destinations.length === 0 && (
              <div className="text-center p-6 border-2 border-dashed rounded-lg text-gray-400">
                No hay destinos fijos configurados. El sistema usará la tarifa por kilómetro para este hotel.
              </div>
            )}
          </div>

          <div className="flex justify-end pt-6 border-t mt-6">
            <Button type="button" variant="outline" className="mr-4" onClick={() => router.back()}>Cancelar</Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
