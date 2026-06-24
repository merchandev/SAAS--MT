import { authService } from "@/modules/auth/auth.service";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { b2bQueries } from "@/modules/b2b/b2b.queries";

export const dynamic = "force-dynamic";

export default async function HotelDashboardPage() {
  const session = await authService.getSession();

  if (!session) {
    redirect("/admin/login");
  }

  const allowedRoles = ["HOTEL", "SUPER_ADMIN", "ADMIN"];

  if (!allowedRoles.includes(session.role)) {
    redirect("/");
  }

  // Find User to get hotelId
  const user = await prisma.user.findUnique({
    where: { id: session.userId }
  });

  if (!user?.hotelId) {
    return (
      <main className="min-h-screen bg-gray-50 p-6">
        <section className="mx-auto max-w-5xl rounded-xl border bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-red-600">Acceso Denegado</h1>
          <p className="mt-2 text-gray-600">Este usuario no está vinculado a ningún hotel válido.</p>
        </section>
      </main>
    );
  }

  const dashboardData = await b2bQueries.getHotelDashboardData(user.hotelId);

  if (!dashboardData) {
    return (
      <main className="min-h-screen bg-gray-50 p-6">
        <section className="mx-auto max-w-5xl rounded-xl border bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-red-600">Hotel no encontrado</h1>
          <p className="mt-2 text-gray-600">La configuración de este hotel parece estar corrupta.</p>
        </section>
      </main>
    );
  }

  const { hotel, bookings, stats } = dashboardData;

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <section className="mx-auto max-w-6xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between bg-white p-6 rounded-xl border shadow-sm">
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-blue-600">
              Panel B2B
            </p>
            <h1 className="mt-1 text-3xl font-bold text-gray-900">{hotel.name}</h1>
          </div>
          <div className="text-right">
            <span className="text-sm text-gray-500">Comisión actual:</span>
            <p className="text-xl font-semibold text-gray-900">{Number(hotel.commissionValue)}%</p>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border shadow-sm border-l-4 border-l-blue-500">
            <h3 className="text-sm font-medium text-gray-500">Total Reservas Generadas</h3>
            <p className="mt-2 text-3xl font-bold text-gray-900">{stats.totalBookings}</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl border shadow-sm border-l-4 border-l-green-500">
            <h3 className="text-sm font-medium text-gray-500">Reservas Completadas/Pagadas</h3>
            <p className="mt-2 text-3xl font-bold text-gray-900">{stats.paidBookings}</p>
          </div>

          <div className="bg-white p-6 rounded-xl border shadow-sm border-l-4 border-l-purple-500">
            <h3 className="text-sm font-medium text-gray-500">Comisiones Acumuladas</h3>
            <p className="mt-2 text-3xl font-bold text-purple-700">
              {stats.totalCommissions.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
            </p>
          </div>
        </div>

        {/* Bookings List */}
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-900">Historial de Reservas</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-white">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha / Código</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trayecto</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Importe</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {bookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{booking.publicCode}</div>
                      <div className="text-sm text-gray-500">{booking.createdAt.toLocaleDateString('es-ES')}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{booking.customer?.fullName || 'N/A'}</div>
                      <div className="text-sm text-gray-500">{booking.customer?.email || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 truncate max-w-[250px]">{booking.originAddress}</div>
                      <div className="text-sm text-gray-500 truncate max-w-[250px]">&rarr; {booking.destinationAddress}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        booking.paymentStatus === 'PAID' ? 'bg-green-100 text-green-800' :
                        booking.paymentStatus === 'REFUNDED' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {booking.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {Number(booking.basePrice).toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                    </td>
                  </tr>
                ))}
                {bookings.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
                      Todavía no se ha generado ninguna reserva desde tu código.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </section>
    </main>
  );
}
