"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createHotelAction } from "@/modules/b2b/b2b.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import PlaceAutocompleteInput from "@/components/maps/PlaceAutocompleteInput";

export default function NewHotelPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [address, setAddress] = useState("");
  const [placeId, setPlaceId] = useState("");

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
      commissionValue: Number(formData.get("commissionValue")),
      discountValue: Number(formData.get("discountValue")),
    };

    try {
      const result = await createHotelAction(data);
      if (result.error) {
        setError(result.error);
        setIsLoading(false);
      } else {
        router.push("/admin/hotels");
      }
    } catch (err) {
      setError("Error crítico al crear el hotel.");
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h3 className="text-2xl font-bold tracking-tight">Afiliar Nuevo Hotel</h3>
        <p className="text-gray-500">El sistema generará un enlace mágico (token QR) único para sus recepcionistas.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardContent className="pt-6 space-y-6">
            {error && <div className="text-red-500 text-sm">{error}</div>}
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 col-span-2">
                <Label htmlFor="name">Nombre del Hotel / Cadena</Label>
                <Input id="name" name="name" required placeholder="Ej. Hotel Sol y Mar" />
              </div>
              <div className="space-y-2 col-span-2">
                <Label>Dirección del Hotel</Label>
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
                <Label htmlFor="contactName">Persona de Contacto</Label>
                <Input id="contactName" name="contactName" placeholder="Recepcionista Jefe" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Teléfono del Hotel</Label>
                <Input id="phone" name="phone" placeholder="+34..." />
              </div>
              <div className="space-y-2 col-span-2">
                <Label htmlFor="email">Correo Electrónico (Para Facturación/Alertas)</Label>
                <Input id="email" name="email" type="email" placeholder="recepcion@hotelsolymar.com" />
              </div>
            </div>

            <h4 className="font-semibold pt-4 border-t">Reglas de Negocio</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="commissionValue">Comisión para el Hotel (%)</Label>
                <Input id="commissionValue" name="commissionValue" type="number" step="0.1" defaultValue={10.0} required />
                <p className="text-xs text-gray-400">Porcentaje de la ganancia total que se liquida al hotel a fin de mes.</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="discountValue">Descuento aplicado al Cliente (%)</Label>
                <Input id="discountValue" name="discountValue" type="number" step="0.1" defaultValue={0.0} required />
                <p className="text-xs text-gray-400">Descuento si el huésped escanea el QR por sí mismo en recepción.</p>
              </div>
            </div>

            <div className="flex justify-end pt-6">
              <Button type="button" variant="outline" className="mr-4" onClick={() => router.back()}>Cancelar</Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Generando Enlace QR..." : "Afiliar Hotel"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
