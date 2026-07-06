"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Clock } from "lucide-react";
import { getSpainToday } from "@/lib/utils";
import PlaceAutocompleteInput from "@/components/maps/PlaceAutocompleteInput";

const timeOptions = Array.from({ length: 24 * 4 }).map((_, i) => {
  const hours = Math.floor(i / 4).toString().padStart(2, '0');
  const mins = ((i % 4) * 15).toString().padStart(2, '0');
  return `${hours}:${mins}`;
});

export default function HomeBookingFormClient() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    originAddress: "",
    originPlaceId: "",
    destinationAddress: "",
    destinationPlaceId: "",
    date: "",
    time: ""
  });

  const updateForm = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSearch = () => {
    // Redirigir a /booking con los parámetros en la URL
    const params = new URLSearchParams();
    if (formData.originAddress) params.append("origin", formData.originAddress);
    if (formData.originPlaceId) params.append("originId", formData.originPlaceId);
    if (formData.destinationAddress) params.append("destination", formData.destinationAddress);
    if (formData.destinationPlaceId) params.append("destinationId", formData.destinationPlaceId);
    if (formData.date) params.append("date", formData.date);
    if (formData.time) params.append("time", formData.time);

    router.push(`/booking?${params.toString()}`);
  };

  return (
    <div className="bg-white/10 backdrop-blur-xl p-1 md:p-1.5 rounded-[1.5rem] shadow-2xl w-full max-w-md ml-auto border border-white/20">
      <div className="bg-white rounded-2xl p-6 md:p-8 space-y-5">
        
        {/* Origin */}
        <div className="space-y-1">
          <Label htmlFor="booking-origin" className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Origen</Label>
          <PlaceAutocompleteInput
            name="origin"
            value={formData.originAddress}
            onChange={(value) => updateForm("originAddress", value)}
            onSelectPlace={({ address, placeId }) => {
              updateForm("originAddress", address);
              updateForm("originPlaceId", placeId);
            }}
            placeholder="Ingresa origen o lugar de recogida..."
            className="h-12 border-gray-200 rounded-xl bg-gray-50/50 hover:bg-white focus:bg-white transition-colors text-sm"
            enableGeolocation={true}
          />
        </div>

        {/* Destination */}
        <div className="space-y-1">
          <Label htmlFor="booking-destination" className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Destino</Label>
          <PlaceAutocompleteInput
            name="destination"
            value={formData.destinationAddress}
            onChange={(value) => updateForm("destinationAddress", value)}
            onSelectPlace={({ address, placeId }) => {
              updateForm("destinationAddress", address);
              updateForm("destinationPlaceId", placeId);
            }}
            placeholder="Ingresa destino..."
            className="h-12 border-gray-200 rounded-xl bg-gray-50/50 hover:bg-white focus:bg-white transition-colors text-sm"
          />
        </div>

        {/* Date and Time (Full width like the design) */}
        <div className="space-y-1">
          <Label htmlFor="booking-date" className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Fecha</Label>
          <input
            id="booking-date"
            name="date"
            type="date"
            min={getSpainToday().toISOString().split("T")[0]}
            value={formData.date}
            onChange={(e) => updateForm("date", e.target.value)}
            className="h-12 w-full border border-gray-200 rounded-xl bg-gray-50/50 hover:bg-white focus:bg-white transition-colors text-sm text-gray-600 px-4 outline-none focus:ring-2 focus:ring-[#D4AF37]/50"
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="booking-time" className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Hora</Label>
          <div className="relative">
            <select
              id="booking-time"
              name="time"
              value={formData.time}
              onChange={(e) => updateForm('time', e.target.value)}
              className="h-12 w-full border border-gray-200 rounded-xl bg-gray-50/50 hover:bg-white focus:bg-white transition-colors text-sm text-gray-600 appearance-none px-4 outline-none focus:ring-2 focus:ring-[#D4AF37]/50"
            >
              <option value="" disabled>--:--</option>
              {timeOptions.map(time => (
                <option key={time} value={time}>{time}</option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <Clock className="w-4 h-4 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Search Button */}
        <div className="pt-2">
          <Button 
            onClick={handleSearch} 
            className="w-full h-14 bg-gradient-to-r from-[#D4AF37] to-[#AA8B2C] hover:from-[#AA8B2C] hover:to-[#8E7321] text-white font-bold text-base rounded-2xl shadow-md active:scale-[0.98] transition-all"
          >
            Buscar vehículos
          </Button>
        </div>

      </div>
    </div>
  );
}
