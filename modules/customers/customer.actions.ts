"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireCustomerProfile } from "./customer.auth";
import {
  customerProfileSchema,
  customerReviewSchema,
  customerSuggestionSchema,
  type CustomerProfileInput,
  type CustomerReviewInput,
  type CustomerSuggestionInput,
} from "./customer.schemas";

export async function updateCustomerProfileAction(input: CustomerProfileInput) {
  const { session, customer } = await requireCustomerProfile();
  const parsed = customerProfileSchema.safeParse(input);

  if (!parsed.success) {
    return { error: "Datos de perfil inválidos", details: parsed.error.flatten() };
  }

  await prisma.$transaction(async (tx) => {
    await tx.customer.update({
      where: { id: customer.id },
      data: parsed.data,
    });

    await tx.user.update({
      where: { id: session.userId },
      data: {
        fullName: parsed.data.fullName,
        phone: parsed.data.phone,
      },
    });
  });

  revalidatePath("/customer/dashboard");
  return { success: true };
}

export async function submitCustomerReviewAction(input: CustomerReviewInput) {
  const { customer } = await requireCustomerProfile();
  const parsed = customerReviewSchema.safeParse(input);

  if (!parsed.success) {
    return { error: "Datos de calificación inválidos", details: parsed.error.flatten() };
  }

  const booking = await prisma.booking.findFirst({
    where: {
      id: parsed.data.bookingId,
      customerId: customer.id,
    },
    select: {
      id: true,
      bookingStatus: true,
      review: { select: { id: true } },
    },
  });

  if (!booking) {
    return { error: "Reserva no encontrada para este cliente" };
  }

  if (booking.bookingStatus !== "COMPLETADA") {
    return { error: "Solo puedes calificar traslados completados" };
  }

  if (booking.review) {
    return { error: "Esta reserva ya fue calificada" };
  }

  await prisma.review.create({
    data: {
      bookingId: booking.id,
      customerId: customer.id,
      rating: parsed.data.rating,
      comment: parsed.data.comment,
      isPublished: false,
    },
  });

  revalidatePath("/customer/dashboard");
  return { success: true };
}

export async function createCustomerSuggestionAction(input: CustomerSuggestionInput) {
  const { customer } = await requireCustomerProfile();
  const parsed = customerSuggestionSchema.safeParse(input);

  if (!parsed.success) {
    return { error: "Datos de sugerencia inválidos", details: parsed.error.flatten() };
  }

  await prisma.customerSuggestion.create({
    data: {
      customerId: customer.id,
      subject: parsed.data.subject,
      message: parsed.data.message,
    },
  });

  revalidatePath("/customer/dashboard");
  return { success: true };
}
