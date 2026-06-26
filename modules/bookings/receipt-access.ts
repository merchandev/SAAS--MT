import { SignJWT, jwtVerify } from "jose";

const ISSUER = "metransfers:receipt";
const AUDIENCE = "metransfers:booking-receipt";
const PURPOSE = "booking_receipt";

export type ReceiptAccessBooking = {
  id: string;
  publicCode: string;
};

type ReceiptAccessPayload = {
  purpose: typeof PURPOSE;
  bookingId: string;
  publicCode: string;
};

function getReceiptTokenKey() {
  const secret = process.env.RECEIPT_TOKEN_SECRET || process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("RECEIPT_TOKEN_SECRET or JWT_SECRET is required for receipt access tokens.");
  }

  return new TextEncoder().encode(secret);
}

export async function createReceiptAccessToken(booking: ReceiptAccessBooking) {
  return new SignJWT({
    purpose: PURPOSE,
    bookingId: booking.id,
    publicCode: booking.publicCode,
  } satisfies ReceiptAccessPayload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setIssuer(ISSUER)
    .setAudience(AUDIENCE)
    .setExpirationTime("30d")
    .sign(getReceiptTokenKey());
}

export async function verifyReceiptAccessToken(
  token: string | null | undefined,
  booking: ReceiptAccessBooking
) {
  if (!token) return false;

  try {
    const { payload } = await jwtVerify(token, getReceiptTokenKey(), {
      algorithms: ["HS256"],
      issuer: ISSUER,
      audience: AUDIENCE,
    });

    return (
      payload.purpose === PURPOSE &&
      payload.bookingId === booking.id &&
      payload.publicCode === booking.publicCode
    );
  } catch {
    return false;
  }
}
