import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Trash2 } from "lucide-react";
import { BookingStatusForm } from "./BookingStatusForm";
import { BookingNotesForm } from "./BookingNotesForm";
import { DriverAssignmentForm } from "./DriverAssignmentForm";
import { InvoiceDownloadButton } from "@/components/pdf/InvoiceDownloadButton";
import GoogleMapRoute from "@/components/maps/GoogleMapRoute";
import LiveMapPollClient from "@/components/maps/LiveMapPollClient";
import { BookingTrashActions } from "../BookingTrashActions";

export const dynamic = "force-dynamic";

export default async function BookingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const booking = await prisma.booking.findUnique({
    where: { id },
    include: {
      customer: true,
      vehicle: true,
      driver: { include: { user: true } },
      hotel: true,
    },
  });

  if (!booking) notFound();

  const drivers = await prisma.driver.findMany({
    where: { user: { isActive: true } },
    include: { user: true },
  });

  const bookingStatusLabel = ({
    DRAFT: "Borrador",
    PENDING_PAYMENT: "Pendiente de pago",
    PAID: "Pagado",
    POR_CONFIRMAR: "Por confirmar",
    CONFIRMADA: "Confirmada",
    ASIGNADA: "Conductor asignado",
    EN_CURSO: "En curso",
    COMPLETADA: "Completada",
    CANCELADA: "Cancelada",
    NO_SHOW: "No show",
    REEMBOLSADA: "Reembolsada",
    FALLIDA: "Fallida",
  }[booking.bookingStatus as string] || booking.bookingStatus);

  const paymentStatusLabel = ({
    PENDING: "Pendiente",
    PAID: "Pagado",
    COMPLETED: "Completado",
    FAILED: "Fallido",
    REFUNDED: "Reembolsado",
  }[booking.paymentStatus as string] || booking.paymentStatus);

  const isDeleted = Boolean(booking.deletedAt);

  return (
    <div className="space-y-6 max-w-5xl">
      {isDeleted && (
        <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          <Trash2 className="w-4 h-4" />
          <span>
            Este traslado está en la papelera desde{" "}
            {booking.deletedAt ? new Date(booking.deletedAt).toLocaleString("es-ES") : "fecha no disponible"}.
          </span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-2xl font-bold tracking-tight">Reserva {booking.publicCode}</h3>
          <p className="text-gray-500">
            Creada el {new Date(booking.createdAt).toLocaleString("es-ES")} | Origen: {booking.sourceType}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800">
            {bookingStatusLabel}
          </span>
          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
            booking.paymentStatus === "PAID" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
          }`}>
            Pago: {paymentStatusLabel}
          </span>
          {booking.paymentStatus === "PAID" && (
            <InvoiceDownloadButton bookingId={booking.id} />
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white border rounded-lg p-6 shadow-sm">
            <h4 className="font-semibold text-lg mb-4 border-b pb-2">Detalles del traslado</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500 font-medium">Origen</p>
                <p>{booking.originAddress}</p>
              </div>
              <div>
                <p className="text-gray-500 font-medium">Destino</p>
                <p>{booking.destinationAddress}</p>
              </div>
              <div>
                <p className="text-gray-500 font-medium">Fecha y hora</p>
                <p>{new Date(booking.serviceDate).toLocaleDateString("es-ES")} a las {booking.serviceTime}</p>
              </div>
              <div>
                <p className="text-gray-500 font-medium">Distancia / Duración</p>
                <p>{Number(booking.distanceKm).toFixed(1)} km / {booking.durationMinutes} min</p>
              </div>
              <div>
                <p className="text-gray-500 font-medium">Pasajeros / Maletas</p>
                <p>{booking.passengers} pax / {booking.luggage} maletas</p>
              </div>
              <div>
                <p className="text-gray-500 font-medium">Vuelo</p>
                <p>{booking.flightNumber || "-"}</p>
              </div>
            </div>
          </div>

          <div className="bg-white border rounded-lg p-6 shadow-sm">
            <h4 className="font-semibold text-lg mb-4 border-b pb-2">Mapa del recorrido</h4>
            <div className="h-[360px] overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
              <GoogleMapRoute
                origin={booking.originAddress}
                destination={booking.destinationAddress}
                className="w-full h-full"
              />
            </div>
          </div>

          {booking.driverId && ["EN_CAMINO", "EN_PUNTO_DE_RECOGIDA", "CLIENTE_RECOGIDO"].includes(booking.driverStatus || "") && (
            <div className="bg-white border rounded-lg p-6 shadow-sm">
              <h4 className="font-semibold text-lg mb-4 border-b pb-2 flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500" />
                </span>
                Rastreo GPS en vivo
              </h4>
              <LiveMapPollClient
                driverId={booking.driverId}
                origin={booking.originAddress}
                destination={booking.destinationAddress}
              />
            </div>
          )}

          <div className="bg-white border rounded-lg p-6 shadow-sm">
            <h4 className="font-semibold text-lg mb-4 border-b pb-2">Información del cliente</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500 font-medium">Nombre</p>
                <p>{booking.customer.fullName}</p>
              </div>
              <div>
                <p className="text-gray-500 font-medium">Teléfono</p>
                <p>{booking.customer.phone || "-"}</p>
              </div>
              <div>
                <p className="text-gray-500 font-medium">Email</p>
                <p>{booking.customer.email}</p>
              </div>
              <div>
                <p className="text-gray-500 font-medium">Notas del cliente</p>
                <p>{booking.customerNotes || "Ninguna"}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <BookingStatusForm bookingId={booking.id} currentStatus={booking.bookingStatus} />

          <DriverAssignmentForm
            bookingId={booking.id}
            currentDriverId={booking.driverId}
            drivers={drivers.map((driver) => ({ id: driver.id, name: driver.user.fullName }))}
          />

          <BookingNotesForm bookingId={booking.id} initialNotes={booking.internalNotes || ""} />

          <div className="bg-gray-50 border rounded-lg p-6 shadow-sm">
            <h4 className="font-semibold text-lg mb-4 border-b pb-2 border-gray-200">Resumen económico</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Vehículo:</span>
                <span className="font-medium">{booking.vehicle.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Precio base:</span>
                <span className="font-medium">{booking.currency} {Number(booking.basePrice).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Recargos:</span>
                <span className="font-medium">{booking.currency} {Number(booking.surchargeAmount).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Descuentos:</span>
                <span className="font-medium text-red-600">-{booking.currency} {Number(booking.discountAmount).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-2 border-t mt-2">
                <span>Total:</span>
                <span>{booking.currency} {Number(booking.finalPrice).toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-red-200 rounded-lg p-6 shadow-sm">
            <h4 className="font-semibold text-lg mb-2">Papelera</h4>
            <p className="text-sm text-gray-500 mb-4">
              {isDeleted
                ? "Restaura el traslado para devolverlo al listado principal."
                : "Mueve este traslado a la papelera si es una prueba o ya no debe mostrarse en el listado principal."}
            </p>
            <BookingTrashActions
              bookingId={booking.id}
              mode={isDeleted ? "restore" : "trash"}
              label={isDeleted ? "Restaurar traslado" : "Mover a papelera"}
              redirectTo={isDeleted ? undefined : "/admin/bookings"}
              className="w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
