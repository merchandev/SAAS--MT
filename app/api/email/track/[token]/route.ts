import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getTenantId } from "@/modules/auth/tenant.service";

const PIXEL = Buffer.from(
  "R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
  "base64"
);

export async function GET(req: Request, { params }: { params: Promise<{ token: string }> }) {
  try {
    const { token } = await params;

    if (token) {
      const email = await prisma.outboundEmail.findUnique({
        where: { id: token },
        select: { campaignId: true, id: true }
      });

      if (email && email.campaignId) {
        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);

        const hour = new Date();
        hour.setUTCMinutes(0, 0, 0);

        // Update Daily Metric
        await prisma.campaignMetricDaily.upsert({
          where: {
            campaignId_date: {
              campaignId: email.campaignId,
              date: today
            }
          },
          update: {
              
            openedCount: { increment: 1 }
          },
          create: {
              
            campaignId: email.campaignId,
            date: today,
            openedCount: 1
          }
        });

        // Update Hourly Metric
        await prisma.campaignMetricHourly.upsert({
          where: {
            campaignId_hour: {
              campaignId: email.campaignId,
              hour: hour
            }
          },
          update: {
              openedCount: { increment: 1 }
          },
          create: {
              campaignId: email.campaignId,
            hour: hour,
            openedCount: 1
          }
        });
      }
    }

  } catch (error) {
    console.error("[EMAIL_TRACK_ERROR]", error);
  }

  // Always return the transparent 1x1 GIF
  return new NextResponse(PIXEL, {
    headers: {
      "Content-Type": "image/gif",
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      "Pragma": "no-cache",
      "Expires": "0",
    },
  });
}
