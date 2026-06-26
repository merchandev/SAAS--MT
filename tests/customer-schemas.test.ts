import { describe, expect, it } from "vitest";
import { registerSchema } from "../modules/auth/auth.schemas";
import { customerReviewSchema, customerSuggestionSchema } from "../modules/customers/customer.schemas";

describe("customer schemas", () => {
  it("requires client profile fields during public registration", () => {
    const result = registerSchema.safeParse({
      fullName: "Maria Cliente",
      email: "maria@example.com",
      phone: "+34600000000",
      country: "Espana",
      preferredLanguage: "es",
      password: "secret123",
    });

    expect(result.success).toBe(true);
  });

  it("rejects incomplete client registration", () => {
    const result = registerSchema.safeParse({
      fullName: "Maria Cliente",
      email: "maria@example.com",
      password: "secret123",
    });

    expect(result.success).toBe(false);
  });

  it("rejects role and B2B fields during public registration", () => {
    const result = registerSchema.safeParse({
      fullName: "Maria Cliente",
      email: "maria@example.com",
      phone: "+34600000000",
      country: "Espana",
      preferredLanguage: "es",
      password: "secret123",
      role: "ADMIN",
      hotelId: "11111111-1111-4111-8111-111111111111",
      agencyId: "22222222-2222-4222-8222-222222222222",
    });

    expect(result.success).toBe(false);
  });

  it("validates internal service ratings", () => {
    const valid = customerReviewSchema.safeParse({
      bookingId: "11111111-1111-4111-8111-111111111111",
      rating: 5,
      comment: "Servicio excelente",
    });
    const invalid = customerReviewSchema.safeParse({
      bookingId: "11111111-1111-4111-8111-111111111111",
      rating: 6,
    });

    expect(valid.success).toBe(true);
    expect(invalid.success).toBe(false);
  });

  it("validates suggestion messages", () => {
    expect(customerSuggestionSchema.safeParse({ subject: "Ruta", message: "Me gustaria una nueva ruta fija." }).success).toBe(true);
    expect(customerSuggestionSchema.safeParse({ subject: "X", message: "corto" }).success).toBe(false);
  });
});
