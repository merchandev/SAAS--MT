export const DEFAULT_TEMPLATES = [
  { 
    name: "BOOKING_PENDING", 
    description: "Reserva pendiente de confirmación", 
    subject: "Reserva recibida — Pendiente de confirmación #{{publicCode}}",
    defaultBody: `
      <h2>¡Hemos recibido tu solicitud de reserva!</h2>
      <p>Hola <strong>{{customerName}}</strong>,</p>
      <p>Tu solicitud de traslado está siendo revisada por nuestro equipo. Te enviaremos un correo de confirmación en breve cuando haya sido aprobada.</p>
      <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin-top: 20px;">
        <h3 style="margin-top: 0;">Detalles de la solicitud</h3>
        <p><strong>Código:</strong> {{publicCode}}</p>
        <p><strong>Fecha:</strong> {{serviceDate}}</p>
        <p><strong>Origen:</strong> {{originAddress}}</p>
        <p><strong>Destino:</strong> {{destinationAddress}}</p>
      </div>
    `
  },
  { 
    name: "BOOKING_CONFIRMED", 
    description: "Reserva confirmada por administrador", 
    subject: "✅ Reserva Confirmada #{{publicCode}} — Transfers in Barcelona",
    defaultBody: `
      <h2 style="color: #166534;">¡Tu traslado está confirmado!</h2>
      <p>Hola <strong>{{customerName}}</strong>,</p>
      <p>Nos complace confirmar tu reserva. Nuestro equipo profesional estará listo para recibirte puntualmente.</p>
      <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #e5e7eb;">
        <h3 style="margin-top: 0; color: #111827; text-transform: uppercase; font-size: 14px;">📋 Detalles confirmados</h3>
        <hr style="border-color: #e5e7eb; margin: 12px 0;" />
        <p><strong>Código:</strong> <span style="color: #D4AF37; font-family: monospace;">{{publicCode}}</span></p>
        <p><strong>Fecha:</strong> {{serviceDate}} a las {{serviceTime}}</p>
        <p><strong>Ruta:</strong> Desde {{originAddress}} hasta {{destinationAddress}}</p>
        <hr style="border-color: #e5e7eb; margin: 12px 0;" />
        <p style="font-size: 16px;"><strong>Total:</strong> <span style="color: #D4AF37; font-weight: bold;">{{totalPrice}}</span></p>
      </div>
      <div style="background-color: #fffbeb; padding: 15px; border-radius: 8px; border: 1px solid #fde68a;">
        <p style="color: #78350f; margin: 0;">🚗 <strong>Nuestro conductor te esperará</strong> con un cartel con tu nombre en el punto de recogida.</p>
      </div>
    `
  },
  { 
    name: "BOOKING_CANCELLED", 
    description: "Reserva cancelada", 
    subject: "Reserva Cancelada #{{publicCode}}",
    defaultBody: `
      <h2 style="color: #991b1b;">Reserva Cancelada</h2>
      <p>Hola <strong>{{customerName}}</strong>,</p>
      <p>Lamentamos informarte que tu reserva ha sido cancelada.</p>
      <p><strong>Código de reserva:</strong> {{publicCode}}</p>
      <p>Si tienes alguna duda o crees que se trata de un error, por favor contáctanos lo antes posible.</p>
    `
  },
  { 
    name: "BOOKING_REFUNDED", 
    description: "Reserva reembolsada", 
    subject: "Reembolso procesado para reserva #{{publicCode}}",
    defaultBody: `
      <h2>Reembolso Procesado</h2>
      <p>Hola <strong>{{customerName}}</strong>,</p>
      <p>Te confirmamos que hemos procesado correctamente el reembolso de tu reserva <strong>#{{publicCode}}</strong>.</p>
      <p>El monto de <strong>{{totalPrice}}</strong> ha sido devuelto a tu método de pago original. Dependiendo de tu banco, puede tardar entre 5 y 10 días hábiles en reflejarse.</p>
    `
  },
  { 
    name: "TRIP_STARTED", 
    description: "Viaje en curso", 
    subject: "🚗 Tu traslado ha comenzado — #{{publicCode}}",
    defaultBody: `
      <h2>Tu conductor está en camino</h2>
      <p>Hola <strong>{{customerName}}</strong>,</p>
      <p>Tu servicio está en curso. Tu conductor <strong>{{driverName}}</strong> ya está asignado a tu traslado desde {{originAddress}}.</p>
    `
  },
  { 
    name: "TRIP_COMPLETED", 
    description: "Viaje finalizado", 
    subject: "✅ Viaje completado — Gracias, {{customerName}}",
    defaultBody: `
      <h2>Gracias por viajar con nosotros</h2>
      <p>Hola <strong>{{customerName}}</strong>,</p>
      <p>Tu traslado a {{destinationAddress}} ha finalizado con éxito.</p>
      <p>Esperamos que hayas disfrutado de un viaje cómodo y seguro con <strong>Transfers in Barcelona</strong>.</p>
    `
  },
  { 
    name: "REVIEW_REQUESTED", 
    description: "Solicitud de valoración", 
    subject: "⭐ ¿Cómo fue tu traslado? Valóralo en 30 segundos",
    defaultBody: `
      <h2>Tu opinión es muy importante</h2>
      <p>Hola <strong>{{customerName}}</strong>,</p>
      <p>Recientemente completaste un traslado con nosotros el {{serviceDate}}. Nos ayudaría muchísimo si pudieras dedicarnos 30 segundos para contarnos cómo fue tu experiencia.</p>
      <p style="text-align: center; margin: 30px 0;">
        <a href="{{reviewUrl}}" style="background-color: #D4AF37; color: #000; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
          Valorar mi traslado
        </a>
      </p>
    `
  },
  { 
    name: "ADMIN_NEW_BOOKING", 
    description: "Alerta interna (solo admins)", 
    subject: "🔔 Nueva reserva #{{publicCode}}",
    defaultBody: `
      <h2>Nueva Reserva Recibida</h2>
      <p>Se ha registrado una nueva reserva en el sistema.</p>
      <ul>
        <li><strong>Cliente:</strong> {{customerName}}</li>
        <li><strong>Ruta:</strong> {{originAddress}} -> {{destinationAddress}}</li>
        <li><strong>Fecha:</strong> {{serviceDate}} a las {{serviceTime}}</li>
        <li><strong>Total:</strong> {{totalPrice}}</li>
      </ul>
    `
  },
];
