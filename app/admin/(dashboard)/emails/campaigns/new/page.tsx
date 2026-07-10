"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Save, ArrowLeft, Loader2, Send, Eye, Code, Type } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

const toolbarOptions = [
  [{ header: [1, 2, 3, false] }],
  ["bold", "italic", "underline", "strike"],
  [{ color: [] }, { background: [] }],
  [{ list: "ordered" }, { list: "bullet" }],
  ["link", "image"],
  ["clean"],
];

export default function CampaignComposerClient() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [recipientsRaw, setRecipientsRaw] = useState("");
  const [contactPhone, setContactPhone] = useState("+34 662 02 41 36");

  const [editorMode, setEditorMode] = useState<"visual" | "html">("visual");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewHtml, setPreviewHtml] = useState<string | null>(null);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);

  const [isSending, setIsSending] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const handlePreview = async () => {
    setIsPreviewLoading(true);
    setIsPreviewOpen(true);
    try {
      const res = await fetch("/api/admin/emails/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, body, contactPhone }),
      });
      const data = await res.json();
      if (data.success && data.html) {
        setPreviewHtml(data.html);
      } else {
        setPreviewHtml(`<p style="color:red;">Error al generar vista previa: ${data.error || 'Unknown'}</p>`);
      }
    } catch (err) {
      setPreviewHtml(`<p style="color:red;">Error de conexión.</p>`);
    }
    setIsPreviewLoading(false);
  };

  const handleSend = async () => {
    // Validate
    if (!name || !subject || !body || !recipientsRaw) {
      setMessage({ text: "Todos los campos son obligatorios", type: "error" });
      return;
    }

    const recipients = recipientsRaw
      .split(",")
      .map(e => e.trim())
      .filter(e => e.includes("@"));

    if (recipients.length === 0) {
      setMessage({ text: "No se encontraron correos válidos", type: "error" });
      return;
    }

    if (!confirm(`¿Estás seguro de enviar esta campaña a ${recipients.length} destinatarios?`)) {
      return;
    }

    setIsSending(true);
    setMessage(null);

    try {
      const res = await fetch("/api/admin/emails/campaigns/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          subject,
          body,
          recipients,
          contactPhone,
        }),
      });
      
      const data = await res.json();
      
      if (!res.ok || data.error) {
        setMessage({ text: data.error || "Error al enviar la campaña", type: "error" });
      } else {
        setMessage({ text: "Campaña iniciada", type: "success" });
        router.push("/admin/emails/campaigns");
        router.refresh();
      }
    } catch (err) {
      setMessage({ text: "Error de conexión", type: "error" });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Nueva Campaña</h1>
          <p className="text-sm text-gray-500 mt-1">
            Redacta y envía correos masivos usando el diseño corporativo.
          </p>
        </div>
        <Button onClick={handlePreview} variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50">
          <Eye className="h-4 w-4 mr-2" />
          Previsualizar Correo
        </Button>
      </div>

      {message && (
        <div className={`p-4 rounded-md ${message.type === "error" ? "bg-red-50 text-red-800" : "bg-green-50 text-green-800"}`}>
          {message.text}
        </div>
      )}

      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre interno de la campaña</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Promo Verano 2026"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contactPhone">Teléfono de contacto (Pie de correo)</Label>
            <Input
              id="contactPhone"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              placeholder="+34 662 02 41 36"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="subject">Asunto del correo</Label>
          <Input
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Ej: Oferta especial en tus traslados en Barcelona"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="recipients">Destinatarios (Separados por coma)</Label>
          <Textarea
            id="recipients"
            value={recipientsRaw}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setRecipientsRaw(e.target.value)}
            placeholder="cliente1@gmail.com, cliente2@hotmail.com"
            rows={3}
          />
          <p className="text-xs text-gray-500">
            Pega aquí la lista de correos de tus clientes. Los correos mal formados serán ignorados.
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Cuerpo del correo</Label>
            <div className="flex bg-gray-100 p-1 rounded-md">
              <button
                type="button"
                onClick={() => setEditorMode("visual")}
                className={`flex items-center px-3 py-1.5 text-xs font-medium rounded-sm transition-all ${
                  editorMode === "visual"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                <Type className="w-3 h-3 mr-1.5" /> Visual
              </button>
              <button
                type="button"
                onClick={() => setEditorMode("html")}
                className={`flex items-center px-3 py-1.5 text-xs font-medium rounded-sm transition-all ${
                  editorMode === "html"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                <Code className="w-3 h-3 mr-1.5" /> HTML Puro
              </button>
            </div>
          </div>

          <div className="border rounded-md overflow-hidden bg-white">
            {editorMode === "visual" ? (
              <ReactQuill
                theme="snow"
                value={body}
                onChange={setBody}
                modules={{ toolbar: toolbarOptions }}
                className="min-h-[400px]"
              />
            ) : (
              <Textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="min-h-[400px] font-mono text-sm border-0 focus-visible:ring-0 p-4 rounded-none"
                placeholder="Escribe o pega aquí tu código HTML..."
              />
            )}
          </div>
        </div>

      </div>

      <div className="flex items-center justify-between">
        <Link href="/admin/emails/campaigns">
          <Button variant="ghost">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Cancelar
          </Button>
        </Link>
        <Button onClick={handleSend} disabled={isSending} className="bg-blue-600 hover:bg-blue-700">
          {isSending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
          Enviar Campaña
        </Button>
      </div>

      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-4xl w-full h-[90vh] flex flex-col p-0 overflow-hidden">
          <DialogHeader className="p-4 border-b bg-gray-50/80 backdrop-blur-sm sticky top-0 z-10">
            <DialogTitle>Previsualización del Correo</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-hidden bg-gray-100 flex items-center justify-center p-4">
            {isPreviewLoading ? (
              <div className="flex flex-col items-center text-gray-500">
                <Loader2 className="h-8 w-8 animate-spin mb-4" />
                <p>Generando vista previa...</p>
              </div>
            ) : (
              <div className="w-full max-w-[600px] h-full bg-white shadow-xl rounded-md overflow-hidden border border-gray-200">
                <iframe
                  srcDoc={previewHtml || ""}
                  title="Preview"
                  className="w-full h-full border-0"
                />
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
