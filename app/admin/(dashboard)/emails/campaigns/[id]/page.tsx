import { prisma } from "@/lib/prisma";
import { requireRole } from "@/modules/auth/permissions";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Users, Send, CheckCircle2, XCircle, Calendar, AlertCircle, Pause } from "lucide-react";
import ResendButton from "./ResendButton";
import CampaignControls from "./CampaignControls";
import CampaignLogTable from "./CampaignLogTable";

export const metadata = {
  title: "Detalles de Campaña | Admin",
};

export const dynamic = "force-dynamic";

export default async function CampaignDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await requireRole(["SUPER_ADMIN", "ADMIN"]);

  const campaign = await prisma.emailCampaign.findUnique({
    where: { id },
  });

  if (!campaign) notFound();

  const logs = await prisma.notificationLog.findMany({
    where: { campaignId: id },
    orderBy: { sentAt: 'desc' }
  });

  const recipients = (Array.isArray(campaign.recipients) ? campaign.recipients : []) as string[];

  // Dynamic stats calculated from real logs
  const sentCount = logs.filter(l => l.status === "SENT").length;
  const failedCount = logs.filter(l => l.status === "FAILED").length;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/emails/campaigns"
          className="inline-flex items-center justify-center rounded-md text-sm font-medium border border-gray-200 bg-white text-gray-700 shadow-sm hover:bg-gray-50 h-9 px-4 py-2 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            Campaña: {campaign.name}
          </h1>
        </div>
      </div>

      <div className="space-y-6">
        
        {/* Superior: Detalles y HTML */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
              <h2 className="font-semibold text-gray-900">Información General</h2>
              <div className="flex gap-2">
                <CampaignControls campaignId={campaign.id} initialStatus={campaign.status} />
                <ResendButton campaignId={campaign.id} />
              </div>
            </div>
            <div className="p-6 space-y-4 text-sm flex-1">
              <div className="grid grid-cols-[120px_1fr] gap-4 border-b pb-4">
                <span className="text-gray-500 font-medium">Asunto:</span>
                <span className="text-gray-900 font-semibold">{campaign.subject}</span>
              </div>
              <div className="grid grid-cols-[120px_1fr] gap-4 border-b pb-4">
                <span className="text-gray-500 font-medium">Estado:</span>
                <span className="flex items-center gap-2">
                  {campaign.status === "DRAFT" && (
                    <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                      Borrador
                    </span>
                  )}
                  {campaign.status === "SENDING" && (
                    <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                      <Send className="h-3 w-3 mr-1 animate-pulse" /> Enviando...
                    </span>
                  )}
                  {campaign.status === "PAUSED" && (
                    <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                      <Pause className="h-3 w-3 mr-1" /> Pausada
                    </span>
                  )}
                  {campaign.status === "COMPLETED" && (
                    <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                      <CheckCircle2 className="h-3 w-3 mr-1" /> Completada
                    </span>
                  )}
                  {campaign.status === "FAILED" && (
                    <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                      <XCircle className="h-3 w-3 mr-1" /> Fallida
                    </span>
                  )}
                </span>
              </div>
              <div className="grid grid-cols-[120px_1fr] gap-4 border-b pb-4">
                <span className="text-gray-500 font-medium flex items-center">
                  <Calendar className="w-4 h-4 mr-2" /> Fecha:
                </span>
                <span className="text-gray-900">
                  {campaign.createdAt.toLocaleDateString("es-ES", {
                    day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit"
                  })}
                </span>
              </div>
              <div className="grid grid-cols-[120px_1fr] gap-4">
                <span className="text-gray-500 font-medium flex items-center">
                  <AlertCircle className="w-4 h-4 mr-2" /> Estadísticas:
                </span>
                <span className="text-gray-900 flex gap-4">
                  <span className="text-green-600 font-semibold">{sentCount} Enviados</span>
                  <span className="text-red-600 font-semibold">{failedCount} Fallidos</span>
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-[400px]">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
              <h2 className="font-semibold text-gray-900">Vista Previa del Contenido (HTML)</h2>
            </div>
            <div className="p-6 bg-gray-50 flex-1 overflow-auto">
              <div 
                className="bg-white p-8 rounded-lg shadow-sm border max-w-2xl mx-auto prose prose-sm"
                dangerouslySetInnerHTML={{ __html: campaign.content }} 
              />
            </div>
          </div>
        </div>

        {/* Inferior: Lista de Destinatarios y Logs */}
        <CampaignLogTable 
          campaignId={campaign.id} 
          recipients={recipients} 
          logs={logs} 
        />
      </div>
    </div>
  );
}
