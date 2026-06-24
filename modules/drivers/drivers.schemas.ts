import { z } from "zod";

export const driverCreationSchema = z.object({
  email: z.string().email("Correo inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  fullName: z.string().min(3, "El nombre completo es requerido"),
  phone: z.string().min(5, "El teléfono es requerido"),
  licenseNumber: z.string().min(3, "La licencia es requerida"),
});

export type DriverCreationInput = z.infer<typeof driverCreationSchema>;
