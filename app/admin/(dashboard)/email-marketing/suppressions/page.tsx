import { prisma } from "@/lib/prisma";
import { requireRole } from "@/modules/auth/permissions";
import { UserX, Calendar, Plus, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Supresiones | Email Marketing",
};

export const dynamic = "force-dynamic";

export default async function SuppressionsPage() {
  await requireRole(["SUPER_ADMIN", "ADMIN"]);

  const suppressions = await prisma.emailSuppression.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Lista de Supresión</h1>
          <p className="text-gray-500 mt-1">
            Contactos que se han dado de baja, quejas de spam o rebotados
          </p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Añadir a la lista
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Razón
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Origen
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {suppressions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    <UserX className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                    <p className="text-lg font-medium text-gray-900">No hay supresiones</p>
                    <p>Tu lista de supresión está vacía actualmente.</p>
                  </td>
                </tr>
              ) : (
                suppressions.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm font-medium text-gray-900">
                        <Mail className="w-4 h-4 mr-2 text-gray-400" />
                        {s.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        s.reason === 'UNSUBSCRIBED' ? 'bg-yellow-100 text-yellow-800' :
                        s.reason === 'HARD_BOUNCE' ? 'bg-red-100 text-red-800' :
                        s.reason === 'SPAM_COMPLAINT' ? 'bg-purple-100 text-purple-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {s.reason}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {s.source}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {new Date(s.createdAt).toLocaleDateString("es-ES")}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
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
