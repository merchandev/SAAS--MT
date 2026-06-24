import { describe, expect, it, vi } from "vitest";
import { createPublicCodeCandidate, generateUniquePublicCode } from "../modules/bookings/public-code";

describe("Booking public code", () => {
  it("generates a longer stable public code format", () => {
    const publicCode = createPublicCodeCandidate(new Date("2026-06-23T00:00:00.000Z"));

    expect(publicCode).toMatch(/^MT-2026-[A-Z0-9]{8}$/);
  });

  it("retries when a generated public code already exists", async () => {
    const findUnique = vi
      .fn()
      .mockResolvedValueOnce({ id: "existing-booking" })
      .mockResolvedValueOnce(null);

    const publicCode = await generateUniquePublicCode({
      booking: { findUnique },
    } as any);

    expect(publicCode).toMatch(/^MT-\d{4}-[A-Z0-9]{8}$/);
    expect(findUnique).toHaveBeenCalledTimes(2);
  });
});
