"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Send, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ResendButton({ campaignId }: { campaignId: string }) {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const handleResend = async () => {
    if (!confirm("¿Reenviar esta campaña a los mismos destinatarios?")) return;
    
    setIsPending(true);
    try {
      const res = await fetch(`/api/admin/emails/campaigns/${campaignId}/resend`, {
        method: "POST",
      });
      const data = await res.json();
      
      if (!res.ok || data.error) {
        alert(data.error || "Error al reenviar");
      } else {
        alert("Campaña reenviada / encolada");
        router.refresh();
      }
    } catch (err) {
      alert("Error de conexión");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={handleResend}
      disabled={isPending}
    >
      {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
      Reenviar
    </Button>
  );
}
