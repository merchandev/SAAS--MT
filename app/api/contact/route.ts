import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { contactRateLimiter } from "@/lib/rate-limit";
import { getRequestMeta, buildRateLimitKey } from "@/lib/request-meta";

const contactSchema = z.object({
  name: z.string().min(2, "Name is too short").max(100, "Name is too long"),
  email: z.string().email("Invalid email address").max(150, "Email is too long"),
  phone: z.string().max(30, "Phone is too long").optional().nullable(),
  subject: z.string().max(150, "Subject is too long").optional().nullable(),
  message: z.string().min(10, "Message is too short").max(2000, "Message is too long"),
  honeypot: z.string().optional(), // Simple honeypot field
});

export async function POST(req: Request) {
  try {
    const meta = getRequestMeta(req.headers);
    const rateLimitKey = buildRateLimitKey("contact", meta);

    if (!(await contactRateLimiter.check(rateLimitKey))) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const body = await req.json();
    
    // Validate with Zod
    const validatedData = contactSchema.parse(body);

    // Check honeypot (bots will likely fill this hidden field)
    if (validatedData.honeypot) {
      // Act as if it was successful to trick the bot
      return NextResponse.json({ success: true }, { status: 201 });
    }

    const contactMessage = await prisma.contactMessage.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone || null,
        subject: validatedData.subject || null,
        message: validatedData.message,
        status: "NEW",
      },
    });

    return NextResponse.json(contactMessage, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.issues },
        { status: 400 }
      );
    }
    console.error("Error creating contact message:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
