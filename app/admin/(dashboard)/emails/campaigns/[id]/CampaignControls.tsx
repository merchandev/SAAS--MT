"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Pause, Play } from "lucide-react";

export default function CampaignControls({
  campaignId,
  initialStatus,
}: {
  campaignId: string;
  initialStatus: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Auto-refresh when status is SENDING
  useEffect(() => {
    if (initialStatus !== "SENDING") return;
    
    const interval = setInterval(() => {
      router.refresh();
    }, 5000);

    return () => clearInterval(interval);
  }, [initialStatus, router]);

  const handlePause = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/emails/campaigns/${campaignId}/pause`, { method: "POST" });
      if (res.ok) {
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error || "Error al pausar");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResume = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/emails/campaigns/${campaignId}/resume`, { method: "POST" });
      if (res.ok) {
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error || "Error al reanudar");
      }
    } finally {
      setLoading(false);
    }
  };

  if (initialStatus === "COMPLETED" || initialStatus === "FAILED" || initialStatus === "CANCELLED" || initialStatus === "DRAFT") {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      {initialStatus === "SENDING" ? (
        <button
          onClick={handlePause}
          disabled={loading}
          className="inline-flex items-center px-3 py-1.5 bg-yellow-50 text-yellow-700 hover:bg-yellow-100 rounded-md text-sm font-medium transition-colors disabled:opacity-50"
        >
          <Pause className="w-4 h-4 mr-1.5" />
          Pausar Envío
        </button>
      ) : initialStatus === "PAUSED" ? (
        <button
          onClick={handleResume}
          disabled={loading}
          className="inline-flex items-center px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-md text-sm font-medium transition-colors disabled:opacity-50"
        >
          <Play className="w-4 h-4 mr-1.5" />
          Reanudar Envío
        </button>
      ) : null}
    </div>
  );
}
