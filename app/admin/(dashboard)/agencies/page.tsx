import Link from "next/link";
import { Briefcase, Percent, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { b2bQueries } from "@/modules/b2b/b2b.queries";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AgencyActionsDropdown } from "@/components/admin/agency-actions-dropdown";

export const dynamic = "force-dynamic";

export default async function AgenciesPage() {
  const allAgencies = await b2bQueries.getAllAgencies();
  
  const activeAgencies = allAgencies.filter(a => !a.deletedAt);
  const deletedAgencies = allAgencies.filter(a => a.deletedAt);
  
  const activeAgenciesCount = activeAgencies.filter((agency) => agency.isActive).length;
  const bookingsCount = activeAgencies.reduce((sum, agency) => sum + agency._count.bookings, 0);

  const renderTable = (agencies: typeof allAgencies, isTrash: boolean = false) => (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Agencia</th>
            <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Contacto</th>
            <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Reglas</th>
            <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Actividad</th>
            <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Estado</th>
            <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {agencies.map((agency) => (
            <tr key={agency.id} className="hover:bg-gray-50/70">
              <td className="px-5 py-4">
                <div className="font-semibold text-gray-900">
                  {agency.name}
                  {isTrash && <span className="ml-2 text-xs text-red-500 font-normal">(En papelera)</span>}
                </div>
                <div className="text-xs text-gray-500">/{agency.slug}</div>
                <div className="mt-1 max-w-[180px] truncate text-xs text-gray-400" title={agency.token}>
                  Token {agency.token}
                </div>
              </td>
              <td className="px-5 py-4">
                <div className="font-medium text-gray-800">{agency.contactName || "Sin contacto"}</div>
                <div className="text-xs text-gray-500">{agency.email || "Sin email"}</div>
                <div className="text-xs text-gray-400">{agency.phone || "Sin teléfono"}</div>
              </td>
              <td className="px-5 py-4">
                <div className="text-sm font-semibold text-gray-900">{Number(agency.commissionValue).toFixed(1)}% comisión</div>
                <div className="text-xs text-gray-500">{Number(agency.discountValue).toFixed(1)}% descuento cliente</div>
              </td>
              <td className="px-5 py-4">
                <div className="text-sm font-semibold text-gray-900">{agency._count.bookings} reservas</div>
                <div className="text-xs text-gray-500">{agency._count.users} usuarios</div>
              </td>
              <td className="px-5 py-4">
                {agency.deletedAt ? (
                  <span className="inline-flex rounded-full px-2 py-1 text-xs font-semibold bg-gray-100 text-gray-500">
                    Eliminada
                  </span>
                ) : (
                  <span
                    className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                      agency.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}
                  >
                    {agency.isActive ? "Activa" : "Suspendida"}
                  </span>
                )}
              </td>
              <td className="px-5 py-4 text-right">
                <AgencyActionsDropdown agency={agency} />
              </td>
            </tr>
          ))}
          {agencies.length === 0 && (
            <tr>
              <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                {isTrash ? "La papelera está vacía." : "No hay agencias registradas."}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-2xl font-bold tracking-tight">Agencias (B2B)</h3>
          <p className="text-gray-500">Gestión de agencias asociadas, comisiones, tokens y usuarios.</p>
        </div>
        <Link href="/admin/agencies/new">
          <Button>
            <UserPlus className="h-4 w-4 mr-2" />
            Nueva agencia
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
            <Briefcase className="h-4 w-4 text-blue-600" />
            Agencias Activas
          </div>
          <p className="mt-2 text-3xl font-bold">{activeAgencies.length}</p>
          <p className="mt-1 text-xs text-gray-500">{activeAgenciesCount} operativas</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
            <UserPlus className="h-4 w-4 text-green-600" />
            Reservas B2B
          </div>
          <p className="mt-2 text-3xl font-bold">{bookingsCount}</p>
          <p className="mt-1 text-xs text-gray-500">Origen agencia</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
            <Percent className="h-4 w-4 text-amber-600" />
            Comisión media
          </div>
          <p className="mt-2 text-3xl font-bold">
            {activeAgencies.length > 0
              ? `${(activeAgencies.reduce((sum, agency) => sum + Number(agency.commissionValue), 0) / activeAgencies.length).toFixed(1)}%`
              : "0%"}
          </p>
          <p className="mt-1 text-xs text-gray-500">Segun agencias activas</p>
        </div>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="active">Activas / Suspendidas</TabsTrigger>
          <TabsTrigger value="trash">
            Papelera {deletedAgencies.length > 0 && `(${deletedAgencies.length})`}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="active">
          {renderTable(activeAgencies, false)}
        </TabsContent>
        <TabsContent value="trash">
          {renderTable(deletedAgencies, true)}
        </TabsContent>
      </Tabs>
    </div>
  );
}
