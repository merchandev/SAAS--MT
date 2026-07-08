export const DEFAULT_TEMPLATES = [
  { name: "BOOKING_PENDING", description: "Reserva pendiente de confirmación", subject: "Reserva recibida — Pendiente de confirmación #{{publicCode}}" },
  { name: "BOOKING_CONFIRMED", description: "Reserva confirmada por administrador", subject: "✅ Reserva Confirmada #{{publicCode}} — Transfers in Barcelona" },
  { name: "BOOKING_CANCELLED", description: "Reserva cancelada", subject: "Reserva Cancelada #{{publicCode}}" },
  { name: "BOOKING_REFUNDED", description: "Reserva reembolsada", subject: "Reembolso procesado para reserva #{{publicCode}}" },
  { name: "TRIP_STARTED", description: "Viaje en curso", subject: "🚗 Tu traslado ha comenzado — #{{publicCode}}" },
  { name: "TRIP_COMPLETED", description: "Viaje finalizado", subject: "✅ Viaje completado — Gracias, {{customerName}}" },
  { name: "REVIEW_REQUESTED", description: "Solicitud de valoración", subject: "⭐ ¿Cómo fue tu traslado? Valóralo en 30 segundos" },
  { name: "ADMIN_NEW_BOOKING", description: "Alerta interna (solo admins)", subject: "🔔 Nueva reserva #{{publicCode}}" },
];
