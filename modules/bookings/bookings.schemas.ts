import { z } from "zod";

export const adminBookingSchema = z.object({
  customerName: z.string().min(2, "Nombre requerido"),
  customerEmail: z.string().email("Email inválido"),
  customerPhone: z.string().optional(),
  
  vehicleId: z.string().uuid("Vehículo inválido"),
  
  originAddress: z.string().min(5, "Origen requerido"),
  destinationAddress: z.string().min(5, "Destino requerido"),
  distanceKm: z.coerce.number().min(0.1, "Distancia requerida"),
  durationMinutes: z.coerce.number().min(1, "Duración requerida"),
  
  serviceDate: z.string(), // ISO string date
  serviceTime: z.string(), // HH:mm format
  tripType: z.enum(["ONE_WAY", "ROUND_TRIP", "HOURLY"]),
  
  passengers: z.coerce.number().min(1),
  luggage: z.coerce.number().min(0),
  flightNumber: z.string().optional(),
  
  internalNotes: z.string().optional(),
  customerNotes: z.string().optional(),
});

export type AdminBookingInput = z.infer<typeof adminBookingSchema>;
