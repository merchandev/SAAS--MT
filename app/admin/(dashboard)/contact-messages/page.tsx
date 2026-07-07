import { prisma } from "@/lib/prisma";
import { MessageSquare, Mail } from "lucide-react";
import { ContactMessagesClient } from "@/components/admin/contact/ContactMessagesClient";

export const dynamic = "force-dynamic";



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

      <ContactMessagesClient initialMessages={messages} />
    </div>
  );
}
