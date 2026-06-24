"use client";

import { useState } from "react";
import { updateInternalNotesAction } from "@/modules/bookings/bookings.actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function BookingNotesForm({ bookingId, initialNotes }: { bookingId: string, initialNotes: string }) {
  const [notes, setNotes] = useState(initialNotes);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSave() {
    setIsLoading(true);
    await updateInternalNotesAction(bookingId, notes);
    setIsLoading(false);
  }

  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        <h4 className="font-semibold border-b pb-2">Notas Internas (Admin)</h4>
        <textarea 
          value={notes} 
          onChange={(e) => setNotes(e.target.value)}
          className="w-full p-2 border rounded-md text-sm min-h-[100px]"
          placeholder="Escribe notas operativas aquí (sólo visibles para admin/operadores)..."
        />
        <Button onClick={handleSave} disabled={isLoading || notes === initialNotes} className="w-full" variant="outline">
          {isLoading ? "Guardando..." : "Guardar Notas"}
        </Button>
      </CardContent>
    </Card>
  );
}
