"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save, Loader2 } from "lucide-react";

export default function StaticPageForm({ page }: { page: any }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: page.title || "",
    metaDescription: page.metaDescription || "",
    seoKeywords: page.seoKeywords || "",
    translations: page.translations || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`/api/admin/static-pages/${page.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Error al guardar");
      
      alert("SEO actualizado correctamente");
      router.refresh();
      router.push("/admin/pages");
    } catch (error) {
      alert("No se pudo guardar la información");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Título SEO</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Ej: Tours Privados en Barcelona | Transfers in Barcelona"
            required
            className="mt-1"
          />
          <p className="text-xs text-gray-500 mt-1">Este es el título que aparecerá en la pestaña del navegador y en los resultados de Google.</p>
        </div>

        <div>
          <Label htmlFor="metaDescription">Meta Descripción</Label>
          <textarea
            id="metaDescription"
            value={formData.metaDescription}
            onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
            placeholder="Breve descripción para los resultados de búsqueda..."
            rows={3}
            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1"
          />
          <p className="text-xs text-gray-500 mt-1">Se recomienda entre 120 y 155 caracteres. Es el texto que aparece debajo del título en Google.</p>
        </div>

        <div>
          <Label htmlFor="seoKeywords">Palabras Clave (SEO Keywords)</Label>
          <Input
            id="seoKeywords"
            value={formData.seoKeywords}
            onChange={(e) => setFormData({ ...formData, seoKeywords: e.target.value })}
            placeholder="ej: tours privados, excursiones barcelona, chofer"
            className="mt-1"
          />
          <p className="text-xs text-gray-500 mt-1">Opcional. Separadas por comas.</p>
        </div>

        <div>
          <Label htmlFor="translations">Traducciones (JSON SEO)</Label>
          <textarea
            id="translations"
            value={typeof formData.translations === 'string' ? formData.translations : JSON.stringify(formData.translations || {}, null, 2)}
            onChange={(e) => setFormData({ ...formData, translations: e.target.value })}
            placeholder={'{\n  "en": {\n    "title": "...",\n    "metaDescription": "..."\n  }\n}'}
            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm font-mono h-48 mt-1 placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
          <p className="text-xs text-gray-500 mt-1">
            Añade traducciones para "title", "metaDescription", "seoKeywords". Idiomas: en, fr, ca.
          </p>
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t">
        <Button type="submit" disabled={isLoading} className="bg-[#D4AF37] hover:bg-[#b5952f] text-white">
          {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
          Guardar Cambios
        </Button>
      </div>
    </form>
  );
}
