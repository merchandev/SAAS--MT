import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FilePenLine, Plus, Edit, Eye } from "lucide-react";

export default async function AdminPostsList() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <FilePenLine className="h-6 w-6 text-[#D4AF37]" />
            Blog y Entradas
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Gestiona los artículos y noticias del blog corporativo.
          </p>
        </div>
        <Link href="/admin/posts/new">
          <Button className="bg-[#D4AF37] hover:bg-[#b5952f] text-white">
            <Plus className="mr-2 h-4 w-4" />
            Nueva Entrada
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-600 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 font-medium">Título</th>
              <th className="px-6 py-4 font-medium">Slug</th>
              <th className="px-6 py-4 font-medium">Estado</th>
              <th className="px-6 py-4 font-medium">Fecha creación</th>
              <th className="px-6 py-4 font-medium text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {posts.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  No hay entradas publicadas todavía.
                </td>
              </tr>
            ) : (
              posts.map((post) => (
                <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {post.title}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    /blog/{post.slug}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      post.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                    }`}>
                      {post.isActive ? "Público" : "Borrador"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <Link href={`/en/blog/${post.slug}`} target="_blank">
                      <Button variant="ghost" size="sm" className="text-gray-600 hover:text-blue-600" title="Ver entrada">
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
