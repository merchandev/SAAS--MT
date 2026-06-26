import Link from "next/link";
import { AlertTriangle, BadgeEuro, Clock3, ReceiptText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { paymentsQueries } from "@/modules/payments/payments.queries";

export const dynamic = "force-dynamic";

function formatMoney(value: number) {
  return new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(value);
}

function formatDate(value: Date | null | undefined) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("es-ES", { dateStyle: "medium", timeStyle: "short" }).format(value);
}

function statusClass(status: string) {
  if (status === "PAID" || status === "AUTHORIZED") return "bg-green-100 text-green-800";
  if (status === "FAILED" || status === "CANCELLED") return "bg-red-100 text-red-800";
  if (status === "REFUNDED") return "bg-blue-100 text-blue-800";
  return "bg-yellow-100 text-yellow-800";
}

export default async function PaymentsPage() {
  const { metrics, payments, settlements } = await paymentsQueries.getAdminPaymentsDashboard();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold tracking-tight">Liquidaciones y Pagos</h3>
        <p className="text-gray-500">Control de pagos Redsys, cobros pendientes y comisiones B2B.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
            <BadgeEuro className="h-4 w-4 text-green-600" />
            Cobrado
          </div>
          <p className="mt-2 text-3xl font-bold">{formatMoney(metrics.paidTotal)}</p>
          <p className="mt-1 text-xs text-gray-500">{metrics.paidCount} pagos</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
            <Clock3 className="h-4 w-4 text-amber-600" />
            Pendiente
          </div>
          <p className="mt-2 text-3xl font-bold">{formatMoney(metrics.pendingTotal)}</p>
          <p className="mt-1 text-xs text-gray-500">{metrics.pendingCount} pagos</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
            <ReceiptText className="h-4 w-4 text-blue-600" />
            Comisiones B2B
          </div>
          <p className="mt-2 text-3xl font-bold">{formatMoney(metrics.b2bCommissionTotal)}</p>
          <p className="mt-1 text-xs text-gray-500">Estimadas por reservas pagadas</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            Fallidos
          </div>
          <p className="mt-2 text-3xl font-bold">{metrics.failedCount}</p>
          <p className="mt-1 text-xs text-gray-500">Revisar Redsys/logs</p>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-100 px-5 py-4">
            <h4 className="font-semibold text-gray-900">Pagos recientes</h4>
          </div>
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Reserva</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Cliente</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Importe</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Redsys</th>
                <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {payments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50/70">
                  <td className="px-5 py-4">
                    <div className="font-semibold text-gray-900">{payment.booking.publicCode}</div>
                    <div className="text-xs text-gray-500">{formatDate(payment.createdAt)}</div>
                    {(payment.booking.hotel || payment.booking.agency) && (
                      <div className="mt-1 text-xs text-gray-400">
                        {payment.booking.hotel?.name ?? payment.booking.agency?.name}
                      </div>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <div className="font-medium text-gray-900">{payment.booking.customer.fullName}</div>
                    <div className="text-xs text-gray-500">{payment.booking.customer.email}</div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="font-semibold text-gray-900">{formatMoney(payment.amount)}</div>
                    <span className={`mt-1 inline-flex rounded-full px-2 py-1 text-xs font-semibold ${statusClass(payment.status)}`}>
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="text-xs text-gray-500">Orden {payment.providerOrderId || "-"}</div>
                    <div className="text-xs text-gray-500">Codigo {payment.responseCode || "-"}</div>
                    <div className="text-xs text-gray-500">Firma {payment.signatureValid ? "válida" : "sin validar"}</div>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <Link href={`/admin/bookings/${payment.bookingId}`}>
                      <Button variant="outline" size="sm">Ver reserva</Button>
                    </Link>
                  </td>
                </tr>
              ))}
              {payments.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    No hay pagos registrados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-100 px-5 py-4">
            <h4 className="font-semibold text-gray-900">Liquidacion B2B estimada</h4>
            <p className="mt-1 text-xs text-gray-500">Calculada sobre reservas pagadas.</p>
          </div>
          <div className="divide-y divide-gray-100">
            {settlements.map((settlement) => (
              <div key={settlement.key} className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="font-semibold text-gray-900">{settlement.name}</div>
                    <div className="text-xs text-gray-500">{settlement.type === "HOTEL" ? "Hotel" : "Agencia"}</div>
                  </div>
                  <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-700">
                    {settlement.commissionValue.toFixed(1)}%
                  </span>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <div className="text-xs text-gray-500">Reservas</div>
                    <div className="font-semibold">{settlement.bookings}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">A liquidar</div>
                    <div className="font-semibold">{formatMoney(settlement.commissionAmount)}</div>
                  </div>
                </div>
              </div>
            ))}
            {settlements.length === 0 && (
              <div className="p-8 text-center text-sm text-gray-500">No hay comisiones pendientes.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
