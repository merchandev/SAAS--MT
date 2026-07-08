import { prisma } from "@/lib/prisma";
import { requireRole } from "@/modules/auth/permissions";
import { Mail } from "lucide-react";
import EmailLogTable from "./EmailLogTable";

export const metadata = {
  title: "Registro de Emails | Admin",
};

export const dynamic = "force-dynamic";

export default async function EmailLogPage() {
  await requireRole(["SUPER_ADMIN", "ADMIN"]);

  const logs = await prisma.notificationLog.findMany({
    where: { type: "EMAIL" },
    orderBy: { sentAt: "desc" },
    take: 500,
  });

  // Stats summary
  const total = logs.length;
  const sent = logs.filter((l) => l.status === "SENT").length;
  const failed = logs.filter((l) => l.status === "FAILED").length;

  const byEvent = logs.reduce<Record<string, number>>((acc, log) => {
    const key = log.eventType || "OTHER";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Mail className="h-6 w-6 text-[#D4AF37]" />
            Registro de Emails
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Historial de notificaciones enviadas por el sistema. Últimos 500 registros.
          </p>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total enviados" value={total} color="text-gray-900" />
        <StatCard label="Entregados ✅" value={sent} color="text-green-700" bg="bg-green-50 border-green-200" />
        <StatCard label="Fallidos ❌" value={failed} color="text-red-700" bg="bg-red-50 border-red-200" />
        <StatCard
          label="Tasa de éxito"
          value={total > 0 ? `${Math.round((sent / total) * 100)}%` : "—"}
          color="text-blue-700"
          bg="bg-blue-50 border-blue-200"
        />
      </div>

      {/* Event breakdown */}
      {Object.keys(byEvent).length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">
            Emails por tipo de evento
          </h2>
          <div className="flex flex-wrap gap-2">
            {Object.entries(byEvent)
              .sort(([, a], [, b]) => b - a)
              .map(([event, count]) => (
                <span
                  key={event}
                  className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 border border-gray-200"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-[#D4AF37]" />
                  {EVENT_LABELS[event] || event}
                  <span className="ml-1 font-bold text-gray-900">{count}</span>
                </span>
              ))}
          </div>
        </div>
      )}

      {/* Table */}
      <EmailLogTable logs={logs as any[]} />
    </div>
  );
}

function StatCard({
  label,
  value,
  color = "text-gray-900",
  bg = "bg-white border-gray-200",
}: {
  label: string;
  value: string | number;
  color?: string;
  bg?: string;
}) {
  return (
    <div className={`rounded-xl border p-5 ${bg}`}>
      <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{label}</p>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
    </div>
  );
}

export const EVENT_LABELS: Record<string, string> = {
  BOOKING_PENDING: "Reserva pendiente",
  BOOKING_CONFIRMED: "Reserva confirmada",
  BOOKING_CANCELLED: "Reserva cancelada",
  BOOKING_REFUNDED: "Reembolso",
  TRIP_STARTED: "Viaje iniciado",
  TRIP_COMPLETED: "Viaje completado",
  REVIEW_REQUESTED: "Solicitud valoración",
  ADMIN_NEW_BOOKING: "Alerta admin",
  ACCOUNT_CREATED: "Cuenta creada",
  DRIVER_ASSIGNED: "Conductor asignado",
  OTHER: "Otro",
};
