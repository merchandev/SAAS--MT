"use client";

import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    google: any;
  }
}

interface LiveTrackingMapProps {
  origin: string;
  destination: string;
  driverLocation?: { lat: number; lng: number } | null;
  className?: string;
}

export default function LiveTrackingMap({ 
  origin, 
  destination, 
  driverLocation,
  className = "w-full h-full min-h-[300px] rounded-md" 
}: LiveTrackingMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const mapInstanceRef = useRef<any>(null);
  const directionsRendererRef = useRef<any>(null);
  const driverMarkerRef = useRef<any>(null);

  // 1. Cargar Script de Google Maps
  useEffect(() => {
    if (window.google && window.google.maps) {
      setTimeout(() => setIsLoaded(true), 0);
      return;
    }

    const scriptId = "google-maps-global-script";
    let script = document.getElementById(scriptId) as HTMLScriptElement;

    if (!script) {
      script = document.createElement("script");
      script.id = scriptId;
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      
      script.onload = () => setIsLoaded(true);
      document.head.appendChild(script);
    } else {
      script.addEventListener("load", () => setIsLoaded(true));
    }
  }, []);

  // 2. Inicializar Mapa y Dibujar Ruta
  useEffect(() => {
    if (!isLoaded || !mapRef.current) return;

    if (!mapInstanceRef.current) {
      mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
        zoom: 7,
        center: { lat: 40.4168, lng: -3.7038 },
        disableDefaultUI: true,
        zoomControl: true,
      });

      directionsRendererRef.current = new window.google.maps.DirectionsRenderer({
        map: mapInstanceRef.current,
        suppressMarkers: false,
        polylineOptions: {
          strokeColor: "#2563eb", // blue-600
          strokeOpacity: 0.8,
          strokeWeight: 6,
        },
      });
    }

    if (origin && destination) {
      const directionsService = new window.google.maps.DirectionsService();
      directionsService.route(
        {
          origin: origin,
          destination: destination,
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (response: any, status: string) => {
          if (status === "OK") {
            directionsRendererRef.current.setDirections(response);
          }
        }
      );
    }
  }, [isLoaded, origin, destination]);

  // 3. Actualizar Marcador del Conductor
  useEffect(() => {
    if (!isLoaded || !mapInstanceRef.current || !driverLocation) return;

    const position = { lat: driverLocation.lat, lng: driverLocation.lng };

    if (!driverMarkerRef.current) {
      // Crear marcador por primera vez
      driverMarkerRef.current = new window.google.maps.Marker({
        position,
        map: mapInstanceRef.current,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: "#10b981", // green-500
          fillOpacity: 1,
          strokeWeight: 3,
          strokeColor: "#ffffff",
        },
        title: "Ubicación del Conductor",
      });
    } else {
      // Mover el marcador existente suavemente
      driverMarkerRef.current.setPosition(position);
    }

    // Opcional: Centrar el mapa en el conductor si se desea
    // mapInstanceRef.current.panTo(position);

  }, [isLoaded, driverLocation]);

  return <div ref={mapRef} className={className} />;
}
