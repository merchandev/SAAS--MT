"use client";

import { useState } from "react";
import { assignDriverToBookingAction } from "@/modules/bookings/bookings.actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type DriverOption = { id: string, name: string };

export function DriverAssignmentForm({ bookingId, currentDriverId, drivers }: { bookingId: string, currentDriverId: string | null, drivers: DriverOption[] }) {
  const [driverId, setDriverId] = useState(currentDriverId || "");
  const [isLoading, setIsLoading] = useState(false);

  async function handleAssign() {
    setIsLoading(true);
    await assignDriverToBookingAction(bookingId, driverId === "" ? null : driverId);
    setIsLoading(false);
  }

  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        <h4 className="font-semibold border-b pb-2">Asignación de Conductor</h4>
        <select 
          value={driverId} 
          onChange={(e) => setDriverId(e.target.value)}
          className="w-full p-2 border rounded-md text-sm"
        >
          <option value="">-- Sin Asignar --</option>
          {drivers.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
        </select>
        <Button onClick={handleAssign} disabled={isLoading || driverId === (currentDriverId || "")} className="w-full" variant="secondary">
          {isLoading ? "Asignando..." : "Asignar Conductor"}
        </Button>
      </CardContent>
    </Card>
  );
}
