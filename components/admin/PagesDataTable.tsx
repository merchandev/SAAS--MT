"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Edit, Eye, Trash2, CheckCircle2, XCircle } from "lucide-react";
import { deleteBulkPages, updateBulkPagesStatus } from "@/app/admin/(dashboard)/pages/bulk-actions";

type PageItem = {
  id: string;
  title: string;
  url: string;
  type: string;
  isActive: boolean;
  updatedAt: Date;
  editUrl: string;
};

export default function PagesDataTable({ initialPages }: { initialPages: PageItem[] }) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isProcessing, setIsProcessing] = useState(false);

  const toggleAll = () => {
    if (selectedIds.size === initialPages.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(initialPages.map((p) => p.id)));
    }
  };

  const toggleOne = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedIds(next);
  };

  const handleBulkDelete = async () => {
    if (!confirm(`¿Estás seguro de que quieres eliminar ${selectedIds.size} páginas?`)) return;
    setIsProcessing(true);
    const res = await deleteBulkPages(Array.from(selectedIds));
    if (res.success) {
      setSelectedIds(new Set());
    } else {
      alert(res.error);
    }
    setIsProcessing(false);
  };

  const handleBulkStatus = async (isActive: boolean) => {
    setIsProcessing(true);
    const res = await updateBulkPagesStatus(Array.from(selectedIds), isActive);
    if (res.success) {
      setSelectedIds(new Set());
    } else {
      alert(res.error);
    }
    setIsProcessing(false);
  };

  return (
    <div className="space-y-4">
      {/* Barra flotante de acciones masivas */}
      {selectedIds.size > 0 && (
        <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm flex items-center justify-between animate-in fade-in slide-in-from-top-4">
          <span className="text-sm font-medium text-gray-700">
            {selectedIds.size} seleccionadas
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={isProcessing}
              onClick={() => handleBulkStatus(true)}
              className="text-green-600 hover:text-green-700 hover:bg-green-50"
            >
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Activar
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={isProcessing}
              onClick={() => handleBulkStatus(false)}
              className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
            >
              <XCircle className="h-4 w-4 mr-2" />
              Desactivar (Borrador)
            </Button>
            <Button
              variant="destructive"
              size="sm"
              disabled={isProcessing}
              onClick={handleBulkDelete}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Eliminar
            </Button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-600 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 font-medium w-12">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-[#D4AF37] focus:ring-[#D4AF37]"
                  checked={selectedIds.size === initialPages.length && initialPages.length > 0}
                  onChange={toggleAll}
                />
              </th>
              <th className="px-6 py-4 font-medium">Título / Nombre</th>
              <th className="px-6 py-4 font-medium">URL</th>
              <th className="px-6 py-4 font-medium">Tipo</th>
              <th className="px-6 py-4 font-medium">Estado</th>
              <th className="px-6 py-4 font-medium">Última modificación</th>
              <th className="px-6 py-4 font-medium text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {initialPages.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                  No hay páginas creadas todavía.
                </td>
              </tr>
            ) : (
              initialPages.map((page) => (
                <tr key={page.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-[#D4AF37] focus:ring-[#D4AF37]"
                      checked={selectedIds.has(page.id)}
                      onChange={() => toggleOne(page.id)}
                    />
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">{page.title}</td>
                  <td className="px-6 py-4 text-gray-600">{page.url}</td>
                  <td className="px-6 py-4 text-gray-600">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        page.type === "Ruta de Traslado"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-purple-100 text-purple-800"
                      }`}
                    >
                      {page.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        page.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {page.isActive ? "Activo" : "Borrador"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {new Date(page.updatedAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <Link href={`/en${page.url}`} target="_blank">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-600 hover:text-blue-600"
                        title="Ver página"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Link href={page.editUrl}>
                      <Button variant="ghost" size="sm" className="text-gray-600 hover:text-[#D4AF37]">
                        <Edit className="h-4 w-4 mr-2" />
                        Editar SEO
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
