"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Save, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createUserAction, updateUserAction } from "@/modules/users/users.actions";

type PartnerOption = {
  id: string;
  name: string;
};

type UserFormUser = {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  role: string;
  isActive: boolean;
  hotelId: string | null;
  agencyId: string | null;
  driverProfile: {
    licenseNumber: string | null;
    status: string;
  } | null;
  customerProfile: {
    country: string | null;
    preferredLanguage: string | null;
  } | null;
};

const roleOptions = [
  { value: "SUPER_ADMIN", label: "Super admin" },
  { value: "ADMIN", label: "Administrador" },
  { value: "OPERATOR", label: "Operador" },
  { value: "HOTEL", label: "Usuario hotel" },
  { value: "AGENCY", label: "Usuario agencia" },
  { value: "DRIVER", label: "Conductor" },
  { value: "CUSTOMER", label: "Cliente" },
];

export function UserForm({
  mode,
  user,
  hotels,
  agencies,
}: {
  mode: "create" | "edit";
  user?: UserFormUser;
  hotels: PartnerOption[];
  agencies: PartnerOption[];
}) {
  const router = useRouter();
  const [role, setRole] = useState(user?.role ?? "CUSTOMER");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const password = ((formData.get("password") as string | null) ?? "");
    const confirmPassword = ((formData.get("confirmPassword") as string | null) ?? "");

    if (mode === "create" && password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      setIsLoading(false);
      return;
    }

    const payload = {
      fullName: formData.get("fullName") as string,
      email: formData.get("email") as string,
      phone: ((formData.get("phone") as string | null) ?? ""),
      role,
      isActive: formData.get("isActive") === "on",
      hotelId: ((formData.get("hotelId") as string | null) ?? ""),
      agencyId: ((formData.get("agencyId") as string | null) ?? ""),
      licenseNumber: ((formData.get("licenseNumber") as string | null) ?? ""),
      driverStatus: ((formData.get("driverStatus") as string | null) ?? ""),
      country: ((formData.get("country") as string | null) ?? ""),
      preferredLanguage: ((formData.get("preferredLanguage") as string | null) ?? "es"),
    };

    const result =
      mode === "create"
        ? await createUserAction({
            ...payload,
            password,
            confirmPassword,
          } as any)
        : await updateUserAction(user!.id, payload as any);

    setIsLoading(false);

    if (result?.error) {
      setError(result.error);
      return;
    }

    router.push("/admin/users");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card className="border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle>{mode === "create" ? "Nuevo usuario" : "Editar usuario"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && <div className="rounded-md bg-red-50 px-3 py-2 text-sm font-medium text-red-700">{error}</div>}

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="fullName">Nombre completo</Label>
              <Input id="fullName" name="fullName" required defaultValue={user?.fullName ?? ""} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Correo</Label>
              <Input id="email" name="email" type="email" required defaultValue={user?.email ?? ""} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono</Label>
              <Input id="phone" name="phone" defaultValue={user?.phone ?? ""} />
            </div>
            {mode === "create" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="password">Contraseña</Label>
                  <Input id="password" name="password" type="password" required minLength={6} autoComplete="new-password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    minLength={6}
                    autoComplete="new-password"
                  />
                </div>
              </>
            )}
            <div className="space-y-2">
              <Label htmlFor="role">Rol</Label>
              <select
                id="role"
                name="role"
                value={role}
                onChange={(event) => setRole(event.target.value)}
                className="h-8 w-full rounded-lg border border-input bg-white px-2.5 text-sm outline-none focus:border-ring focus:ring-3 focus:ring-ring/50"
              >
                {roleOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-md border border-gray-200 bg-gray-50 px-3 py-2">
            <input
              id="isActive"
              name="isActive"
              type="checkbox"
              defaultChecked={user?.isActive ?? true}
              className="h-4 w-4 rounded border-gray-300"
            />
            <Label htmlFor="isActive">Usuario activo</Label>
          </div>

          {role === "HOTEL" && (
            <div className="space-y-2 rounded-lg border border-gray-200 p-4">
              <Label htmlFor="hotelId">Hotel o cadena asociada</Label>
              <select
                id="hotelId"
                name="hotelId"
                defaultValue={user?.hotelId ?? ""}
                className="h-8 w-full rounded-lg border border-input bg-white px-2.5 text-sm outline-none focus:border-ring focus:ring-3 focus:ring-ring/50"
              >
                <option value="">Selecciona hotel</option>
                {hotels.map((hotel) => (
                  <option key={hotel.id} value={hotel.id}>
                    {hotel.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {role === "AGENCY" && (
            <div className="space-y-2 rounded-lg border border-gray-200 p-4">
              <Label htmlFor="agencyId">Agencia asociada</Label>
              <select
                id="agencyId"
                name="agencyId"
                defaultValue={user?.agencyId ?? ""}
                className="h-8 w-full rounded-lg border border-input bg-white px-2.5 text-sm outline-none focus:border-ring focus:ring-3 focus:ring-ring/50"
              >
                <option value="">Selecciona agencia</option>
                {agencies.map((agency) => (
                  <option key={agency.id} value={agency.id}>
                    {agency.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {role === "DRIVER" && (
            <div className="grid gap-4 rounded-lg border border-gray-200 p-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="licenseNumber">Número de licencia</Label>
                <Input id="licenseNumber" name="licenseNumber" required defaultValue={user?.driverProfile?.licenseNumber ?? ""} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="driverStatus">Estado operativo</Label>
                <Input id="driverStatus" name="driverStatus" defaultValue={user?.driverProfile?.status ?? "ACTIVE"} />
              </div>
            </div>
          )}

          {role === "CUSTOMER" && (
            <div className="grid gap-4 rounded-lg border border-gray-200 p-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="country">País</Label>
                <Input id="country" name="country" defaultValue={user?.customerProfile?.country ?? ""} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="preferredLanguage">Idioma preferido</Label>
                <select
                  id="preferredLanguage"
                  name="preferredLanguage"
                  defaultValue={user?.customerProfile?.preferredLanguage ?? "es"}
                  className="h-8 w-full rounded-lg border border-input bg-white px-2.5 text-sm outline-none focus:border-ring focus:ring-3 focus:ring-ring/50"
                >
                  <option value="es">Español</option>
                  <option value="en">Inglés</option>
                  <option value="de">Alemán</option>
                  <option value="fr">Francés</option>
                </select>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 border-t border-gray-100 pt-5">
            <Button type="button" variant="outline" onClick={() => router.push("/admin/users")} disabled={isLoading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {mode === "create" ? <UserPlus className="h-4 w-4" /> : <Save className="h-4 w-4" />}
              {isLoading ? "Guardando..." : mode === "create" ? "Crear usuario" : "Guardar cambios"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
