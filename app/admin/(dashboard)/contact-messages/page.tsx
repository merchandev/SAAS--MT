import { prisma } from "@/lib/prisma";
import { MessageSquare, Mail, Phone, Calendar } from "lucide-react";

export const dynamic = "force-dynamic";

function statusBadge(status: string) {
  switch (status) {
    case "NEW": return "bg-blue-100 text-blue-800";
    case "READ": return "bg-gray-100 text-gray-800";
    case "REPLIED": return "bg-green-100 text-green-800";
    default: return "bg-gray-100 text-gray-800";
  }
}

export default async function ContactMessagesPage() {
  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  });

  const newMessages = messages.filter((m) => m.status === "NEW").length;
  const totalMessages = messages.length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-2xl font-bold tracking-tight">Mensajes de Contacto</h3>
          <p className="text-gray-500">Gestión de consultas y solicitudes enviadas desde la web.</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
            <MessageSquare className="h-4 w-4 text-blue-600" />
            Total Mensajes
          </div>
          <p className="mt-2 text-3xl font-bold text-gray-900">{totalMessages}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
            <Mail className="h-4 w-4 text-amber-600" />
            Nuevos (Sin Leer)
          </div>
          <p className="mt-2 text-3xl font-bold text-gray-900">{newMessages}</p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Remitente</th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Asunto</th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Mensaje</th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Fecha</th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {messages.map((message) => (
              <tr key={message.id} className="hover:bg-gray-50/70">
                <td className="px-5 py-4">
                  <div className="font-semibold text-gray-900">{message.name}</div>
                  <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                    <Mail className="w-3 h-3" /> {message.email}
                  </div>
                  {message.phone && (
                    <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                      <Phone className="w-3 h-3" /> {message.phone}
                    </div>
                  )}
                </td>
                <td className="px-5 py-4 font-medium text-gray-800">
                  {message.subject || "Sin Asunto"}
                </td>
                <td className="px-5 py-4">
                  <p className="text-gray-600 line-clamp-2 max-w-xs" title={message.message}>
                    {message.message}
                  </p>
                </td>
                <td className="px-5 py-4 whitespace-nowrap text-gray-500 text-xs flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {message.createdAt.toLocaleDateString("es-ES", { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </td>
                <td className="px-5 py-4 whitespace-nowrap">
                  <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${statusBadge(message.status)}`}>
                    {message.status === "NEW" ? "Nuevo" : message.status === "READ" ? "Leído" : "Respondido"}
                  </span>
                </td>
              </tr>
            ))}
            {messages.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                  No hay mensajes de contacto todavía.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
