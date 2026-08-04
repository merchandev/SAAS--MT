import { prisma } from "@/lib/prisma";
import { requireRole } from "@/modules/auth/permissions";
import Link from "next/link";
import { FileEdit, Plus } from "lucide-react";

export const metadata = {
  title: "Plantillas de Correo | Admin",
};

export const dynamic = "force-dynamic";

import { DEFAULT_TEMPLATES } from "@/config/email-templates";

export default async function EmailTemplatesPage() {
  await requireRole(["SUPER_ADMIN", "ADMIN"]);

  const dbTemplates = await prisma.notificationTemplate.findMany();
  
  // Merge DB templates with defaults
  const templates = DEFAULT_TEMPLATES.map((def) => {
    const dbItem = dbTemplates.find((t) => t.name === def.name);
    return {
      name: def.name,
      description: def.description,
      defaultSubject: def.subject,
      id: dbItem?.id || null,
      isActive: dbItem?.isActive ?? true,
      hasCustomBody: !!dbItem?.body,
    };
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            Plantillas Automáticas
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Personaliza el texto de los correos que envía el sistema. Si no personalizas una plantilla, se usará el diseño base del sistema.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-200">
            <tr>
              <th className="px-6 py-4">Evento / Disparador</th>
              <th className="px-6 py-4">Estado</th>
              <th className="px-6 py-4 text-right">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {templates.map((tpl) => (
              <tr key={tpl.name} className="hover:bg-gray-50/50">
                <td className="px-6 py-4">
                  <div className="font-semibold text-gray-900">{tpl.description}</div>
                  <div className="text-gray-500 font-mono text-xs mt-1">{tpl.name}</div>
                </td>
                <td className="px-6 py-4">
                  {tpl.hasCustomBody ? (
                    <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                      Personalizada
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                      Diseño del Sistema
                    </span>
                  )}
                  {!tpl.isActive && (
                    <span className="ml-2 inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                      Inactiva
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <Link
                    href={`/admin/emails/templates/${tpl.name}`}
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium border border-gray-200 bg-white shadow-sm hover:bg-gray-50 hover:text-gray-900 h-9 px-4 py-2 transition-colors"
                  >
                    <FileEdit className="h-4 w-4 mr-2" />
                    {tpl.hasCustomBody ? "Editar" : "Crear Personalizada"}
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
