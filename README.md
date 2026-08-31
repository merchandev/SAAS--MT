# Plataforma SaaS para Gestión de Traslados Privados
**Powered by Merchan.Dev**

Plataforma SaaS B2B2C multi-tenant diseñada para empresas de transfers, VTC, chóferes privados, agencias de viajes y hoteles. Permite a múltiples operadores gestionar de forma independiente reservas, clientes, conductores, vehículos, tarifas, agencias colaboradoras y pagos desde un único panel centralizado.

> **Repositorio**: [merchandev/SAAS--MT](https://github.com/merchandev/SAAS--MT)

---

## 🚀 Características Principales (SaaS B2B2C)

- **Motor de Reservas Integrado:** Cálculo dinámico de tarifas por distancia/zonas, suplementos nocturnos, gestión de equipaje y selección de vehículos.
- **Gestión Operativa Integral:** Asignación de conductores, control de flota de vehículos, estados de reserva en tiempo real y seguimiento.
- **Facturación y Pagos:** Emisión automática de facturas y recibos. Integración con pasarela de pagos (Redsys).
- **Portal de Colaboradores (B2B):** Áreas exclusivas para Hoteles y Agencias, con gestión de comisiones, reservas por referidos y QR codes.
- **Arquitectura Multi-tenant (En desarrollo):** Preparado para aislar datos por `Company`, permitiendo configuraciones personalizadas (branding, monedas, correos) por cada cliente del software.

- **Integración Universal (API & Plugins):** Conectable con cualquier plataforma. Incluye plugins nativos para WordPress, Shopify, integraciones con GoHighLevel (GHL), SDKs para React/PHP y una API REST completa para sistemas a medida.
- **Sistema de Roles:** SUPER_ADMIN (Merchan.Dev), COMPANY_ADMIN, OPERATOR, DRIVER, HOTEL, AGENCY, CUSTOMER.

## 🛠️ Stack Tecnológico

- **Framework**: Next.js 16.2.9 (App Router)
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS v4, shadcn/ui
- **Base de Datos**: PostgreSQL
- **ORM**: Prisma
- **Pagos**: Pasarela Redsys
- **Seguridad y Auth**: JWT (jose), bcryptjs, validación estricta de variables y sanitización (prevención P0).

---

## 💻 Inicio Rápido (Desarrollo Local)

### Prerrequisitos
- Node.js 20.19+ (Node 22 recomendado)
- Docker & Docker Compose (para base de datos local)

### 1. Instalación
Clona el repositorio e instala las dependencias:
```bash
git clone https://github.com/merchandev/SAAS--MT.git
cd SAAS--MT
npm install
```

### 2. Variables de Entorno
Copia el archivo de ejemplo y rellena tus credenciales (URL de la base de datos, Secret JWT, credenciales SMTP, etc.):
```bash
cp .env.example .env
```

### 3. Base de Datos (Local)
Inicia la base de datos PostgreSQL mediante Docker:
```bash
docker compose up -d postgres
```
*(Opcional: PgAdmin está disponible vinculando el perfil de desarrollo)*
```bash
docker compose --profile dev up -d pgadmin
```

### 4. Prisma & Migraciones
Aplica el esquema a la base de datos y genera el cliente de Prisma:
```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 5. Iniciar Servidor
```bash
npm run dev
```
La plataforma estará disponible en `http://localhost:3000`.

---

## 📦 Despliegue en Producción (Docker VPS)

El proyecto incluye un `docker-compose.yml` optimizado para entornos de producción (como Hostinger VPS) que levanta la base de datos y la aplicación Next.js de forma aislada.

1. Configura tu `.env` (asegurándote de que `NEXT_PUBLIC_APP_URL` apunte a tu dominio real).
2. Construye y levanta los servicios:
```bash
docker compose up -d --build
```
La web expone por defecto el puerto `3100` (configura tu NGINX/Proxy Inverso para apuntar a este puerto localmente).

*(Nota: El contenedor de producción aplica automáticamente `npx prisma migrate deploy` al arrancar. Para poblar datos iniciales, ejecuta manualmente el seed).*
```bash
docker compose run --rm app node node_modules/ts-node/dist/bin.js prisma/seed.ts
```

---

## 🔒 Seguridad
Se han mitigado vulnerabilidades críticas (P0) en las áreas de autenticación, Host Header Poisoning, Open Redirects e Inyecciones HTML. El acceso de roles administrativos y de GPS requiere tokens JWT fuertemente validados.

- [Database Schema](docs/database.md)

## Development Workflow
All business logic is contained within the `modules/` directory to adhere to Domain-Driven Design principles. Please review the architecture guide before adding new routes or database models.
