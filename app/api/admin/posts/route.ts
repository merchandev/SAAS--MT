import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authService } from "@/modules/auth/auth.service";

function resolveScheduledStatus(body: any) {
  const scheduledAt = body.scheduledAt ? new Date(body.scheduledAt) : null;
  const now = new Date();
  
  // If scheduledAt is in the future → save as draft until that date
  // If scheduledAt is in the past or null → use the isActive flag directly
  let isActive = body.isActive ?? true;
  if (scheduledAt && scheduledAt > now) {
    isActive = false; // Will be published when cron runs
  }

  return { scheduledAt, isActive };
}

export async function POST(request: NextRequest) {
  try {
    const session = await authService.getSession();
    if (!session || !["SUPER_ADMIN", "ADMIN"].includes(session.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { scheduledAt, isActive } = resolveScheduledStatus(body);

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
        isActive,
        scheduledAt,
        publishedAt: isActive && !scheduledAt ? new Date() : null,
        translations: typeof body.translations === 'string' ? JSON.parse(body.translations || '{}') : body.translations,
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
    const { scheduledAt, isActive } = resolveScheduledStatus(data);

    // If we're actively publishing now (no schedule, isActive=true), set publishedAt
    const existingPost = await prisma.post.findUnique({ where: { id }, select: { publishedAt: true, isActive: true } });
    const publishedAt = isActive && !existingPost?.publishedAt
      ? new Date()
      : existingPost?.publishedAt ?? null;

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
        isActive,
        scheduledAt,
        publishedAt,
        translations: typeof data.translations === 'string' && data.translations ? JSON.parse(data.translations) : data.translations,
      },
    });

    return NextResponse.json(updatedPost);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
