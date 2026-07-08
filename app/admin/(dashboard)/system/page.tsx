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
        <h4 className="text-xl font-semibold border-b pb-2">Mantenimiento y Registros</h4>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SystemCacheButton />
          
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm flex flex-col">
            <div className="flex items-start gap-4 flex-1">
              <div className="rounded-full bg-slate-100 p-3 text-slate-600">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mail"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900">Registro de Emails</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Historial de correos enviados por el sistema, auditoría de notificaciones a clientes y errores de entrega SMTP.
                </p>
              </div>
            </div>
            <div className="mt-6 flex">
              <a href="/admin/emails" className="inline-flex items-center justify-center rounded-md text-sm font-medium border border-gray-200 bg-white shadow-sm hover:bg-gray-50 hover:text-gray-900 h-10 px-4 py-2 transition-colors">
                Ver registro de correos
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h4 className="text-xl font-semibold border-b pb-2">Ajustes Generales</h4>
        <SettingsForm initialData={settings} />
      </div>
    </div>
  );
}
