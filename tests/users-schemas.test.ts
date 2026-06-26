import { describe, expect, it } from "vitest";
import {
  adminUserCreateSchema,
  adminUserUpdateSchema,
  passwordResetSchema,
} from "../modules/users/users.schemas";

const baseUser = {
  fullName: "Maria Cliente",
  email: "maria@example.com",
  phone: "+34600000000",
  role: "CUSTOMER",
  isActive: true,
  preferredLanguage: "es",
};

describe("admin user schemas", () => {
  it("accepts a customer user profile", () => {
    const result = adminUserCreateSchema.safeParse({
      ...baseUser,
      country: "Espana",
      password: "secret123",
      confirmPassword: "secret123",
    });

    expect(result.success).toBe(true);
  });

  it("requires hotel for hotel users", () => {
    const result = adminUserCreateSchema.safeParse({
      ...baseUser,
      role: "HOTEL",
      password: "secret123",
      confirmPassword: "secret123",
    });

    expect(result.success).toBe(false);
  });

  it("requires agency for agency users", () => {
    const result = adminUserUpdateSchema.safeParse({
      ...baseUser,
      role: "AGENCY",
    });

    expect(result.success).toBe(false);
  });

  it("requires driver license for drivers", () => {
    const result = adminUserCreateSchema.safeParse({
      ...baseUser,
      role: "DRIVER",
      password: "secret123",
      confirmPassword: "secret123",
    });

    expect(result.success).toBe(false);
  });

  it("rejects mismatched user creation passwords", () => {
    const result = adminUserCreateSchema.safeParse({
      ...baseUser,
      password: "secret123",
      confirmPassword: "different123",
    });

    expect(result.success).toBe(false);
  });

  it("validates password resets", () => {
    expect(passwordResetSchema.safeParse({ password: "secret123", confirmPassword: "secret123" }).success).toBe(true);
    expect(passwordResetSchema.safeParse({ password: "123", confirmPassword: "123" }).success).toBe(false);
    expect(passwordResetSchema.safeParse({ password: "secret123", confirmPassword: "different123" }).success).toBe(false);
  });
});
