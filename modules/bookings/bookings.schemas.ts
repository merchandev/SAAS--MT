import { z } from "zod";

export const adminBookingSchema = z.object({
  customerName: z.string().min(2, "Nombre requerido"),
  customerEmail: z.string().email("Email inválido"),
  customerPhone: z.string().optional(),
  
  vehicleId: z.string().uuid("Vehículo inválido"),
  
  originAddress: z.string().min(5, "Origen requerido"),
  originPlaceId: z.string().optional(),
  destinationAddress: z.string().min(5, "Destino requerido"),
  destinationPlaceId: z.string().optional(),
  distanceKm: z.coerce.number().optional(),
  durationMinutes: z.coerce.number().optional(),
  
  serviceDate: z.string(), // ISO string date
  serviceTime: z.string(), // HH:mm format
  tripType: z.enum(["ONE_WAY", "ROUND_TRIP"]),
  
  passengers: z.coerce.number().min(1),
  luggage: z.coerce.number().min(0),
  flightNumber: z.string().optional(),
  
  internalNotes: z.string().optional(),
  customerNotes: z.string().optional(),
});

export type AdminBookingInput = z.infer<typeof adminBookingSchema>;
