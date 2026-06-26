"use client";

import { useState } from "react";
import { Palette, Save, Search } from "lucide-react";
import { upsertSettingsAction } from "@/modules/settings/settings.actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function SettingsForm({ initialData }: { initialData: Record<string, string> }) {
  const [data, setData] = useState(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setData({ ...data, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
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
    <form onSubmit={handleSubmit} className="space-y-6 max-w-5xl">
      {message && (
        <div className={`p-4 rounded-md text-sm ${message.type === "success" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}>
          {message.text}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Identidad comercial</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="COMPANY_NAME">Nombre de la empresa</Label>
              <Input id="COMPANY_NAME" name="COMPANY_NAME" value={data.COMPANY_NAME || ""} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="TAX_ID">NIF / CIF para facturas</Label>
              <Input id="TAX_ID" name="TAX_ID" value={data.TAX_ID || ""} onChange={handleChange} required />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="COMPANY_EMAIL">Correo electrónico de contacto</Label>
              <Input id="COMPANY_EMAIL" name="COMPANY_EMAIL" type="email" value={data.COMPANY_EMAIL || ""} onChange={handleChange} required />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5 text-[#D4AF37]" />
            SEO y marca
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="SITE_NAME">Nombre visible de la web</Label>
              <Input id="SITE_NAME" name="SITE_NAME" value={data.SITE_NAME || ""} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="SITE_TITLE">Título SEO principal</Label>
              <Input id="SITE_TITLE" name="SITE_TITLE" value={data.SITE_TITLE || ""} onChange={handleChange} maxLength={120} required />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="SITE_META_DESCRIPTION">Metadescripción</Label>
              <textarea
                id="SITE_META_DESCRIPTION"
                name="SITE_META_DESCRIPTION"
                value={data.SITE_META_DESCRIPTION || ""}
                onChange={handleChange}
                maxLength={180}
                rows={3}
                required
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-gray-400 focus:ring-2 focus:ring-gray-200"
              />
              <p className="text-xs text-gray-500">{(data.SITE_META_DESCRIPTION || "").length}/180 caracteres.</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="SITE_LOGO_URL">Logotipo</Label>
              <Input id="SITE_LOGO_URL" name="SITE_LOGO_URL" value={data.SITE_LOGO_URL || ""} onChange={handleChange} placeholder="/images/logo.png o https://..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="SITE_FAVICON_URL">Favicon</Label>
              <Input id="SITE_FAVICON_URL" name="SITE_FAVICON_URL" value={data.SITE_FAVICON_URL || ""} onChange={handleChange} placeholder="/favicon.ico o https://..." />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 rounded-lg border border-gray-200 p-4">
            <div className="space-y-2">
              <Label htmlFor="BRAND_PRIMARY_COLOR" className="flex items-center gap-2">
                <Palette className="w-4 h-4" />
                Color principal
              </Label>
              <div className="flex gap-2">
                <Input id="BRAND_PRIMARY_COLOR" name="BRAND_PRIMARY_COLOR" value={data.BRAND_PRIMARY_COLOR || ""} onChange={handleChange} required />
                <input
                  type="color"
                  value={data.BRAND_PRIMARY_COLOR || "#003049"}
                  onChange={(event) => setData({ ...data, BRAND_PRIMARY_COLOR: event.target.value })}
                  className="h-8 w-12 rounded-md border border-gray-200 bg-white"
                  aria-label="Seleccionar color principal"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="BRAND_ACCENT_COLOR" className="flex items-center gap-2">
                <Palette className="w-4 h-4" />
                Color de acento
              </Label>
              <div className="flex gap-2">
                <Input id="BRAND_ACCENT_COLOR" name="BRAND_ACCENT_COLOR" value={data.BRAND_ACCENT_COLOR || ""} onChange={handleChange} required />
                <input
                  type="color"
                  value={data.BRAND_ACCENT_COLOR || "#D4AF37"}
                  onChange={(event) => setData({ ...data, BRAND_ACCENT_COLOR: event.target.value })}
                  className="h-8 w-12 rounded-md border border-gray-200 bg-white"
                  aria-label="Seleccionar color de acento"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-lg border border-gray-200 p-4">
            {data.SITE_LOGO_URL ? (
              <img src={data.SITE_LOGO_URL} alt={data.SITE_NAME || "Logotipo"} className="h-12 w-12 rounded-md object-contain border border-gray-100" />
            ) : (
              <div className="h-12 w-12 rounded-md flex items-center justify-center font-bold text-gray-950" style={{ backgroundColor: data.BRAND_ACCENT_COLOR || "#D4AF37" }}>
                MT
              </div>
            )}
            <div className="min-w-0">
              <p className="font-semibold text-gray-900 truncate">{data.SITE_NAME || data.COMPANY_NAME}</p>
              <p className="text-sm text-gray-500 truncate">{data.SITE_TITLE}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Reglas operativas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="NIGHT_START_TIME">Inicio de franja nocturna</Label>
              <Input id="NIGHT_START_TIME" name="NIGHT_START_TIME" value={data.NIGHT_START_TIME || ""} onChange={handleChange} placeholder="Ej. 22:00" required />
              <p className="text-xs text-gray-500">Formato HH:MM. A partir de esta hora se aplica el recargo nocturno.</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="NIGHT_END_TIME">Fin de franja nocturna</Label>
              <Input id="NIGHT_END_TIME" name="NIGHT_END_TIME" value={data.NIGHT_END_TIME || ""} onChange={handleChange} placeholder="Ej. 06:00" required />
              <p className="text-xs text-gray-500">Formato HH:MM. Hora en la que termina el recargo nocturno.</p>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="MIN_HOURS_AHEAD_BOOKING">Margen mínimo de reserva en horas</Label>
              <Input id="MIN_HOURS_AHEAD_BOOKING" name="MIN_HOURS_AHEAD_BOOKING" type="number" value={data.MIN_HOURS_AHEAD_BOOKING || ""} onChange={handleChange} required />
              <p className="text-xs text-gray-500">Los clientes web no podrán reservar con menos de estas horas de antelación.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading}>
          <Save className="w-4 h-4" />
          {isLoading ? "Guardando..." : "Guardar configuración"}
        </Button>
      </div>
    </form>
  );
}
