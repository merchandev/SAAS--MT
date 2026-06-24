"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createPublicBookingAction } from "@/modules/bookings/bookings.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
    destinationAddress: "",
    distanceKm: 25, // Mock distance for MVP
    durationMinutes: 45, // Mock duration
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
    const base = formData.distanceKm * Number(vehicle.pricePerKmOneWay);
    return Math.max(base, Number(vehicle.minimumPrice)).toFixed(2);
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (!formData.originAddress || !formData.destinationAddress || !formData.serviceDate || !formData.serviceTime) {
        setError("Por favor, completa las direcciones y fechas.");
        return;
      }
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

    const result = await createPublicBookingAction(formData, hotelToken);
    
    if (result.error) {
      setError(result.error);
      setIsLoading(false);
    } else {
      // Redirigir a pasarela de pago (Redsys)
      router.push(`/booking/${result.publicCode}/payment`);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Progress Bar */}
      <div className="flex border-b bg-gray-50/50">
        {[1, 2, 3].map((num) => (
          <div key={num} className={`flex-1 text-center py-4 text-sm font-semibold border-b-2 transition-colors ${
            step === num ? 'border-black text-black' : step > num ? 'border-gray-300 text-gray-500' : 'border-transparent text-gray-400'
          }`}>
            Paso {num}
          </div>
        ))}
      </div>

      <div className="p-6 sm:p-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg text-sm font-medium border border-red-100">
            {error}
          </div>
        )}

        {/* STEP 1: Ruta y Fechas */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-bold text-gray-900">Detalles del Viaje</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label className="text-gray-700 font-semibold">Lugar de Recogida</Label>
                <Input 
                  placeholder="Aeropuerto, Hotel o Dirección..." 
                  value={formData.originAddress}
                  onChange={(e) => updateForm('originAddress', e.target.value)}
                  className="h-12 bg-gray-50"
                />
              </div>
              <div className="space-y-3">
                <Label className="text-gray-700 font-semibold">Destino</Label>
                <Input 
                  placeholder="Hotel, Ciudad o Dirección..." 
                  value={formData.destinationAddress}
                  onChange={(e) => updateForm('destinationAddress', e.target.value)}
                  className="h-12 bg-gray-50"
                />
              </div>
              <div className="space-y-3">
                <Label className="text-gray-700 font-semibold">Fecha de Recogida</Label>
                <Input 
                  type="date" 
                  value={formData.serviceDate}
                  onChange={(e) => updateForm('serviceDate', e.target.value)}
                  className="h-12 bg-gray-50"
                />
              </div>
              <div className="space-y-3">
                <Label className="text-gray-700 font-semibold">Hora (Formato 24h)</Label>
                <Input 
                  type="time" 
                  value={formData.serviceTime}
                  onChange={(e) => updateForm('serviceTime', e.target.value)}
                  className="h-12 bg-gray-50"
                />
              </div>
            </div>
            <Button size="lg" className="w-full mt-6 h-14 text-lg font-bold" onClick={handleNextStep}>
              Ver Vehículos Disponibles
            </Button>
          </div>
        )}

        {/* STEP 2: Selección de Vehículo */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
            <h2 className="text-2xl font-bold text-gray-900">Selecciona tu Vehículo</h2>
            <p className="text-gray-500 mb-6">Precios estimados basados en la distancia.</p>
            
            <div className="grid grid-cols-1 gap-4">
              {vehicles.map(v => (
                <div 
                  key={v.id} 
                  onClick={() => updateForm('vehicleId', v.id)}
                  className={`p-5 rounded-xl border-2 cursor-pointer transition-all ${
                    formData.vehicleId === v.id ? 'border-black bg-gray-50 ring-2 ring-black/5' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="text-lg font-bold text-gray-900">{v.name}</h4>
                      <p className="text-sm text-gray-500 mt-1">
                        Hasta {v.passengerCapacity} Pasajeros • {v.luggageCapacity} Maletas
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Precio final desde</p>
                      <p className="text-2xl font-black text-gray-900">€{calculateEstimation(v)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex gap-4 mt-8 pt-6 border-t">
              <Button variant="outline" size="lg" className="h-14 w-1/3" onClick={() => setStep(1)}>
                Volver
              </Button>
              <Button size="lg" className="h-14 w-2/3 text-lg font-bold" onClick={handleNextStep}>
                Continuar
              </Button>
            </div>
          </div>
        )}

        {/* STEP 3: Datos Finales */}
        {step === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
            <h2 className="text-2xl font-bold text-gray-900">Datos del Pasajero</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label className="text-gray-700 font-semibold">Nombre y Apellidos</Label>
                  <Input 
                    required 
                    value={formData.customerName}
                    onChange={(e) => updateForm('customerName', e.target.value)}
                    className="h-12 bg-gray-50"
                  />
                </div>
                <div className="space-y-3">
                  <Label className="text-gray-700 font-semibold">Email de Contacto</Label>
                  <Input 
                    type="email" required 
                    value={formData.customerEmail}
                    onChange={(e) => updateForm('customerEmail', e.target.value)}
                    className="h-12 bg-gray-50"
                  />
                </div>
                <div className="space-y-3">
                  <Label className="text-gray-700 font-semibold">Teléfono / WhatsApp</Label>
                  <Input 
                    required 
                    value={formData.customerPhone}
                    onChange={(e) => updateForm('customerPhone', e.target.value)}
                    className="h-12 bg-gray-50"
                  />
                </div>
                <div className="space-y-3">
                  <Label className="text-gray-700 font-semibold">Número de Vuelo (Opcional)</Label>
                  <Input 
                    value={formData.flightNumber}
                    onChange={(e) => updateForm('flightNumber', e.target.value)}
                    className="h-12 bg-gray-50"
                  />
                </div>
              </div>
              
              <div className="space-y-3">
                <Label className="text-gray-700 font-semibold">Peticiones Especiales (Sillas de bebé, etc.)</Label>
                <textarea 
                  rows={3}
                  className="w-full rounded-md border border-input bg-gray-50 px-3 py-2 text-sm"
                  value={formData.customerNotes}
                  onChange={(e) => updateForm('customerNotes', e.target.value)}
                />
              </div>

              <div className="flex gap-4 pt-6 border-t mt-8">
                <Button type="button" variant="outline" size="lg" className="h-14 w-1/3" onClick={() => setStep(2)} disabled={isLoading}>
                  Volver
                </Button>
                <Button type="submit" size="lg" className="h-14 w-2/3 text-lg font-bold" disabled={isLoading}>
                  {isLoading ? "Procesando Reserva..." : "Confirmar Reserva"}
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
