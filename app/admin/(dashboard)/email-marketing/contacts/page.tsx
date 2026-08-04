import { prisma } from "@/lib/prisma";
import { requireRole } from "@/modules/auth/permissions";
import { Users, Mail, Phone, Globe, Calendar, Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Contactos | Email Marketing",
};

export const dynamic = "force-dynamic";

export default async function ContactsPage() {
  await requireRole(["SUPER_ADMIN", "ADMIN"]);

  const contacts = await prisma.marketingContact.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contactos</h1>
          <p className="text-gray-500 mt-1">
            Gestiona tu base de datos de suscriptores y clientes
          </p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Añadir Contacto
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contacto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Detalles
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Consentimiento
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha Registro
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {contacts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    <Users className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                    <p className="text-lg font-medium text-gray-900">No hay contactos</p>
                    <p>Aún no has añadido ningún contacto de marketing.</p>
                  </td>
                </tr>
              ) : (
                contacts.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold uppercase">
                          {c.email.charAt(0)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {c.firstName || c.lastName ? `${c.firstName || ''} ${c.lastName || ''}` : "Sin Nombre"}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center mt-1">
                            <Mail className="w-3 h-3 mr-1" />
                            {c.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex flex-col gap-1">
                        {c.phone && (
                          <div className="flex items-center text-gray-500">
                            <Phone className="w-3 h-3 mr-1" /> {c.phone}
                          </div>
                        )}
                        {c.country && (
                          <div className="flex items-center text-gray-500">
                            <Globe className="w-3 h-3 mr-1" /> {c.country} ({c.language?.toUpperCase()})
                          </div>
                        )}
                        {!c.phone && !c.country && <span className="text-gray-400">-</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${c.hasConsent ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {c.hasConsent ? "Suscrito" : "Sin Consentimiento"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {new Date(c.createdAt).toLocaleDateString("es-ES")}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-900">
                        Ver
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
