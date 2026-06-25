"use client";

import { useState } from "react";
import { updateBookingStatusAction } from "@/modules/bookings/bookings.actions";

export default function StatusSelectClient({ bookingId, initialStatus }: { bookingId: string, initialStatus: string }) {
  const [status, setStatus] = useState(initialStatus);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    setIsUpdating(true);
    
    const result = await updateBookingStatusAction(bookingId, newStatus);
    
    if (result.success) {
      setStatus(newStatus);
    } else {
      // Revert if failed
      e.target.value = status;
      alert("Error al actualizar el estado");
    }
    setIsUpdating(false);
  };

  return (
    <div className="relative">
      <select 
        value={status}
        onChange={handleStatusChange}
        disabled={isUpdating}
        className={`appearance-none text-xs font-bold uppercase tracking-wider py-2 pl-3 pr-8 rounded-md border shadow-sm outline-none cursor-pointer transition-colors ${
          status === 'CONFIRMADA' ? 'bg-green-50 text-green-700 border-green-200' : 
          status === 'POR_CONFIRMAR' ? 'bg-amber-50 text-amber-700 border-amber-200' :
          status === 'CANCELADA' ? 'bg-red-50 text-red-700 border-red-200' :
          'bg-gray-50 text-gray-700 border-gray-200'
        } ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <option value="DRAFT">Borrador</option>
        <option value="PENDING_PAYMENT">Pago Pdte.</option>
        <option value="POR_CONFIRMAR">Por Confirmar</option>
        <option value="CONFIRMADA">Confirmada</option>
        <option value="IN_PROGRESS">En Progreso</option>
        <option value="COMPLETED">Completada</option>
        <option value="CANCELADA">Cancelada</option>
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
      </div>
    </div>
  );
}
