import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const schema = z.object({
  bookingId: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(1000).optional(),
  token: z.string().min(1),
});

async function verifyToken(token: string): Promise<{ bookingId: string } | null> {
  try {
    if (!process.env.JWT_SECRET) {
      return null;
    }
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(decodeURIComponent(token), secret);
    return payload.bookingId ? { bookingId: payload.bookingId as string } : null;
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Datos inválidos." },
        { status: 400 }
      );
    }

    const { bookingId, rating, comment, token } = parsed.data;

    // Verify JWT token
    const payload = await verifyToken(token);
    if (!payload || payload.bookingId !== bookingId) {
      return NextResponse.json(
        { error: "Token inválido o expirado." },
        { status: 401 }
      );
    }

    // Check booking exists and is completed
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { review: true, customer: true },
    });

    if (!booking) {
      return NextResponse.json({ error: "Reserva no encontrada." }, { status: 404 });
    }

    if (booking.bookingStatus !== "COMPLETADA") {
      return NextResponse.json(
        { error: "Solo se pueden valorar traslados completados." },
        { status: 400 }
      );
    }

    if (booking.review) {
      return NextResponse.json(
        { error: "Ya has valorado este traslado." },
        { status: 409 }
      );
    }

    // Create review
    await prisma.review.create({
      data: {
        bookingId,
        customerId: booking.customerId,
        rating,
        comment: comment || null,
        isPublished: false, // Requiere aprobación del admin
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[REVIEW_SUBMIT_ERROR]", error);
    return NextResponse.json(
      { error: "Error interno del servidor." },
      { status: 500 }
    );
  }
}
