import { prisma } from "@/lib/prisma";
import CampaignsReportClient from "./CampaignsReportClient";

export const dynamic = "force-dynamic";

export default async function CampaignsReportPage() {
  const campaigns = await prisma.emailCampaign.findMany({
    orderBy: { createdAt: 'desc' },
    take: 10
  });

  const campaignsData = campaigns.map(camp => {
    const total = camp.totalCount || 1; // avoid division by zero
    const delivered = camp.deliveredCount || 0;
    
    // We don't have openCount directly on EmailCampaign in this schema, 
    // so we will query it from CampaignMetricDaily or just use 0 if not stored there.
    // Wait, the aggregated metrics are in CampaignMetricDaily. Let's fetch them!
    return {
      id: camp.id,
      name: camp.name.length > 20 ? camp.name.substring(0, 20) + "..." : camp.name,
      totalCount: camp.totalCount,
      deliveredCount: camp.deliveredCount,
    };
  });

  // Fetch daily metrics to get true open and click counts
  const allMetrics = await prisma.campaignMetricDaily.findMany({
    where: { campaignId: { in: campaigns.map(c => c.id) } }
  });

  let sumOpenRate = 0;
  let sumClickRate = 0;
  let validCamps = 0;
  let totalSentAll = 0;

  const finalData = campaignsData.map(camp => {
    const metrics = allMetrics.filter(m => m.campaignId === camp.id);
    const openedCount = metrics.reduce((acc, m) => acc + m.openedCount, 0);
    const clickedCount = metrics.reduce((acc, m) => acc + m.clickedCount, 0);
    
    const deliveryRate = camp.totalCount > 0 ? (camp.deliveredCount / camp.totalCount) * 100 : 0;
    const openRate = camp.deliveredCount > 0 ? (openedCount / camp.deliveredCount) * 100 : 0;
    const clickRate = openedCount > 0 ? (clickedCount / openedCount) * 100 : 0;

    if (camp.totalCount > 0) {
      sumOpenRate += openRate;
      sumClickRate += clickRate;
      validCamps++;
      totalSentAll += camp.deliveredCount;
    }

    return {
      name: camp.name,
      deliveryRate: Number(deliveryRate.toFixed(1)),
      openRate: Number(openRate.toFixed(1)),
      clickRate: Number(clickRate.toFixed(1)),
    };
  }).reverse(); // chronological order for chart

  const avgOpenRate = validCamps > 0 ? sumOpenRate / validCamps : 0;
  const avgClickRate = validCamps > 0 ? sumClickRate / validCamps : 0;

  return (
    <CampaignsReportClient 
      campaignsData={finalData}
      avgOpenRate={avgOpenRate}
      avgClickRate={avgClickRate}
      totalSent={totalSentAll}
    />
  );
}
