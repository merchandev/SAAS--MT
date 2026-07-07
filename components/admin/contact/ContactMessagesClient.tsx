"use client";

import { useState } from "react";
import { updateMessageStatus, deleteMessagePermanently } from "@/app/admin/(dashboard)/contact-messages/actions";
import { Mail, Phone, Calendar, Archive, Trash2, RotateCcw, MessageSquare, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

type ContactMessage = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  status: string;
  createdAt: Date;
};

export function statusBadge(status: string) {
  switch (status) {
    case "NEW": return "bg-blue-100 text-blue-800";
    case "READ": return "bg-gray-100 text-gray-800";
    case "REPLIED": return "bg-green-100 text-green-800";
    case "ARCHIVED": return "bg-amber-100 text-amber-800";
    case "DELETED": return "bg-red-100 text-red-800";
    default: return "bg-gray-100 text-gray-800";
  }
}

export function ContactMessagesClient({ initialMessages }: { initialMessages: ContactMessage[] }) {
  const [tab, setTab] = useState<"INBOX" | "ARCHIVED" | "DELETED">("INBOX");
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filtrar mensajes según la pestaña actual
  const filteredMessages = initialMessages.filter((m) => {
    if (tab === "INBOX") return ["NEW", "READ", "REPLIED"].includes(m.status);
    if (tab === "ARCHIVED") return m.status === "ARCHIVED";
    if (tab === "DELETED") return m.status === "DELETED";
    return false;
  });

  const handleOpenMessage = async (msg: ContactMessage) => {
    setSelectedMessage(msg);
    setIsModalOpen(true);

    if (msg.status === "NEW") {
      await updateMessageStatus(msg.id, "READ");
    }
  };

  const handleArchive = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    await updateMessageStatus(id, "ARCHIVED");
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    await updateMessageStatus(id, "DELETED");
  };

  const handleRestore = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    await updateMessageStatus(id, "READ");
  };

  const handlePermanentDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm("¿Estás seguro de querer eliminar este mensaje para siempre?")) {
      await deleteMessagePermanently(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Pestañas personalizadas */}
      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setTab("INBOX")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${tab === "INBOX" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
        >
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            Bandeja de Entrada
          </div>
        </button>
        <button
          onClick={() => setTab("ARCHIVED")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${tab === "ARCHIVED" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
        >
          <div className="flex items-center gap-2">
            <Archive className="w-4 h-4" />
            Archivados
          </div>
        </button>
        <button
          onClick={() => setTab("DELETED")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${tab === "DELETED" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
        >
          <div className="flex items-center gap-2">
            <Trash2 className="w-4 h-4" />
            Papelera
          </div>
        </button>
      </div>

      {/* Tabla de mensajes */}
      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Remitente</th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Asunto</th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Mensaje</th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Fecha</th>
              <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {filteredMessages.map((message) => (
              <tr 
                key={message.id} 
                className={`cursor-pointer transition-colors ${message.status === "NEW" ? "bg-blue-50/50 hover:bg-blue-50" : "hover:bg-gray-50/70"}`}
                onClick={() => handleOpenMessage(message)}
              >
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
                  <div className="mt-1">
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${statusBadge(message.status)}`}>
                      {message.status === "NEW" ? "Nuevo" : message.status === "READ" ? "Leído" : message.status === "ARCHIVED" ? "Archivado" : message.status === "DELETED" ? "Eliminado" : "Respondido"}
                    </span>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <p className="text-gray-600 line-clamp-2 max-w-xs">
                    {message.message}
                  </p>
                </td>
                <td className="px-5 py-4 whitespace-nowrap text-gray-500 text-xs">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(message.createdAt).toLocaleDateString("es-ES", { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </div>
                </td>
                <td className="px-5 py-4 whitespace-nowrap text-right">
                  <div className="flex items-center justify-end gap-2">
                    {tab === "INBOX" && (
                      <>
                        <Button variant="outline" size="sm" className="h-8 w-8 p-0 text-gray-500 hover:text-blue-600" onClick={(e) => handleArchive(e, message.id)} title="Archivar">
                          <Archive className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="h-8 w-8 p-0 text-gray-500 hover:text-red-600" onClick={(e) => handleDelete(e, message.id)} title="Enviar a Papelera">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                    {tab === "ARCHIVED" && (
                      <>
                        <Button variant="outline" size="sm" className="h-8 w-8 p-0 text-gray-500 hover:text-green-600" onClick={(e) => handleRestore(e, message.id)} title="Restaurar a Bandeja de Entrada">
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="h-8 w-8 p-0 text-gray-500 hover:text-red-600" onClick={(e) => handleDelete(e, message.id)} title="Enviar a Papelera">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                    {tab === "DELETED" && (
                      <>
                        <Button variant="outline" size="sm" className="h-8 w-8 p-0 text-gray-500 hover:text-green-600" onClick={(e) => handleRestore(e, message.id)} title="Restaurar a Bandeja de Entrada">
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="h-8 w-8 p-0 text-red-500 hover:bg-red-50 hover:text-red-700" onClick={(e) => handlePermanentDelete(e, message.id)} title="Eliminar Definitivamente">
                          <Trash className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {filteredMessages.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                  {tab === "INBOX" ? "No tienes mensajes nuevos ni leídos en tu bandeja de entrada." : 
                   tab === "ARCHIVED" ? "No hay mensajes archivados." : 
                   "La papelera está vacía."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal para leer el mensaje completo */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-xl max-h-[85vh] overflow-y-auto">
          {selectedMessage && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl">{selectedMessage.subject || "Mensaje de Contacto"}</DialogTitle>
                <DialogDescription>
                  Enviado el {new Date(selectedMessage.createdAt).toLocaleString("es-ES")}
                </DialogDescription>
              </DialogHeader>
              
              <div className="py-4 space-y-6">
                <div className="flex flex-col gap-2 p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-700 w-20">De:</span>
                    <span className="text-gray-900">{selectedMessage.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-700 w-20">Email:</span>
                    <a href={`mailto:${selectedMessage.email}`} className="text-blue-600 hover:underline">{selectedMessage.email}</a>
                  </div>
                  {selectedMessage.phone && (
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-700 w-20">Teléfono:</span>
                      <a href={`tel:${selectedMessage.phone}`} className="text-blue-600 hover:underline">{selectedMessage.phone}</a>
                    </div>
                  )}
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-gray-500" />
                    Contenido del Mensaje
                  </h4>
                  <div className="p-4 bg-white border border-gray-200 rounded-lg whitespace-pre-wrap text-gray-700 leading-relaxed min-h-[150px]">
                    {selectedMessage.message}
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                <div className="flex gap-2">
                  {tab !== "ARCHIVED" && (
                    <Button variant="outline" onClick={(e) => { handleArchive(e as any, selectedMessage.id); setIsModalOpen(false); }}>
                      <Archive className="w-4 h-4 mr-2" /> Archivar
                    </Button>
                  )}
                  {tab !== "DELETED" && (
                    <Button variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={(e) => { handleDelete(e as any, selectedMessage.id); setIsModalOpen(false); }}>
                      <Trash2 className="w-4 h-4 mr-2" /> Eliminar
                    </Button>
                  )}
                </div>
                <Button onClick={() => setIsModalOpen(false)}>Cerrar</Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
