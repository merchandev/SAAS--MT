"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Send, Loader2 } from "lucide-react";
import { resendCampaignAction } from "../new/campaign.actions";
import { useRouter } from "next/navigation";

export default function ResendButton({ campaignId }: { campaignId: string }) {
  const router = useRouter();
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleResend = async () => {
    if (!confirm("¿Estás seguro de que deseas volver a enviar esta campaña a todos sus destinatarios?")) return;
    
    setIsSending(true);
    setError(null);
    
    const res = await resendCampaignAction(campaignId);
    
    setIsSending(false);
    
    if (res.error) {
      setError(res.error);
    } else {
      router.push(`/admin/emails/campaigns/${res.id}`);
    }
  };

  return (
    <div className="flex flex-col items-end gap-2">
      <Button onClick={handleResend} disabled={isSending} className="bg-blue-600 hover:bg-blue-700">
        {isSending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
        Volver a Enviar
      </Button>
      {error && <span className="text-sm text-red-600">{error}</span>}
    </div>
  );
}
