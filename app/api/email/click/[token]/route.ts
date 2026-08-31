import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getTenantId } from "@/modules/auth/tenant.service";

export async function GET(req: Request, { params }: { params: Promise<{ token: string }> }) {
  try {
    const { token } = await params;
    const url = new URL(req.url);
    const redirectUrl = url.searchParams.get("url");

    if (!redirectUrl) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    // P0 - Seguridad: Prevenir Open Redirect
    // Solo permitir rutas relativas o dominios confiables
    let isValidRedirect = false;
    try {
      const parsedRedirect = new URL(redirectUrl, req.url);
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL || "https://saas.merchan.dev";
      const trustedHost = new URL(appUrl).host;
      
      if (redirectUrl.startsWith("/") && !redirectUrl.startsWith("//")) {
        isValidRedirect = true;
      } else if (parsedRedirect.host === trustedHost) {
        isValidRedirect = true;
      }
    } catch (e) {
      // Invalid URL format
    }

    if (!isValidRedirect) {
      return NextResponse.redirect(new URL("/", req.url));
    }

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
              
            clickedCount: { increment: 1 }
          },
          create: {
              
            campaignId: email.campaignId,
            date: today,
            clickedCount: 1
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
              clickedCount: { increment: 1 }
          },
          create: {
              campaignId: email.campaignId,
            hour: hour,
            clickedCount: 1
          }
        });

        // Update Link Metric
        await prisma.linkMetric.upsert({
          where: {
            campaignId_url: {
              campaignId: email.campaignId,
              url: redirectUrl
            }
          },
          update: {
              clickedCount: { increment: 1 }
          },
          create: {
              campaignId: email.campaignId,
            url: redirectUrl,
            clickedCount: 1,
            uniqueClicks: 1
          }
        });
      }
    }

    return NextResponse.redirect(redirectUrl);

  } catch (error) {
    console.error("[EMAIL_CLICK_ERROR]", error);
    // Even if it fails to track, redirect the user
    const redirectUrl = new URL(req.url).searchParams.get("url");
    if (redirectUrl) {
      return NextResponse.redirect(redirectUrl);
    }
    return NextResponse.redirect(new URL("/", req.url));
  }
}
