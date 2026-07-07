import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileText, Plus, Edit, Globe, RefreshCw } from "lucide-react";
import { seedStaticPagesAction } from "./actions";

export default async function AdminPagesList() {
  const routePages = await prisma.routePage.findMany({
    orderBy: { updatedAt: "desc" },
  });

  const staticPages = await prisma.staticPage.findMany({
    orderBy: { updatedAt: "desc" },
  });

  // Mapeamos para unificar la tabla
  const allPages = [
    ...routePages.map((p) => ({
      id: p.id,
      title: p.h1Title,
      url: `/rutas/${p.slug}`,
      type: "Ruta de Traslado",
      isActive: p.isActive,
      updatedAt: p.updatedAt,
      editUrl: `/admin/pages/${p.id}/edit`
    })),
    ...staticPages.map((p) => ({
      id: p.id,
      title: p.name,
      url: p.slug === "inicio" ? "/" : `/${p.slug}`,
      type: "Página Estructural",
      isActive: p.isActive,
      updatedAt: p.updatedAt,
      editUrl: `/admin/static-pages/${p.id}/edit`
    }))
  ].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Globe className="h-6 w-6 text-[#D4AF37]" />
            Páginas y Rutas SEO
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Gestiona el SEO de las páginas estáticas y las rutas de traslado.
          </p>
        </div>
        <div className="flex gap-2">
          <form action={seedStaticPagesAction}>
            <Button type="submit" variant="outline" className="text-gray-600 hover:text-gray-900">
              <RefreshCw className="mr-2 h-4 w-4" />
              Sincronizar Páginas Base
            </Button>
          </form>
          <Link href="/admin/pages/new">
            <Button className="bg-[#D4AF37] hover:bg-[#b5952f] text-white">
              <Plus className="mr-2 h-4 w-4" />
              Nueva Ruta
            </Button>
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-600 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 font-medium">Título / Nombre</th>
              <th className="px-6 py-4 font-medium">URL</th>
              <th className="px-6 py-4 font-medium">Tipo</th>
              <th className="px-6 py-4 font-medium">Estado</th>
              <th className="px-6 py-4 font-medium">Última modificación</th>
              <th className="px-6 py-4 font-medium text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {allPages.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  No hay páginas creadas todavía.
                </td>
              </tr>
            ) : (
              allPages.map((page) => (
                <tr key={page.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {page.title}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {page.url}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      page.type === "Ruta de Traslado" ? "bg-blue-100 text-blue-800" : "bg-purple-100 text-purple-800"
                    }`}>
                      {page.type}
                    </span>
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
