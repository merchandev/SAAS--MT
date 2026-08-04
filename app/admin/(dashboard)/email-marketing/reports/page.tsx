import { prisma } from "@/lib/prisma";
import { requireRole } from "@/modules/auth/permissions";
import { BarChart, Users, Send, MousePointerClick, MailOpen } from "lucide-react";

export const metadata = {
  title: "Informes | Email Marketing",
};

export const dynamic = "force-dynamic";

export default async function ReportsDashboardPage() {
  await requireRole(["SUPER_ADMIN", "ADMIN"]);

  // Fetch some mock/real metrics
  const totalCampaigns = await prisma.emailCampaign.count();
  const totalContacts = await prisma.marketingContact.count();
  const activeContacts = await prisma.marketingContact.count({
    where: { hasConsent: true }
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Resumen de Informes</h1>
          <p className="text-gray-500 mt-1">
            Analítica general del rendimiento de tus campañas de email marketing
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center text-gray-500 mb-4">
            <Send className="w-5 h-5 mr-2" />
            <h3 className="font-medium">Campañas Enviadas</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">{totalCampaigns}</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center text-gray-500 mb-4">
            <Users className="w-5 h-5 mr-2" />
            <h3 className="font-medium">Total Contactos</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">{totalContacts}</p>
          <p className="text-sm text-green-600 mt-2">{activeContacts} activos con consentimiento</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center text-gray-500 mb-4">
            <MailOpen className="w-5 h-5 mr-2" />
            <h3 className="font-medium">Tasa de Apertura Media</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">--%</p>
          <p className="text-sm text-gray-400 mt-2">Datos insuficientes</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center text-gray-500 mb-4">
            <MousePointerClick className="w-5 h-5 mr-2" />
            <h3 className="font-medium">Tasa de Clic Media</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">--%</p>
          <p className="text-sm text-gray-400 mt-2">Datos insuficientes</p>
        </div>
      </div>

      <div className="bg-white p-12 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center justify-center text-center">
        <BarChart className="w-16 h-16 text-gray-300 mb-4" />
        <h2 className="text-xl font-bold text-gray-900">Más gráficos en camino</h2>
        <p className="text-gray-500 mt-2 max-w-md">
          Próximamente agregaremos gráficos detallados sobre la evolución de las aperturas, 
          clics y la entregabilidad de tus campañas.
        </p>
      </div>
    </div>
  );
}
