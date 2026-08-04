import { requireRole } from "@/modules/auth/permissions";
import { Users, LineChart } from "lucide-react";

export const metadata = {
  title: "Crecimiento de Audiencia | Email Marketing",
};

export const dynamic = "force-dynamic";

export default async function ReportsAudiencePage() {
  await requireRole(["SUPER_ADMIN", "ADMIN"]);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Crecimiento de Audiencia</h1>
          <p className="text-gray-500 mt-1">
            Visualiza cómo crece tu base de suscriptores a lo largo del tiempo
          </p>
        </div>
      </div>

      <div className="bg-white p-12 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center justify-center text-center">
        <div className="bg-purple-50 p-4 rounded-full mb-4">
          <LineChart className="w-12 h-12 text-purple-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Módulo Analítico en Desarrollo</h2>
        <p className="text-gray-500 mt-2 max-w-md">
          Próximamente agregaremos gráficos de tendencias mostrando nuevos suscriptores,
          tasas de retención y orígenes de captación.
        </p>
      </div>
    </div>
  );
}
