# Arquitectura del Sistema MeTransfers SaaS

## 1. Visión General
MeTransfers es un SaaS especializado para la gestión operativa y de reservas de traslados privados.

El sistema se estructura bajo la arquitectura **App Router** de Next.js, utilizando un enfoque orientado a dominios (Domain-Driven Design simplificado) mediante la carpeta `modules/`.

## 2. Stack Tecnológico
- **Frontend**: Next.js 14+ (App Router), React, Tailwind CSS, shadcn/ui.
- **Backend**: Server Actions y Route Handlers (API).
- **Base de Datos**: PostgreSQL gestionado mediante Prisma ORM.
- **Pagos**: Pasarela Redsys.
- **Infraestructura**: Docker Compose para entorno local/DB. Despliegue en VPS.

## 3. Estructura de Módulos (`modules/`)
Toda la lógica de negocio debe residir en su módulo correspondiente, en lugar de diluirse en componentes de UI o rutas.

```text
modules/
├── bookings/      # Gestión de reservas (creación, estados, notas)
├── pricing/       # Motor de precios, reglas, suplementos y descuentos
├── payments/      # Integración con Redsys, estados de pagos
├── vehicles/      # CRUD de vehículos y categorías
├── hotels/        # B2B: Hoteles QR, tokens, comisiones
├── agencies/      # B2B: Agencias, enlaces, comisiones
├── customers/     # Pasajeros, historial, datos de contacto
├── drivers/       # Conductores, asignaciones, estados operativos
├── notifications/ # Plantillas de correos, WhatsApp y logs
├── auth/          # Autenticación, roles y permisos
└── reports/       # Estadísticas y métricas financieras
```

### 3.1 Anatomía de un módulo
Cada módulo debe contener los siguientes archivos (según necesidad):
- `[module].actions.ts`: Server Actions (mutaciones llamadas desde el cliente).
- `[module].queries.ts`: Funciones de lectura directa a la DB.
- `[module].schemas.ts`: Validaciones con Zod.
- `[module].service.ts`: Lógica de negocio pura (ej. `calculateBookingPrice()`).
- `[module].types.ts`: Tipos TypeScript específicos.

## 4. Patrones de Diseño Obligatorios
1. **El Servidor es la Fuente de la Verdad**: El precio jamás se fía del cliente. Siempre se recalcula en `pricing.service.ts` antes de persistir o cobrar.
2. **Pagos Asíncronos**: La confirmación de Redsys se gestiona vía Webhook (`/api/redsys/notification`), no por redirección del usuario.
3. **Auditoría Estricta**: Toda mutación en una reserva o pago se registra en `AuditLog`.
4. **Validación Zod**: Todo input desde Server Actions o API debe validarse con `zod` antes de llegar a Prisma.
