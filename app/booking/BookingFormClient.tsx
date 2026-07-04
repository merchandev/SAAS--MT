"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createPublicBookingAction, getDistanceEstimationAction } from "@/modules/bookings/bookings.actions";
import { getOptionalSavedAddressesAction } from "@/modules/customers/customer.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PhoneInput } from "@/components/ui/phone-input";
import PlaceAutocompleteInput from "@/components/maps/PlaceAutocompleteInput";
import GoogleMapRoute from "@/components/maps/GoogleMapRoute";
import Image from "next/image";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Clock } from "lucide-react";
import { getSpainToday } from "@/lib/utils";
import { getVehicleImageSrc } from "@/lib/fleet-images";

type Vehicle = any; // Tipado simple para el MVP

const timeOptions = Array.from({ length: 24 * 4 }).map((_, i) => {
  const hours = Math.floor(i / 4).toString().padStart(2, '0');
  const mins = ((i % 4) * 15).toString().padStart(2, '0');
  return `${hours}:${mins}`;
});

export default function BookingFormClient({ 
  vehicles, 
  hotelToken 
}: { 
  vehicles: Vehicle[]; 
  hotelToken?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);

  // Form State
  const [formData, setFormData] = useState({
    originAddress: searchParams.get("origin") || "",
    originPlaceId: searchParams.get("originId") || "",
    destinationAddress: searchParams.get("destination") || "",
    destinationPlaceId: searchParams.get("destinationId") || "",
    distanceKm: 0,
    durationMinutes: 0,
    serviceDate: searchParams.get("date") || "",
    serviceTime: searchParams.get("time") || "",
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

  const selectedVehicle = vehicles.find(v => v.id === formData.vehicleId);

  const calculateEstimation = (vehicle: Vehicle) => {
    if (!formData.distanceKm) return Number(vehicle.minimumPrice).toFixed(2);
    const base = formData.distanceKm * Number(vehicle.pricePerKmOneWay);
    const total = Math.max(base, Number(vehicle.minimumPrice));
    return formData.tripType === "ROUND_TRIP" ? (total * 2).toFixed(2) : total.toFixed(2);
  };

  useEffect(() => {
    const fetchAddresses = async () => {
      const res = await getOptionalSavedAddressesAction();
      if (res.success && res.data) {
        setSavedAddresses(res.data);
      }
    };
    fetchAddresses();
  }, []);

  useEffect(() => {
    // Si viene con origen y destino en la URL, auto-calcula la distancia para mostrar el mapa.
    if (formData.originAddress && formData.destinationAddress && formData.distanceKm === 0) {
      const fetchDistance = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const estimation = await getDistanceEstimationAction({
            originAddress: formData.originAddress,
            originPlaceId: formData.originPlaceId,
            destinationAddress: formData.destinationAddress,
            destinationPlaceId: formData.destinationPlaceId,
          });
          if (estimation.success) {
            setFormData(prev => ({ 
              ...prev, 
              distanceKm: estimation.distanceKm || 0, 
              durationMinutes: estimation.durationMinutes || 0 
            }));
          } else {
            setError(estimation.error || "No se pudo calcular la ruta automáticamente.");
          }
        } catch (err) {
          setError("Error al conectar con Google Maps.");
        } finally {
          setIsLoading(false);
        }
      };
      fetchDistance();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Se ejecuta solo al montar el componente

  const handleNextStep1 = async () => {
    if (!formData.originAddress || !formData.destinationAddress || !formData.serviceDate || !formData.serviceTime) {
      setError("Por favor, complete origen, destino, fecha y hora.");
      return;
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
    const notesWithHandLuggage = smallLuggage > 0 
      ? (formData.customerNotes ? formData.customerNotes + `\nMaletas de mano: ${smallLuggage}` : `Maletas de mano: ${smallLuggage}`)
      : formData.customerNotes;
      
    const dataToSend = {
      ...bookingPayload,
      customerNotes: notesWithHandLuggage,
      luggage: largeLuggage,
      tripType: formData.tripType as "ONE_WAY" | "ROUND_TRIP"
    };

    const result = await createPublicBookingAction(dataToSend, hotelToken);
    
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
      {/* Progress Wizard Header */}
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
        
        {/* LEFT PANEL: Summary & Map (Visible after step 1 or always if desired, but best to show once we have origin/dest) */}
        <div className="w-full lg:w-1/3 flex flex-col gap-6">
          <div className="bg-[#111111] text-white rounded-2xl overflow-hidden shadow-xl flex flex-col">
            {/* Map Area */}
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

            {/* Summary Area */}
            <div className="p-6 space-y-4">
              <h3 className="font-bold text-lg uppercase tracking-wider mb-4">Resumen del Viaje</h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-gray-300">Vehículo:</span>
                  <span className="font-semibold text-[#D4AF37] text-right">{selectedVehicle ? selectedVehicle.name : "-"}</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-gray-300">Tipo:</span>
                  <span className="font-semibold text-right">{formData.tripType === "ONE_WAY" ? "Solo Ida" : "Ida y Vuelta"}</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-gray-300">Origen:</span>
                  <span className="font-semibold text-right max-w-[150px] truncate" title={formData.originAddress}>{formData.originAddress || "-"}</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-gray-300">Destino:</span>
                  <span className="font-semibold text-right max-w-[150px] truncate" title={formData.destinationAddress}>{formData.destinationAddress || "-"}</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-gray-300">Distancia:</span>
                  <span className="font-semibold text-right">
                    {formData.distanceKm ? `${formData.distanceKm.toFixed(1)} km (${formatDuration(formData.durationMinutes)})` : "-"}
                  </span>
                </div>
              </div>

              <div className="pt-4 mt-2">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold">TOTAL:</span>
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
          
          {/* STEP 1 */}
          {step === 1 && (
            <div className="space-y-6 fade-in-up">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 uppercase tracking-wide">Detalles de la Ruta</h2>
                <p className="text-sm text-gray-500 mt-1 font-medium">Verifique el trayecto de su traslado y defina los horarios para garantizar una puntualidad absoluta.</p>
              </div>
              
              <div className="flex gap-4 mb-6">
                <label className="flex-1 cursor-pointer">
                  <input type="radio" className="peer sr-only" name="tripType" checked={formData.tripType === "ONE_WAY"} onChange={() => updateForm('tripType', 'ONE_WAY')} />
                  <div className="text-center p-3 rounded-lg border-2 border-gray-200 peer-checked:border-[#111111] peer-checked:bg-[#111111] peer-checked:text-white transition-all font-bold">
                    Solo Ida
                  </div>
                </label>
                <label className="flex-1 cursor-pointer">
                  <input type="radio" className="peer sr-only" name="tripType" checked={formData.tripType === "ROUND_TRIP"} onChange={() => updateForm('tripType', 'ROUND_TRIP')} />
                  <div className="text-center p-3 rounded-lg border-2 border-gray-200 peer-checked:border-[#111111] peer-checked:bg-[#111111] peer-checked:text-white transition-all font-bold">
                    Ida y Vuelta
                  </div>
                </label>
              </div>

              {savedAddresses.length > 0 && (
                <div className="bg-gray-50 border border-gray-100 rounded-lg p-4 mb-6">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Tus Direcciones Guardadas</p>
                  <div className="flex flex-wrap gap-2">
                    {savedAddresses.map(addr => (
                      <div key={addr.id} className="flex flex-col sm:flex-row gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="bg-white border-gray-300 text-gray-700 hover:text-[#D4AF37] hover:border-[#D4AF37]"
                          onClick={() => {
                            updateForm('originAddress', addr.address);
                            if (addr.placeId) updateForm('originPlaceId', addr.placeId);
                          }}
                        >
                          <span translate="no" className="notranslate material-symbols-outlined text-[16px] mr-1">location_on</span>
                          {addr.label} (Origen)
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="bg-white border-gray-300 text-gray-700 hover:text-[#D4AF37] hover:border-[#D4AF37]"
                          onClick={() => {
                            updateForm('destinationAddress', addr.address);
                            if (addr.placeId) updateForm('destinationPlaceId', addr.placeId);
                          }}
                        >
                          <span translate="no" className="notranslate material-symbols-outlined text-[16px] mr-1">flag</span>
                          {addr.label} (Destino)
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 md:col-span-2">
                  <Label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Origen</Label>
                  <PlaceAutocompleteInput 
                    value={formData.originAddress}
                    onChange={(val) => updateForm('originAddress', val)}
                    onSelectPlace={(place) => {
                      updateForm('originAddress', place.address);
                      updateForm('originPlaceId', place.placeId);
                    }}
                    className="h-12 border-gray-300 rounded-md shadow-sm"
                    enableGeolocation={true}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Destino</Label>
                  <PlaceAutocompleteInput 
                    value={formData.destinationAddress}
                    onChange={(val) => updateForm('destinationAddress', val)}
                    onSelectPlace={(place) => {
                      updateForm('destinationAddress', place.address);
                      updateForm('destinationPlaceId', place.placeId);
                    }}
                    className="h-12 border-gray-300 rounded-md shadow-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Fecha</Label>
                  <DatePicker
                    selected={formData.serviceDate ? new Date(formData.serviceDate + "T12:00:00") : null}
                    onChange={(date: Date | null) => updateForm('serviceDate', date ? date.toISOString().split('T')[0] : '')}
                    dateFormat="dd/MM/yyyy"
                    minDate={getSpainToday()}
                    customInput={<Input readOnly className="h-12 border-gray-300 rounded-md shadow-sm w-full cursor-pointer bg-white" />}
                    placeholderText="dd/mm/aaaa"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Hora</Label>
                  <div className="relative">
                    <select
                      value={formData.serviceTime}
                      onChange={(e) => updateForm('serviceTime', e.target.value)}
                      className="h-12 w-full border border-gray-300 rounded-md shadow-sm bg-white hover:bg-gray-50 focus:bg-white transition-colors text-sm text-gray-900 appearance-none px-4 outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
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
                <Button onClick={handleNextStep1} disabled={isLoading} className="bg-[#111111] text-white hover:bg-black h-12 px-8 text-lg w-full md:w-auto transition-colors">
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
                <p className="text-sm text-gray-500 mt-1 font-medium">Elija la categoría de la flota que mejor se adapte a sus exigencias de confort y volumen de equipaje.</p>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {vehicles.map(v => {
                  const vehicleImage = getVehicleImageSrc(v);

                  return (
                    <div
                      key={v.id}
                      onClick={() => updateForm('vehicleId', v.id)}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between ${
                        formData.vehicleId === v.id
                          ? 'border-[#D4AF37] bg-[#D4AF37]/5 shadow-md'
                          : 'border-gray-200 bg-white hover:border-[#D4AF37]/50'
                      }`}
                    >
                      <div className="flex min-w-0 items-center gap-4">
                        <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                          <Image
                            src={vehicleImage}
                            alt={`${v.name} de Transfers in Barcelona`}
                            fill
                            sizes="112px"
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="text-xl font-bold text-gray-900">{v.name}</h4>
                          <p className="text-sm text-gray-500 mt-1">Capacidad: {v.passengerCapacity} Pasajeros | {v.luggageCapacity} Maletas</p>
                        </div>
                      </div>
                      <div className="text-left sm:text-right">
                        <p className="text-sm text-gray-500 uppercase tracking-wider mb-1">Precio</p>
                        <p className="text-2xl font-bold text-[#D4AF37]">€{calculateEstimation(v)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="pt-6 flex justify-between gap-4">
                <Button variant="outline" onClick={() => setStep(1)} className="h-12 px-8">Volver</Button>
                <Button onClick={handleNextStep2} className="bg-[#111111] text-white hover:bg-black h-12 px-8 transition-colors">Continuar</Button>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="space-y-6 fade-in-up">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 uppercase tracking-wide">Detalles de los Pasajeros</h2>
                <p className="text-sm text-gray-500 mt-1 font-medium">Proporcione la información de los viajeros para ofrecerle un servicio de recepción impecable.</p>
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
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      if (isNaN(val)) {
                        setFormData(prev => ({ ...prev, passengers: '' as any }));
                      } else {
                        const newPass = Math.min(val, selectedVehicle?.passengerCapacity || 4);
                        setFormData(prev => ({ ...prev, passengers: newPass }));
                      }
                    }}
                    onBlur={() => {
                      if (!formData.passengers || formData.passengers < 1) updateForm('passengers', 1);
                    }}
                    className="h-12" 
                  />
                  <p className="text-[10px] text-gray-400">Máximo: {selectedVehicle?.passengerCapacity || 4}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Nº de Vuelo (Opcional)</Label>
                  <Input value={formData.flightNumber} onChange={(e) => updateForm('flightNumber', e.target.value)} className="h-12" placeholder="Ej. IB3150" />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Maletas Grandes</Label>
                  <Input 
                    type="number" 
                    min="0" 
                    max={selectedVehicle?.luggageCapacity || 4} 
                    value={formData.largeLuggage} 
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      if (isNaN(val)) updateForm('largeLuggage', '');
                      else updateForm('largeLuggage', Math.min(val, selectedVehicle?.luggageCapacity || 4));
                    }}
                    onBlur={() => {
                      if (formData.largeLuggage === ('' as unknown as number)) updateForm('largeLuggage', 0);
                    }}
                    className="h-12" 
                  />
                  <p className="text-[10px] text-gray-400">Máximo: {selectedVehicle?.luggageCapacity || 4}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Maletas de Mano</Label>
                  <Input 
                    type="number" 
                    min="0" 
                    max={(selectedVehicle?.passengerCapacity || 4) * 2} 
                    value={formData.smallLuggage} 
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      const maxSmall = (selectedVehicle?.passengerCapacity || 4) * 2;
                      if (isNaN(val)) updateForm('smallLuggage', '');
                      else updateForm('smallLuggage', Math.min(val, maxSmall));
                    }}
                    onBlur={() => {
                      if (formData.smallLuggage === ('' as unknown as number)) updateForm('smallLuggage', 0);
                    }}
                    className="h-12" 
                  />
                  <p className="text-[10px] text-gray-400">Máximo: {(selectedVehicle?.passengerCapacity || 4) * 2}</p>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Notas Adicionales</Label>
                  <textarea 
                    rows={3}
                    className="w-full rounded-md border border-gray-300 bg-white shadow-sm px-3 py-2 text-sm focus:border-[#D4AF37] focus:ring-[#D4AF37] outline-none"
                    value={formData.customerNotes}
                    onChange={(e) => updateForm('customerNotes', e.target.value)}
                  />
                </div>
              </div>

              <div className="pt-6 flex justify-between gap-4">
                <Button variant="outline" onClick={() => setStep(2)} className="h-12 px-8">Volver</Button>
                <Button onClick={handleNextStep3} className="bg-[#111111] text-white hover:bg-black h-12 px-8 transition-colors">Confirmar Reserva</Button>
              </div>
            </div>
          )}

          {/* STEP 4: PAGO SEGURO */}
          {step === 4 && (
            <div className="space-y-6 fade-in-up flex flex-col items-center justify-center py-6 text-center">
              <h2 className="text-3xl font-bold text-gray-900 uppercase tracking-wide mb-2 flex items-center justify-center gap-2">
                💳 Pago Seguro
              </h2>
              <p className="text-gray-500 max-w-md mx-auto mb-8">
                Está a un paso de confirmar su traslado. Será redirigido a la pasarela de pago segura de Getnet (Santander).
              </p>

              <div className="w-full max-w-md bg-gray-50 p-6 rounded-xl border border-gray-200 mb-6 text-left">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="mt-1 w-5 h-5 text-gray-900 border-gray-300 rounded focus:ring-gray-900" 
                    checked={formData.termsAccepted}
                    onChange={(e) => updateForm('termsAccepted', e.target.checked)}
                  />
                  <span className="text-sm text-gray-600 font-medium leading-tight">
                    He leído y acepto los <a href="#" className="text-[#D4AF37] hover:text-[#AA8B2C] underline font-bold">Términos y Condiciones</a> de la web y estoy de acuerdo en continuar.
                  </span>
                </label>
              </div>

              <div className="flex justify-center gap-4 w-full max-w-md">
                <Button variant="outline" onClick={() => setStep(3)} className="h-14 flex-1 text-lg font-bold">Volver</Button>
                <Button onClick={handleSubmit} disabled={isLoading || !formData.termsAccepted} className="bg-[#111111] text-white hover:bg-black h-14 flex-1 text-lg font-bold shadow-lg transition-colors">
                  {isLoading ? "Procesando..." : "PAGAR"}
                </Button>
              </div>
              <p className="text-xs text-gray-400 mt-4">Serás redirigido a la pasarela de pago segura del banco.</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
