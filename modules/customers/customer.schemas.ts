import { z } from "zod";

export const customerProfileSchema = z.object({
  fullName: z.string().trim().min(2, "Nombre requerido"),
  phone: z.string().trim().min(6, "Teléfono requerido"),
  country: z.string().trim().min(2, "País requerido"),
  preferredLanguage: z.enum(["es", "en", "de", "fr"]).default("es"),
});

export const customerReviewSchema = z.object({
  bookingId: z.string().uuid("Reserva inválida"),
  rating: z.coerce.number().int().min(1).max(5),
  comment: z.string().trim().max(1200).optional(),
});

export const customerSuggestionSchema = z.object({
  subject: z.string().trim().min(3, "Asunto requerido").max(120),
  message: z.string().trim().min(10, "Mensaje demasiado corto").max(2000),
});

export type CustomerProfileInput = z.infer<typeof customerProfileSchema>;
export type CustomerReviewInput = z.infer<typeof customerReviewSchema>;
export type CustomerSuggestionInput = z.infer<typeof customerSuggestionSchema>;
