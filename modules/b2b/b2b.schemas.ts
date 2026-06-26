import { z } from "zod";

export const hotelCreationSchema = z.object({
  name: z.string().trim().min(2, "El nombre debe tener al menos 2 caracteres"),
  contactName: z.string().trim().optional().or(z.literal("")),
  email: z.string().email("Debe ser un email válido").optional().or(z.literal("")),
  phone: z.string().trim().optional().or(z.literal("")),
  address: z.string().trim().optional().or(z.literal("")),
  placeId: z.string().trim().optional().or(z.literal("")),
  commissionValue: z.coerce.number().min(0, "La comisión no puede ser negativa").max(100, "La comisión máxima es 100%"),
  discountValue: z.coerce.number().min(0, "El descuento no puede ser negativo").max(100, "El descuento máximo es 100%"),
});

export type HotelCreationInput = z.infer<typeof hotelCreationSchema>;

export const updateHotelSchema = hotelCreationSchema.extend({
  isActive: z.boolean().optional(),
  routesSettings: z.any().optional(),
});

export type HotelUpdateInput = z.infer<typeof updateHotelSchema>;

export const hotelUserCreationSchema = z.object({
  hotelId: z.string().uuid("ID de hotel inválido"),
  fullName: z.string().trim().min(3, "El nombre completo es requerido"),
  email: z.string().email("Correo inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

export type HotelUserCreationInput = z.infer<typeof hotelUserCreationSchema>;

export const agencyCreationSchema = z.object({
  name: z.string().trim().min(2, "El nombre debe tener al menos 2 caracteres"),
  contactName: z.string().trim().optional().or(z.literal("")),
  email: z.string().email("Debe ser un email válido").optional().or(z.literal("")),
  phone: z.string().trim().optional().or(z.literal("")),
  commissionValue: z.coerce.number().min(0, "La comisión no puede ser negativa").max(100, "La comisión máxima es 100%"),
  discountValue: z.coerce.number().min(0, "El descuento no puede ser negativo").max(100, "El descuento máximo es 100%"),
});

export type AgencyCreationInput = z.infer<typeof agencyCreationSchema>;

export const updateAgencySchema = agencyCreationSchema.extend({
  isActive: z.boolean().optional(),
});

export type AgencyUpdateInput = z.infer<typeof updateAgencySchema>;

export const agencyUserCreationSchema = z.object({
  agencyId: z.string().uuid("ID de agencia inválido"),
  fullName: z.string().trim().min(3, "El nombre completo es requerido"),
  email: z.string().email("Correo inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

export type AgencyUserCreationInput = z.infer<typeof agencyUserCreationSchema>;
