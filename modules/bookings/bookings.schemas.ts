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

function isFutureServiceDate(dateStr: string) {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return false;
  // Compare to current date (stripping time)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date >= today;
}

export const publicBookingSchema = adminBookingSchema.extend({
  serviceDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "El formato de fecha debe ser YYYY-MM-DD")
    .refine(date => isFutureServiceDate(date), "La fecha debe ser igual o posterior a hoy"),
  serviceTime: z
    .string()
    .regex(/^\d{2}:\d{2}$/, "El formato de hora debe ser HH:MM"),
  passengers: z.coerce.number().int().min(1, "Debe haber al menos 1 pasajero"),
  luggage: z.coerce.number().int().min(0, "El equipaje no puede ser negativo"),
});

export type PublicBookingInput = z.infer<typeof publicBookingSchema>;
