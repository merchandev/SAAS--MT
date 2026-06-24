import { randomBytes } from "crypto";
import type { Prisma } from "@prisma/client";

const PUBLIC_CODE_RANDOM_LENGTH = 8;
const PUBLIC_CODE_MAX_ATTEMPTS = 8;

type PublicCodeClient = Pick<Prisma.TransactionClient, "booking">;

export function createPublicCodeCandidate(date = new Date()) {
  const year = date.getUTCFullYear();
  const randomPart = randomBytes(PUBLIC_CODE_RANDOM_LENGTH / 2).toString("hex").toUpperCase();

  return `MT-${year}-${randomPart}`;
}

export async function generateUniquePublicCode(client: PublicCodeClient) {
  for (let attempt = 0; attempt < PUBLIC_CODE_MAX_ATTEMPTS; attempt += 1) {
    const publicCode = createPublicCodeCandidate();
    const existingBooking = await client.booking.findUnique({
      where: { publicCode },
      select: { id: true },
    });

    if (!existingBooking) {
      return publicCode;
    }
  }

  throw new Error("No se pudo generar un código público único para la reserva.");
}
