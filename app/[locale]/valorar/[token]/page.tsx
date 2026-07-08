import { jwtVerify } from "jose";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ReviewPageClient from "./ReviewPageClient";

interface Props {
  params: Promise<{ token: string }>;
}

export const metadata = {
  title: "Valora tu traslado | Transfers in Barcelona",
  description: "Comparte tu experiencia y ayúdanos a seguir mejorando.",
  robots: "noindex",
};

async function verifyReviewToken(token: string): Promise<{ bookingId: string; publicCode: string } | null> {
  try {
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || "metransfers_jwt_dev_secret"
    );
    const { payload } = await jwtVerify(token, secret);
    if (payload.bookingId && payload.publicCode) {
      return {
        bookingId: payload.bookingId as string,
        publicCode: payload.publicCode as string,
      };
    }
    return null;
  } catch {
    return null;
  }
}

export default async function ReviewPage({ params }: Props) {
  const { token } = await params;

  const payload = await verifyReviewToken(decodeURIComponent(token));
  if (!payload) return notFound();

  const booking = await prisma.booking.findUnique({
    where: { id: payload.bookingId },
    include: { customer: true, review: true },
  });

  if (!booking) return notFound();

  // Si ya tiene reseña publicada, mostrar mensaje de agradecimiento
  const alreadyReviewed = !!booking.review;

  return (
    <ReviewPageClient
      bookingId={booking.id}
      publicCode={booking.publicCode}
      customerName={booking.customer.fullName}
      serviceDate={booking.serviceDate.toISOString().split("T")[0]}
      originAddress={booking.originAddress}
      destinationAddress={booking.destinationAddress}
      alreadyReviewed={alreadyReviewed}
      token={token}
    />
  );
}
