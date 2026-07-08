"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Save, ArrowLeft, Loader2, Play } from "lucide-react";
import Link from "next/link";
import { saveTemplateAction, testTemplateAction } from "./template.actions";

// Dynamic import for React Quill to avoid SSR issues
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

const toolbarOptions = [
  [{ header: [1, 2, 3, false] }],
  ["bold", "italic", "underline", "strike"],
  [{ color: [] }, { background: [] }],
  [{ list: "ordered" }, { list: "bullet" }],
  ["link", "image"],
  ["clean"],
];

export function TemplateEditorClient({ initialData }: { initialData: any }) {
  const [subject, setSubject] = useState(initialData.subject);
  const [body, setBody] = useState(initialData.body || "");
  const [isActive, setIsActive] = useState(initialData.isActive);
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const handleSave = async () => {
    setIsSaving(true);
    setMessage(null);
    const res = await saveTemplateAction({
      name: initialData.name,
      subject,
      body,
      isActive,
    });
    setIsSaving(false);
    if (res.error) {
      setMessage({ text: res.error, type: "error" });
    } else {
      setMessage({ text: "Plantilla guardada correctamente.", type: "success" });
    }
  };

  const handleTest = async () => {
    setIsTesting(true);
    setMessage(null);
    const res = await testTemplateAction({
      name: initialData.name,
      subject,
      body,
    });
    setIsTesting(false);
    if (res.error) {
      setMessage({ text: res.error, type: "error" });
    } else {
      setMessage({ text: "Correo de prueba enviado a info@transfersinbarcelona.com", type: "success" });
    }
  };

  return (
    <div className="space-y-6">
      {message && (
        <div className={`p-4 rounded-md ${message.type === "error" ? "bg-red-50 text-red-800" : "bg-green-50 text-green-800"}`}>
          {message.text}
        </div>
      )}

      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Switch
              id="active-mode"
              checked={isActive}
              onCheckedChange={setIsActive}
            />
            <Label htmlFor="active-mode">
              {isActive ? "Plantilla Activa" : "Plantilla Inactiva (Usa React Email base)"}
            </Label>
          </div>
          <Button variant="outline" onClick={handleTest} disabled={isTesting || isSaving}>
            {isTesting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Play className="h-4 w-4 mr-2" />}
            Enviar Prueba
          </Button>
        </div>

        <div className="space-y-2">
          <Label htmlFor="subject">Asunto del correo</Label>
          <Input
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Ej: Reserva Confirmada #{{publicCode}}"
          />
        </div>

        <div className="space-y-2">
          <Label>Cuerpo del correo (Contenido)</Label>
          <div className="border rounded-md overflow-hidden bg-white">
            <ReactQuill
              theme="snow"
              value={body}
              onChange={setBody}
              modules={{ toolbar: toolbarOptions }}
              className="min-h-[400px]"
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Puedes pegar imágenes, usar enlaces y texto enriquecido. Todo este contenido irá dentro del diseño base con fondo corporativo.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Link href="/admin/emails/templates">
          <Button variant="ghost">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
        </Link>
        <Button onClick={handleSave} disabled={isSaving || isTesting}>
          {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
          Guardar Cambios
        </Button>
      </div>
    </div>
  );
}
