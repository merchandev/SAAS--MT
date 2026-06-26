import { prisma } from "@/lib/prisma";
import { SETTINGS_KEYS } from "./settings.schemas";

export const settingsQueries = {
  async getAllSettings() {
    const settingsList = await prisma.systemSetting.findMany();
    
    // Convert to key-value map
    const map: Record<string, string> = {};
    for (const s of settingsList) {
      map[s.key] = s.value;
    }

    // Default values if not found
    const defaults: Record<string, string> = {
      COMPANY_NAME: "MeTransfers",
      COMPANY_EMAIL: "admin@metransfers.com",
      TAX_ID: "B12345678",
      SITE_NAME: "MeTransfers",
      SITE_TITLE: "MeTransfers | Traslados privados premium",
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
  },

  async getSettingValue(key: typeof SETTINGS_KEYS[number], defaultValue: string) {
    const setting = await prisma.systemSetting.findUnique({
      where: { key }
    });
    return setting?.value ?? defaultValue;
  }
};
