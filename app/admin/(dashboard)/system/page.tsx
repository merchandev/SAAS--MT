import { SystemCacheButton } from "./SystemCacheButton";
import { settingsQueries } from "@/modules/settings/settings.queries";
import { SettingsForm } from "./SettingsForm";

export const dynamic = "force-dynamic";

export default async function SystemPage() {
  const settings = await settingsQueries.getAllSettings();

  return (
    <div className="space-y-10 max-w-5xl">
      <div>
        <h3 className="text-2xl font-bold tracking-tight">Sistema y Ajustes</h3>
        <p className="text-gray-500">
          Configuración global de la plataforma, reglas del negocio y mantenimiento avanzado.
        </p>
      </div>

      <div className="space-y-6">
        <h4 className="text-xl font-semibold border-b pb-2">Mantenimiento</h4>
        <SystemCacheButton />
      </div>

      <div className="space-y-6">
        <h4 className="text-xl font-semibold border-b pb-2">Ajustes Generales</h4>
        <SettingsForm initialData={settings} />
      </div>
    </div>
  );
}
