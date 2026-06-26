"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Edit, KeyRound, PlayCircle, UserPlus, Ban } from "lucide-react";
import { Button } from "@/components/ui/button";
import { regenerateAgencyTokenAction, toggleAgencyStatusAction } from "@/modules/b2b/b2b.actions";

export function AgencyRowActions({ agencyId, isActive }: { agencyId: string; isActive: boolean }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function run(action: "toggle" | "token") {
    setError(null);
    setIsLoading(true);
    const result = action === "toggle" ? await toggleAgencyStatusAction(agencyId) : await regenerateAgencyTokenAction(agencyId);
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
        <Link href={`/admin/agencies/${agencyId}/edit`}>
          <Button variant="outline" size="sm">
            <Edit className="h-3.5 w-3.5" />
            Editar
          </Button>
        </Link>
        <Link href={`/admin/agencies/${agencyId}/user/new`}>
          <Button variant="outline" size="sm">
            <UserPlus className="h-3.5 w-3.5" />
            Usuario
          </Button>
        </Link>
        <Button variant="secondary" size="sm" disabled={isLoading} onClick={() => run("toggle")}>
          {isActive ? <Ban className="h-3.5 w-3.5" /> : <PlayCircle className="h-3.5 w-3.5" />}
          {isActive ? "Suspender" : "Activar"}
        </Button>
        <Button variant="ghost" size="sm" disabled={isLoading} onClick={() => run("token")}>
          <KeyRound className="h-3.5 w-3.5" />
          Token
        </Button>
      </div>
      {error && <p className="max-w-xs text-right text-xs font-medium text-red-600">{error}</p>}
    </div>
  );
}
