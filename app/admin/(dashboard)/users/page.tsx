import Link from "next/link";
import { KeyRound, ShieldCheck, UserPlus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usersQueries } from "@/modules/users/users.queries";
import { UserRowActions } from "./UserRowActions";

export const dynamic = "force-dynamic";

const roleLabels: Record<string, string> = {
  SUPER_ADMIN: "Super admin",
  ADMIN: "Admin",
  OPERATOR: "Operador",
  HOTEL: "Hotel",
  AGENCY: "Agencia",
  DRIVER: "Conductor",
  CUSTOMER: "Cliente",
};

function statusBadge(isActive: boolean) {
  return isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
}

export default async function UsersPage() {
  const users = await usersQueries.getAdminUsers();
  const activeUsers = users.filter((user) => user.isActive).length;
  const adminUsers = users.filter((user) => ["SUPER_ADMIN", "ADMIN", "OPERATOR"].includes(user.role)).length;
  const externalUsers = users.length - adminUsers;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-2xl font-bold tracking-tight">Usuarios y Perfiles</h3>
          <p className="text-gray-500">Administración de accesos, roles, perfiles y estado de cuentas.</p>
        </div>
        <Link href="/admin/users/new">
          <Button>
            <UserPlus className="h-4 w-4" />
            Nuevo usuario
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
            <Users className="h-4 w-4 text-blue-600" />
            Total usuarios
          </div>
          <p className="mt-2 text-3xl font-bold text-gray-900">{users.length}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
            <ShieldCheck className="h-4 w-4 text-green-600" />
            Activos
          </div>
          <p className="mt-2 text-3xl font-bold text-gray-900">{activeUsers}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
            <KeyRound className="h-4 w-4 text-amber-600" />
            Perfiles externos
          </div>
          <p className="mt-2 text-3xl font-bold text-gray-900">{externalUsers}</p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Usuario</th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Rol</th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Perfil asociado</th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Estado</th>
              <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {users.map((user) => {
              const profile =
                user.role === "HOTEL"
                  ? user.hotel?.name ?? "Hotel no asignado"
                  : user.role === "AGENCY"
                    ? user.agency?.name ?? "Agencia no asignada"
                    : user.role === "DRIVER"
                      ? `${user.driverProfile?.licenseNumber ?? "Sin licencia"} (${user.driverProfile?._count.bookings ?? 0} reservas)`
                      : user.role === "CUSTOMER"
                        ? `${user.customerProfile?._count.bookings ?? 0} traslados / EUR ${(user.customerProfile?.totalSpent ?? 0).toFixed(2)}`
                        : "Equipo interno";

              return (
                <tr key={user.id} className="hover:bg-gray-50/70">
                  <td className="px-5 py-4">
                    <div className="font-semibold text-gray-900">{user.fullName}</div>
                    <div className="text-xs text-gray-500">{user.email}</div>
                    <div className="text-xs text-gray-400">{user.phone || "Sin teléfono"}</div>
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <span className="inline-flex rounded-full bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-700">
                      {roleLabels[user.role] ?? user.role}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-gray-600">{profile}</td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${statusBadge(user.isActive)}`}>
                      {user.isActive ? "Activo" : "Suspendido"}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <UserRowActions userId={user.id} isActive={user.isActive} />
                  </td>
                </tr>
              );
            })}
            {users.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                  No hay usuarios registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
