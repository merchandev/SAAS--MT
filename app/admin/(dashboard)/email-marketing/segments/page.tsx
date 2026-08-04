import { prisma } from "@/lib/prisma";
import { requireRole } from "@/modules/auth/permissions";
import { Filter, Calendar, Plus, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Segmentos | Email Marketing",
};

export const dynamic = "force-dynamic";

export default async function SegmentsPage() {
  await requireRole(["SUPER_ADMIN", "ADMIN"]);

  const segments = await prisma.marketingSegment.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Segmentos Dinámicos</h1>
          <p className="text-gray-500 mt-1">
            Filtra a tus contactos usando reglas y condiciones
          </p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Crear Segmento
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Segmento
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Condiciones
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
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
              {segments.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    <Filter className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                    <p className="text-lg font-medium text-gray-900">No hay segmentos</p>
                    <p>Aún no has creado ningún segmento dinámico.</p>
                  </td>
                </tr>
              ) : (
                segments.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{s.name}</div>
                      {s.description && (
                        <div className="text-sm text-gray-500 mt-1 truncate max-w-xs">{s.description}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 truncate max-w-[200px]">
                        {JSON.stringify(s.rules)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${s.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {s.isActive ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {new Date(s.createdAt).toLocaleDateString("es-ES")}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex justify-end gap-2">
                      <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-900">
                        <Play className="w-3 h-3 mr-1" /> Evaluar
                      </Button>
                      <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                        Editar
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
