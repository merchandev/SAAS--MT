import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileText, Plus, Edit } from "lucide-react";

export default async function AdminPagesList() {
  const pages = await prisma.routePage.findMany({
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <FileText className="h-6 w-6 text-[#D4AF37]" />
            Páginas y Rutas SEO
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Gestiona las páginas de aterrizaje dinámicas para las diferentes rutas de traslados.
          </p>
        </div>
        <Link href="/admin/pages/new">
          <Button className="bg-[#D4AF37] hover:bg-[#b5952f] text-white">
            <Plus className="mr-2 h-4 w-4" />
            Nueva Página
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-600 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 font-medium">Título (H1)</th>
              <th className="px-6 py-4 font-medium">Slug / URL</th>
              <th className="px-6 py-4 font-medium">Estado</th>
              <th className="px-6 py-4 font-medium">Última modificación</th>
              <th className="px-6 py-4 font-medium text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {pages.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  No hay páginas creadas todavía.
                </td>
              </tr>
            ) : (
              pages.map((page) => (
                <tr key={page.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {page.h1Title}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    /rutas/{page.slug}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      page.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                    }`}>
                      {page.isActive ? "Activo" : "Borrador"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {new Date(page.updatedAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/admin/pages/${page.id}/edit`}>
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
