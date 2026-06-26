import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Debe ser un correo electrónico válido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    fullName: z.string().trim().min(2, "El nombre debe tener al menos 2 caracteres"),
    email: z.string().email("Debe ser un correo electrónico válido"),
    phone: z.string().trim().min(6, "El teléfono es obligatorio"),
    country: z.string().trim().min(2, "El país es obligatorio"),
    preferredLanguage: z.enum(["es", "en", "de", "fr"]).default("es"),
    password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  })
  .strict();

export type RegisterInput = z.infer<typeof registerSchema>;
