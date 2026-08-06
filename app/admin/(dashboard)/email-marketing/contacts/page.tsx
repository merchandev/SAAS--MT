import { prisma } from "@/lib/prisma";
import { requireRole } from "@/modules/auth/permissions";
import { ContactsClient } from "./ContactsClient";

export const metadata = {
  title: "Contactos | Email Marketing",
};

export const dynamic = "force-dynamic";

export default async function ContactsPage() {
  await requireRole(["SUPER_ADMIN", "ADMIN"]);

  const contacts = await prisma.marketingContact.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  const lists = await prisma.marketingList.findMany({
    where: { isActive: true },
    select: { id: true, name: true }
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <ContactsClient initialContacts={contacts} availableLists={lists} />
    </div>
  );
}
