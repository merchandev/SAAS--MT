import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { usersQueries } from "@/modules/users/users.queries";
import { UserForm } from "../UserForm";

export const dynamic = "force-dynamic";

export default async function NewUserPage() {
  const { hotels, agencies } = await usersQueries.getUserFormOptions();

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/users" className="text-gray-500 hover:text-gray-900">
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <div>
          <h3 className="text-2xl font-bold tracking-tight">Crear usuario</h3>
          <p className="text-gray-500">Alta interna de administradores, operadores, clientes, conductores y usuarios B2B.</p>
        </div>
      </div>

      <UserForm mode="create" hotels={hotels} agencies={agencies} />
    </div>
  );
}
