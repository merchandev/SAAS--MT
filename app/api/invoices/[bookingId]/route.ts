import React from "react";
import { NextResponse } from "next/server";
import { renderToStream } from "@react-pdf/renderer";
import { InvoiceDocument } from "@/modules/invoices/components/InvoiceDocument";
import { invoicesService } from "@/modules/invoices/invoices.service";
import { prisma } from "@/lib/prisma";
import { authService } from "@/modules/auth/auth.service";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ bookingId: string }> }
) {
  try {
    const { bookingId } = await params;
    
    // 1. Obtener Booking base para verificar permisos
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId }
    });

    if (!booking) {
      return NextResponse.json({ error: "Reserva no encontrada" }, { status: 404 });
    }

    // 2. Control de Acceso
    // Se permite acceso si:
    // a) Hay una sesión de Admin logueado
    // b) Se accede con un publicCode válido (que el cliente tiene en su URL de /receipt)
    // Extraemos el token/código de la query string (ej: ?publicCode=xxx)
    const { searchParams } = new URL(request.url);
    const publicCodeParam = searchParams.get("publicCode");

    let isAuthorized = false;

    if (publicCodeParam && publicCodeParam === booking.publicCode) {
      isAuthorized = true;
    } else {
      const session = await authService.getSession();
      if (session && ["SUPER_ADMIN", "ADMIN", "OPERATOR"].includes(session.role)) {
        isAuthorized = true;
      }
    }

    if (!isAuthorized) {
      return NextResponse.json({ error: "No autorizado para ver esta factura" }, { status: 403 });
    }

    // 3. Obtener o Generar la Factura
    const invoice = await invoicesService.getOrCreateInvoiceForBooking(booking.id);

    // 4. Renderizar a Stream
    // Importante: renderToStream es asíncrono y devuelve un stream de Node que Next.js puede pipear
    const stream = await renderToStream(React.createElement(InvoiceDocument, { invoice }) as any);

    // Retornar la respuesta como PDF
    return new NextResponse(stream as any, {
      headers: {
        "Content-Type": "application/pdf",
        // "inline" hace que se abra en el navegador en vez de forzar descarga inmediata.
        // Usa "attachment; filename=" si prefieres descarga directa.
        "Content-Disposition": `inline; filename="factura_${invoice.invoiceNumber}.pdf"`,
      },
    });

  } catch (error: any) {
    console.error("Error generating invoice:", error);
    return NextResponse.json({ error: "Error interno al generar la factura" }, { status: 500 });
  }
}
