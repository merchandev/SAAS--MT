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
    const newPost = await prisma.post.create({
      data: {
        slug: body.slug,
        title: body.title,
        excerpt: body.excerpt,
        contentHtml: body.contentHtml,
        metaTitle: body.metaTitle,
        metaDescription: body.metaDescription,
        seoKeywords: body.seoKeywords,
        imageUrl: body.imageUrl,
        isActive: body.isActive ?? true,
        publishedAt: body.isActive ? new Date() : null,
      },
    });

    return NextResponse.json(newPost);
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

    const updatedPost = await prisma.post.update({
      where: { id },
      data: {
        slug: data.slug,
        title: data.title,
        excerpt: data.excerpt,
        contentHtml: data.contentHtml,
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
        seoKeywords: data.seoKeywords,
        imageUrl: data.imageUrl,
        isActive: data.isActive,
      },
    });

    return NextResponse.json(updatedPost);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
