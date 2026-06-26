"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Ban, Edit, PlayCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteUserAction, toggleUserStatusAction } from "@/modules/users/users.actions";

export function UserRowActions({ userId, isActive }: { userId: string; isActive: boolean }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function runAction(action: "toggle" | "delete") {
    setError(null);

    if (action === "delete") {
      const confirmed = window.confirm("¿Borrar este usuario si no tiene historial dependiente?");
      if (!confirmed) return;
    }

    setIsLoading(true);
    const result = action === "toggle" ? await toggleUserStatusAction(userId) : await deleteUserAction(userId);
    setIsLoading(false);

    if (result?.error) {
      setError(result.error);
      return;
    }

    router.refresh();
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <div className="flex flex-wrap justify-end gap-2">
        <Link href={`/admin/users/${userId}/edit`}>
          <Button type="button" variant="outline" size="sm">
            <Edit className="h-3.5 w-3.5" />
            Editar
          </Button>
        </Link>
        <Button type="button" variant="secondary" size="sm" disabled={isLoading} onClick={() => runAction("toggle")}>
          {isActive ? <Ban className="h-3.5 w-3.5" /> : <PlayCircle className="h-3.5 w-3.5" />}
          {isActive ? "Suspender" : "Activar"}
        </Button>
        <Button type="button" variant="destructive" size="sm" disabled={isLoading} onClick={() => runAction("delete")}>
          <Trash2 className="h-3.5 w-3.5" />
          Borrar
        </Button>
      </div>
      {error && <p className="max-w-xs text-right text-xs font-medium text-red-600">{error}</p>}
    </div>
  );
}
