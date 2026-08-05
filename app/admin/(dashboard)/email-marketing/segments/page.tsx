import { prisma } from "@/lib/prisma";
import { requireRole } from "@/modules/auth/permissions";
import { SegmentsClient } from "./SegmentsClient";

export const metadata = {
  title: "Segmentos | Email Marketing",
};

export const dynamic = "force-dynamic";

export default async function SegmentsPage() {
  await requireRole(["SUPER_ADMIN", "ADMIN"]);

  const segments = await prisma.marketingSegment.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <SegmentsClient initialSegments={segments} />
    </div>
  );
}
