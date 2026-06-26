"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createAgencyUserAction } from "@/modules/b2b/b2b.actions";

export function AgencyUserForm({
  agencyId,
  agencyName,
  agencyEmail,
}: {
  agencyId: string;
  agencyName: string;
  agencyEmail: string | null;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const result = await createAgencyUserAction({
      agencyId,
      fullName: formData.get("fullName") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    });

    setIsLoading(false);

    if (result?.error) {
      setError(result.error);
      return;
    }

    router.push("/admin/agencies");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card className="border-gray-200 shadow-sm">
        <CardContent className="space-y-6 pt-6">
          {error && <div className="rounded-md bg-red-50 px-3 py-2 text-sm font-medium text-red-700">{error}</div>}
          <div className="rounded-md bg-gray-50 px-3 py-2 text-sm text-gray-600">
            El usuario tendrá acceso de agencia para {agencyName}.
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="fullName">Nombre completo</Label>
              <Input id="fullName" name="fullName" required placeholder="Responsable de reservas" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Correo</Label>
              <Input id="email" name="email" type="email" required defaultValue={agencyEmail ?? ""} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input id="password" name="password" type="password" required minLength={6} />
            </div>
          </div>
          <div className="flex justify-end gap-3 border-t border-gray-100 pt-5">
            <Button type="button" variant="outline" onClick={() => router.push("/admin/agencies")} disabled={isLoading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              <UserPlus className="h-4 w-4" />
              {isLoading ? "Creando..." : "Crear usuario"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
