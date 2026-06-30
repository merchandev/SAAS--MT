import { settingsQueries } from "@/modules/settings/settings.queries";
import { GenerateImageButton } from "@/components/admin/GenerateImageButton";
import { SettingsForm } from "./SettingsForm";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const settings = await settingsQueries.getAllSettings();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold tracking-tight">Configuración global</h3>
        <p className="text-gray-500">Ajustes generales de la plataforma, SEO, marca y reglas del motor de reservas.</p>
      </div>

      <SettingsForm initialData={settings} />
      <GenerateImageButton />
    </div>
  );
}
