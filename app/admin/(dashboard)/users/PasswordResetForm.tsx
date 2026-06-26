"use client";

import { useState } from "react";
import { KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { resetUserPasswordAction } from "@/modules/users/users.actions";

export function PasswordResetForm({ userId }: { userId: string }) {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      setIsLoading(false);
      return;
    }

    const result = await resetUserPasswordAction(userId, {
      password,
      confirmPassword,
    });

    setIsLoading(false);

    if (result?.error) {
      setError(result.error);
      return;
    }

    form.reset();
    setSuccess("Contraseña actualizada.");
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card className="border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle>Cambiar o reiniciar contraseña</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && <div className="rounded-md bg-red-50 px-3 py-2 text-sm font-medium text-red-700">{error}</div>}
          {success && <div className="rounded-md bg-green-50 px-3 py-2 text-sm font-medium text-green-700">{success}</div>}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="password">Nueva contraseña</Label>
              <Input id="password" name="password" type="password" required minLength={6} autoComplete="new-password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar nueva contraseña</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                minLength={6}
                autoComplete="new-password"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button type="submit" variant="secondary" disabled={isLoading}>
              <KeyRound className="h-4 w-4" />
              {isLoading ? "Guardando..." : "Guardar contraseña"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
