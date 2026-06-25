"use client";

import { useState } from "react";
import { updateBookingStatusAction } from "@/modules/bookings/bookings.actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function BookingStatusForm({ bookingId, currentStatus }: { bookingId: string, currentStatus: string }) {
  const [status, setStatus] = useState(currentStatus);
  const [isLoading, setIsLoading] = useState(false);

  const statuses = [
    "DRAFT", "PENDING_PAYMENT", "PAID", "POR_CONFIRMAR", 
    "CONFIRMADA", "ASIGNADA", "EN_CURSO", "COMPLETADA", 
    "CANCELADA", "NO_SHOW", "REEMBOLSADA", "FALLIDA"
  ];

  const statusLabels: Record<string, string> = {
    DRAFT: "Borrador",
    PENDING_PAYMENT: "Pendiente de Pago",
    PAID: "Pagado",
    POR_CONFIRMAR: "Por Confirmar",
    CONFIRMADA: "Confirmada",
    ASIGNADA: "Conductor Asignado",
    EN_CURSO: "En Curso",
    COMPLETADA: "Completada",
    CANCELADA: "Cancelada",
    NO_SHOW: "No Show (Ausente)",
    REEMBOLSADA: "Reembolsada",
    FALLIDA: "Fallida"
  };

  async function handleUpdate() {
    setIsLoading(true);
    await updateBookingStatusAction(bookingId, status);
    setIsLoading(false);
  }

  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        <h4 className="font-semibold border-b pb-2">Estado de la Reserva</h4>
        <select 
          value={status} 
          onChange={(e) => setStatus(e.target.value)}
          className="w-full p-2 border rounded-md text-sm"
        >
          {statuses.map(s => <option key={s} value={s}>{statusLabels[s] || s}</option>)}
        </select>
        <Button onClick={handleUpdate} disabled={isLoading || status === currentStatus} className="w-full">
          {isLoading ? "Actualizando..." : "Actualizar Estado"}
        </Button>
      </CardContent>
    </Card>
  );
}
