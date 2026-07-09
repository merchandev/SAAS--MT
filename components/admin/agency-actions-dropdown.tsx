"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MoreHorizontal, Trash2, Power, PowerOff, Edit, Plus, RefreshCw, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  toggleAgencyStatusAction, 
  softDeleteAgencyAction, 
  restoreAgencyAction, 
  hardDeleteAgencyAction 
} from "@/modules/b2b/b2b.actions";
import Link from "next/link";

interface AgencyActionsProps {
  agency: {
    id: string;
    name: string;
    token: string;
    isActive: boolean;
    deletedAt: Date | null;
  };
}

export function AgencyActionsDropdown({ agency }: AgencyActionsProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function handleToggleStatus() {
    setIsLoading(true);
    await toggleAgencyStatusAction(agency.id);
    setIsLoading(false);
    router.refresh();
  }

  async function handleSoftDelete() {
    if (!confirm(`¿Estás seguro de mover "${agency.name}" a la papelera?`)) return;
    setIsLoading(true);
    const res = await softDeleteAgencyAction(agency.id);
    if (res?.error) alert(res.error);
    setIsLoading(false);
    router.refresh();
  }

  async function handleRestore() {
    setIsLoading(true);
    await restoreAgencyAction(agency.id);
    setIsLoading(false);
    router.refresh();
  }

  async function handleHardDelete() {
    if (!confirm(`¿Eliminar PERMANENTEMENTE "${agency.name}"? Esta acción no se puede deshacer.`)) return;
    setIsLoading(true);
    const res = await hardDeleteAgencyAction(agency.id);
    if (res?.error) {
      alert(res.error);
    }
    setIsLoading(false);
    router.refresh();
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-8 w-8 p-0" disabled={isLoading}>
        <span className="sr-only">Abrir menú</span>
        <MoreHorizontal className="h-4 w-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
        
        {!agency.deletedAt ? (
          // Opciones para agencias Activas/Suspendidas
          <>
            <DropdownMenuItem onClick={() => router.push(`/admin/agencies/${agency.id}/edit`)}>
              <Edit className="mr-2 h-4 w-4" /> Editar
            </DropdownMenuItem>
            
            <DropdownMenuItem onClick={() => router.push(`/admin/agencies/${agency.id}/user/new`)}>
              <Plus className="mr-2 h-4 w-4" /> Nuevo Usuario
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={handleToggleStatus}>
              {agency.isActive ? (
                <><PowerOff className="mr-2 h-4 w-4 text-orange-500" /> Suspender</>
              ) : (
                <><Power className="mr-2 h-4 w-4 text-green-500" /> Activar</>
              )}
            </DropdownMenuItem>

            <DropdownMenuItem onClick={handleSoftDelete} className="text-red-600 focus:text-red-600">
              <Trash2 className="mr-2 h-4 w-4" /> Mover a Papelera
            </DropdownMenuItem>
          </>
        ) : (
          // Opciones para agencias en la Papelera
          <>
            <DropdownMenuItem onClick={handleRestore} className="text-green-600 focus:text-green-600">
              <RefreshCw className="mr-2 h-4 w-4" /> Restaurar
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={handleHardDelete} className="text-red-600 focus:text-red-600 font-bold">
              <Trash className="mr-2 h-4 w-4" /> Eliminar Permanente
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
