"use client";

import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    google: any;
  }
}

interface GoogleMapRouteProps {
  origin: string;
  destination: string;
  className?: string;
}

export default function GoogleMapRoute({ origin, destination, className = "w-full h-full min-h-[300px] rounded-md" }: GoogleMapRouteProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const directionsRendererRef = useRef<any>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (window.google && window.google.maps) {
      setTimeout(() => setIsLoaded(true), 0);
      return;
    }

    const scriptId = "google-maps-script";
    let script = document.getElementById(scriptId) as HTMLScriptElement;

    if (!script) {
      script = document.createElement("script");
      script.id = scriptId;
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        setIsLoaded(true);
      };

      document.head.appendChild(script);
    } else {
      script.addEventListener("load", () => setIsLoaded(true));
    }
  }, []);

  useEffect(() => {
    if (!isLoaded || !mapRef.current) return;

    if (!mapInstanceRef.current) {
      mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
        zoom: 7,
        center: { lat: 40.4168, lng: -3.7038 }, // Default to Madrid, Spain
        disableDefaultUI: true,
        zoomControl: true,
      });

      directionsRendererRef.current = new window.google.maps.DirectionsRenderer({
        map: mapInstanceRef.current,
        suppressMarkers: false,
        polylineOptions: {
          strokeColor: "#D4AF37", // A nice gold route color
          strokeOpacity: 0.8,
          strokeWeight: 5,
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
          } else {
            console.error("Directions request failed due to " + status);
          }
        }
      );
    }
  }, [isLoaded, origin, destination]);

  return <div ref={mapRef} className={className} />;
}
