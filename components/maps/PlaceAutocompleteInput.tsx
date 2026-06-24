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
}

export default function PlaceAutocompleteInput({
  label,
  placeholder,
  value,
  onChange,
  onSelectPlace,
  className = "h-12 bg-gray-50",
}: PlaceAutocompleteInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Check if script is already loaded
    if (window.google && window.google.maps && window.google.maps.places) {
      setTimeout(() => setIsLoaded(true), 0);
      return;
    }

    // Check if script tag already exists
    const scriptId = "google-maps-places-script";
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
    if (!isLoaded || !inputRef.current) return;

    const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
      fields: ["formatted_address", "place_id"],
      // Opcional: restringir a un país o tipo si es necesario
      // types: ["geocode", "establishment"],
    });

    const listener = autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (place.formatted_address && place.place_id) {
        if (onChange) onChange(place.formatted_address);
        onSelectPlace({
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
  }, [isLoaded, onSelectPlace, onChange]);

  return (
    <Input
      ref={inputRef}
      placeholder={placeholder || label || "Ingresa una dirección..."}
      value={value}
      onChange={(e) => onChange && onChange(e.target.value)}
      className={className}
    />
  );
}
