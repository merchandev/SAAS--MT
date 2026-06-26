import { describe, expect, it, beforeEach } from "vitest";
import { createReceiptAccessToken, verifyReceiptAccessToken } from "../modules/bookings/receipt-access";

const booking = {
  id: "booking-123",
  publicCode: "MT-2026-ABCDEFGH",
};

describe("receipt access tokens", () => {
  beforeEach(() => {
    process.env.JWT_SECRET = "test-secret-for-receipt-tokens";
    delete process.env.RECEIPT_TOKEN_SECRET;
  });

  it("authorizes the booking that owns the token", async () => {
    const token = await createReceiptAccessToken(booking);

    await expect(verifyReceiptAccessToken(token, booking)).resolves.toBe(true);
  });

  it("rejects a token reused for another public code", async () => {
    const token = await createReceiptAccessToken(booking);

    await expect(
      verifyReceiptAccessToken(token, {
        id: booking.id,
        publicCode: "MT-2026-DIFFERENT",
      })
    ).resolves.toBe(false);
  });

  it("rejects missing or malformed tokens", async () => {
    await expect(verifyReceiptAccessToken(undefined, booking)).resolves.toBe(false);
    await expect(verifyReceiptAccessToken("not-a-jwt", booking)).resolves.toBe(false);
  });
});
