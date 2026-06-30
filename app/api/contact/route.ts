import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, subject, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const contactMessage = await prisma.contactMessage.create({
      data: {
        name,
        email,
        phone: phone || null,
        subject: subject || null,
        message,
        status: "NEW",
      },
    });

    return NextResponse.json(contactMessage, { status: 201 });
  } catch (error) {
    console.error("Error creating contact message:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
