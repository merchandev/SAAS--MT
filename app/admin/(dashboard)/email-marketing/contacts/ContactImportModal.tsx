"use client";

import { useState } from "react";
import { UploadCloud, FileSpreadsheet, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";

interface ContactImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportSuccess: (count: number) => void;
  listId?: string; // If provided, contacts will be added to this list
}

export function ContactImportModal({ isOpen, onClose, onImportSuccess, listId }: ContactImportModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Por favor, selecciona un archivo Excel (.xlsx) o CSV.");
      return;
    }

    setIsUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);
    if (listId) {
      formData.append("listId", listId);
    }

    try {
      const res = await fetch("/api/admin/email-marketing/contacts/import", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Ocurrió un error al importar el archivo.");
      }

      onImportSuccess(data.importedCount);
      onClose();
      setFile(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Importar Contactos Masivamente</DialogTitle>
          <DialogDescription>
            Sube un archivo Excel (.xlsx) o .csv con tus contactos.
            <br />
            El archivo debe contener al menos una columna llamada <strong>Email</strong> o <strong>Correo</strong>.
          </DialogDescription>
        </DialogHeader>

        <div className="py-6">
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer relative">
            <input 
              type="file" 
              accept=".xlsx,.csv,.xls" 
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            
            <div className="flex flex-col items-center justify-center space-y-3">
              {file ? (
                <>
                  <FileSpreadsheet className="w-12 h-12 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{file.name}</p>
                    <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
                  </div>
                </>
              ) : (
                <>
                  <UploadCloud className="w-12 h-12 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Haz clic para buscar un archivo</p>
                    <p className="text-xs text-gray-500 mt-1">Soporta .xlsx y .csv</p>
                  </div>
                </>
              )}
            </div>
          </div>
          
          {error && (
            <div className="mt-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
              {error}
            </div>
          )}

          <div className="mt-4 bg-blue-50 p-4 rounded-lg border border-blue-100">
            <h4 className="text-sm font-semibold text-blue-900 mb-2">Columnas soportadas:</h4>
            <ul className="text-xs text-blue-800 list-disc list-inside space-y-1">
              <li><strong>Email</strong> (obligatorio)</li>
              <li><strong>Nombre</strong> (opcional)</li>
              <li><strong>Apellidos</strong> (opcional)</li>
              <li><strong>Telefono</strong> (opcional)</li>
              <li><strong>Pais</strong> (opcional)</li>
            </ul>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isUploading}>
            Cancelar
          </Button>
          <Button onClick={handleUpload} disabled={!file || isUploading} className="bg-blue-600 hover:bg-blue-700">
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Importando...
              </>
            ) : (
              "Comenzar Importación"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
