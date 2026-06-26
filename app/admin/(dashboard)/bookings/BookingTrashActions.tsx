"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { RotateCcw, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  moveBookingToTrashAction,
  restoreBookingFromTrashAction,
} from "@/modules/bookings/bookings.actions";

type BookingTrashActionsProps = {
  bookingId: string;
  mode: "trash" | "restore";
  label?: string;
  redirectTo?: string;
  className?: string;
};

export function BookingTrashActions({
  bookingId,
  mode,
  label,
  redirectTo,
  className,
}: BookingTrashActionsProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isTrashMode = mode === "trash";
  const buttonLabel = label ?? (isTrashMode ? "Mover a papelera" : "Restaurar");
  const Icon = isTrashMode ? Trash2 : RotateCcw;

  async function handleClick() {
    const confirmed = window.confirm(
      isTrashMode
        ? "¿Quieres mover este traslado a la papelera?"
        : "¿Quieres restaurar este traslado?"
    );

    if (!confirmed) return;

    setIsSubmitting(true);
    setError(null);

    const result = isTrashMode
      ? await moveBookingToTrashAction(bookingId)
      : await restoreBookingFromTrashAction(bookingId);

    setIsSubmitting(false);

    if (!result.success) {
      setError(result.error ?? "No se pudo completar la acción.");
      return;
    }

    if (redirectTo) {
      router.push(redirectTo);
    }

    router.refresh();
  }

  return (
    <div className="space-y-1">
      <Button
        type="button"
        variant={isTrashMode ? "destructive" : "secondary"}
        size="sm"
        onClick={handleClick}
        disabled={isSubmitting}
        className={className}
        aria-label={buttonLabel}
      >
        <Icon className="w-3.5 h-3.5" />
        {isSubmitting ? "Procesando..." : buttonLabel}
      </Button>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
