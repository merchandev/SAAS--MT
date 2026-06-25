"use client";

import { useEffect, useState } from "react";
import LiveTrackingMap from "@/components/maps/LiveTrackingMap";
import { getDriverLocationAction } from "@/modules/drivers/location.actions";

interface Props {
  driverId: string;
  origin: string;
  destination: string;
  pollIntervalMs?: number;
}

export default function LiveMapPollClient({ 
  driverId, 
  origin, 
  destination,
  pollIntervalMs = 10000 
}: Props) {
  const [driverLocation, setDriverLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    // 1. Carga Inicial
    const fetchLocation = async () => {
      const res = await getDriverLocationAction(driverId);
      if (res.success && res.lat && res.lng) {
        setDriverLocation({ lat: res.lat, lng: res.lng });
      }
    };

    fetchLocation();

    // 2. Polling periódico
    const interval = setInterval(fetchLocation, pollIntervalMs);
    return () => clearInterval(interval);
  }, [driverId, pollIntervalMs]);

  return (
    <div className="w-full h-64 rounded-xl overflow-hidden border border-gray-200">
      <LiveTrackingMap 
        origin={origin} 
        destination={destination} 
        driverLocation={driverLocation} 
      />
    </div>
  );
}
