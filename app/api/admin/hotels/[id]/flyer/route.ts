import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import QRCode from "qrcode";
import fs from "fs";
import path from "path";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const hotelId = params.id;
    const hotel = await prisma.hotel.findUnique({
      where: { id: hotelId },
    });

    if (!hotel) {
      return NextResponse.json({ error: "Hotel no encontrado" }, { status: 404 });
    }

    // El enlace de reserva del hotel
    // Idealmente el NEXT_PUBLIC_APP_URL, pero si no hardcodeamos el default:
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://metransfers.es";
    const bookingUrl = `${baseUrl}/hotel/${hotel.slug}`;

    // Generar el código QR como buffer de PNG
    const qrBuffer = await QRCode.toBuffer(bookingUrl, {
      type: "png",
      width: 500,
      margin: 1,
      color: {
        dark: "#000000",
        light: "#ffffff",
      },
    });

    // Crear un nuevo documento PDF
    const pdfDoc = await PDFDocument.create();
    
    // Verificar si existe una imagen de fondo en public/assets/flyer-bg.jpg o png
    const bgPathJpg = path.join(process.cwd(), "public", "flyer-bg.jpg");
    const bgPathPng = path.join(process.cwd(), "public", "flyer-bg.png");
    
    let page;
    let bgImage;
    
    if (fs.existsSync(bgPathJpg)) {
      const bgBytes = fs.readFileSync(bgPathJpg);
      bgImage = await pdfDoc.embedJpg(bgBytes);
    } else if (fs.existsSync(bgPathPng)) {
      const bgBytes = fs.readFileSync(bgPathPng);
      bgImage = await pdfDoc.embedPng(bgBytes);
    }

    if (bgImage) {
      // Usar la imagen de fondo con sus proporciones
      const { width, height } = bgImage.scale(1);
      page = pdfDoc.addPage([width, height]);
      page.drawImage(bgImage, {
        x: 0,
        y: 0,
        width,
        height,
      });
      
      // Basado en el diseño "HABLADOR - METRANSFERS.PNG"
      // Dimensiones de la imagen: 2362 x 2953 (aprox)
      const qrSize = width * 0.38; // 38% del ancho para dejar margen en el recuadro
      const qrX = width * 0.07;    // 7% de margen izquierdo
      const qrY = height * 0.31;   // 31% desde abajo, centrado en el recuadro blanco
      
      // Ya que la imagen base tiene el recuadro en blanco, incrustamos el QR directamente
      const qrImage = await pdfDoc.embedPng(qrBuffer);
      page.drawImage(qrImage, {
        x: qrX,
        y: qrY,
        width: qrSize,
        height: qrSize,
      });

      // Añadir el nombre del hotel debajo del QR
      const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const text = hotel.name;
      const fontSize = 48; // Tamaño grande por la alta resolución (2362px ancho)
      const textWidth = font.widthOfTextAtSize(text, fontSize);
      
      // Centrar el texto respecto al QR
      const textX = qrX + (qrSize / 2) - (textWidth / 2);
      const textY = qrY - 80; // 80 puntos por debajo del QR
      
      page.drawText(text, {
        x: textX,
        y: textY,
        size: fontSize,
        font,
        color: rgb(0, 0.188, 0.286), // Color azul oscuro similar a #003049
      });

    } else {
      // Si no hay imagen de fondo, creamos un PDF A4 estándar en blanco (fallback)
      page = pdfDoc.addPage([595.28, 841.89]); // Tamaño A4 en puntos
      const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      
      page.drawText(hotel.name, {
        x: 50,
        y: 800,
        size: 24,
        font,
        color: rgb(0, 0.3, 0.6),
      });

      page.drawText("Escanea para reservar tu traslado", {
        x: 50,
        y: 770,
        size: 14,
        font: await pdfDoc.embedFont(StandardFonts.Helvetica),
      });

      // Insertar el QR
      const qrImage = await pdfDoc.embedPng(qrBuffer);
      page.drawImage(qrImage, {
        x: 100,
        y: 350,
        width: 400,
        height: 400,
      });
    }

    // Convertir a bytes
    const pdfBytes = await pdfDoc.save();

    // Retornar la respuesta como archivo PDF descargable
    return new NextResponse(Buffer.from(pdfBytes), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="Hablador-${hotel.slug}.pdf"`,
      },
    });

  } catch (error) {
    console.error("Error generating flyer:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
