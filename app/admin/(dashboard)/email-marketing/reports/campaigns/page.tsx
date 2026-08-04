import { requireRole } from "@/modules/auth/permissions";
import { Send, BarChart2 } from "lucide-react";

export const metadata = {
  title: "Informes de Campañas | Email Marketing",
};

export const dynamic = "force-dynamic";

export default async function ReportsCampaignsPage() {
  await requireRole(["SUPER_ADMIN", "ADMIN"]);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Rendimiento de Campañas</h1>
          <p className="text-gray-500 mt-1">
            Analiza en detalle las métricas de tus envíos
          </p>
        </div>
      </div>

      <div className="bg-white p-12 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center justify-center text-center">
        <div className="bg-blue-50 p-4 rounded-full mb-4">
          <BarChart2 className="w-12 h-12 text-blue-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Módulo Analítico en Desarrollo</h2>
        <p className="text-gray-500 mt-2 max-w-md">
          Próximamente podrás visualizar gráficos interactivos, comparar el rendimiento entre campañas
          y exportar tus informes.
        </p>
      </div>
    </div>
  );
}
