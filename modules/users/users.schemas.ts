import { z } from "zod";

export const adminManagedRoles = [
  "SUPER_ADMIN",
  "ADMIN",
  "OPERATOR",
  "HOTEL",
  "AGENCY",
  "DRIVER",
  "CUSTOMER",
] as const;

const emptyToUndefined = (value: unknown) => {
  if (typeof value !== "string") return value;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
};

const optionalText = z.preprocess(emptyToUndefined, z.string().trim().optional());
const optionalUuid = z.preprocess(emptyToUndefined, z.string().uuid().optional());
const passwordFields = {
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  confirmPassword: z.string().min(6, "Confirma la contraseña"),
};

const adminUserBaseShape = {
  fullName: z.string().trim().min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z.string().trim().email("Debe ser un correo válido").transform((value) => value.toLowerCase()),
  phone: optionalText,
  role: z.enum(adminManagedRoles),
  isActive: z.coerce.boolean().default(true),
  hotelId: optionalUuid,
  agencyId: optionalUuid,
  licenseNumber: optionalText,
  driverStatus: optionalText,
  country: optionalText,
  preferredLanguage: z.enum(["es", "en", "de", "fr"]).default("es"),
};

type RoleProfileInput = {
  role: (typeof adminManagedRoles)[number];
  hotelId?: string;
  agencyId?: string;
  licenseNumber?: string;
};

function validateRoleProfile(data: RoleProfileInput, ctx: z.RefinementCtx) {
  if (data.role === "HOTEL" && !data.hotelId) {
    ctx.addIssue({ code: "custom", path: ["hotelId"], message: "Selecciona un hotel" });
  }

  if (data.role === "AGENCY" && !data.agencyId) {
    ctx.addIssue({ code: "custom", path: ["agencyId"], message: "Selecciona una agencia" });
  }

  if (data.role === "DRIVER" && !data.licenseNumber) {
    ctx.addIssue({ code: "custom", path: ["licenseNumber"], message: "La licencia es obligatoria" });
  }
}

function validatePasswordConfirmation(data: { password: string; confirmPassword: string }, ctx: z.RefinementCtx) {
  if (data.password !== data.confirmPassword) {
    ctx.addIssue({
      code: "custom",
      path: ["confirmPassword"],
      message: "Las contraseñas no coinciden",
    });
  }
}

export const adminUserUpdateSchema = z.object(adminUserBaseShape).superRefine(validateRoleProfile);

export const adminUserCreateSchema = z
  .object({
    ...adminUserBaseShape,
    ...passwordFields,
  })
  .superRefine(validateRoleProfile)
  .superRefine(validatePasswordConfirmation);

export const passwordResetSchema = z.object(passwordFields).superRefine(validatePasswordConfirmation);

export type AdminUserCreateInput = z.infer<typeof adminUserCreateSchema>;
export type AdminUserUpdateInput = z.infer<typeof adminUserUpdateSchema>;
export type PasswordResetInput = z.infer<typeof passwordResetSchema>;
