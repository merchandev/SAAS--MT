import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileText, Plus, Edit, Globe, RefreshCw, Eye } from "lucide-react";
import { seedStaticPagesAction } from "./actions";
import PagesDataTable from "@/components/admin/PagesDataTable";

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

      <PagesDataTable initialPages={allPages} />
    </div>
  );
}
