"use client";

import { useState } from "react";
import { Users, Download, XCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface LogItem {
  recipient: string;
  status: string;
  errorReason: string | null;
  sentAt: Date;
}

export default function CampaignLogTable({
  campaignId,
  recipients,
  logs,
}: {
  campaignId: string;
  recipients: string[];
  logs: LogItem[];
}) {
  const [selectedError, setSelectedError] = useState<{ recipient: string; reason: string } | null>(null);

  const handleExportCSV = () => {
    window.location.href = `/api/admin/emails/campaigns/${campaignId}/export`;
  };

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
          <h2 className="font-semibold text-gray-900 flex items-center">
            <Users className="w-4 h-4 mr-2 text-gray-500" />
            Registro de Envíos
            <span className="ml-3 bg-gray-200 text-gray-700 py-0.5 px-2 rounded-full text-xs font-semibold">
              {recipients.length} Destinatarios
            </span>
          </h2>
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center justify-center rounded-md text-xs font-medium border border-gray-200 bg-white text-gray-700 shadow-sm hover:bg-gray-50 h-8 px-3 transition-colors"
          >
            <Download className="h-3.5 w-3.5 mr-1.5" />
            Exportar CSV
          </button>
        </div>
        
        <div className="p-0 overflow-y-auto max-h-[600px] w-full">
          <table className="min-w-full divide-y divide-gray-200 text-sm text-left">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-3 font-medium text-gray-500">Destinatario</th>
                <th className="px-6 py-3 font-medium text-gray-500">Estado</th>
                <th className="px-6 py-3 font-medium text-gray-500">Hora</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {recipients.map((email: string, i: number) => {
                const log = logs.find((l) => l.recipient === email);
                
                return (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-gray-900 font-medium">
                      {email}
                    </td>
                    <td className="px-6 py-4">
                      {!log ? (
                        <span className="inline-flex items-center text-gray-500 text-xs">
                          <span className="w-2 h-2 rounded-full bg-gray-300 mr-1.5"></span>
                          Pendiente
                        </span>
                      ) : log.status === "SENT" ? (
                        <span className="inline-flex items-center text-green-700 text-xs">
                          <span className="w-2 h-2 rounded-full bg-green-500 mr-1.5"></span>
                          Enviado
                        </span>
                      ) : (
                        <div className="flex flex-col items-start">
                          <button 
                            onClick={() => setSelectedError({ recipient: email, reason: log.errorReason || "Error desconocido" })}
                            className="inline-flex items-center text-red-700 text-xs hover:underline cursor-pointer focus:outline-none"
                          >
                            <span className="w-2 h-2 rounded-full bg-red-500 mr-1.5"></span>
                            Rechazado (Ver Detalles)
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-xs whitespace-nowrap">
                      {log ? new Date(log.sentAt).toLocaleString("es-ES", { dateStyle: "short", timeStyle: "medium" }) : "-"}
                    </td>
                  </tr>
                );
              })}
              {recipients.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-gray-500">
                    No hay destinatarios registrados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={!!selectedError} onOpenChange={(open) => !open && setSelectedError(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <XCircle className="w-5 h-5" />
              Detalles del Error
            </DialogTitle>
            <DialogDescription>
              Error al enviar a: <strong>{selectedError?.recipient}</strong>
            </DialogDescription>
          </DialogHeader>
          <div className="bg-gray-50 p-4 rounded-md border border-gray-200 mt-2 max-h-[300px] overflow-y-auto">
            <pre className="text-xs text-gray-800 whitespace-pre-wrap font-mono">
              {selectedError?.reason}
            </pre>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
