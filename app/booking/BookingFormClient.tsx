"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createPublicBookingAction, getDistanceEstimationAction } from "@/modules/bookings/bookings.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import PlaceAutocompleteInput from "@/components/maps/PlaceAutocompleteInput";

type Vehicle = any; // Tipado simple para el MVP

export default function BookingFormClient({ 
  vehicles, 
  hotelToken 
}: { 
  vehicles: Vehicle[]; 
  hotelToken?: string;
}) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    originAddress: "",
    originPlaceId: "",
    destinationAddress: "",
    destinationPlaceId: "",
    distanceKm: 0,
    durationMinutes: 0,
    serviceDate: "",
    serviceTime: "",
    tripType: "ONE_WAY",
    passengers: 1,
    luggage: 0,
    vehicleId: "",
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    flightNumber: "",
    customerNotes: "",
  });

  const updateForm = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const calculateEstimation = (vehicle: Vehicle) => {
    // Cálculo aproximado puro frontend para UI, la verdad absoluta será el backend
    if (!formData.distanceKm) return Number(vehicle.minimumPrice).toFixed(2);
    const base = formData.distanceKm * Number(vehicle.pricePerKmOneWay);
    return Math.max(base, Number(vehicle.minimumPrice)).toFixed(2);
  };

  const handleNextStep = async () => {
    if (step === 1) {
      if (!formData.originAddress || !formData.destinationAddress || !formData.serviceDate || !formData.serviceTime) {
        setError("Por favor, completa las direcciones y fechas.");
        return;
      }
      setIsLoading(true);
      try {
        const estimation = await getDistanceEstimationAction({
          originAddress: formData.originAddress,
          originPlaceId: formData.originPlaceId,
          destinationAddress: formData.destinationAddress,
          destinationPlaceId: formData.destinationPlaceId,
        });
        if (!estimation.success) {
          setError(estimation.error ?? "No se pudo calcular la ruta real.");
          setIsLoading(false);
          return;
        }
        setFormData(prev => ({ 
          ...prev, 
          distanceKm: estimation.distanceKm, 
          durationMinutes: estimation.durationMinutes 
        }));
      } catch (err) {
        setError("No se pudo calcular la ruta real. Intenta de nuevo.");
        setIsLoading(false);
        return;
      }
      setIsLoading(false);
    }
    if (step === 2 && !formData.vehicleId) {
      setError("Por favor, selecciona un vehículo.");
      return;
    }
    setError(null);
    setStep(s => s + 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customerName || !formData.customerEmail) {
      setError("Nombre y correo son obligatorios.");
      return;
    }

    setIsLoading(true);
    setError(null);

    // Castear el tripType al union type que espera el schema
    const { distanceKm, durationMinutes, ...bookingPayload } = formData;
    const dataToSend = {
      ...bookingPayload,
      tripType: formData.tripType as "ONE_WAY" | "ROUND_TRIP"
    };

    const result = await createPublicBookingAction(dataToSend, hotelToken);
    
    if (result.error) {
      setError(result.error);
      setIsLoading(false);
    } else {
      // Redirigir a pasarela de pago (Redsys)
      router.push(`/booking/${result.publicCode}/payment`);
    }
  };

  return (
    <div className="bg-[#13151A] rounded-sm shadow-xl border border-white/5 overflow-hidden">
      {/* Progress Bar */}
      <div className="flex border-b border-white/5 bg-[#0B0C10]/50">
        {[1, 2, 3].map((num) => (
          <div key={num} className={`flex-1 text-center py-5 text-sm uppercase tracking-widest font-semibold border-b-2 transition-colors ${
            step === num ? 'border-[#D4AF37] text-[#D4AF37]' : step > num ? 'border-white/20 text-gray-400' : 'border-transparent text-gray-600'
          }`}>
            Etapa {num}
          </div>
        ))}
      </div>

      <div className="p-8 sm:p-10">
        {error && (
          <div className="mb-8 p-4 bg-red-950/50 text-red-400 rounded-sm text-sm font-medium border border-red-900/50">
            {error}
          </div>
        )}

        {/* STEP 1: Ruta y Fechas */}
        {step === 1 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-3xl font-serif font-bold text-white">Detalles del Trayecto</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <Label className="text-gray-400 font-medium tracking-wide uppercase text-xs">Lugar de Recogida</Label>
                <PlaceAutocompleteInput 
                  placeholder="Aeropuerto, Hotel o Dirección..." 
                  value={formData.originAddress}
                  onChange={(address) => updateForm('originAddress', address)}
                  onSelectPlace={(place) => {
                    updateForm('originAddress', place.address);
                    updateForm('originPlaceId', place.placeId);
                  }}
                  className="h-14 bg-[#0B0C10] border-white/10 text-white focus:border-[#D4AF37] focus:ring-[#D4AF37] rounded-sm"
                />
              </div>
              <div className="space-y-4">
                <Label className="text-gray-400 font-medium tracking-wide uppercase text-xs">Lugar de Destino</Label>
                <PlaceAutocompleteInput 
                  placeholder="Hotel, Ciudad o Dirección..." 
                  value={formData.destinationAddress}
                  onChange={(address) => updateForm('destinationAddress', address)}
                  onSelectPlace={(place) => {
                    updateForm('destinationAddress', place.address);
                    updateForm('destinationPlaceId', place.placeId);
                  }}
                  className="h-14 bg-[#0B0C10] border-white/10 text-white focus:border-[#D4AF37] focus:ring-[#D4AF37] rounded-sm"
                />
              </div>
              <div className="space-y-4">
                <Label className="text-gray-400 font-medium tracking-wide uppercase text-xs">Fecha de Servicio</Label>
                <Input 
                  type="date" 
                  value={formData.serviceDate}
                  onChange={(e) => updateForm('serviceDate', e.target.value)}
                  className="h-14 bg-[#0B0C10] border-white/10 text-white focus:border-[#D4AF37] focus:ring-[#D4AF37] rounded-sm [color-scheme:dark]"
                />
              </div>
              <div className="space-y-4">
                <Label className="text-gray-400 font-medium tracking-wide uppercase text-xs">Hora de Recogida (24h)</Label>
                <Input 
                  type="time" 
                  value={formData.serviceTime}
                  onChange={(e) => updateForm('serviceTime', e.target.value)}
                  className="h-14 bg-[#0B0C10] border-white/10 text-white focus:border-[#D4AF37] focus:ring-[#D4AF37] rounded-sm [color-scheme:dark]"
                />
              </div>
            </div>
            <Button size="lg" className="w-full mt-8 h-16 text-lg font-medium bg-[#D4AF37] text-[#0B0C10] hover:bg-[#C5A059] rounded-sm transition-all" onClick={handleNextStep} disabled={isLoading}>
              {isLoading ? "Validando Ruta..." : "Descubrir Flota Disponible"}
            </Button>
          </div>
        )}

        {/* STEP 2: Selección de Vehículo */}
        {step === 2 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
            <h2 className="text-3xl font-serif font-bold text-white">Seleccione su Clase</h2>
            <p className="text-gray-400 font-light text-lg">Estimaciones cotizadas para su trayecto específico.</p>
            
            <div className="grid grid-cols-1 gap-5">
              {vehicles.map(v => (
                <div 
                  key={v.id} 
                  onClick={() => updateForm('vehicleId', v.id)}
                  className={`p-6 rounded-sm border cursor-pointer transition-all duration-300 ${
                    formData.vehicleId === v.id 
                      ? 'border-[#D4AF37] bg-[#D4AF37]/5 shadow-[0_0_15px_rgba(212,175,55,0.1)]' 
                      : 'border-white/10 bg-[#0B0C10] hover:border-white/30'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="text-xl font-serif font-bold text-white tracking-wide">{v.name}</h4>
                      <div className="flex items-center gap-3 mt-2 text-sm text-gray-400 font-light">
                        <span>Hasta {v.passengerCapacity} Pax</span>
                        <span className="w-1 h-1 rounded-full bg-gray-600"></span>
                        <span>{v.luggageCapacity} Maletas</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-[#D4AF37] uppercase tracking-[0.2em] font-medium mb-1">Estimación desde</p>
                      <p className="text-3xl font-serif font-bold text-white">€{calculateEstimation(v)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex gap-4 mt-10 pt-8 border-t border-white/5">
              <Button variant="outline" size="lg" className="h-16 w-1/3 border-gray-600 text-gray-300 hover:text-white hover:border-[#D4AF37] hover:bg-transparent rounded-sm transition-all font-medium" onClick={() => setStep(1)}>
                Retroceder
              </Button>
              <Button size="lg" className="h-16 w-2/3 text-lg font-medium bg-[#D4AF37] text-[#0B0C10] hover:bg-[#C5A059] rounded-sm transition-all" onClick={handleNextStep}>
                Proceder al Registro
              </Button>
            </div>
          </div>
        )}

        {/* STEP 3: Datos Finales */}
        {step === 3 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
            <h2 className="text-3xl font-serif font-bold text-white">Información del Pasajero VIP</h2>
            
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <Label className="text-gray-400 font-medium tracking-wide uppercase text-xs">Nombre Completo</Label>
                  <Input 
                    required 
                    value={formData.customerName}
                    onChange={(e) => updateForm('customerName', e.target.value)}
                    className="h-14 bg-[#0B0C10] border-white/10 text-white focus:border-[#D4AF37] focus:ring-[#D4AF37] rounded-sm"
                  />
                </div>
                <div className="space-y-4">
                  <Label className="text-gray-400 font-medium tracking-wide uppercase text-xs">Email Personal / Ejecutivo</Label>
                  <Input 
                    type="email" required 
                    value={formData.customerEmail}
                    onChange={(e) => updateForm('customerEmail', e.target.value)}
                    className="h-14 bg-[#0B0C10] border-white/10 text-white focus:border-[#D4AF37] focus:ring-[#D4AF37] rounded-sm"
                  />
                </div>
                <div className="space-y-4">
                  <Label className="text-gray-400 font-medium tracking-wide uppercase text-xs">Teléfono Móvil (Con Prefijo)</Label>
                  <Input 
                    required 
                    value={formData.customerPhone}
                    onChange={(e) => updateForm('customerPhone', e.target.value)}
                    className="h-14 bg-[#0B0C10] border-white/10 text-white focus:border-[#D4AF37] focus:ring-[#D4AF37] rounded-sm"
                  />
                </div>
                <div className="space-y-4">
                  <Label className="text-gray-400 font-medium tracking-wide uppercase text-xs">Número de Vuelo (Si aplica)</Label>
                  <Input 
                    value={formData.flightNumber}
                    onChange={(e) => updateForm('flightNumber', e.target.value)}
                    className="h-14 bg-[#0B0C10] border-white/10 text-white focus:border-[#D4AF37] focus:ring-[#D4AF37] rounded-sm uppercase"
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <Label className="text-gray-400 font-medium tracking-wide uppercase text-xs">Requerimientos Especiales</Label>
                <textarea 
                  rows={3}
                  className="w-full rounded-sm border border-white/10 bg-[#0B0C10] text-white focus:border-[#D4AF37] focus:ring-[#D4AF37] px-4 py-3 text-base outline-none transition-all"
                  value={formData.customerNotes}
                  onChange={(e) => updateForm('customerNotes', e.target.value)}
                  placeholder="Ej. Silla para infante, equipaje voluminoso..."
                />
              </div>

              <div className="flex gap-4 pt-8 border-t border-white/5 mt-10">
                <Button type="button" variant="outline" size="lg" className="h-16 w-1/3 border-gray-600 text-gray-300 hover:text-white hover:border-[#D4AF37] hover:bg-transparent rounded-sm transition-all font-medium" onClick={() => setStep(2)} disabled={isLoading}>
                  Retroceder
                </Button>
                <Button type="submit" size="lg" className="h-16 w-2/3 text-lg font-medium bg-[#D4AF37] text-[#0B0C10] hover:bg-[#C5A059] rounded-sm transition-all" disabled={isLoading}>
                  {isLoading ? "Asegurando Reserva..." : "Finalizar y Pagar"}
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
