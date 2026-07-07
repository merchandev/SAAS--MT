"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Edit, Eye, Trash2, CheckCircle2, XCircle } from "lucide-react";
import { deleteBulkPosts, updateBulkPostsStatus } from "@/app/admin/(dashboard)/posts/bulk-actions";

type Post = {
  id: string;
  title: string;
  slug: string;
  isActive: boolean;
  createdAt: Date;
};

export default function PostsDataTable({ initialPosts }: { initialPosts: Post[] }) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isProcessing, setIsProcessing] = useState(false);

  const toggleAll = () => {
    if (selectedIds.size === initialPosts.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(initialPosts.map((p) => p.id)));
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
    if (!confirm(`¿Estás seguro de que quieres eliminar ${selectedIds.size} entradas?`)) return;
    setIsProcessing(true);
    const res = await deleteBulkPosts(Array.from(selectedIds));
    if (res.success) {
      setSelectedIds(new Set());
    } else {
      alert(res.error);
    }
    setIsProcessing(false);
  };

  const handleBulkStatus = async (isActive: boolean) => {
    setIsProcessing(true);
    const res = await updateBulkPostsStatus(Array.from(selectedIds), isActive);
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
              Publicar
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={isProcessing}
              onClick={() => handleBulkStatus(false)}
              className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
            >
              <XCircle className="h-4 w-4 mr-2" />
              Borrador
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
                  checked={selectedIds.size === initialPosts.length && initialPosts.length > 0}
                  onChange={toggleAll}
                />
              </th>
              <th className="px-6 py-4 font-medium">Título</th>
              <th className="px-6 py-4 font-medium">Slug</th>
              <th className="px-6 py-4 font-medium">Estado</th>
              <th className="px-6 py-4 font-medium">Fecha creación</th>
              <th className="px-6 py-4 font-medium text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {initialPosts.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  No hay entradas publicadas todavía.
                </td>
              </tr>
            ) : (
              initialPosts.map((post) => (
                <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-[#D4AF37] focus:ring-[#D4AF37]"
                      checked={selectedIds.has(post.id)}
                      onChange={() => toggleOne(post.id)}
                    />
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">{post.title}</td>
                  <td className="px-6 py-4 text-gray-600">/blog/{post.slug}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        post.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {post.isActive ? "Público" : "Borrador"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <Link href={`/en/blog/${post.slug}`} target="_blank">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-600 hover:text-blue-600"
                        title="Ver entrada"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Link href={`/admin/posts/${post.id}/edit`}>
                      <Button variant="ghost" size="sm" className="text-gray-600 hover:text-[#D4AF37]">
                        <Edit className="h-4 w-4 mr-2" />
                        Editar
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
