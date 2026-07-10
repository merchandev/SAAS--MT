import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRoleApi } from "@/modules/auth/permissions";

export async function POST(req: Request) {
  try {
    const auth = await requireRoleApi(["SUPER_ADMIN", "ADMIN"]);
    if (!auth.ok) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { id, name, subject, body, recipients, contactPhone } = await req.json();

    const data = {
      name: name || "Campaña sin nombre",
      subject: subject || "",
      content: body || "",
      recipients: recipients || [],
      contactPhone: contactPhone || "+34 662 02 41 36",
      status: "DRAFT",
    };

    if (id) {
      // Check if draft exists and is actually a draft
      const existing = await prisma.emailCampaign.findUnique({
        where: { id },
      });

      if (!existing) {
        return NextResponse.json({ error: "Borrador no encontrado" }, { status: 404 });
      }
      
      if (existing.status !== "DRAFT") {
        return NextResponse.json({ error: "Esta campaña ya no es un borrador y no se puede editar" }, { status: 400 });
      }

      await prisma.emailCampaign.update({
        where: { id },
        data,
      });

      return NextResponse.json({ success: true, id });
    } else {
      // Create new draft
      const newDraft = await prisma.emailCampaign.create({
        data,
      });

      return NextResponse.json({ success: true, id: newDraft.id });
    }
  } catch (error: any) {
    console.error("[DRAFT_CAMPAIGN_API_ERROR]", error);
    return NextResponse.json({ error: error.message || "Error al guardar el borrador" }, { status: 500 });
  }
}
