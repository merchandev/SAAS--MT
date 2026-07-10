import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/modules/auth/permissions";

export const dynamic = "force-dynamic";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireRole(["SUPER_ADMIN", "ADMIN"]);
    const { id } = await params;

    const campaign = await prisma.emailCampaign.findUnique({
      where: { id },
    });

    if (!campaign) {
      return new NextResponse("Campaign not found", { status: 404 });
    }

    const logs = await prisma.notificationLog.findMany({
      where: { campaignId: id },
      orderBy: { sentAt: "desc" },
    });

    const recipients = (Array.isArray(campaign.recipients) ? campaign.recipients : []) as string[];
    
    // Create CSV header
    let csvContent = "Destinatario,Estado,Fecha de Envio,Razon de Error\n";

    recipients.forEach((email) => {
      const log = logs.find(l => l.recipient === email);
      
      const recipientSafe = `"${email}"`;
      
      let status = "Pendiente";
      if (log?.status === "SENT") status = "Enviado";
      else if (log?.status === "FAILED") status = "Fallido";
      else if (log?.status === "BOUNCED") status = "Rebotado";
      else if (log?.status === "DELIVERED") status = "Entregado";
      else if (log?.status === "OPENED") status = "Abierto";
      else if (log?.status === "CLICKED") status = "Clic";

      const dateStr = log ? `"${log.sentAt.toISOString()}"` : '""';
      
      // Limpiar el mensaje de error de comillas dobles y saltos de línea para el CSV
      let errorReason = '""';
      if (log?.errorReason) {
        const cleanError = log.errorReason.replace(/"/g, '""').replace(/\n/g, ' ');
        errorReason = `"${cleanError}"`;
      }

      csvContent += `${recipientSafe},${status},${dateStr},${errorReason}\n`;
    });

    // Sanitize filename
    const safeName = campaign.name.replace(/[^a-z0-9]/gi, '_').toLowerCase();

    return new NextResponse(csvContent, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="reporte_campana_${safeName}.csv"`,
      },
    });

  } catch (error) {
    console.error("[CAMPAIGN_EXPORT_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
