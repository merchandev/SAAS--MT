import { z } from "zod";

const optionalPlaceId = z.string().trim().min(1).optional().or(z.literal(""));

export const distanceInputSchema = z
  .object({
    originAddress: z.string().trim().optional(),
    originPlaceId: optionalPlaceId,
    destinationAddress: z.string().trim().optional(),
    destinationPlaceId: optionalPlaceId,
  })
  .refine((value) => Boolean(value.originPlaceId || value.originAddress), {
    message: "Origen requerido",
    path: ["originAddress"],
  })
  .refine((value) => Boolean(value.destinationPlaceId || value.destinationAddress), {
    message: "Destino requerido",
    path: ["destinationAddress"],
  });

export type DistanceInput = z.infer<typeof distanceInputSchema>;
