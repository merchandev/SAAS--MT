import { prisma } from "@/lib/prisma";
import DeliverabilityClient from "./DeliverabilityClient";

export const dynamic = "force-dynamic";

export default async function DeliverabilityReportPage() {
  const totalSuppressions = await prisma.emailSuppression.count();
  
  const totalHardBounces = await prisma.emailSuppression.count({
    where: { reason: "HARD_BOUNCE" }
  });

  const totalComplaints = await prisma.emailSuppression.count({
    where: { reason: "SPAM_COMPLAINT" }
  });

  const rawReasons = await prisma.emailSuppression.groupBy({
    by: ['reason'],
    _count: { id: true }
  });

  const bounceReasons = rawReasons.map(r => ({
    reason: r.reason.replace("_", " "),
    count: r._count.id
  })).sort((a, b) => b.count - a.count);

  return (
    <DeliverabilityClient 
      totalSuppressions={totalSuppressions}
      totalHardBounces={totalHardBounces}
      totalComplaints={totalComplaints}
      bounceReasons={bounceReasons}
    />
  );
}
