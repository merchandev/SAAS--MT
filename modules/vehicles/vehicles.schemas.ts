import { z } from "zod";

export const vehicleSchema = z.object({
  categoryId: z.string().uuid("Categoría inválida"),
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  slug: z.string().min(2, "El slug debe tener al menos 2 caracteres"),
  imageUrl: z.string().trim().optional(),
  passengerCapacity: z.coerce.number().min(1, "Debe haber al menos 1 pasajero"),
  luggageCapacity: z.coerce.number().min(0, "La capacidad de maletas no puede ser negativa"),
  pricePerKmOneWay: z.coerce.number().min(0, "El precio por Km no puede ser negativo"),
  pricePerKmRoundTrip: z.coerce.number().min(0, "El precio por Km no puede ser negativo"),
  pricePerHour: z.coerce.number().min(0, "El precio por hora no puede ser negativo"),
  minimumPrice: z.coerce.number().min(0, "El precio mínimo no puede ser negativo"),
  airportSurcharge: z.coerce.number().default(0),
  nightSurcharge: z.coerce.number().default(0),
  isActive: z.boolean().default(true),
  sortOrder: z.coerce.number().int().default(0),
});

export type VehicleInput = z.infer<typeof vehicleSchema>;

export const categorySchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().optional(),
});

export type CategoryInput = z.infer<typeof categorySchema>;
