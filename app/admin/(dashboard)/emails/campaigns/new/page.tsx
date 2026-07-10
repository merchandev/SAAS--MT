import { prisma } from "@/lib/prisma";
import { requireRole } from "@/modules/auth/permissions";
import CampaignComposerClient from "./CampaignComposerClient";

export const dynamic = "force-dynamic";

export default async function NewCampaignPage({
  searchParams,
}: {
  searchParams: Promise<{ draftId?: string }>;
}) {
  await requireRole(["SUPER_ADMIN", "ADMIN"]);
  
  const { draftId } = await searchParams;

  let initialData = null;

  if (draftId) {
    const draft = await prisma.emailCampaign.findUnique({
      where: { id: draftId },
    });

    if (draft && draft.status === "DRAFT") {
      const recipientsArray = Array.isArray(draft.recipients) ? draft.recipients as string[] : [];
      initialData = {
        id: draft.id,
        name: draft.name,
        subject: draft.subject,
        body: draft.content,
        recipientsRaw: recipientsArray.join(", "),
        contactPhone: draft.contactPhone || "+34 662 02 41 36",
      };
    }
  }

  return <CampaignComposerClient initialData={initialData} />;
}
