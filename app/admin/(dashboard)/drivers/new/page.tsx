"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createDriverAction } from "@/modules/drivers/drivers.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

export default function NewDriverPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      fullName: formData.get("fullName") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      password: formData.get("password") as string,
      licenseNumber: formData.get("licenseNumber") as string,
    };

    try {
      const result = await createDriverAction(data);
      if (result.error) {
        setError(result.error);
        setIsLoading(false);
      } else {
        router.push("/admin/drivers");
      }
    } catch (err) {
      setError("Error crítico al crear el conductor.");
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h3 className="text-2xl font-bold tracking-tight">Añadir Conductor</h3>
        <p className="text-gray-500">Crea un perfil para que el conductor pueda recibir servicios asignados.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardContent className="pt-6 space-y-6">
            {error && <div className="text-red-500 text-sm">{error}</div>}
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 col-span-2">
                <Label htmlFor="fullName">Nombre Completo</Label>
                <Input id="fullName" name="fullName" required placeholder="Ej. Juan Pérez" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Correo Electrónico</Label>
                <Input id="email" name="email" type="email" required placeholder="juan@transfersinbarcelona.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Teléfono</Label>
                <Input id="phone" name="phone" required placeholder="+34..." />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="licenseNumber">Número de Licencia</Label>
                <Input id="licenseNumber" name="licenseNumber" required placeholder="B-123456" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input id="password" name="password" type="password" required placeholder="Min 6 caracteres" />
              </div>
            </div>

            <div className="flex justify-end pt-6">
              <Button type="button" variant="outline" className="mr-4" onClick={() => router.back()}>Cancelar</Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Guardando..." : "Crear Conductor"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
