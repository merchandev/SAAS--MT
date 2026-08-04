import { prisma } from "@/lib/prisma";
import { requireRolePage } from "@/modules/auth/permissions";
import { ContactsTable } from "./contacts-table";
import { PlusCircle, Upload } from "lucide-react";

export default async function MarketingContactsPage({
  searchParams,
}: {
  searchParams: { page?: string; search?: string };
}) {
  await requireRolePage(["ADMIN", "SUPER_ADMIN"]);

  const page = parseInt(searchParams.page || "1");
  const search = searchParams.search || "";
  const limit = 50;
  const skip = (page - 1) * limit;

  const where = search
    ? {
        OR: [
          { email: { contains: search, mode: "insensitive" as const } },
          { firstName: { contains: search, mode: "insensitive" as const } },
          { lastName: { contains: search, mode: "insensitive" as const } },
        ],
      }
    : {};

  const [contacts, total] = await Promise.all([
    prisma.marketingContact.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        customer: true,
        tags: { include: { tag: true } },
      },
    }),
    prisma.marketingContact.count({ where }),
  ]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Marketing Contacts</h1>
          <p className="text-sm text-gray-500">
            Manage your audience for mass email campaigns. Total: {total}
          </p>
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition">
            <Upload className="w-4 h-4" />
            <span>Import CSV</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition">
            <PlusCircle className="w-4 h-4" />
            <span>Add Contact</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow border border-gray-200">
        <ContactsTable contacts={contacts} total={total} currentPage={page} />
      </div>
    </div>
  );
}
