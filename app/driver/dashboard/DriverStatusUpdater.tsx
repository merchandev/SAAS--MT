"use client";

import { useState, useEffect, useRef } from "react";
import { updateDriverBookingStatusAction } from "@/modules/drivers/drivers.actions";
import { updateDriverLocationAction } from "@/modules/drivers/location.actions";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";

interface Props {
  bookingId: string;
  driverId: string;
  currentStatus: string | null;
}

const statusFlow = [
  { value: "ASIGNADO", label: "Asignado", color: "bg-gray-100 text-gray-800" },
  { value: "EN_CAMINO", label: "En Camino al Origen", color: "bg-blue-100 text-blue-800" },
  { value: "EN_PUNTO_DE_RECOGIDA", label: "En Punto de Recogida", color: "bg-yellow-100 text-yellow-800" },
  { value: "CLIENTE_RECOGIDO", label: "Cliente Recogido", color: "bg-purple-100 text-purple-800" },
  { value: "SERVICIO_FINALIZADO", label: "Servicio Finalizado", color: "bg-green-100 text-green-800" },
];

export function DriverStatusUpdater({ bookingId, driverId, currentStatus }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [isTracking, setIsTracking] = useState(false);
  const watchIdRef = useRef<number | null>(null);

  const currentIndex = statusFlow.findIndex(s => s.value === currentStatus);
  const nextStatus = currentIndex >= 0 && currentIndex < statusFlow.length - 1 ? statusFlow[currentIndex + 1] : null;

  // Lógica de Tracking de Ubicación
  useEffect(() => {
    const activeStatuses = ["EN_CAMINO", "EN_PUNTO_DE_RECOGIDA", "CLIENTE_RECOGIDO"];
    
    if (currentStatus && activeStatuses.includes(currentStatus)) {
      if (!isTracking && navigator.geolocation) {
        setTimeout(() => setIsTracking(true), 0);
        watchIdRef.current = navigator.geolocation.watchPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            // Enviar la posición al servidor sin bloquear la UI
            updateDriverLocationAction(latitude, longitude).catch(console.error);
          },
          (error) => {
            console.error("Error obteniendo ubicación:", error);
          },
          {
            enableHighAccuracy: true,
            maximumAge: 10000,
            timeout: 5000
          }
        );
      }
    } else {
      // Detener tracking si el estado no es activo
      if (isTracking && watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
        setIsTracking(false);
      }
    }

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, [currentStatus, isTracking]);

  const handleUpdate = async () => {
    if (!nextStatus) return;
    setIsLoading(true);
    await updateDriverBookingStatusAction(bookingId, driverId, nextStatus.value);
    setIsLoading(false);
  };

  if (currentStatus === "SERVICIO_FINALIZADO") {
    return (
      <div className="w-full text-center p-3 rounded-lg bg-green-50 text-green-700 font-semibold border border-green-200">
        ¡Trayecto Completado!
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500 font-medium">Estado actual:</span>
          <span className={`px-2 py-1 rounded-md text-xs font-semibold ${statusFlow[currentIndex]?.color || "bg-gray-100"}`}>
            {statusFlow[currentIndex]?.label || "Pendiente"}
          </span>
        </div>
        {isTracking && (
          <div className="flex items-center gap-1 text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full border border-green-200 animate-pulse">
            <MapPin className="h-3 w-3" /> GPS Activo
          </div>
        )}
      </div>

      {nextStatus && (
        <Button 
          className="w-full h-12 text-lg font-bold shadow-md active:scale-95 transition-transform" 
          onClick={handleUpdate}
          disabled={isLoading}
        >
          {isLoading ? "Actualizando..." : `Marcar: ${nextStatus.label}`}
        </Button>
      )}
    </div>
  );
}
