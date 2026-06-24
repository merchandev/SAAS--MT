"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateHotelAction } from "@/modules/b2b/b2b.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

export function HotelEditForm({ hotel }: { hotel: any }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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
      }
    } catch (err) {
      setError("Error crítico al actualizar el hotel.");
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card className="border-gray-200 shadow-sm">
        <CardContent className="pt-6 space-y-6">
          {error && <div className="text-red-500 text-sm bg-red-50 p-3 rounded">{error}</div>}
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 col-span-2">
              <Label htmlFor="name" className="text-gray-700">Nombre del Hotel / Cadena</Label>
              <Input id="name" name="name" required defaultValue={hotel.name} className="text-gray-900 bg-white" />
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
              <Label htmlFor="email" className="text-gray-700">Correo Electrónico (Para Facturación/Alertas)</Label>
              <Input id="email" name="email" type="email" defaultValue={hotel.email || ""} className="text-gray-900 bg-white" />
            </div>
          </div>

          <h4 className="font-semibold pt-4 border-t text-gray-900">Reglas de Negocio</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="commissionValue" className="text-gray-700">Comisión para el Hotel (%)</Label>
              <Input id="commissionValue" name="commissionValue" type="number" step="0.1" defaultValue={Number(hotel.commissionValue)} required className="text-gray-900 bg-white" />
              <p className="text-xs text-gray-500">Porcentaje de la ganancia total que se liquida al hotel a fin de mes.</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="discountValue" className="text-gray-700">Descuento aplicado al Cliente (%)</Label>
              <Input id="discountValue" name="discountValue" type="number" step="0.1" defaultValue={Number(hotel.discountValue)} required className="text-gray-900 bg-white" />
              <p className="text-xs text-gray-500">Descuento si el huésped escanea el QR por sí mismo en recepción.</p>
            </div>
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <input type="checkbox" id="isActive" name="isActive" defaultChecked={hotel.isActive} className="w-4 h-4 text-[#D4AF37] bg-white border-gray-300 rounded focus:ring-[#D4AF37]" />
            <Label htmlFor="isActive" className="text-gray-700 font-medium">Hotel Activo (Puede recibir reservas)</Label>
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
