import { describe, expect, it } from "vitest";
import { agencyCreationSchema, agencyUserCreationSchema } from "../modules/b2b/b2b.schemas";

describe("b2b schemas", () => {
  it("validates agency creation", () => {
    const result = agencyCreationSchema.safeParse({
      name: "Travel Partner",
      contactName: "Agent",
      email: "agent@example.com",
      phone: "+34600000000",
      commissionValue: 12,
      discountValue: 4,
    });

    expect(result.success).toBe(true);
  });

  it("rejects invalid agency commission", () => {
    const result = agencyCreationSchema.safeParse({
      name: "Travel Partner",
      commissionValue: 120,
      discountValue: 0,
    });

    expect(result.success).toBe(false);
  });

  it("requires agency id for agency users", () => {
    const result = agencyUserCreationSchema.safeParse({
      fullName: "Agent User",
      email: "agent@example.com",
      password: "secret123",
    });

    expect(result.success).toBe(false);
  });
});
