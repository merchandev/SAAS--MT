import { prisma } from "@/lib/prisma";
import { requireRole } from "@/modules/auth/permissions";
import { ListsClient } from "./ListsClient";

export const metadata = {
  title: "Listas | Email Marketing",
};

export const dynamic = "force-dynamic";

export default async function ListsPage() {
  await requireRole(["SUPER_ADMIN", "ADMIN"]);

  const lists = await prisma.marketingList.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { contacts: true }
      }
    }
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <ListsClient initialLists={lists} />
    </div>
  );
}
