"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createAgencyAction, updateAgencyAction } from "@/modules/b2b/b2b.actions";

type AgencyFormData = {
  id: string;
  name: string;
  contactName: string | null;
  email: string | null;
  phone: string | null;
  commissionValue: number;
  discountValue: number;
  isActive: boolean;
};

export function AgencyForm({ mode, agency }: { mode: "create" | "edit"; agency?: AgencyFormData }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const payload = {
      name: formData.get("name") as string,
      contactName: formData.get("contactName") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      commissionValue: Number(formData.get("commissionValue")),
      discountValue: Number(formData.get("discountValue")),
      isActive: formData.get("isActive") === "on",
    };

    const result =
      mode === "create" ? await createAgencyAction(payload) : await updateAgencyAction(agency!.id, payload);

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

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="name">Nombre de la agencia</Label>
              <Input id="name" name="name" required defaultValue={agency?.name ?? ""} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactName">Contacto</Label>
              <Input id="contactName" name="contactName" defaultValue={agency?.contactName ?? ""} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono</Label>
              <Input id="phone" name="phone" defaultValue={agency?.phone ?? ""} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="email">Correo</Label>
              <Input id="email" name="email" type="email" defaultValue={agency?.email ?? ""} />
            </div>
          </div>

          <div className="grid gap-4 border-t border-gray-100 pt-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="commissionValue">Comisión para agencia (%)</Label>
              <Input
                id="commissionValue"
                name="commissionValue"
                type="number"
                step="0.1"
                min="0"
                max="100"
                required
                defaultValue={agency?.commissionValue ?? 10}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="discountValue">Descuento cliente (%)</Label>
              <Input
                id="discountValue"
                name="discountValue"
                type="number"
                step="0.1"
                min="0"
                max="100"
                required
                defaultValue={agency?.discountValue ?? 0}
              />
            </div>
          </div>

          {mode === "edit" && (
            <div className="flex items-center gap-2 rounded-md border border-gray-200 bg-gray-50 px-3 py-2">
              <input
                id="isActive"
                name="isActive"
                type="checkbox"
                defaultChecked={agency?.isActive ?? true}
                className="h-4 w-4 rounded border-gray-300"
              />
              <Label htmlFor="isActive">Agencia activa</Label>
            </div>
          )}

          <div className="flex justify-end gap-3 border-t border-gray-100 pt-5">
            <Button type="button" variant="outline" onClick={() => router.push("/admin/agencies")} disabled={isLoading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              <Save className="h-4 w-4" />
              {isLoading ? "Guardando..." : "Guardar agencia"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
