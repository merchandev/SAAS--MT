"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createAdminBookingAction } from "@/modules/bookings/bookings.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import PlaceAutocompleteInput from "@/components/maps/PlaceAutocompleteInput";

export default function NewAdminBookingPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // States for Autocomplete
  const [originAddress, setOriginAddress] = useState("");
  const [originPlaceId, setOriginPlaceId] = useState("");
  const [destinationAddress, setDestinationAddress] = useState("");
  const [destinationPlaceId, setDestinationPlaceId] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      customerName: formData.get("customerName") as string,
      customerEmail: formData.get("customerEmail") as string,
      customerPhone: formData.get("customerPhone") as string,
      vehicleId: formData.get("vehicleId") as string,
      originAddress: formData.get("originAddress") as string,
      originPlaceId: formData.get("originPlaceId") as string,
      destinationAddress: formData.get("destinationAddress") as string,
      destinationPlaceId: formData.get("destinationPlaceId") as string,
      serviceDate: formData.get("serviceDate") as string,
      serviceTime: formData.get("serviceTime") as string,
      tripType: formData.get("tripType") as "ONE_WAY" | "ROUND_TRIP",
      passengers: Number(formData.get("passengers")),
      luggage: Number(formData.get("luggage")),
      flightNumber: formData.get("flightNumber") as string,
      internalNotes: formData.get("internalNotes") as string,
    };

    try {
      const result = await createAdminBookingAction(data);
      if (result.error) {
        setError(result.error);
        setIsLoading(false);
      } else {
        router.push("/admin/bookings");
      }
    } catch {
      setError("Error al procesar la reserva manual.");
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h3 className="text-2xl font-bold tracking-tight">Nueva Reserva Manual</h3>
        <p className="text-gray-500">Crea una reserva directamente desde el panel administrativo.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardContent className="pt-6 space-y-6">
            {error && <div className="text-red-500 text-sm">{error}</div>}

            <h4 className="font-semibold pt-4 border-t">Datos del Cliente</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="customerName">Nombre completo</Label>
                <Input id="customerName" name="customerName" required placeholder="Ej. Juan Pérez" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customerEmail">Correo electrónico</Label>
                <Input id="customerEmail" name="customerEmail" type="email" required placeholder="juan@ejemplo.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customerPhone">Teléfono / WhatsApp</Label>
                <Input id="customerPhone" name="customerPhone" placeholder="+34 600 000 000" />
              </div>
            </div>

            <h4 className="font-semibold pt-4 border-t">Ruta y fechas</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="originAddress">Origen</Label>
                <PlaceAutocompleteInput 
                  name="originAddress"
                  value={originAddress}
                  onChange={setOriginAddress}
                  onSelectPlace={(place) => {
                    setOriginAddress(place.address);
                    setOriginPlaceId(place.placeId);
                  }}
                  className="h-10 w-full"
                />
                <input type="hidden" name="originPlaceId" value={originPlaceId} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="originPlaceId_display">Google Place ID origen opcional</Label>
                <Input id="originPlaceId_display" placeholder="place_id opcional" value={originPlaceId} onChange={(e) => setOriginPlaceId(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="destinationAddress">Destino</Label>
                <PlaceAutocompleteInput 
                  name="destinationAddress"
                  value={destinationAddress}
                  onChange={setDestinationAddress}
                  onSelectPlace={(place) => {
                    setDestinationAddress(place.address);
                    setDestinationPlaceId(place.placeId);
                  }}
                  className="h-10 w-full"
                />
                <input type="hidden" name="destinationPlaceId" value={destinationPlaceId} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="destinationPlaceId_display">Google Place ID destino opcional</Label>
                <Input id="destinationPlaceId_display" placeholder="place_id opcional" value={destinationPlaceId} onChange={(e) => setDestinationPlaceId(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="serviceDate">Fecha del servicio</Label>
                <Input id="serviceDate" name="serviceDate" type="date" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="serviceTime">Hora del servicio</Label>
                <Input id="serviceTime" name="serviceTime" type="time" required />
              </div>
            </div>

            <p className="text-sm text-gray-500">
              La distancia, duración y precio se recalculan en servidor con Google Maps antes de crear la reserva.
            </p>

            <h4 className="font-semibold pt-4 border-t">Detalles del traslado</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="vehicleId">ID vehículo</Label>
                <Input id="vehicleId" name="vehicleId" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tripType">Tipo de viaje</Label>
                <select name="tripType" className="w-full border rounded p-2" required>
                  <option value="ONE_WAY">Solo Ida</option>
                  <option value="ROUND_TRIP">Ida y Vuelta</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="passengers">Pasajeros</Label>
                <Input id="passengers" name="passengers" type="number" required defaultValue={1} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="luggage">Maletas</Label>
                <Input id="luggage" name="luggage" type="number" required defaultValue={0} />
              </div>
            </div>

            <div className="flex justify-end pt-6 border-t mt-6">
              <Button type="button" variant="outline" className="mr-4" onClick={() => router.back()}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Calculando y guardando..." : "Crear reserva"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
