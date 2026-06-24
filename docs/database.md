# Modelo de Datos MeTransfers SaaS

La base de datos se modela en PostgreSQL usando **Prisma ORM**. Todo dato financiero se gestiona con `Decimal(10,2)` para evitar pérdidas de precisión.

## Entidades Principales

### 1. Booking (Reserva)
El centro neurálgico del sistema. Relaciona todas las entidades.
- **Campos críticos**: `basePrice`, `discountAmount`, `surchargeAmount`, `finalPrice`.
- **Estados**: 
  - `BookingStatus`: DRAFT, PENDING_PAYMENT, PAID, CONFIRMADA, EN_CURSO, COMPLETADA...
  - `PaymentStatus`: PENDING, AUTHORIZED, PAID, FAILED, REFUNDED.
  - `SourceType`: WEB_DIRECT, HOTEL_QR, AGENCY_LINK, MANUAL_ADMIN.

### 2. Vehículos y Reglas de Precio
- **Vehicle**: Representa el coche físico. Almacena capacidad y precios base por km/hora.
- **PriceRule**: Dinamismo de precios. Define reglas como "Recargo Nocturno del 15%", "Tarifa Fija de Aeropuerto", etc.
- **DiscountCode**: Códigos promocionales aplicables al momento del checkout.

### 3. Actores del Sistema (B2B y B2C)
- **User**: Usuarios de sistema con `Role` (SUPER_ADMIN, OPERATOR, etc.).
- **Customer**: El pasajero final que recibe el servicio. Agrupa historial y facturación.
- **Driver**: Conductores con estado en tiempo real (EN_CAMINO, ASIGNADO).
- **Hotel / Agency**: Entidades B2B que generan reservas referidas mediante tokens únicos.

### 4. Pagos y Trazabilidad
- **Payment**: Registro individual de intentos de cobro, respuestas de Redsys y firmas de validación.
- **AuditLog**: Historial de cada cambio en reservas, precios y asignaciones.
- **NotificationLog**: Registro de correos y mensajes enviados (para verificar fallos de comunicación).

## Consideraciones para Desarrollo
- **Migraciones**: Jamás modificar el schema directamente en la DB. Editar `schema.prisma` y correr `npx prisma migrate dev`.
- **Tipos de Datos**: Usar `import { Prisma } from '@prisma/client'` al trabajar con campos `Decimal`.
- **Relaciones Cíclicas**: Evitarlas. Las entidades apuntan hacia abajo o mantienen un ID referencial (ej. un `Booking` apunta a `Vehicle` y a `Customer`).
