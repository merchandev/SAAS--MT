import { z } from "zod";

export const hotelCreationSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  contactName: z.string().optional(),
  email: z.string().email("Debe ser un email válido").optional().or(z.literal("")),
  phone: z.string().optional(),
  commissionValue: z.coerce.number().min(0, "La comisión no puede ser negativa").max(100, "La comisión máxima es 100%"),
  discountValue: z.coerce.number().min(0, "El descuento no puede ser negativo").max(100, "El descuento máximo es 100%"),
});

export type HotelCreationInput = z.infer<typeof hotelCreationSchema>;
