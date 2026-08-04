"use client";

import { useState, useMemo } from "react";
import { Search, CheckCircle2, XCircle, Mail, Clock, Filter } from "lucide-react";

const EVENT_LABELS: Record<string, string> = {
  BOOKING_PENDING:   "Reserva pendiente",
  BOOKING_CONFIRMED: "Reserva confirmada",
  BOOKING_CANCELLED: "Reserva cancelada",
  BOOKING_REFUNDED:  "Reembolso",
  TRIP_STARTED:      "Viaje iniciado",
  TRIP_COMPLETED:    "Viaje completado",
  REVIEW_REQUESTED:  "Solicitud valoración",
  ADMIN_NEW_BOOKING: "Alerta admin",
  ACCOUNT_CREATED:   "Cuenta creada",
  DRIVER_ASSIGNED:   "Conductor asignado",
};

const EVENT_COLORS: Record<string, string> = {
  BOOKING_PENDING:   "bg-yellow-100 text-yellow-800",
  BOOKING_CONFIRMED: "bg-green-100 text-green-800",
  BOOKING_CANCELLED: "bg-red-100 text-red-800",
  BOOKING_REFUNDED:  "bg-purple-100 text-purple-800",
  TRIP_STARTED:      "bg-blue-100 text-blue-800",
  TRIP_COMPLETED:    "bg-emerald-100 text-emerald-800",
  REVIEW_REQUESTED:  "bg-amber-100 text-amber-800",
  ADMIN_NEW_BOOKING: "bg-indigo-100 text-indigo-800",
  ACCOUNT_CREATED:   "bg-teal-100 text-teal-800",
  DRIVER_ASSIGNED:   "bg-sky-100 text-sky-800",
};

interface EmailLog {
  id: string;
  recipient: string;
  subject: string | null;
  eventType: string | null;
  status: string;
  bookingId: string | null;
  errorReason: string | null;
  sentAt: Date | string;
}

const ALL_EVENTS = ["ALL", ...Object.keys(EVENT_LABELS)];
const ALL_STATUSES = ["ALL", "SENT", "FAILED"];

export default function EmailLogTable({ logs }: { logs: EmailLog[] }) {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [filterEvent, setFilterEvent] = useState("ALL");
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    return logs.filter((log) => {
      const matchSearch =
        !search ||
        log.recipient.toLowerCase().includes(search.toLowerCase()) ||
        (log.subject || "").toLowerCase().includes(search.toLowerCase()) ||
        (log.bookingId || "").toLowerCase().includes(search.toLowerCase());

      const matchStatus = filterStatus === "ALL" || log.status === filterStatus;
      const matchEvent =
        filterEvent === "ALL" ||
        (filterEvent === "OTHER" && !EVENT_LABELS[log.eventType || ""])
          ? true
          : log.eventType === filterEvent;

      return matchSearch && matchStatus && matchEvent;
    });
  }, [logs, search, filterStatus, filterEvent]);

  function formatDate(date: Date | string) {
    return new Date(date).toLocaleString("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <div className="space-y-4">
      {/* Search + filter bar */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por destinatario, asunto o código de reserva..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#D4AF37] transition-colors"
          />
        </div>
        <button
          type="button"
          onClick={() => setShowFilters((v) => !v)}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${
            showFilters || filterStatus !== "ALL" || filterEvent !== "ALL"
              ? "border-[#D4AF37] bg-[#D4AF37]/10 text-gray-900"
              : "border-gray-200 text-gray-600 hover:bg-gray-50"
          }`}
        >
          <Filter className="h-4 w-4" />
          Filtros
          {(filterStatus !== "ALL" || filterEvent !== "ALL") && (
            <span className="h-1.5 w-1.5 rounded-full bg-[#D4AF37]" />
          )}
        </button>
      </div>

      {/* Expandable filters */}
      {showFilters && (
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-wrap gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</label>
            <div className="flex gap-2">
              {ALL_STATUSES.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setFilterStatus(s)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
                    filterStatus === s
                      ? "bg-gray-900 text-white border-gray-900"
                      : "border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {s === "ALL" ? "Todos" : s === "SENT" ? "✅ Enviado" : "❌ Fallido"}
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo de evento</label>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setFilterEvent("ALL")}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
                  filterEvent === "ALL" ? "bg-gray-900 text-white border-gray-900" : "border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                Todos
              </button>
              {Object.entries(EVENT_LABELS).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setFilterEvent(key)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
                    filterEvent === key ? "bg-gray-900 text-white border-gray-900" : "border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Results count */}
      <p className="text-sm text-gray-500 px-1">
        Mostrando <strong className="text-gray-900">{filtered.length}</strong> de {logs.length} emails
      </p>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 w-10">Estado</th>
                <th className="px-4 py-3">Destinatario</th>
                <th className="px-4 py-3">Asunto</th>
                <th className="px-4 py-3">Tipo</th>
                <th className="px-4 py-3">Reserva</th>
                <th className="px-4 py-3 text-right">Fecha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-gray-400">
                    <Mail className="h-8 w-8 mx-auto mb-2 opacity-40" />
                    <p>No hay registros que coincidan con los filtros.</p>
                  </td>
                </tr>
              ) : (
                filtered.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50/80 transition-colors">
                    {/* Status */}
                    <td className="px-4 py-3">
                      {log.status === "SENT" ? (
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-500" />
                      )}
                    </td>

                    {/* Recipient */}
                    <td className="px-4 py-3 font-medium text-gray-900 max-w-[180px] truncate">
                      {log.recipient}
                    </td>

                    {/* Subject */}
                    <td className="px-4 py-3 text-gray-600 max-w-[260px]">
                      <span className="truncate block" title={log.subject || ""}>
                        {log.subject || <span className="text-gray-400 italic">sin asunto</span>}
                      </span>
                      {log.status === "FAILED" && log.errorReason && (
                        <span className="text-xs text-red-500 block truncate">{log.errorReason}</span>
                      )}
                    </td>

                    {/* Event type badge */}
                    <td className="px-4 py-3">
                      {log.eventType ? (
                        <span
                          className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap ${
                            EVENT_COLORS[log.eventType] || "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {EVENT_LABELS[log.eventType] || log.eventType}
                        </span>
                      ) : (
                        <span className="text-gray-400 text-xs">—</span>
                      )}
                    </td>

                    {/* Booking link */}
                    <td className="px-4 py-3">
                      {log.bookingId ? (
                        <a
                          href={`/admin/bookings/${log.bookingId}`}
                          className="text-[#D4AF37] hover:underline text-xs font-mono"
                        >
                          Ver reserva →
                        </a>
                      ) : (
                        <span className="text-gray-400 text-xs">—</span>
                      )}
                    </td>

                    {/* Date */}
                    <td className="px-4 py-3 text-right text-gray-500 text-xs whitespace-nowrap">
                      <span className="flex items-center justify-end gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDate(log.sentAt)}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
