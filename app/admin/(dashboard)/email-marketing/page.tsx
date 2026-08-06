import { prisma } from "@/lib/prisma";
import EmailMarketingDashboardClient from "./EmailMarketingDashboardClient";

export const dynamic = "force-dynamic";

export default async function EmailMarketingDashboard() {
  const totalContacts = await prisma.marketingContact.count();
  const activeContacts = await prisma.marketingContact.count({
    where: { hasConsent: true }
  });

  const activePercentage = totalContacts > 0 ? ((activeContacts / totalContacts) * 100).toFixed(1) : "0";

  const campaigns = await prisma.emailCampaign.findMany({
    orderBy: { createdAt: 'desc' },
    take: 50
  });

  let totalSent = 0;
  let totalDelivered = 0;
  let totalBounced = 0;
  let totalOpened = 0;

  campaigns.forEach(c => {
    totalSent += c.totalCount;
    totalDelivered += c.deliveredCount;
    totalBounced += c.bouncedCount;
    totalOpened += (c as any).openedCount || 0; // openedCount might not be in EmailCampaign directly yet, but it's safe to fallback to 0
  });

  const deliveryRate = totalSent > 0 ? ((totalDelivered / totalSent) * 100).toFixed(1) : "0";
  const openRate = totalDelivered > 0 ? ((totalOpened / totalDelivered) * 100).toFixed(1) : "0";
  const bounceRate = totalSent > 0 ? ((totalBounced / totalSent) * 100).toFixed(1) : "0";

  const metrics = {
    totalContacts,
    activeContacts,
    activePercentage,
    totalSent,
    deliveryRate,
    openRate,
    bounceRate
  };

  // Get daily metrics for the chart (last 7 days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  sevenDaysAgo.setUTCHours(0,0,0,0);

  const rawDailyData = await prisma.campaignMetricDaily.findMany({
    where: {
      date: {
        gte: sevenDaysAgo
      }
    },
    orderBy: { date: 'asc' }
  });

  // Aggregate by date (since they are per campaign)
  const aggregatedDaily = rawDailyData.reduce((acc, curr) => {
    const dateStr = curr.date.toISOString().split('T')[0];
    if (!acc[dateStr]) {
      acc[dateStr] = { date: dateStr, entregados: 0, aperturas: 0, rebotes: 0 };
    }
    acc[dateStr].entregados += curr.deliveredCount;
    acc[dateStr].aperturas += curr.openedCount;
    acc[dateStr].rebotes += curr.bouncedCount;
    return acc;
  }, {} as Record<string, any>);

  const dailyData = Object.values(aggregatedDaily);

  const recentCampaigns = campaigns.slice(0, 5);

  return (
    <EmailMarketingDashboardClient 
      metrics={metrics} 
      dailyData={dailyData} 
      recentCampaigns={recentCampaigns} 
    />
  );
}
