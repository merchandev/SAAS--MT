import { prisma } from "@/lib/prisma";
import AudienceClient from "./AudienceClient";

export const dynamic = "force-dynamic";

export default async function AudienceReportPage() {
  const totalContacts = await prisma.marketingContact.count();
  const activeContacts = await prisma.marketingContact.count({
    where: { hasConsent: true }
  });

  // Calculate growth over the last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  thirtyDaysAgo.setUTCHours(0, 0, 0, 0);

  const rawGrowth = await prisma.marketingContact.groupBy({
    by: ['createdAt'],
    _count: { id: true },
    where: { createdAt: { gte: thirtyDaysAgo } }
  });

  // Aggregate by day
  const dailyCounts: Record<string, number> = {};
  rawGrowth.forEach(item => {
    const d = new Date(item.createdAt);
    const dateStr = d.toISOString().split("T")[0];
    dailyCounts[dateStr] = (dailyCounts[dateStr] || 0) + item._count.id;
  });

  // Find total before 30 days
  let cumulative = await prisma.marketingContact.count({
    where: { createdAt: { lt: thirtyDaysAgo } }
  });

  // Generate 30 day array
  const growthData = [];
  for (let i = 0; i < 30; i++) {
    const d = new Date(thirtyDaysAgo);
    d.setDate(d.getDate() + i);
    const dateStr = d.toISOString().split("T")[0];
    const nuevos = dailyCounts[dateStr] || 0;
    cumulative += nuevos;
    growthData.push({
      date: dateStr,
      nuevos: nuevos,
      total: cumulative
    });
  }

  return (
    <AudienceClient 
      totalContacts={totalContacts} 
      activeContacts={activeContacts} 
      growthData={growthData} 
    />
  );
}
