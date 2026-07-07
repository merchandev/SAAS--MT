"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { UploadCloud, CheckCircle2, FileWarning, ArrowLeft, Loader2 } from "lucide-react";

export default function ImportRoutesPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string; count?: number } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setResult(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/admin/import-routes", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setResult({
          success: true,
          message: data.message || "Importación completada con éxito.",
          count: data.importedCount,
        });
      } else {
        setResult({
          success: false,
          message: data.error || "Ocurrió un error al importar el archivo.",
        });
      }
    } catch (error) {
      console.error(error);
      setResult({
        success: false,
        message: "Error de red al comunicarse con el servidor.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href="/admin/pages">
          <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-900">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Importar Rutas desde XML
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Sube el archivo XML con las rutas SEO para añadirlas o actualizarlas en la base de datos.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        {!result?.success ? (
          <div className="max-w-md mx-auto space-y-6">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 hover:bg-gray-50 transition-colors cursor-pointer relative">
              <input
                type="file"
                accept=".xml"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                title="Selecciona un archivo XML"
              />
              <div className="flex flex-col items-center gap-3">
                <UploadCloud className="h-10 w-10 text-gray-400" />
                <div className="text-sm font-medium text-gray-900">
                  {file ? file.name : "Haz clic o arrastra tu archivo XML aquí"}
                </div>
                <div className="text-xs text-gray-500">
                  Solo se permiten archivos .xml
                </div>
              </div>
            </div>

            <Button
              onClick={handleUpload}
              disabled={!file || isUploading}
              className="w-full bg-[#D4AF37] hover:bg-[#b5952f] text-white"
              size="lg"
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Procesando XML...
                </>
              ) : (
                "Importar Archivo"
              )}
            </Button>

            {result && !result.success && (
              <div className="p-4 bg-red-50 text-red-800 rounded-lg flex items-start gap-3 text-sm text-left">
                <FileWarning className="h-5 w-5 shrink-0 text-red-500 mt-0.5" />
                <p>{result.message}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="py-12 flex flex-col items-center gap-4 animate-in fade-in zoom-in duration-300">
            <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">¡Importación Exitosa!</h3>
            <p className="text-gray-600 max-w-sm">
              Se han procesado e importado <strong className="text-gray-900">{result.count}</strong> rutas correctamente. 
              Puedes encontrarlas en estado "Borrador" en tu lista de páginas.
            </p>
            <div className="mt-6 flex gap-4">
              <Button
                variant="outline"
                onClick={() => {
                  setFile(null);
                  setResult(null);
                }}
              >
                Subir otro archivo
              </Button>
              <Link href="/admin/pages">
                <Button className="bg-[#D4AF37] hover:bg-[#b5952f] text-white">
                  Ver Rutas Importadas
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
