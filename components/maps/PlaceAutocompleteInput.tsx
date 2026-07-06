"use client";

import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";

declare global {
  interface Window {
    google: any;
  }
}

interface PlaceAutocompleteInputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChange?: (value: string) => void;
  onSelectPlace: (place: { address: string; placeId: string }) => void;
  className?: string;
  name?: string;
  enableGeolocation?: boolean;
}

export default function PlaceAutocompleteInput({
  label,
  placeholder,
  value,
  onChange,
  onSelectPlace,
  className = "h-12 bg-gray-50",
  name,
  enableGeolocation = false,
}: PlaceAutocompleteInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const loadScript = () => {
    if (isLoaded) return;
    if (window.google && window.google.maps && window.google.maps.places) {
      setIsLoaded(true);
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
      
      script.onload = () => {
        setIsLoaded(true);
      };

      document.head.appendChild(script);
    } else {
      script.addEventListener("load", () => setIsLoaded(true));
    }
  };

  useEffect(() => {
    if (window.google && window.google.maps && window.google.maps.places) {
      setIsLoaded(true);
    }
  }, []);

  const onChangeRef = useRef(onChange);
  const onSelectPlaceRef = useRef(onSelectPlace);

  useEffect(() => {
    onChangeRef.current = onChange;
    onSelectPlaceRef.current = onSelectPlace;
  }, [onChange, onSelectPlace]);

  useEffect(() => {
    if (!isLoaded || !inputRef.current) return;

    const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
      fields: ["formatted_address", "place_id"],
    });

    const listener = autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (place.formatted_address && place.place_id) {
        if (onChangeRef.current) onChangeRef.current(place.formatted_address);
        if (onSelectPlaceRef.current) onSelectPlaceRef.current({
          address: place.formatted_address,
          placeId: place.place_id,
        });
      }
    });

    return () => {
      if (window.google && window.google.maps && window.google.maps.event) {
        window.google.maps.event.removeListener(listener);
      }
    };
  }, [isLoaded]);

  const handleGeolocation = () => {
    if (!navigator.geolocation) {
      alert("La geolocalización no está soportada por tu navegador.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        if (window.google && window.google.maps && window.google.maps.Geocoder) {
          const geocoder = new window.google.maps.Geocoder();
          geocoder.geocode({ location: { lat: latitude, lng: longitude } }, (results: any, status: any) => {
            if (status === "OK" && results && results[0]) {
              const address = results[0].formatted_address;
              const placeId = results[0].place_id;
              if (onChange) onChange(address);
              if (onSelectPlace) onSelectPlace({ address, placeId });
            } else {
              alert("No se pudo obtener la dirección de tu ubicación.");
            }
          });
        }
      },
      () => {
        alert("No se pudo obtener tu ubicación. Por favor, asegúrate de estar usando una conexión segura (HTTPS) y de dar permisos al navegador.");
      }
    );
  };

  return (
    <div className="relative w-full">
      <Input
        ref={inputRef}
        name={name}
        placeholder={placeholder || label || "Ingresa una dirección..."}
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
        onFocus={loadScript}
        className={`${className} ${enableGeolocation ? 'pr-10' : ''}`}
      />
      {enableGeolocation && (
        <button
          type="button"
          onClick={() => {
            loadScript();
            if (isLoaded) handleGeolocation();
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#D4AF37] transition-colors"
          title="Usar mi ubicación actual"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
        </button>
      )}
    </div>
  );
}
