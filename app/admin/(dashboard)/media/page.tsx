"use client";

import { useState, useEffect } from "react";
import { Upload, Trash2, Copy, FileText, Image as ImageIcon, Video, CheckCircle2, Loader2, AlertCircle, RefreshCw, X, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface MediaFile {
  name: string;
  url: string;
  size: number;
  createdAt: string;
  type: "image" | "video" | "pdf" | "unknown";
}

export default function MediaPage() {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [trashFiles, setTrashFiles] = useState<MediaFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [activeTab, setActiveTab] = useState("active");
  const [selectedFile, setSelectedFile] = useState<MediaFile | null>(null);

  useEffect(() => {
    fetchFiles();
  }, [activeTab]);

  const fetchFiles = async () => {
    try {
      setIsLoading(true);
      const isTrash = activeTab === "trash";
      const res = await fetch(`/api/admin/media${isTrash ? "?status=trash" : ""}`);
      if (res.ok) {
        const data = await res.json();
        if (isTrash) setTrashFiles(data);
        else setFiles(data);
      }
    } catch (error) {
      alert("Error al cargar los archivos");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "video/mp4", "application/pdf"];
    if (!allowedTypes.includes(file.type)) {
      alert(`Tipo no permitido: ${file.type}. Solo png, jpeg, webp, mp4, pdf.`);
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      alert("El archivo es demasiado grande (máx 50MB)");
      return;
    }

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/media", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        if (activeTab === "active") {
          setFiles([data.file, ...files]);
        } else {
          setActiveTab("active");
        }
      } else {
        alert(data.error || "Error al subir");
      }
    } catch (error) {
      alert("Error interno al subir el archivo");
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const handleDelete = async (filename: string, isTrash: boolean) => {
    const msg = isTrash 
      ? `¿Seguro que deseas eliminar definitivamente ${filename}? Esta acción no se puede deshacer.`
      : `¿Mover ${filename} a la papelera?`;
      
    if (!confirm(msg)) return;

    try {
      const res = await fetch(`/api/admin/media/${filename}${isTrash ? "?status=trash&hard=true" : ""}`, {
        method: "DELETE",
      });

      if (res.ok) {
        if (isTrash) {
          setTrashFiles(trashFiles.filter(f => f.name !== filename));
        } else {
          setFiles(files.filter(f => f.name !== filename));
        }
      } else {
        const data = await res.json();
        alert(data.error || "Error al eliminar");
      }
    } catch (error) {
      alert("Error interno al eliminar");
    }
  };

  const handleRestore = async (filename: string) => {
    try {
      const res = await fetch(`/api/admin/media/${filename}?action=restore`, {
        method: "PATCH",
      });

      if (res.ok) {
        setTrashFiles(trashFiles.filter(f => f.name !== filename));
      } else {
        const data = await res.json();
        alert(data.error || "Error al restaurar");
      }
    } catch (error) {
      alert("Error interno al restaurar");
    }
  };

  const handleCopyUrl = (url: string) => {
    const fullUrl = `${window.location.origin}${url}`;
    navigator.clipboard.writeText(fullUrl);
    alert("URL copiada al portapapeles");
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const renderFileGrid = (items: MediaFile[], isTrash: boolean) => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      );
    }

    if (items.length === 0) {
      return (
        <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 text-gray-400 mb-4">
            {isTrash ? <Trash2 className="w-6 h-6" /> : <ImageIcon className="w-6 h-6" />}
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            {isTrash ? "La papelera está vacía" : "No hay archivos"}
          </h3>
          <p className="text-gray-500 text-sm">
            {isTrash ? "Los archivos eliminados aparecerán aquí." : "Sube tu primera imagen, vídeo o PDF para empezar."}
          </p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {items.map((file) => (
          <div key={file.name} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col">
            <div className="aspect-square bg-gray-100 relative border-b border-gray-100 flex items-center justify-center overflow-hidden cursor-pointer" onClick={() => setSelectedFile(file)}>
              {file.type === "image" ? (
                <img src={file.url} alt={file.name} className="w-full h-full object-cover" />
              ) : file.type === "video" ? (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gray-900 text-white">
                  <Video className="w-12 h-12 mb-2 opacity-80" />
                  <span className="text-xs font-medium uppercase tracking-wider opacity-80">MP4 Video</span>
                </div>
              ) : file.type === "pdf" ? (
                <div className="w-full h-full flex flex-col items-center justify-center bg-red-50 text-red-600">
                  <FileText className="w-12 h-12 mb-2" />
                  <span className="text-xs font-medium uppercase tracking-wider">PDF Document</span>
                </div>
              ) : (
                <div className="text-gray-400"><FileText className="w-12 h-12" /></div>
              )}
              
              {/* Hover Actions */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3" onClick={(e) => e.stopPropagation()}>
                <button 
                  onClick={() => setSelectedFile(file)}
                  className="p-2 bg-white text-gray-900 rounded-full hover:bg-gray-100 hover:scale-110 transition-all"
                  title="Ver archivo"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleCopyUrl(file.url)}
                  className="p-2 bg-white text-gray-900 rounded-full hover:bg-gray-100 hover:scale-110 transition-all"
                  title="Copiar URL"
                >
                  <Copy className="w-4 h-4" />
                </button>
                {isTrash ? (
                  <>
                    <button 
                      onClick={() => handleRestore(file.name)}
                      className="p-2 bg-green-600 text-white rounded-full hover:bg-green-700 hover:scale-110 transition-all"
                      title="Restaurar"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(file.name, true)}
                      className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 hover:scale-110 transition-all"
                      title="Eliminar permanentemente"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <button 
                    onClick={() => handleDelete(file.name, false)}
                    className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 hover:scale-110 transition-all"
                    title="Mover a papelera"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
            
            <div className="p-4 flex-1 flex flex-col">
              <p className="text-sm font-medium text-gray-900 truncate" title={file.name}>
                {file.name}
              </p>
              <div className="flex items-center justify-between mt-auto pt-2 text-xs text-gray-500">
                <span>{formatSize(file.size)}</span>
                <span>{format(new Date(file.createdAt), "d MMM yyyy", { locale: es })}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestor de Medios</h1>
          <p className="text-sm text-gray-500 mt-1">
            Sube y administra imágenes, vídeos y PDFs para usar en tus rutas y artículos.
          </p>
        </div>
        
        <div className="relative">
          <input
            type="file"
            id="file-upload"
            className="hidden"
            accept=".png,.jpg,.jpeg,.webp,.mp4,.pdf"
            onChange={handleFileUpload}
            disabled={isUploading}
          />
          <label 
            htmlFor="file-upload"
            className={`flex items-center gap-2 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors cursor-pointer shadow-sm ${isUploading ? 'opacity-70 pointer-events-none' : ''}`}
          >
            {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            {isUploading ? "Subiendo..." : "Subir Archivo"}
          </label>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex gap-3 text-sm text-blue-800">
        <AlertCircle className="w-5 h-5 shrink-0 text-blue-600" />
        <div>
          <p className="font-medium">Formatos permitidos:</p>
          <ul className="list-disc ml-5 mt-1 opacity-90">
            <li>Imágenes: PNG, JPEG, WEBP</li>
            <li>Vídeos: MP4 (máx 50MB)</li>
            <li>Documentos: PDF</li>
          </ul>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="active" className="flex items-center gap-2">
            <ImageIcon className="w-4 h-4" />
            Archivos Activos
          </TabsTrigger>
          <TabsTrigger value="trash" className="flex items-center gap-2">
            <Trash2 className="w-4 h-4" />
            Papelera
          </TabsTrigger>
        </TabsList>
        <TabsContent value="active">
          {renderFileGrid(files, false)}
        </TabsContent>
        <TabsContent value="trash">
          {renderFileGrid(trashFiles, true)}
        </TabsContent>
      </Tabs>

      {/* Lightbox Dialog */}
      <Dialog open={!!selectedFile} onOpenChange={(open) => !open && setSelectedFile(null)}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden bg-black border-gray-800">
          <DialogTitle className="sr-only">Previsualización de archivo</DialogTitle>
          <div className="relative w-full h-[70vh] flex items-center justify-center bg-black/95">
            {selectedFile?.type === 'image' && (
              <img src={selectedFile.url} alt={selectedFile.name} className="max-w-full max-h-full object-contain" />
            )}
            {selectedFile?.type === 'video' && (
              <video src={selectedFile.url} controls className="max-w-full max-h-full" />
            )}
            {selectedFile?.type === 'pdf' && (
              <iframe src={selectedFile.url} className="w-full h-full border-0 bg-white" />
            )}
          </div>
          <div className="p-4 bg-white flex flex-col sm:flex-row items-center gap-4 border-t">
            <div className="flex-1 w-full flex items-center gap-2">
              <Input 
                readOnly 
                value={selectedFile ? `${window.location.origin}${selectedFile.url}` : ''} 
                className="font-mono text-xs bg-gray-50"
              />
              <Button onClick={() => selectedFile && handleCopyUrl(selectedFile.url)} variant="secondary" className="shrink-0 flex items-center gap-2">
                <Copy className="w-4 h-4" /> Copiar Enlace
              </Button>
            </div>
            {selectedFile && (
              <div className="flex items-center gap-2 shrink-0">
                <Button 
                  variant="outline" 
                  onClick={() => window.open(selectedFile.url, '_blank')}
                >
                  Abrir en nueva pestaña
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
