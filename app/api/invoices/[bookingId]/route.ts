import React from "react";
import { NextResponse } from "next/server";
import { renderToStream } from "@react-pdf/renderer";
import { InvoiceDocument } from "@/modules/invoices/components/InvoiceDocument";
import { invoicesService } from "@/modules/invoices/invoices.service";
import { prisma } from "@/lib/prisma";
import { authService } from "@/modules/auth/auth.service";
import { verifyReceiptAccessToken } from "@/modules/bookings/receipt-access";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ bookingId: string }> }
) {
  try {
    const { bookingId } = await params;
    const { searchParams } = new URL(request.url);
    const receiptToken = searchParams.get("token");
    const session = await authService.getSession();
    const hasAdminSession = Boolean(
      session && ["SUPER_ADMIN", "ADMIN", "OPERATOR"].includes(session.role)
    );
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking || (booking.deletedAt && !hasAdminSession)) {
      return NextResponse.json({ error: "Reserva no encontrada" }, { status: 404 });
    }

    const hasReceiptToken = await verifyReceiptAccessToken(receiptToken, booking);

    if (!hasAdminSession && !hasReceiptToken) {
      return NextResponse.json({ error: "No autorizado para ver esta factura" }, { status: 403 });
    }

    const invoice = await invoicesService.getOrCreateInvoiceForBooking(booking.id);
    const stream = await renderToStream(React.createElement(InvoiceDocument, { invoice }) as any);

    return new NextResponse(stream as any, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="factura_${invoice.invoiceNumber}.pdf"`,
      },
    });
  } catch (error) {
    console.error("Error generating invoice:", error);
    return NextResponse.json({ error: "Error interno al generar la factura" }, { status: 500 });
  }
}
