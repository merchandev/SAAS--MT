import { reportsQueries } from "@/modules/reports/reports.queries";
import { RevenueChart } from "@/components/charts/RevenueChart";
import { StatusChart } from "@/components/charts/StatusChart";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const kpis = await reportsQueries.getGlobalKPIs();
  const recentBookings = await reportsQueries.getRecentBookings(10);
  const revenueData = await reportsQueries.getRevenueByMonth();
  const statusData = await reportsQueries.getBookingsByStatus();

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard de Operaciones</h1>
        <p className="text-gray-500">Resumen en tiempo real del estado de MeTransfers.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-2 text-gray-500">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <h3 className="font-semibold text-sm">Ingresos Brutos (Pagados)</h3>
          </div>
          <p className="text-4xl font-black text-gray-900">€{kpis.grossRevenue.toFixed(2)}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-2 text-gray-500">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
            <h3 className="font-semibold text-sm">Reservas Activas</h3>
          </div>
          <p className="text-4xl font-black text-gray-900">{kpis.activeBookings}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-2 text-gray-500">
            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
            <h3 className="font-semibold text-sm">Comisiones B2B a Liquidar</h3>
          </div>
          <p className="text-4xl font-black text-gray-900">€{kpis.pendingCommissions.toFixed(2)}</p>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Evolución de Ingresos</h3>
          <RevenueChart data={revenueData} />
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Distribución de Reservas</h3>
          <StatusChart data={statusData} />
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900">Últimas Reservas Ingresadas</h3>
          <Link href="/admin/bookings" className="text-sm text-blue-600 font-medium hover:underline cursor-pointer">Ver todas</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Ref</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Cliente</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Ruta</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Vehículo</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Monto</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Estado</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{booking.publicCode}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="font-medium text-gray-900">{booking.customer.fullName}</div>
                    <div className="text-xs">{booking.customer.phone || booking.customer.email}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                    <div className="font-medium text-gray-900 truncate">{booking.originAddress}</div>
                    <div className="text-xs truncate">→ {booking.destinationAddress}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.vehicle.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">€{Number(booking.finalPrice).toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      booking.bookingStatus === 'PENDING_PAYMENT' ? 'bg-yellow-100 text-yellow-800' :
                      booking.bookingStatus === 'CONFIRMADA' ? 'bg-blue-100 text-blue-800' :
                      booking.bookingStatus === 'COMPLETADA' ? 'bg-green-100 text-green-800' :
                      booking.bookingStatus === 'CANCELADA' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {booking.bookingStatus}
                    </span>
                  </td>
                </tr>
              ))}
              {recentBookings.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    No hay reservas registradas todavía.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
