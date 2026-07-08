"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Save, ArrowLeft, Loader2, Send } from "lucide-react";
import Link from "next/link";
import { sendCampaignAction } from "./campaign.actions";
import { useRouter } from "next/navigation";

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

  
  const [isSending, setIsSending] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

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

    const res = await sendCampaignAction({
      name,
      subject,
      body,
      recipients,
    });

    setIsSending(false);
    if (res.error) {
      setMessage({ text: res.error, type: "error" });
    } else {
      setMessage({ text: "Campaña enviada / encolada exitosamente.", type: "success" });
      setTimeout(() => {
        router.push("/admin/emails/campaigns");
      }, 1500);
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
      </div>

      {message && (
        <div className={`p-4 rounded-md ${message.type === "error" ? "bg-red-50 text-red-800" : "bg-green-50 text-green-800"}`}>
          {message.text}
        </div>
      )}

      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
        
        <div className="space-y-2">
          <Label htmlFor="name">Nombre interno de la campaña</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej: Promo Verano 2026 (No visible para el cliente)"
          />
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
          <Label>Cuerpo del correo</Label>
          <div className="border rounded-md overflow-hidden bg-white">
            <ReactQuill
              theme="snow"
              value={body}
              onChange={setBody}
              modules={{ toolbar: toolbarOptions }}
              className="min-h-[400px]"
            />
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
    </div>
  );
}
