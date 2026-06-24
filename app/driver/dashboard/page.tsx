import { authService } from "@/modules/auth/auth.service";
import { redirect } from "next/navigation";
import { driversQueries } from "@/modules/drivers/drivers.queries";
import { DriverStatusUpdater } from "./DriverStatusUpdater";
import { MapPin, Clock, Calendar, Briefcase, Info } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DriverDashboardPage() {
  const session = await authService.getSession();

  if (!session || session.role !== "DRIVER") {
    redirect("/admin/login");
  }

  const data = await driversQueries.getDriverBookings(session.userId);

  if (!data?.driver) {
    return (
      <div className="p-6 text-center mt-10">
        <h1 className="text-2xl font-bold text-red-600">Perfil Inválido</h1>
        <p className="text-gray-500 mt-2">No se encontró un perfil de conductor activo para tu usuario.</p>
      </div>
    );
  }

  const { driver, bookings } = data;

  // Filtrar servicios activos (no cancelados, ni completados)
  const activeBookings = bookings.filter(b => 
    b.bookingStatus !== "CANCELADA" && 
    b.bookingStatus !== "REEMBOLSADA" && 
    b.driverStatus !== "SERVICIO_FINALIZADO"
  );

  const completedBookings = bookings.filter(b => 
    b.driverStatus === "SERVICIO_FINALIZADO"
  );

  return (
    <main className="min-h-screen bg-gray-100 pb-20">
      <header className="bg-slate-900 text-white p-6 shadow-md rounded-b-3xl">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-slate-400 text-sm font-medium uppercase tracking-wider">Modo Chofer</p>
            <h1 className="text-2xl font-bold">{session.email}</h1>
          </div>
          <div className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm font-semibold">
            {driver.status === 'ACTIVE' ? 'Activo' : 'Inactivo'}
          </div>
        </div>
      </header>

      <div className="px-4 mt-6 space-y-6 max-w-lg mx-auto">
        <h2 className="text-xl font-bold text-gray-800 border-b pb-2">Servicios Asignados</h2>

        {activeBookings.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl text-center shadow-sm border border-gray-100">
            <div className="mx-auto w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <MapPin className="text-gray-400 h-8 w-8" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Sin rutas asignadas</h3>
            <p className="text-gray-500 text-sm mt-1">Actualmente no tienes viajes pendientes. Relájate.</p>
          </div>
        ) : (
          activeBookings.map((b) => (
            <div key={b.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-blue-50 p-4 border-b border-blue-100 flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-1.5 text-blue-900 font-bold text-lg">
                    <Clock className="h-5 w-5" />
                    {b.serviceTime}
                  </div>
                  <div className="flex items-center gap-1.5 text-blue-700 text-sm mt-1">
                    <Calendar className="h-4 w-4" />
                    {b.serviceDate.toLocaleDateString('es-ES')}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 bg-blue-100 px-2 py-1 rounded-md">
                    #{b.publicCode.slice(0,6)}
                  </span>
                </div>
              </div>

              <div className="p-5 space-y-4">
                <div className="relative pl-6 space-y-4">
                  <div className="absolute left-1.5 top-2 bottom-2 w-0.5 bg-gray-200"></div>
                  
                  <div className="relative">
                    <div className="absolute -left-[23px] top-1 h-3 w-3 rounded-full bg-blue-500 ring-4 ring-white"></div>
                    <p className="text-xs text-gray-500 font-medium uppercase">Origen</p>
                    <p className="text-sm font-semibold text-gray-900 leading-tight mt-0.5">{b.originAddress}</p>
                    {b.flightNumber && (
                      <p className="text-xs text-orange-600 font-semibold mt-1 flex items-center gap-1">
                        ✈️ Vuelo: {b.flightNumber}
                      </p>
                    )}
                  </div>

                  <div className="relative">
                    <div className="absolute -left-[23px] top-1 h-3 w-3 rounded-full bg-green-500 ring-4 ring-white"></div>
                    <p className="text-xs text-gray-500 font-medium uppercase">Destino</p>
                    <p className="text-sm font-semibold text-gray-900 leading-tight mt-0.5">{b.destinationAddress}</p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-3 flex justify-between items-center border border-gray-100">
                  <div className="flex items-center gap-2">
                    <div className="bg-gray-200 p-2 rounded-lg">
                      <Briefcase className="h-4 w-4 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Pasajeros & Equipaje</p>
                      <p className="text-sm font-semibold text-gray-900">{b.passengers} Pax | {b.luggage} Maletas</p>
                    </div>
                  </div>
                </div>

                {b.customerNotes && (
                  <div className="flex gap-2 p-3 bg-yellow-50 text-yellow-800 text-sm rounded-lg border border-yellow-100">
                    <Info className="h-5 w-5 flex-shrink-0" />
                    <p>{b.customerNotes}</p>
                  </div>
                )}

                <div className="pt-4 border-t border-gray-100">
                  <DriverStatusUpdater 
                    bookingId={b.id} 
                    driverId={driver.id} 
                    currentStatus={b.driverStatus} 
                  />
                </div>
              </div>
            </div>
          ))
        )}

        {completedBookings.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-bold text-gray-800 border-b pb-2 mb-4">Historial Reciente</h3>
            <div className="space-y-3">
              {completedBookings.map(b => (
                <div key={b.id} className="bg-white p-4 rounded-xl border flex items-center justify-between opacity-75">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{b.serviceDate.toLocaleDateString()} {b.serviceTime}</p>
                    <p className="text-xs text-gray-500 truncate max-w-[200px]">{b.destinationAddress}</p>
                  </div>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded font-medium">Finalizado</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
