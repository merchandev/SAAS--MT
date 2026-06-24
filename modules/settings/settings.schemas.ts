import { z } from "zod";

export const SETTINGS_KEYS = [
  "COMPANY_NAME",
  "COMPANY_EMAIL",
  "TAX_ID", // NIF o CIF
  "NIGHT_START_TIME", // Ej: "22:00"
  "NIGHT_END_TIME",   // Ej: "06:00"
  "MIN_HOURS_AHEAD_BOOKING", // Horas de antelación para que un cliente pueda reservar online
] as const;

export type SettingKey = typeof SETTINGS_KEYS[number];

export const updateSettingsSchema = z.object({
  COMPANY_NAME: z.string().min(2, "El nombre de la empresa es obligatorio"),
  COMPANY_EMAIL: z.string().email("Debe ser un email válido"),
  TAX_ID: z.string().min(5, "El NIF/CIF es obligatorio"),
  NIGHT_START_TIME: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Formato HH:mm (ej 22:00)"),
  NIGHT_END_TIME: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Formato HH:mm (ej 06:00)"),
  MIN_HOURS_AHEAD_BOOKING: z.string().regex(/^\d+$/, "Debe ser un número entero"),
});

export type UpdateSettingsInput = z.infer<typeof updateSettingsSchema>;
