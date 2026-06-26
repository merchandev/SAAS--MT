import Link from "next/link";
import { MessageSquare, Star, UserRound, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAdminCustomersDirectory } from "@/modules/customers/customer.queries";

export const dynamic = "force-dynamic";

function formatMoney(value: number) {
  return new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(value);
}

function formatDate(value: Date | null | undefined) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("es-ES", { dateStyle: "medium" }).format(value);
}

export default async function CustomersPage() {
  const { customers, totals } = await getAdminCustomersDirectory();
  const suggestions = customers.reduce((sum, customer) => sum + customer.counts.suggestions, 0);
  const reviews = customers.reduce((sum, customer) => sum + customer.counts.reviews, 0);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold tracking-tight">Directorio de Clientes</h3>
        <p className="text-gray-500">Perfiles, gasto, kilometros recorridos, resenas y sugerencias.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
            <UserRound className="h-4 w-4 text-blue-600" />
            Clientes
          </div>
          <p className="mt-2 text-3xl font-bold">{totals.customers}</p>
          <p className="mt-1 text-xs text-gray-500">{totals.activeCustomers} activos</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
            <Wallet className="h-4 w-4 text-green-600" />
            Gasto total
          </div>
          <p className="mt-2 text-3xl font-bold">{formatMoney(totals.totalSpent)}</p>
          <p className="mt-1 text-xs text-gray-500">{totals.totalBookings} traslados</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
            <Star className="h-4 w-4 text-amber-600" />
            Resenas
          </div>
          <p className="mt-2 text-3xl font-bold">{reviews}</p>
          <p className="mt-1 text-xs text-gray-500">{Math.round(totals.totalDistanceKm)} km completados</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
            <MessageSquare className="h-4 w-4 text-indigo-600" />
            Sugerencias
          </div>
          <p className="mt-2 text-3xl font-bold">{suggestions}</p>
          <p className="mt-1 text-xs text-gray-500">Buzon interno de clientes</p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Cliente</th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Actividad</th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Gastos</th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Ultimo traslado</th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Calidad</th>
              <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">Perfil</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {customers.map((customer) => (
              <tr key={customer.id} className="hover:bg-gray-50/70">
                <td className="px-5 py-4">
                  <div className="font-semibold text-gray-900">{customer.fullName}</div>
                  <div className="text-xs text-gray-500">{customer.email}</div>
                  <div className="text-xs text-gray-400">{customer.phone || "Sin teléfono"}</div>
                  <div className="mt-2">
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                        customer.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}
                    >
                      {customer.isActive ? "Activo" : "Suspendido"}
                    </span>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <div className="font-semibold text-gray-900">{customer.metrics.totalBookings} traslados</div>
                  <div className="text-xs text-gray-500">{customer.metrics.completedTransfers} completados</div>
                  <div className="text-xs text-gray-500">{customer.metrics.totalDistanceKm.toFixed(1)} km</div>
                </td>
                <td className="px-5 py-4">
                  <div className="font-semibold text-gray-900">{formatMoney(customer.metrics.totalSpent)}</div>
                  <div className="text-xs text-gray-500">Media {formatMoney(customer.metrics.averageSpend)}</div>
                </td>
                <td className="px-5 py-4 max-w-xs">
                  {customer.lastBooking ? (
                    <>
                      <div className="font-semibold text-gray-900">{customer.lastBooking.publicCode}</div>
                      <div className="text-xs text-gray-500">{formatDate(customer.lastBooking.serviceDate)}</div>
                      <div className="truncate text-xs text-gray-500" title={customer.lastBooking.destinationAddress}>
                        {customer.lastBooking.originAddress} {"->"} {customer.lastBooking.destinationAddress}
                      </div>
                    </>
                  ) : (
                    <span className="text-gray-400">Sin traslados</span>
                  )}
                </td>
                <td className="px-5 py-4">
                  <div className="text-xs text-gray-600">{customer.counts.reviews} resenas</div>
                  <div className="text-xs text-gray-600">{customer.counts.suggestions} sugerencias</div>
                  {customer.suggestions[0] && (
                    <div className="mt-2 max-w-[220px] truncate rounded-md bg-gray-50 px-2 py-1 text-xs text-gray-500">
                      {customer.suggestions[0].subject}
                    </div>
                  )}
                </td>
                <td className="px-5 py-4 text-right">
                  {customer.userId ? (
                    <Link href={`/admin/users/${customer.userId}/edit`}>
                      <Button variant="outline" size="sm">Editar usuario</Button>
                    </Link>
                  ) : (
                    <Link href="/admin/users/new">
                      <Button variant="secondary" size="sm">Crear acceso</Button>
                    </Link>
                  )}
                </td>
              </tr>
            ))}
            {customers.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                  No hay clientes registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
