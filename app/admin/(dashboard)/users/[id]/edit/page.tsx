import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { usersQueries } from "@/modules/users/users.queries";
import { PasswordResetForm } from "../../PasswordResetForm";
import { UserForm } from "../../UserForm";

export const dynamic = "force-dynamic";

export default async function EditUserPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const [user, options] = await Promise.all([
    usersQueries.getUserByIdForAdmin(params.id),
    usersQueries.getUserFormOptions(),
  ]);

  if (!user) {
    notFound();
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/users" className="text-gray-500 hover:text-gray-900">
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <div>
          <h3 className="text-2xl font-bold tracking-tight">Editar usuario</h3>
          <p className="text-gray-500">{user.email}</p>
        </div>
      </div>

      <UserForm mode="edit" user={user} hotels={options.hotels} agencies={options.agencies} />
      <PasswordResetForm userId={user.id} />
    </div>
  );
}
