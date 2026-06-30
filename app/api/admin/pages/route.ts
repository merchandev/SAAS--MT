import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authService } from "@/modules/auth/auth.service";

export async function POST(request: NextRequest) {
  try {
    const session = await authService.getSession();
    if (!session || !["SUPER_ADMIN", "ADMIN"].includes(session.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const newPage = await prisma.routePage.create({
      data: {
        slug: body.slug,
        originName: body.originName,
        destinationName: body.destinationName,
        h1Title: body.h1Title,
        metaDescription: body.metaDescription,
        contentHtml: body.contentHtml,
        seoTitle: body.seoTitle,
        seoKeywords: body.seoKeywords,
        seoImage: body.seoImage,
        basePriceCache: body.basePriceCache ? Number(body.basePriceCache) : null,
        isActive: body.isActive ?? true,
      },
    });

    return NextResponse.json(newPage);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await authService.getSession();
    if (!session || !["SUPER_ADMIN", "ADMIN"].includes(session.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, ...data } = body;

    const updatedPage = await prisma.routePage.update({
      where: { id },
      data: {
        slug: data.slug,
        originName: data.originName,
        destinationName: data.destinationName,
        h1Title: data.h1Title,
        metaDescription: data.metaDescription,
        contentHtml: data.contentHtml,
        seoTitle: data.seoTitle,
        seoKeywords: data.seoKeywords,
        seoImage: data.seoImage,
        basePriceCache: data.basePriceCache ? Number(data.basePriceCache) : null,
        isActive: data.isActive,
      },
    });

    return NextResponse.json(updatedPage);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
