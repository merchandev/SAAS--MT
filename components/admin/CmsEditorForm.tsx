"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { SeoPreviewCard } from "./SeoPreviewCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save, ArrowLeft, Code } from "lucide-react";
import "react-quill-new/dist/quill.snow.css";

// Dynamic import for React-Quill to avoid SSR issues
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

export function CmsEditorForm({
  initialData,
  type,
  apiEndpoint
}: {
  initialData: any;
  type: "page" | "post";
  apiEndpoint: string;
}) {
  const router = useRouter();
  const [formData, setFormData] = useState(initialData || {});
  const [isSaving, setIsSaving] = useState(false);
  const [viewMode, setViewMode] = useState<"visual" | "html">("visual");

  const handleChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const res = await fetch(apiEndpoint, {
        method: formData.id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Error al guardar");
      
      alert("¡Guardado correctamente!");
      router.push(`/admin/${type}s`);
      router.refresh();
    } catch (error) {
      alert("Ocurrió un error al guardar");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  // Determine what fields to show based on type
  const isPage = type === "page";

  return (
    <div className="space-y-8 pb-12">
      {/* HEADER */}
      <div className="flex items-center justify-between sticky top-16 bg-gray-50 z-10 py-4 border-b border-gray-200">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">
            {formData.id ? "Editar" : "Crear"} {isPage ? "Página" : "Entrada"}
          </h1>
        </div>
        <Button onClick={handleSave} disabled={isSaving} className="bg-[#D4AF37] hover:bg-[#b5952f] text-white">
          <Save className="h-4 w-4 mr-2" />
          {isSaving ? "Guardando..." : "Guardar Cambios"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* MAIN EDITOR COLUMN */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
            
            {/* Título Principal */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {isPage ? "Título H1 (Encabezado principal)" : "Título de la Entrada"}
              </label>
              <Input 
                value={isPage ? (formData.h1Title || "") : (formData.title || "")}
                onChange={(e) => handleChange(isPage ? "h1Title" : "title", e.target.value)}
                placeholder="Ej. Traslado desde el aeropuerto de Barcelona"
                className="text-lg font-medium"
              />
            </div>

            {/* Configuración de Origen/Destino (Solo Páginas) */}
            {isPage && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Origen (Booking Form)</label>
                  <Input 
                    value={formData.originName || ""}
                    onChange={(e) => handleChange("originName", e.target.value)}
                    placeholder="Ej. Aeropuerto de Barcelona"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Destino (Booking Form)</label>
                  <Input 
                    value={formData.destinationName || ""}
                    onChange={(e) => handleChange("destinationName", e.target.value)}
                    placeholder="Ej. Sitges"
                  />
                </div>
              </div>
            )}

            {/* EDITOR DE TEXTO / HTML */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Contenido de la Página
                </label>
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button 
                    onClick={() => setViewMode("visual")}
                    className={`px-3 py-1 text-xs rounded-md transition-colors ${viewMode === "visual" ? "bg-white shadow-sm font-medium" : "text-gray-500 hover:text-gray-700"}`}
                  >
                    Visual
                  </button>
                  <button 
                    onClick={() => setViewMode("html")}
                    className={`px-3 py-1 text-xs rounded-md transition-colors flex items-center gap-1 ${viewMode === "html" ? "bg-white shadow-sm font-medium" : "text-gray-500 hover:text-gray-700"}`}
                  >
                    <Code className="h-3 w-3" /> HTML
                  </button>
                </div>
              </div>
              
              <div className="min-h-[400px] border border-gray-300 rounded-md overflow-hidden bg-white">
                {viewMode === "visual" ? (
                  <ReactQuill 
                    theme="snow" 
                    value={formData.contentHtml || ""} 
                    onChange={(val) => handleChange("contentHtml", val)}
                    className="h-[350px]"
                    modules={{
                      toolbar: [
                        [{ 'header': [2, 3, 4, false] }],
                        ['bold', 'italic', 'underline', 'strike'],
                        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                        ['link', 'image'],
                        ['clean']
                      ]
                    }}
                  />
                ) : (
                  <textarea 
                    value={formData.contentHtml || ""} 
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleChange("contentHtml", e.target.value)}
                    className="h-[400px] w-full p-4 font-mono text-sm border-0 rounded-none focus-visible:ring-0 focus:outline-none resize-none bg-gray-50"
                    placeholder="<p>Escribe tu código HTML aquí...</p>"
                  />
                )}
              </div>
            </div>

          </div>

          {/* YOAST SEO PANEL */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
            <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-3">Ajustes SEO (Estilo Yoast)</h2>
            
            <SeoPreviewCard 
              title={formData.seoTitle || formData.metaTitle || (isPage ? formData.h1Title : formData.title)}
              description={formData.metaDescription}
              slug={formData.slug}
            />

            <div className="space-y-4 pt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Título SEO</label>
                <Input 
                  value={isPage ? (formData.seoTitle || "") : (formData.metaTitle || "")}
                  onChange={(e) => handleChange(isPage ? "seoTitle" : "metaTitle", e.target.value)}
                  placeholder="Título optimizado para Google (Máx 60 caracteres)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Slug (URL)</label>
                <div className="flex items-center">
                  <span className="bg-gray-100 border border-r-0 border-gray-300 px-3 py-2 text-sm text-gray-500 rounded-l-md">
                    /{isPage ? "rutas" : "blog"}/
                  </span>
                  <Input 
                    value={formData.slug || ""}
                    onChange={(e) => handleChange("slug", e.target.value)}
                    placeholder="mi-ruta-optimizada"
                    className="rounded-l-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Meta Descripción</label>
                <textarea 
                  value={formData.metaDescription || ""}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleChange("metaDescription", e.target.value)}
                  placeholder="Resumen atractivo para Google (Máx 160 caracteres)"
                  className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 h-20"
                />
                <p className="text-xs text-gray-500 mt-1 text-right">
                  {formData.metaDescription?.length || 0} / 160 caracteres
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Keywords</label>
                <Input 
                  value={formData.seoKeywords || ""}
                  onChange={(e) => handleChange("seoKeywords", e.target.value)}
                  placeholder="traslado barcelona, chofer sitges, etc (separado por comas)"
                />
              </div>
            </div>
          </div>
        </div>

        {/* SIDEBAR COLUMN */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-medium text-gray-900 mb-4">Estado y Publicación</h3>
            
            <div className="flex items-center gap-2 mb-6">
              <input 
                type="checkbox" 
                id="isActive"
                checked={formData.isActive !== false}
                onChange={(e) => handleChange("isActive", e.target.checked)}
                className="rounded border-gray-300 text-[#D4AF37] focus:ring-[#D4AF37]"
              />
              <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                Público (Visible en la web)
              </label>
            </div>

            {isPage && (
              <div className="pt-4 border-t border-gray-100">
                <label className="block text-sm font-medium text-gray-700 mb-1">Precio Base Desde (€)</label>
                <Input 
                  type="number"
                  step="0.01"
                  value={formData.basePriceCache || ""}
                  onChange={(e) => handleChange("basePriceCache", parseFloat(e.target.value))}
                  placeholder="Ej. 85.00"
                />
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
