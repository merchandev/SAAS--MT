import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, metaDescription, seoKeywords } = body;

    const page = await prisma.staticPage.update({
      where: { id },
      data: {
        title,
        metaDescription,
        seoKeywords,
      },
    });

    return NextResponse.json({ success: true, page });
  } catch (error: any) {
    console.error("Error updating static page:", error);
    return NextResponse.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
