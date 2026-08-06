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
  
  const params = await searchParams;
  const draftId = params.draftId;

  let initialData = null;

  if (draftId) {
    const draft = await prisma.emailCampaign.findUnique({
      where: { id: draftId },
    });

    if (draft && draft.status === "DRAFT") {
      const recipientsArray = Array.isArray(draft.legacyRecipients) ? draft.legacyRecipients as string[] : [];
      initialData = {
        id: draft.id,
        name: draft.name,
        subject: draft.subject,
        body: draft.content,
        recipientsRaw: recipientsArray.join(", "),
        marketingSegmentId: draft.marketingSegmentId || "",
        marketingListId: draft.marketingListId || "",
        emailTemplateId: draft.emailTemplateId || "",
        contactPhone: draft.contactPhone || "+34 662 02 41 36",
        sendingRate: draft.sendingRate,
        sendFromHour: draft.sendFromHour || "",
        sendToHour: draft.sendToHour || "",
      };
    }
  }

  const [segments, lists, templates] = await Promise.all([
    prisma.marketingSegment.findMany({ where: { isActive: true } }),
    prisma.marketingList.findMany({ where: { isActive: true } }),
    prisma.emailTemplate.findMany({ where: { isActive: true } }),
  ]);

  return (
    <CampaignComposerClient 
      initialData={initialData} 
      segments={segments} 
      lists={lists} 
      templates={templates} 
    />
  );
}
