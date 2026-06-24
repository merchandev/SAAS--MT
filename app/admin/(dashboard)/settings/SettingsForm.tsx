"use client";

import { useState } from "react";
import { upsertSettingsAction } from "@/modules/settings/settings.actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function SettingsForm({ initialData }: { initialData: Record<string, string> }) {
  const [data, setData] = useState(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error", text: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    const result = await upsertSettingsAction(data as any);
    
    if (result.error) {
      setMessage({ type: "error", text: result.error });
    } else {
      setMessage({ type: "success", text: "Configuración guardada correctamente." });
    }
    
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
      {message && (
        <div className={`p-4 rounded-md text-sm ${message.type === "success" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}>
          {message.text}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Identidad Comercial</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="COMPANY_NAME">Nombre de la Empresa</Label>
              <Input id="COMPANY_NAME" name="COMPANY_NAME" value={data.COMPANY_NAME || ""} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="TAX_ID">NIF / CIF (Para facturas)</Label>
              <Input id="TAX_ID" name="TAX_ID" value={data.TAX_ID || ""} onChange={handleChange} required />
            </div>
            <div className="space-y-2 col-span-2">
              <Label htmlFor="COMPANY_EMAIL">Correo Electrónico de Contacto</Label>
              <Input id="COMPANY_EMAIL" name="COMPANY_EMAIL" type="email" value={data.COMPANY_EMAIL || ""} onChange={handleChange} required />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Reglas Operativas (Motor de Precios y Reservas)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="NIGHT_START_TIME">Inicio de Franja Nocturna</Label>
              <Input id="NIGHT_START_TIME" name="NIGHT_START_TIME" value={data.NIGHT_START_TIME || ""} onChange={handleChange} placeholder="Ej: 22:00" required />
              <p className="text-xs text-gray-500">Formato HH:MM. A partir de esta hora se aplica el recargo nocturno.</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="NIGHT_END_TIME">Fin de Franja Nocturna</Label>
              <Input id="NIGHT_END_TIME" name="NIGHT_END_TIME" value={data.NIGHT_END_TIME || ""} onChange={handleChange} placeholder="Ej: 06:00" required />
              <p className="text-xs text-gray-500">Formato HH:MM. Hora en la que termina el recargo nocturno.</p>
            </div>
            <div className="space-y-2 col-span-2">
              <Label htmlFor="MIN_HOURS_AHEAD_BOOKING">Margen Mínimo de Reserva (Horas)</Label>
              <Input id="MIN_HOURS_AHEAD_BOOKING" name="MIN_HOURS_AHEAD_BOOKING" type="number" value={data.MIN_HOURS_AHEAD_BOOKING || ""} onChange={handleChange} required />
              <p className="text-xs text-gray-500">Los clientes web no podrán reservar con menos de estas horas de antelación.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Guardando..." : "Guardar Configuración"}
        </Button>
      </div>
    </form>
  );
}
