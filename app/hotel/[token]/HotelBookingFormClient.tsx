"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createPublicBookingAction, getDistanceEstimationAction } from "@/modules/bookings/bookings.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PhoneInput } from "@/components/ui/phone-input";
import PlaceAutocompleteInput from "@/components/maps/PlaceAutocompleteInput";
import GoogleMapRoute from "@/components/maps/GoogleMapRoute";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Clock, MapPin } from "lucide-react";

type Vehicle = any;

const timeOptions = Array.from({ length: 24 * 4 }).map((_, i) => {
  const hours = Math.floor(i / 4).toString().padStart(2, '0');
  const mins = ((i % 4) * 15).toString().padStart(2, '0');
  return `${hours}:${mins}`;
});

export default function HotelBookingFormClient({ 
  vehicles, 
  hotel 
}: { 
  vehicles: Vehicle[]; 
  hotel: any;
}) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Direction: "TO_HOTEL" or "FROM_HOTEL"
  const [direction, setDirection] = useState<"TO_HOTEL" | "FROM_HOTEL">("TO_HOTEL");
  
  // Custom destination selected ID. If "CUSTOM", use PlaceAutocomplete
  const [selectedDestId, setSelectedDestId] = useState<string>("");

  const destinations = hotel.routesSettings?.destinations || [];

  const [formData, setFormData] = useState({
    originAddress: "",
    originPlaceId: "",
    destinationAddress: hotel.address,
    destinationPlaceId: hotel.placeId,
    distanceKm: 0,
    durationMinutes: 0,
    serviceDate: "",
    serviceTime: "",
    tripType: "ONE_WAY",
    passengers: 1,
    largeLuggage: 0,
    smallLuggage: 0,
    vehicleId: "",
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    flightNumber: "",
    customerNotes: "",
    termsAccepted: false,
  });

  const updateForm = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleDirectionChange = (dir: "TO_HOTEL" | "FROM_HOTEL") => {
    setDirection(dir);
    setSelectedDestId("");
    if (dir === "TO_HOTEL") {
      setFormData(prev => ({
        ...prev,
        destinationAddress: hotel.address,
        destinationPlaceId: hotel.placeId,
        originAddress: "",
        originPlaceId: "",
        distanceKm: 0
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        originAddress: hotel.address,
        originPlaceId: hotel.placeId,
        destinationAddress: "",
        destinationPlaceId: "",
        distanceKm: 0
      }));
    }
  };

  const handleDestSelectionChange = (destId: string) => {
    setSelectedDestId(destId);
    
    if (destId === "CUSTOM") {
      if (direction === "TO_HOTEL") {
        updateForm("originAddress", "");
        updateForm("originPlaceId", "");
      } else {
        updateForm("destinationAddress", "");
        updateForm("destinationPlaceId", "");
      }
      updateForm("distanceKm", 0);
      return;
    }

    const dest = destinations.find((d: any) => d.id === destId);
    if (dest) {
      if (direction === "TO_HOTEL") {
        updateForm("originAddress", dest.address);
        updateForm("originPlaceId", dest.placeId);
      } else {
        updateForm("destinationAddress", dest.address);
        updateForm("destinationPlaceId", dest.placeId);
      }
    }
  };

  const selectedVehicle = vehicles.find(v => v.id === formData.vehicleId);

  const calculateEstimation = (vehicle: Vehicle) => {
    if (selectedDestId && selectedDestId !== "CUSTOM") {
      const dest = destinations.find((d: any) => d.id === selectedDestId);
      if (dest && dest.prices && dest.prices[vehicle.id]) {
        let price = Number(dest.prices[vehicle.id]);
        if (formData.tripType === "ROUND_TRIP") price *= 2;
        return price.toFixed(2);
      }
    }

    // Fallback to distance based
    if (!formData.distanceKm) return Number(vehicle.minimumPrice).toFixed(2);
    const base = formData.distanceKm * Number(vehicle.pricePerKmOneWay);
    const total = Math.max(base, Number(vehicle.minimumPrice));
    return formData.tripType === "ROUND_TRIP" ? (total * 2).toFixed(2) : total.toFixed(2);
  };

  const handleNextStep1 = async () => {
    if (!formData.originAddress || !formData.destinationAddress || !formData.serviceDate || !formData.serviceTime) {
      setError("Por favor, complete origen, destino, fecha y hora.");
      return;
    }
    
    if (selectedDestId && selectedDestId !== "CUSTOM") {
      // Si es un destino fijo, no forzamos cálculo de Google Maps si ya sabemos los datos,
      // pero podríamos llamarlo para obtener distancia visual.
      // Lo llamamos para tener distancia en el resumen.
    }

    setIsLoading(true);
    setError(null);
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
      setStep(2);
    } catch (err) {
      setError("Error al conectar con Google Maps.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNextStep2 = () => {
    if (!formData.vehicleId) {
      setError("Por favor, seleccione un vehículo.");
      return;
    }
    setError(null);
    setStep(3);
  };

  const handleNextStep3 = () => {
    if (!formData.customerName || !formData.customerEmail || !formData.customerPhone) {
      setError("Nombre, Email y Teléfono son obligatorios.");
      return;
    }
    setError(null);
    setStep(4);
  };

  const handleSubmit = async () => {
    if (!formData.termsAccepted) {
      setError("Debe aceptar los términos y condiciones para continuar.");
      return;
    }

    setIsLoading(true);
    setError(null);

    const { distanceKm, durationMinutes, largeLuggage, smallLuggage, termsAccepted, ...bookingPayload } = formData;
    const dataToSend = {
      ...bookingPayload,
      luggage: largeLuggage + smallLuggage,
      tripType: formData.tripType as "ONE_WAY" | "ROUND_TRIP"
    };

    const result = await createPublicBookingAction(dataToSend, hotel.token);
    
    if (result.error) {
      setError(result.error);
      setIsLoading(false);
    } else {
      const receiptToken = result.receiptToken ? `?token=${encodeURIComponent(result.receiptToken)}` : "";
      router.push(`/booking/${result.publicCode}/payment${receiptToken}`);
    }
  };

  const formatDuration = (mins: number) => {
    const h = Math.floor(mins / 60);
    const m = Math.round(mins % 60);
    return h > 0 ? `${h}h ${m} min` : `${m} min`;
  };

  return (
    <div className="w-full">
      <div className="flex justify-center mb-10">
        <div className="flex items-center w-full max-w-3xl">
          {[1, 2, 3, 4].map((num, i) => (
            <div key={num} className="flex items-center flex-1 last:flex-none">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
                step >= num ? 'bg-[#D4AF37] text-white shadow-md' : 'bg-gray-200 text-gray-500'
              }`}>
                {num}
              </div>
              {i < 3 && (
                <div className={`h-1 flex-1 mx-2 transition-colors ${
                  step > num ? 'bg-[#D4AF37]' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {error && (
        <div className="mb-8 p-4 bg-red-50 text-red-700 rounded-lg text-sm font-bold border border-red-200">
          {error}
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* LEFT PANEL: Summary & Map */}
        <div className="w-full lg:w-1/3 flex flex-col gap-6">
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-xl flex flex-col">
            <div className="h-48 w-full bg-gray-100 relative">
              {(formData.originAddress && formData.destinationAddress && (step > 1 || formData.distanceKm > 0)) ? (
                <GoogleMapRoute 
                  origin={formData.originAddress} 
                  destination={formData.destinationAddress}
                  className="w-full h-full"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-200">
                  <span className="text-sm">El mapa aparecerá aquí</span>
                </div>
              )}
            </div>

            <div className="p-6 space-y-4">
              <h3 className="font-bold text-lg text-gray-900 uppercase tracking-wider mb-4 border-b pb-2">Resumen</h3>
              
              <div className="space-y-3 text-sm text-gray-700">
                <div className="flex justify-between pb-1">
                  <span className="text-gray-500">Vehículo:</span>
                  <span className="font-semibold text-[#D4AF37] text-right">{selectedVehicle ? selectedVehicle.name : "-"}</span>
                </div>
                <div className="flex justify-between pb-1">
                  <span className="text-gray-500">Tipo:</span>
                  <span className="font-semibold text-right">{formData.tripType === "ONE_WAY" ? "Solo Ida" : "Ida y Vuelta"}</span>
                </div>
                <div className="flex justify-between pb-1">
                  <span className="text-gray-500">Origen:</span>
                  <span className="font-semibold text-right max-w-[150px] truncate" title={formData.originAddress}>{formData.originAddress || "-"}</span>
                </div>
                <div className="flex justify-between pb-1">
                  <span className="text-gray-500">Destino:</span>
                  <span className="font-semibold text-right max-w-[150px] truncate" title={formData.destinationAddress}>{formData.destinationAddress || "-"}</span>
                </div>
              </div>

              <div className="pt-4 mt-2 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">TOTAL:</span>
                  <span className="text-2xl font-bold text-[#D4AF37]">
                    {selectedVehicle ? `€${calculateEstimation(selectedVehicle)}` : "€0.00"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: Dynamic Form Steps */}
        <div className="w-full lg:w-2/3 bg-white border border-gray-100 rounded-2xl shadow-xl p-6 lg:p-10">
          
          {step === 1 && (
            <div className="space-y-6 fade-in-up">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 uppercase tracking-wide">¿Hacia dónde te diriges?</h2>
                <p className="text-sm text-gray-500 mt-1 font-medium">Seleccione el trayecto que desea realizar desde o hacia {hotel.name}.</p>
              </div>

              <div className="flex gap-4 mb-6">
                <label className="flex-1 cursor-pointer">
                  <input type="radio" className="peer sr-only" checked={direction === "TO_HOTEL"} onChange={() => handleDirectionChange("TO_HOTEL")} />
                  <div className="text-center p-3 rounded-lg border-2 border-gray-200 peer-checked:border-[#111111] peer-checked:bg-[#111111] peer-checked:text-white transition-all font-bold">
                    Llegada al Hotel
                  </div>
                </label>
                <label className="flex-1 cursor-pointer">
                  <input type="radio" className="peer sr-only" checked={direction === "FROM_HOTEL"} onChange={() => handleDirectionChange("FROM_HOTEL")} />
                  <div className="text-center p-3 rounded-lg border-2 border-gray-200 peer-checked:border-[#111111] peer-checked:bg-[#111111] peer-checked:text-white transition-all font-bold">
                    Salida del Hotel
                  </div>
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 md:col-span-2">
                  <Label className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                    {direction === "TO_HOTEL" ? "Lugar de Origen" : "Destino Fijo"}
                  </Label>
                  <select
                    value={selectedDestId}
                    onChange={(e) => handleDestSelectionChange(e.target.value)}
                    className="h-12 w-full border border-gray-300 rounded-md shadow-sm bg-white hover:bg-gray-50 focus:bg-white transition-colors text-sm text-gray-900 px-4 outline-none focus:ring-2 focus:ring-gray-900"
                  >
                    <option value="" disabled>Seleccione una ubicación...</option>
                    {destinations.map((d: any) => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                    <option value="CUSTOM">Otro Destino (A Medida)</option>
                  </select>
                </div>

                {selectedDestId === "CUSTOM" && (
                  <div className="space-y-2 md:col-span-2 fade-in-up">
                    <Label className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                      {direction === "TO_HOTEL" ? "Buscar Origen" : "Buscar Destino"}
                    </Label>
                    <PlaceAutocompleteInput 
                      value={direction === "TO_HOTEL" ? formData.originAddress : formData.destinationAddress}
                      onChange={(val) => direction === "TO_HOTEL" ? updateForm('originAddress', val) : updateForm('destinationAddress', val)}
                      onSelectPlace={(place) => {
                        if (direction === "TO_HOTEL") {
                          updateForm('originAddress', place.address);
                          updateForm('originPlaceId', place.placeId);
                        } else {
                          updateForm('destinationAddress', place.address);
                          updateForm('destinationPlaceId', place.placeId);
                        }
                      }}
                      className="h-12 border-gray-300 rounded-md shadow-sm"
                    />
                  </div>
                )}

                <div className="space-y-2 md:col-span-2 border-t pt-4">
                  <div className="flex gap-4 mb-4">
                    <label className="flex-1 cursor-pointer">
                      <input type="radio" className="peer sr-only" name="tripType" checked={formData.tripType === "ONE_WAY"} onChange={() => updateForm('tripType', 'ONE_WAY')} />
                      <div className="text-center p-2 rounded-lg border border-gray-200 peer-checked:border-[#D4AF37] peer-checked:text-[#D4AF37] peer-checked:bg-[#D4AF37]/10 transition-all font-semibold text-sm">
                        Solo Ida
                      </div>
                    </label>
                    <label className="flex-1 cursor-pointer">
                      <input type="radio" className="peer sr-only" name="tripType" checked={formData.tripType === "ROUND_TRIP"} onChange={() => updateForm('tripType', 'ROUND_TRIP')} />
                      <div className="text-center p-2 rounded-lg border border-gray-200 peer-checked:border-[#D4AF37] peer-checked:text-[#D4AF37] peer-checked:bg-[#D4AF37]/10 transition-all font-semibold text-sm">
                        Ida y Vuelta
                      </div>
                    </label>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Fecha del Servicio</Label>
                  <DatePicker
                    selected={formData.serviceDate ? new Date(formData.serviceDate + "T12:00:00") : null}
                    onChange={(date: Date | null) => updateForm('serviceDate', date ? date.toISOString().split('T')[0] : '')}
                    dateFormat="dd/MM/yyyy"
                    customInput={<Input className="h-12 border-gray-300 rounded-md shadow-sm w-full" />}
                    placeholderText="dd/mm/aaaa"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Hora de Recogida</Label>
                  <div className="relative">
                    <select
                      value={formData.serviceTime}
                      onChange={(e) => updateForm('serviceTime', e.target.value)}
                      className="h-12 w-full border border-gray-300 rounded-md shadow-sm bg-white px-4 outline-none focus:ring-2 focus:ring-gray-900"
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
              </div>
              
              <div className="pt-6 flex justify-end">
                <Button onClick={handleNextStep1} disabled={isLoading || !selectedDestId} className="bg-[#111111] text-white hover:bg-black h-12 px-8 text-lg w-full md:w-auto transition-colors">
                  {isLoading ? "Calculando..." : "Continuar"}
                </Button>
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="space-y-6 fade-in-up">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 uppercase tracking-wide">Selección de Vehículo</h2>
                <p className="text-sm text-gray-500 mt-1 font-medium">Elija la categoría de la flota que mejor se adapte.</p>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {vehicles.map(v => (
                  <div 
                    key={v.id} 
                    onClick={() => updateForm('vehicleId', v.id)}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex justify-between items-center ${
                      formData.vehicleId === v.id 
                        ? 'border-[#D4AF37] bg-[#D4AF37]/5 shadow-md' 
                        : 'border-gray-200 bg-white hover:border-[#D4AF37]/50'
                    }`}
                  >
                    <div>
                      <h4 className="text-xl font-bold text-gray-900">{v.name}</h4>
                      <p className="text-sm text-gray-500 mt-1">Capacidad: {v.passengerCapacity} Pasajeros | {v.luggageCapacity} Maletas</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500 uppercase tracking-wider mb-1">Precio</p>
                      <p className="text-2xl font-bold text-[#D4AF37]">€{calculateEstimation(v)}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="pt-6 flex justify-between gap-4">
                <Button variant="outline" onClick={() => setStep(1)} className="h-12 px-8">Volver</Button>
                <Button onClick={handleNextStep2} className="bg-[#111111] text-white hover:bg-black h-12 px-8 transition-colors">Continuar</Button>
              </div>
            </div>
          )}

          {/* STEP 3 & 4 identical structure... */}
          {step === 3 && (
            <div className="space-y-6 fade-in-up">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 uppercase tracking-wide">Detalles del Pasajero</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 md:col-span-2">
                  <Label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Nombre Completo</Label>
                  <Input value={formData.customerName} onChange={(e) => updateForm('customerName', e.target.value)} className="h-12" placeholder="Ej. Juan Pérez" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Teléfono</Label>
                  <PhoneInput value={formData.customerPhone} onChange={(val) => updateForm('customerPhone', val)} className="h-12" placeholder="600 000 000" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Email</Label>
                  <Input type="email" value={formData.customerEmail} onChange={(e) => updateForm('customerEmail', e.target.value)} className="h-12" placeholder="juan@ejemplo.com" />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Nº de Pasajeros</Label>
                  <Input 
                    type="number" 
                    min="1" 
                    max={selectedVehicle?.passengerCapacity || 4} 
                    value={formData.passengers} 
                    onChange={(e) => updateForm('passengers', parseInt(e.target.value))}
                    className="h-12" 
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Nº de Vuelo (Opcional)</Label>
                  <Input value={formData.flightNumber} onChange={(e) => updateForm('flightNumber', e.target.value)} className="h-12" placeholder="Ej. IB3150" />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Notas Adicionales (Habitación del Hotel, etc.)</Label>
                  <textarea 
                    rows={3}
                    className="w-full rounded-md border border-gray-300 bg-white shadow-sm px-3 py-2 text-sm focus:border-gray-900 focus:ring-gray-900 outline-none"
                    value={formData.customerNotes}
                    onChange={(e) => updateForm('customerNotes', e.target.value)}
                  />
                </div>
              </div>

              <div className="pt-6 flex justify-between gap-4">
                <Button variant="outline" onClick={() => setStep(2)} className="h-12 px-8">Volver</Button>
                <Button onClick={handleNextStep3} className="bg-[#111111] text-white hover:bg-black h-12 px-8 transition-colors">Confirmar</Button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6 fade-in-up flex flex-col items-center justify-center py-6 text-center">
              <h2 className="text-3xl font-bold text-gray-900 uppercase tracking-wide mb-2 flex items-center justify-center gap-2">
                💳 Pago Seguro
              </h2>
              <div className="w-full max-w-md bg-gray-50 p-6 rounded-xl border border-gray-200 mb-6 text-left">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="mt-1 w-5 h-5 text-gray-900 border-gray-300 rounded focus:ring-gray-900" 
                    checked={formData.termsAccepted}
                    onChange={(e) => updateForm('termsAccepted', e.target.checked)}
                  />
                  <span className="text-sm text-gray-600 font-medium leading-tight">
                    He leído y acepto los <a href="#" className="text-[#D4AF37] underline font-bold">Términos y Condiciones</a>.
                  </span>
                </label>
              </div>

              <div className="flex justify-center gap-4 w-full max-w-md">
                <Button variant="outline" onClick={() => setStep(3)} className="h-14 flex-1 text-lg font-bold">Volver</Button>
                <Button onClick={handleSubmit} disabled={isLoading || !formData.termsAccepted} className="bg-[#111111] text-white hover:bg-black h-14 flex-1 text-lg font-bold shadow-lg transition-colors">
                  {isLoading ? "Procesando..." : "PAGAR"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
