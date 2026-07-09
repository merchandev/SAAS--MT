"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye, Trash, RefreshCw, Send } from "lucide-react";
import { 
  softDeleteCampaignAction, 
  restoreCampaignAction, 
  hardDeleteCampaignAction,
  resendCampaignAction
} from "@/app/admin/(dashboard)/emails/campaigns/new/campaign.actions";

interface CampaignActionsDropdownProps {
  campaign: {
    id: string;
    status: string;
    deletedAt: Date | null;
  };
}

export function CampaignActionsDropdown({ campaign }: CampaignActionsDropdownProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSoftDelete = async () => {
    if (!confirm("¿Mover esta campaña a la papelera?")) return;
    setIsLoading(true);
    const res = await softDeleteCampaignAction(campaign.id);
    if (res?.error) alert(res.error);
    setIsLoading(false);
    router.refresh();
  };

  const handleRestore = async () => {
    setIsLoading(true);
    const res = await restoreCampaignAction(campaign.id);
    if (res?.error) alert(res.error);
    setIsLoading(false);
    router.refresh();
  };

  const handleHardDelete = async () => {
    if (!confirm("¿Eliminar definitivamente? Esta acción es irreversible.")) return;
    setIsLoading(true);
    const res = await hardDeleteCampaignAction(campaign.id);
    if (res?.error) alert(res.error);
    setIsLoading(false);
    router.refresh();
  };

  const handleResend = async () => {
    if (!confirm("¿Volver a enviar esta campaña a todos los destinatarios originales?")) return;
    setIsLoading(true);
    const res = await resendCampaignAction(campaign.id);
    if (res?.error) {
      alert(res.error);
    } else {
      alert("Reenvío de campaña iniciado");
    }
    setIsLoading(false);
    router.refresh();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-8 w-8 p-0" disabled={isLoading}>
        <span className="sr-only">Abrir menú</span>
        <MoreHorizontal className="h-4 w-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {!campaign.deletedAt ? (
          // Acciones para campañas Activas
          <>
            <DropdownMenuItem onClick={() => router.push(`/admin/emails/campaigns/${campaign.id}`)}>
              <Eye className="mr-2 h-4 w-4" /> Ver Detalles
            </DropdownMenuItem>

            <DropdownMenuItem onClick={handleResend}>
              <Send className="mr-2 h-4 w-4" /> Reenviar
            </DropdownMenuItem>

            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSoftDelete} className="text-red-600 focus:text-red-600">
              <Trash className="mr-2 h-4 w-4" /> Mover a Papelera
            </DropdownMenuItem>
          </>
        ) : (
          // Acciones para campañas en Papelera
          <>
            <DropdownMenuItem onClick={handleRestore}>
              <RefreshCw className="mr-2 h-4 w-4" /> Restaurar
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            
            <DropdownMenuItem onClick={handleHardDelete} className="text-red-600 focus:text-red-600">
              <Trash className="mr-2 h-4 w-4" /> Eliminar Definitivamente
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
