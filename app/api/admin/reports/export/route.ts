import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRoleApi } from "@/modules/auth/permissions";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function csvValue(value: unknown) {
  const stringValue = value == null ? "" : String(value);
  return `"${stringValue.replace(/"/g, '""')}"`;
}

export async function GET() {
  const auth = await requireRoleApi(["SUPER_ADMIN", "ADMIN", "OPERATOR"]);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const bookings = await prisma.booking.findMany({
    where: { deletedAt: null },
    orderBy: { createdAt: "desc" },
    include: {
      customer: true,
      vehicle: true,
      hotel: true,
      agency: true,
    },
  });

  const headers = [
    "publicCode",
    "customer",
    "email",
    "origin",
    "destination",
    "serviceDate",
    "serviceTime",
    "vehicle",
    "status",
    "paymentStatus",
    "finalPrice",
    "currency",
    "sourceType",
  ];

  const rows = bookings.map((booking) => [
    booking.publicCode,
    booking.customer.fullName,
    booking.customer.email,
    booking.originAddress,
    booking.destinationAddress,
    booking.serviceDate.toISOString(),
    booking.serviceTime,
    booking.vehicle.name,
    booking.bookingStatus,
    booking.paymentStatus,
    Number(booking.finalPrice).toFixed(2),
    booking.currency,
    booking.sourceType,
  ]);

  const csv = [
    headers.map(csvValue).join(","),
    ...rows.map((row) => row.map(csvValue).join(",")),
  ].join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="metransfers-bookings.csv"',
    },
  });
}
