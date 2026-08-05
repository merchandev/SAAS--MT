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

export default function CampaignComposerClient({ 
  initialData, 
  segments = [], 
  lists = [], 
  templates = [] 
}: { 
  initialData?: any;
  segments?: any[];
  lists?: any[];
  templates?: any[];
}) {
  const router = useRouter();
  const [draftId, setDraftId] = useState<string | null>(initialData?.id || null);
  const [name, setName] = useState(initialData?.name || "");
  const [subject, setSubject] = useState(initialData?.subject || "");
  const [body, setBody] = useState(initialData?.body || "");
  const [contactPhone, setContactPhone] = useState(initialData?.contactPhone || "+34 662 02 41 36");
  const [sendingRate, setSendingRate] = useState<number>(initialData?.sendingRate || 490);
  const [maxDailySends, setMaxDailySends] = useState<number>(initialData?.maxDailySends || 5000);
  const [sendFromHour, setSendFromHour] = useState(initialData?.sendFromHour || "");
  const [sendToHour, setSendToHour] = useState(initialData?.sendToHour || "");

  // Audience
  const [audienceType, setAudienceType] = useState<"segment" | "list" | "raw">(
    initialData?.marketingSegmentId ? "segment" :
    initialData?.marketingListId ? "list" : "raw"
  );
  const [segmentId, setSegmentId] = useState(initialData?.marketingSegmentId || "");
  const [listId, setListId] = useState(initialData?.marketingListId || "");
  const [recipientsRaw, setRecipientsRaw] = useState(initialData?.recipientsRaw || "");

  // Template
  const [templateId, setTemplateId] = useState(initialData?.emailTemplateId || "");

  const [editorMode, setEditorMode] = useState<"visual" | "html">("visual");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewHtml, setPreviewHtml] = useState<string | null>(null);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);

  const [isSending, setIsSending] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const handleTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setTemplateId(id);
    if (id) {
      const template = templates.find((t) => t.id === id);
      if (template) {
        setSubject(template.subject);
        setBody(template.html);
      }
    }
  };

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

  const getPayload = () => {
    const recipients = recipientsRaw
      .split(",")
      .map((e: string) => e.trim())
      .filter((e: string) => e.includes("@"));

    return {
      name,
      subject,
      body,
      recipients: audienceType === "raw" ? recipients : null,
      marketingSegmentId: audienceType === "segment" ? segmentId : null,
      marketingListId: audienceType === "list" ? listId : null,
      emailTemplateId: templateId || null,
      contactPhone,
      sendingRate,
      maxDailySends,
      sendFromHour,
      sendToHour,
    };
  };

  const handleSaveDraft = async () => {
    setIsSaving(true);
    setMessage(null);
    try {
      const payload = getPayload();
      const res = await fetch("/api/admin/emails/campaigns/draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: draftId, ...payload }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setMessage({ text: data.error || "Error al guardar el borrador", type: "error" });
      } else {
        setMessage({ text: "Borrador guardado exitosamente", type: "success" });
        if (data.id && data.id !== draftId) {
          setDraftId(data.id);
          window.history.replaceState(null, "", `/admin/email-marketing/campaigns/new?draftId=${data.id}`);
        }
      }
    } catch (err) {
      setMessage({ text: "Error de conexión", type: "error" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSend = async () => {
    if (!name || !subject || !body) {
      setMessage({ text: "Los campos de nombre, asunto y cuerpo son obligatorios", type: "error" });
      return;
    }

    if (audienceType === "raw" && !recipientsRaw) {
      setMessage({ text: "Ingresa al menos un destinatario", type: "error" });
      return;
    }

    if (audienceType === "segment" && !segmentId) {
      setMessage({ text: "Selecciona un segmento", type: "error" });
      return;
    }

    if (audienceType === "list" && !listId) {
      setMessage({ text: "Selecciona una lista", type: "error" });
      return;
    }

    if (!confirm("¿Estás seguro de iniciar la materialización y envío de esta campaña?")) {
      return;
    }

    setIsSending(true);
    setMessage(null);

    try {
      const payload = getPayload();
      const res = await fetch("/api/admin/emails/campaigns/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      
      const data = await res.json();
      
      if (!res.ok || data.error) {
        setMessage({ text: data.error || "Error al enviar la campaña", type: "error" });
      } else {
        setMessage({ text: "Campaña encolada para envío", type: "success" });
        router.push("/admin/email-marketing/campaigns");
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{draftId ? "Editar Borrador" : "Nueva Campaña"}</h1>
          <p className="text-sm text-gray-500 mt-1">
            Configura la audiencia, el diseño y programa el envío de tu campaña.
          </p>
        </div>
        <Button onClick={handlePreview} variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50 w-full sm:w-auto">
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
        <h2 className="text-lg font-semibold border-b pb-2">1. Configuración Básica</h2>
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
          <div className="space-y-2">
            <Label htmlFor="sendingRate">Correos por Hora (Tasa de Envío)</Label>
            <Input
              id="sendingRate"
              type="number"
              min="1"
              max="5000"
              value={sendingRate}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                if (!isNaN(val) && val > 0) {
                  setSendingRate(val);
                } else if (e.target.value === "") {
                  setSendingRate("" as any);
                }
              }}
              placeholder="Ej: 490"
            />
            <p className="text-xs text-gray-500">
              Controla la velocidad a la que se envían los correos. Un valor más bajo protege tu reputación.
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="maxDailySends">Límite Máximo de Envíos Diarios</Label>
            <Input
              id="maxDailySends"
              type="number"
              min="1"
              max="5000"
              value={maxDailySends}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                if (!isNaN(val) && val <= 5000) {
                  setMaxDailySends(val);
                } else if (e.target.value === "") {
                  setMaxDailySends("" as any);
                }
              }}
              placeholder="Ej: 5000"
            />
            <p className="text-xs text-gray-500">
              Límite máximo diario permitido: 5000. Si la audiencia es mayor, los envíos se repartirán en los siguientes días.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
        <h2 className="text-lg font-semibold border-b pb-2">2. Audiencia</h2>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0">
            <label className="flex items-center space-x-2">
              <input type="radio" checked={audienceType === "segment"} onChange={() => setAudienceType("segment")} />
              <span>Segmento Dinámico</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="radio" checked={audienceType === "list"} onChange={() => setAudienceType("list")} />
              <span>Lista Estática</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="radio" checked={audienceType === "raw"} onChange={() => setAudienceType("raw")} />
              <span>Pegar Correos</span>
            </label>
          </div>

          {audienceType === "segment" && (
            <div className="space-y-2 max-w-3xl">
              <Label className="text-base">Selecciona un Segmento</Label>
              <select 
                className="w-full border-gray-300 rounded-md shadow-sm h-11 px-4 bg-gray-50 focus:bg-white transition-colors focus:ring-blue-500 focus:border-blue-500"
                value={segmentId}
                onChange={(e) => setSegmentId(e.target.value)}
              >
                <option value="">-- Seleccionar Segmento --</option>
                {segments.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
          )}

          {audienceType === "list" && (
            <div className="space-y-2 max-w-3xl">
              <Label className="text-base">Selecciona una Lista</Label>
              <select 
                className="w-full border-gray-300 rounded-md shadow-sm h-11 px-4 bg-gray-50 focus:bg-white transition-colors focus:ring-blue-500 focus:border-blue-500"
                value={listId}
                onChange={(e) => setListId(e.target.value)}
              >
                <option value="">-- Seleccionar Lista --</option>
                {lists.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
              </select>
            </div>
          )}

          {audienceType === "raw" && (
            <div className="space-y-2">
              <Label className="text-base">Destinatarios (Separados por coma)</Label>
              <Textarea
                value={recipientsRaw}
                onChange={(e) => setRecipientsRaw(e.target.value)}
                placeholder="cliente1@gmail.com, cliente2@hotmail.com"
                rows={3}
                className="bg-gray-50 focus:bg-white transition-colors"
              />
            </div>
          )}
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
        <h2 className="text-lg font-semibold border-b pb-2">3. Diseño y Contenido</h2>
        
        <div className="space-y-2 max-w-3xl">
          <Label className="text-base">Usar una Plantilla (Opcional)</Label>
          <select 
            className="w-full border-gray-300 rounded-md shadow-sm h-11 px-4 bg-gray-50 focus:bg-white transition-colors focus:ring-blue-500 focus:border-blue-500"
            value={templateId}
            onChange={handleTemplateChange}
          >
            <option value="">-- Sin Plantilla --</option>
            {templates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <Label>Cuerpo del correo</Label>
            <div className="flex bg-gray-100 p-1 rounded-md self-start sm:self-auto">
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
          <p className="text-xs text-gray-500 mt-2">
            Puedes usar las siguientes variables: {'{{firstName}}'}, {'{{lastName}}'}, {'{{email}}'}, {'{{phone}}'}, {'{{country}}'}
          </p>
        </div>
      </div>

      <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-4 pt-4">
        <Link href="/admin/email-marketing/campaigns" className="w-full sm:w-auto">
          <Button variant="ghost" className="w-full sm:w-auto justify-center">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Cancelar
          </Button>
        </Link>
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <Button onClick={handleSaveDraft} disabled={isSaving || isSending} variant="outline" className="w-full sm:w-auto justify-center">
            {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
            Guardar Borrador
          </Button>
          <Button onClick={handleSend} disabled={isSending || isSaving} className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto justify-center">
            {isSending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
            Materializar y Enviar
          </Button>
        </div>
      </div>

      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="sm:max-w-4xl w-[95vw] h-[90vh] flex flex-col p-0 overflow-hidden mx-auto rounded-lg">
          <DialogHeader className="p-4 border-b bg-gray-50/80 backdrop-blur-sm sticky top-0 z-10">
            <DialogTitle>Previsualización del Correo</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-hidden bg-gray-100 flex items-center justify-center p-2 sm:p-4">
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
