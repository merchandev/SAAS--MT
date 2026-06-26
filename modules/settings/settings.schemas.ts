import { z } from "zod";

export const SETTINGS_KEYS = [
  "COMPANY_NAME",
  "COMPANY_EMAIL",
  "TAX_ID",
  "SITE_NAME",
  "SITE_TITLE",
  "SITE_META_DESCRIPTION",
  "SITE_LOGO_URL",
  "SITE_FAVICON_URL",
  "BRAND_PRIMARY_COLOR",
  "BRAND_ACCENT_COLOR",
  "NIGHT_START_TIME",
  "NIGHT_END_TIME",
  "MIN_HOURS_AHEAD_BOOKING",
] as const;

export type SettingKey = typeof SETTINGS_KEYS[number];

const optionalAssetPath = z.string().trim().max(500, "La ruta no puede superar 500 caracteres").refine(
  (value) => value === "" || value.startsWith("/") || /^https?:\/\//i.test(value),
  "Debe ser una ruta local que empiece por / o una URL http(s)"
);

export const updateSettingsSchema = z.object({
  COMPANY_NAME: z.string().min(2, "El nombre de la empresa es obligatorio"),
  COMPANY_EMAIL: z.string().email("Debe ser un email válido"),
  TAX_ID: z.string().min(5, "El NIF/CIF es obligatorio"),
  SITE_NAME: z.string().min(2, "El nombre visible de la web es obligatorio").max(80),
  SITE_TITLE: z.string().min(5, "El título SEO es obligatorio").max(120),
  SITE_META_DESCRIPTION: z.string().min(20, "La metadescripción debe tener al menos 20 caracteres").max(180),
  SITE_LOGO_URL: optionalAssetPath,
  SITE_FAVICON_URL: optionalAssetPath,
  BRAND_PRIMARY_COLOR: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Debe ser un color hexadecimal válido"),
  BRAND_ACCENT_COLOR: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Debe ser un color hexadecimal válido"),
  NIGHT_START_TIME: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Formato HH:mm (ej. 22:00)"),
  NIGHT_END_TIME: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Formato HH:mm (ej. 06:00)"),
  MIN_HOURS_AHEAD_BOOKING: z.string().regex(/^\d+$/, "Debe ser un número entero"),
});

export type UpdateSettingsInput = z.infer<typeof updateSettingsSchema>;
