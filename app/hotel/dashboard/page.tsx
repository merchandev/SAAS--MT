import { authService } from "@/modules/auth/auth.service";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function HotelDashboardPage() {
  const session = await authService.getSession();

  if (!session) {
    redirect("/admin/login");
  }

  const allowedRoles = ["HOTEL", "AGENCY", "SUPER_ADMIN", "ADMIN"];

  if (!allowedRoles.includes(session.role)) {
    redirect("/");
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <section className="mx-auto max-w-5xl rounded-xl border bg-white p-8 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-blue-600">
              Portal autenticado B2B
            </p>
            <h1 className="mt-2 text-3xl font-bold text-gray-900">Dashboard hotel/agencia</h1>
          </div>
          <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
            {session.role}
          </span>
        </div>

        <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-6">
          <h2 className="text-lg font-semibold text-gray-900">Cuenta autenticada</h2>
          <p className="mt-2 text-sm text-gray-600">
            Sesión iniciada como {session.email}. Falta vincular usuarios B2B con hoteles o agencias
            para mostrar reservas, comisiones y acciones específicas por cuenta.
          </p>
        </div>
      </section>
    </main>
  );
}
