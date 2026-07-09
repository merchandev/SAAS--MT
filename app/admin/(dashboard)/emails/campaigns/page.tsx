import { prisma } from "@/lib/prisma";
import { requireRole } from "@/modules/auth/permissions";
import Link from "next/link";
import { Plus, Send, CheckCircle2, XCircle, Users } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CampaignActionsDropdown } from "@/components/admin/campaign-actions-dropdown";

export const metadata = {
  title: "Campañas de Email | Admin",
};

export const dynamic = "force-dynamic";

export default async function CampaignsPage() {
  await requireRole(["SUPER_ADMIN", "ADMIN"]);

  const allCampaigns = await prisma.emailCampaign.findMany({
    orderBy: { createdAt: "desc" },
  });

  const activeCampaigns = allCampaigns.filter((c) => c.deletedAt === null);
  const trashedCampaigns = allCampaigns.filter((c) => c.deletedAt !== null);

  const renderTable = (campaignsList: typeof allCampaigns, isTrash = false) => (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      <table className="w-full text-sm text-left">
        <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-200">
          <tr>
            <th className="px-6 py-4">Nombre / Asunto</th>
            <th className="px-6 py-4">Destinatarios</th>
            <th className="px-6 py-4">Estadísticas</th>
            <th className="px-6 py-4">Estado</th>
            <th className="px-6 py-4">Fecha</th>
            <th className="px-6 py-4 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {campaignsList.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                {isTrash ? "La papelera está vacía." : "No hay campañas activas registradas."}
              </td>
            </tr>
          ) : (
            campaignsList.map((camp) => {
              const recipients = Array.isArray(camp.recipients) ? camp.recipients : [];
              return (
                <tr key={camp.id} className="hover:bg-gray-50/50">
                  <td className="px-6 py-4">
                    <Link href={`/admin/emails/campaigns/${camp.id}`} className="font-semibold text-blue-600 hover:text-blue-800 hover:underline">
                      {camp.name}
                    </Link>
                    <div className="text-gray-500 text-xs mt-1 truncate max-w-[250px]">
                      Asunto: {camp.subject}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-gray-600">
                      <Users className="h-4 w-4 mr-1.5 text-gray-400" />
                      {recipients.length} contactos
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-4 text-xs">
                      <span className="text-green-600 font-medium">✓ {camp.sentCount}</span>
                      <span className="text-red-600 font-medium">✗ {camp.failedCount}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {camp.status === "DRAFT" && (
                      <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                        Borrador
                      </span>
                    )}
                    {camp.status === "SENDING" && (
                      <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                        <Send className="h-3 w-3 mr-1 animate-pulse" />
                        Enviando...
                      </span>
                    )}
                    {camp.status === "COMPLETED" && (
                      <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Completada
                      </span>
                    )}
                    {camp.status === "FAILED" && (
                      <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                        <XCircle className="h-3 w-3 mr-1" />
                        Fallida
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-gray-500 text-xs whitespace-nowrap">
                    {camp.createdAt.toLocaleDateString("es-ES", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <CampaignActionsDropdown campaign={camp} />
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            Campañas de Correo
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Envía correos masivos a clientes o listas personalizadas usando el diseño corporativo.
          </p>
        </div>
        <Link
          href="/admin/emails/campaigns/new"
          className="inline-flex items-center justify-center rounded-md text-sm font-medium border border-transparent bg-gray-900 text-white shadow-sm hover:bg-gray-800 h-9 px-4 py-2 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nueva Campaña
        </Link>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="active">Activas ({activeCampaigns.length})</TabsTrigger>
          <TabsTrigger value="trash">Papelera ({trashedCampaigns.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          {renderTable(activeCampaigns, false)}
        </TabsContent>

        <TabsContent value="trash">
          {renderTable(trashedCampaigns, true)}
        </TabsContent>
      </Tabs>
    </div>
  );
}
