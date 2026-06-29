import Link from "next/link";
import type { ReactNode } from "react";
import { Car, CreditCard, MapPinned, MessageSquare, Star, UserRound } from "lucide-react";
import { getCustomerDashboard } from "@/modules/customers/customer.queries";
import {
  CustomerProfileForm,
  CustomerReviewForm,
  CustomerSuggestionForm,
  CustomerAddressesForm,
} from "./CustomerDashboardForms";
import { getSavedAddressesAction } from "@/modules/customers/customer.actions";

export const dynamic = "force-dynamic";

function money(value: number, currency = "EUR") {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency,
  }).format(value);
}

function date(value: Date) {
  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(value);
}

export default async function CustomerDashboardPage() {
  const dashboard = await getCustomerDashboard();
  const reviewBookings = dashboard.pendingReviewBookings.map((booking) => ({
    id: booking.id,
    publicCode: booking.publicCode,
    serviceDate: date(booking.serviceDate),
    serviceTime: booking.serviceTime,
    route: `${booking.originAddress} -> ${booking.destinationAddress}`,
  }));
  
  const savedAddressesResponse = await getSavedAddressesAction();
  const savedAddresses = savedAddressesResponse.data || [];

  return (
    <main className="min-h-screen bg-gray-50 text-gray-950">
      <header className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#AA8B2C]">Area cliente</p>
            <h1 className="text-2xl font-bold">Mi perfil MeTransfers</h1>
          </div>
          <Link
            href="/booking"
            className="inline-flex h-10 items-center justify-center rounded-md bg-gray-950 px-4 text-sm font-semibold text-white hover:bg-gray-800"
          >
            Nueva reserva
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 space-y-6">
        <section className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <Metric label="Traslados" value={dashboard.metrics.totalBookings.toString()} icon={<Car className="h-5 w-5" />} />
          <Metric label="Completados" value={dashboard.metrics.completedTransfers.toString()} icon={<Star className="h-5 w-5" />} />
          <Metric label="Kilometros" value={`${dashboard.metrics.totalDistanceKm.toFixed(1)} km`} icon={<MapPinned className="h-5 w-5" />} />
          <Metric label="Gasto total" value={money(dashboard.metrics.totalSpent)} icon={<CreditCard className="h-5 w-5" />} />
        </section>

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 bg-white border rounded-lg p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-5">
              <UserRound className="h-5 w-5 text-[#AA8B2C]" />
              <h2 className="text-lg font-semibold">Perfil del cliente</h2>
            </div>
            <CustomerProfileForm
              customer={{
                fullName: dashboard.customer.fullName,
                email: dashboard.customer.email,
                phone: dashboard.customer.phone,
                country: dashboard.customer.country,
                preferredLanguage: dashboard.customer.preferredLanguage,
              }}
            />
          </div>

          <div className="bg-white border rounded-lg p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-5">
              <MessageSquare className="h-5 w-5 text-[#AA8B2C]" />
              <h2 className="text-lg font-semibold">Buzón de sugerencias</h2>
            </div>
            <CustomerSuggestionForm />
          </div>
        </section>

        <section className="bg-white border rounded-lg p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-5">
            <MapPinned className="h-5 w-5 text-[#AA8B2C]" />
            <h2 className="text-lg font-semibold">Mis Direcciones Guardadas</h2>
          </div>
          <p className="text-sm text-gray-500 mb-6">Guarda aquí tus lugares frecuentes para usarlos rápidamente al hacer una nueva reserva.</p>
          <CustomerAddressesForm addresses={savedAddresses} />
        </section>

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 bg-white border rounded-lg p-6 shadow-sm">
            <div className="flex flex-col gap-1 mb-5">
              <h2 className="text-lg font-semibold">Tabla de gastos</h2>
              <p className="text-sm text-gray-500">Importes asociados a reservas pagadas o reembolsadas.</p>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-xs uppercase tracking-wide text-gray-500">
                    <th className="py-3 pr-4">Fecha</th>
                    <th className="py-3 pr-4">Reserva</th>
                    <th className="py-3 pr-4">Servicio</th>
                    <th className="py-3 pr-4">Km</th>
                    <th className="py-3 pr-4 text-right">Importe</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboard.expenses.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-gray-500">
                        Todavia no hay gastos registrados.
                      </td>
                    </tr>
                  ) : (
                    dashboard.expenses.map((expense) => (
                      <tr key={expense.id} className="border-b last:border-0">
                        <td className="py-3 pr-4 whitespace-nowrap">{date(expense.serviceDate)}</td>
                        <td className="py-3 pr-4 font-semibold">{expense.publicCode}</td>
                        <td className="py-3 pr-4 min-w-72">
                          <div className="font-medium">{expense.vehicleName}</div>
                          <div className="text-xs text-gray-500 truncate max-w-md">{expense.route}</div>
                        </td>
                        <td className="py-3 pr-4 whitespace-nowrap">{expense.distanceKm.toFixed(1)}</td>
                        <td className="py-3 pr-4 text-right font-semibold">{money(expense.amount, expense.currency)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white border rounded-lg p-6 shadow-sm">
            <div className="flex flex-col gap-1 mb-5">
              <h2 className="text-lg font-semibold">Calificar servicio</h2>
              <p className="text-sm text-gray-500">Solo aparecen traslados completados y propios.</p>
            </div>
            <CustomerReviewForm bookings={reviewBookings} />
          </div>
        </section>

        <section className="bg-white border rounded-lg p-6 shadow-sm">
          <div className="flex flex-col gap-1 mb-5">
            <h2 className="text-lg font-semibold">Traslados recientes</h2>
            <p className="text-sm text-gray-500">Historial operativo asociado a tu perfil cliente.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs uppercase tracking-wide text-gray-500">
                  <th className="py-3 pr-4">Fecha</th>
                  <th className="py-3 pr-4">Reserva</th>
                  <th className="py-3 pr-4">Ruta</th>
                  <th className="py-3 pr-4">Estado</th>
                  <th className="py-3 pr-4">Pago</th>
                </tr>
              </thead>
              <tbody>
                {dashboard.bookings.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-500">
                      No hay traslados registrados.
                    </td>
                  </tr>
                ) : (
                  dashboard.bookings.slice(0, 10).map((booking) => (
                    <tr key={booking.id} className="border-b last:border-0">
                      <td className="py-3 pr-4 whitespace-nowrap">{date(booking.serviceDate)} {booking.serviceTime}</td>
                      <td className="py-3 pr-4 font-semibold">{booking.publicCode}</td>
                      <td className="py-3 pr-4 min-w-96">
                        <div className="truncate max-w-xl">{`${booking.originAddress} -> ${booking.destinationAddress}`}</div>
                      </td>
                      <td className="py-3 pr-4">{booking.bookingStatus}</td>
                      <td className="py-3 pr-4">{booking.paymentStatus}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="bg-white border rounded-lg p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-5">Sugerencias enviadas</h2>
          {dashboard.suggestions.length === 0 ? (
            <p className="text-sm text-gray-500">Todavia no has enviado sugerencias.</p>
          ) : (
            <div className="divide-y">
              {dashboard.suggestions.map((suggestion) => (
                <div key={suggestion.id} className="py-4 first:pt-0 last:pb-0">
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <p className="font-semibold">{suggestion.subject}</p>
                    <span className="text-xs font-semibold uppercase text-gray-500">{suggestion.status}</span>
                  </div>
                  <p className="mt-2 text-sm text-gray-600">{suggestion.message}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function Metric({ label, value, icon }: { label: string; value: string; icon: ReactNode }) {
  return (
    <div className="bg-white border rounded-lg p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</p>
        <div className="text-[#AA8B2C]">{icon}</div>
      </div>
      <p className="mt-3 text-2xl font-bold">{value}</p>
    </div>
  );
}
