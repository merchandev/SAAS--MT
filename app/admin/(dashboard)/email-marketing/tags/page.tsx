import { prisma } from "@/lib/prisma";
import { requireRole } from "@/modules/auth/permissions";
import { Tags, Calendar, Plus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Etiquetas | Email Marketing",
};

export const dynamic = "force-dynamic";

export default async function TagsPage() {
  await requireRole(["SUPER_ADMIN", "ADMIN"]);

  const tags = await prisma.marketingTag.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { contacts: true }
      }
    }
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Etiquetas</h1>
          <p className="text-gray-500 mt-1">
            Clasifica a tus contactos con etiquetas personalizadas
          </p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Nueva Etiqueta
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Etiqueta
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contactos
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha Creación
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tags.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                    <Tags className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                    <p className="text-lg font-medium text-gray-900">No hay etiquetas</p>
                    <p>Crea tu primera etiqueta para clasificar a los usuarios.</p>
                  </td>
                </tr>
              ) : (
                tags.map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div 
                          className="w-3 h-3 rounded-full mr-3" 
                          style={{ backgroundColor: t.color || '#3b82f6' }}
                        ></div>
                        <div className="text-sm font-medium text-gray-900">{t.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <Users className="w-4 h-4 mr-2 text-gray-400" />
                        {t._count.contacts}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {new Date(t.createdAt).toLocaleDateString("es-ES")}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-900">
                        Editar
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-900">
                        Eliminar
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
