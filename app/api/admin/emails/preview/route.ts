import { NextResponse } from "next/server";
import { requireRoleApi } from "@/modules/auth/permissions";
import { DynamicLayoutEmail } from "@/components/emails/DynamicLayoutEmail";
import { render } from "@react-email/render";
import * as React from "react";

export async function POST(req: Request) {
  try {
    const auth = await requireRoleApi(["SUPER_ADMIN", "ADMIN", "OPERATOR"]);
    if (!auth.ok) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { subject, body, contactPhone } = await req.json();

    const html = await render(
      React.createElement(DynamicLayoutEmail, {
        previewText: subject,
        dynamicHtml: body,
        contactPhone: contactPhone || "+34 662 02 41 36",
      })
    );

    return NextResponse.json({ success: true, html });
  } catch (error: any) {
    console.error("[PREVIEW_CAMPAIGN_API_ERROR]", error);
    return NextResponse.json(
      { error: "Error al generar la previsualización" },
      { status: 500 }
    );
  }
}
