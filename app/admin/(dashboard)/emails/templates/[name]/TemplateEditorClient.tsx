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

export function TemplateEditorClient({ initialData, defaultBody }: { initialData: any, defaultBody?: string }) {
  const [subject, setSubject] = useState(initialData.subject);
  const [body, setBody] = useState(initialData.body || "");
  const [isActive, setIsActive] = useState(initialData.isActive);
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const handleRestoreDefault = () => {
    if (defaultBody && confirm("¿Estás seguro de que deseas sobreescribir el contenido actual con el diseño original predeterminado?")) {
      setBody(defaultBody);
    }
  };

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

      <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex items-center space-x-2">
          <Switch
            id="active-mode"
            checked={isActive}
            onCheckedChange={setIsActive}
          />
          <Label htmlFor="active-mode" className="font-semibold cursor-pointer">
            {isActive ? "Usar diseño personalizado (Activo)" : "Usar plantilla base del sistema (Inactivo)"}
          </Label>
        </div>
        <div className="flex space-x-4">
          <Button variant="outline" onClick={handleTest} disabled={isTesting || isSaving}>
            {isTesting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Play className="h-4 w-4 mr-2" />}
            Enviar Prueba
          </Button>
          <Button onClick={handleSave} disabled={isSaving || isTesting}>
            {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
            Guardar Cambios
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Editor (Left Column) */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
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
            <Label>Contenido del mensaje</Label>
            <div className="border rounded-md overflow-hidden bg-white">
              <ReactQuill
                theme="snow"
                value={body}
                onChange={(content, delta, source, editor) => {
                  // Only update state if the change was made by the user
                  // This prevents Quill from wiping out the state on initial mount
                  // when it parses and sanitizes the HTML.
                  if (source === 'user') {
                    setBody(content);
                  } else if (source === 'api' && body === '') {
                    // Sometimes on first load body is empty and Quill initializes it
                    setBody(content);
                  }
                }}
                modules={{ toolbar: toolbarOptions }}
                className="min-h-[450px]"
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Puedes usar variables: {'{{customerName}}, {{publicCode}}, {{serviceDate}}, {{serviceTime}}, {{originAddress}}, {{destinationAddress}}, {{totalPrice}}'}.
            </p>
            {defaultBody && (
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-4 text-xs text-gray-600" 
                onClick={handleRestoreDefault}
              >
                🔄 Restaurar diseño original
              </Button>
            )}
          </div>
        </div>

        {/* Live Preview (Right Column) */}
        <div className="bg-gray-100 p-6 rounded-xl border border-gray-200 shadow-inner flex flex-col items-center">
          <h3 className="w-full text-center text-sm font-semibold text-gray-500 mb-4 uppercase tracking-widest">
            Vista Previa del Correo
          </h3>
          
          {/* Simulated Email Wrapper */}
          <div className="w-full max-w-[600px] bg-white rounded-xl overflow-hidden shadow-lg" style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
            {/* Header */}
            <div className="bg-gradient-to-br from-[#0a0a0a] to-[#1a1a1a] p-8 text-center">
              <img 
                src="/images/MeTransfers-exp.png" 
                alt="Transfers in Barcelona"
                className="h-10 mx-auto object-contain"
              />
              <p className="text-[#888888] text-[12px] tracking-[2px] mt-2 uppercase">
                Traslados Privados de Lujo
              </p>
            </div>

            {/* Simulated Body */}
            <div className="p-8">
              <div 
                className="prose prose-sm max-w-none text-gray-700"
                dangerouslySetInnerHTML={{ __html: body || "<p class='text-gray-400 italic text-center'>Empieza a escribir para ver la vista previa...</p>" }} 
              />
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 p-6 text-center bg-gray-50">
              <p className="text-gray-500 text-sm">¿Necesitas modificar tu reserva?</p>
              <p className="text-[#D4AF37] text-sm mt-1">info@transfersinbarcelona.com · +34 662 02 41 36</p>
              <p className="text-gray-400 text-xs mt-4">© {new Date().getFullYear()} Transfers in Barcelona</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-start">
        <Link href="/admin/emails/templates">
          <Button variant="ghost">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a plantillas
          </Button>
        </Link>
      </div>
    </div>
  );
}
