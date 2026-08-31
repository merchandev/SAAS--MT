import { prisma } from "@/lib/prisma";
import { SETTINGS_KEYS } from "./settings.schemas";
import { unstable_cache } from "next/cache";
import { getTenantId } from "@/modules/auth/tenant.service";

export const settingsQueries = {
  getAllSettings: unstable_cache(async () => {
    const settingsList = await prisma.systemSetting.findMany({ where: {
        companyId: await getTenantId() } });
    
    // Convert to key-value map
    const map: Record<string, string> = {};
    for (const s of settingsList) {
      map[s.key] = s.value;
    }

    // Default values if not found
    const defaults: Record<string, string> = {
      COMPANY_NAME: "Merchan.Dev SaaS",
      COMPANY_EMAIL: "admin@saas.merchan.dev",
      TAX_ID: "B12345678",
      SITE_NAME: "Merchan.Dev SaaS",
      SITE_TITLE: "Merchan.Dev SaaS | Traslados privados premium",
      SITE_META_DESCRIPTION: "Reserva traslados privados premium con chófer profesional para aeropuertos, hoteles, eventos y viajes corporativos en España.",
      SITE_LOGO_URL: "",
      SITE_FAVICON_URL: "",
      BRAND_PRIMARY_COLOR: "#003049",
      BRAND_ACCENT_COLOR: "#D4AF37",
      NIGHT_START_TIME: "22:00",
      NIGHT_END_TIME: "06:00",
      MIN_HOURS_AHEAD_BOOKING: "24",
    };

    return { ...defaults, ...map };
  }, ['all-settings'], { tags: ['settings'] }),

  async getSettingValue(key: typeof SETTINGS_KEYS[number], defaultValue: string) {
    const setting = await prisma.systemSetting.findUnique({
      where: {
          companyId_key: { companyId: await getTenantId(), key } }
    });
    return setting?.value ?? defaultValue;
  }
};
