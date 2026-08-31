import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRoleApi } from "@/modules/auth/permissions";

export async function GET(req: Request) {
  try {
    await requireRoleApi(["ADMIN", "SUPER_ADMIN"]);

    const url = new URL(req.url);
    const search = url.searchParams.get("search") || "";
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "50");

    const skip = (page - 1) * limit;

    const where = search
      ? {
          OR: [
            { email: { contains: search, mode: "insensitive" as const } },
            { firstName: { contains: search, mode: "insensitive" as const } },
            { lastName: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {};

    const [contacts, total] = await Promise.all([
      prisma.marketingContact.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          lists: { include: { list: true } },
          tags: { include: { tag: true } },
        },
      }),
      prisma.marketingContact.count({ where }),
    ]);

    return NextResponse.json({ contacts, total });
  } catch (error) {
    console.error("Error fetching marketing contacts:", error);
    return NextResponse.json(
      { error: "Failed to fetch marketing contacts" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await requireRoleApi(["ADMIN", "SUPER_ADMIN"]);
    const body = await req.json();
    
    // In a real scenario, use Zod for validation
    const { email, firstName, lastName, phone, country, language, hasConsent } = body;
    
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if customer exists to link automatically
    const customer = await prisma.customer.findUnique({
      where: { email: normalizedEmail },
    });

    const contact = await prisma.marketingContact.create({
      data: {
          
        email: email.trim(),
        normalizedEmail,
        firstName,
        lastName,
        phone,
        country,
        language: language || "en",
        hasConsent: !!hasConsent,
        consentDate: hasConsent ? new Date() : null,
        customerId: customer?.id || null,
      },
    });

    return NextResponse.json(contact);
  } catch (error: any) {
    console.error("Error creating marketing contact:", error);
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "A contact with this email already exists" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create marketing contact" },
      { status: 500 }
    );
  }
}
