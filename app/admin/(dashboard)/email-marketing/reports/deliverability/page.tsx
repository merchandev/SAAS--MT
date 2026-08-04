import { requireRole } from "@/modules/auth/permissions";
import { ShieldCheck, MailWarning } from "lucide-react";

export const metadata = {
  title: "Entregabilidad | Email Marketing",
};

export const dynamic = "force-dynamic";

export default async function ReportsDeliverabilityPage() {
  await requireRole(["SUPER_ADMIN", "ADMIN"]);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Métricas de Entregabilidad</h1>
          <p className="text-gray-500 mt-1">
            Supervisa la reputación de tu dominio y las tasas de rebote (bounces/spam)
          </p>
        </div>
      </div>

      <div className="bg-white p-12 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center justify-center text-center">
        <div className="bg-green-50 p-4 rounded-full mb-4">
          <ShieldCheck className="w-12 h-12 text-green-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Módulo Analítico en Desarrollo</h2>
        <p className="text-gray-500 mt-2 max-w-md">
          Próximamente agregaremos información detallada sobre rebotes duros, rebotes suaves 
          y reportes de quejas por spam (FBL).
        </p>
      </div>
    </div>
  );
}
