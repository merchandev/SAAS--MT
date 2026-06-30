import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { OpenAIConfigurationError } from "@/lib/openai";
import { aiImageRateLimiter } from "@/lib/rate-limit";
import { buildRateLimitKey, getRequestMeta } from "@/lib/request-meta";
import {
  IMAGE_PAGE_TYPES,
  IMAGE_QUALITIES,
  IMAGE_SIZES,
  IMAGE_TARGETS,
} from "@/modules/ai/image-prompts";
import { generateWebsiteImage } from "@/modules/ai/images.service";
import { requireRoleApi } from "@/modules/auth/permissions";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const generateImageSchema = z.object({
  pageType: z.enum(IMAGE_PAGE_TYPES),
  title: z.string().trim().min(3).max(140),
  description: z.string().trim().max(1200).optional(),
  city: z.string().trim().max(80).optional(),
  serviceType: z.string().trim().max(80).optional(),
  target: z.enum(IMAGE_TARGETS).default("hero"),
  size: z.enum(IMAGE_SIZES).default("1536x1024"),
  quality: z.enum(IMAGE_QUALITIES).default("medium"),
});

export async function POST(request: NextRequest) {
  const auth = await requireRoleApi(["SUPER_ADMIN", "ADMIN", "HOTEL"]);

  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const requestMeta = getRequestMeta(request.headers);
    const rateLimitKey = buildRateLimitKey("admin-ai-image", requestMeta, auth.session.userId);

    if (!(await aiImageRateLimiter.check(rateLimitKey))) {
      return NextResponse.json({ error: "Demasiadas generaciones. Intentelo mas tarde." }, { status: 429 });
    }

    const body = await request.json();
    const parsed = generateImageSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Datos de imagen invalidos", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    if (auth.session.role === "HOTEL" && parsed.data.pageType !== "hotel") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const result = await generateWebsiteImage({
      ...parsed.data,
      userId: auth.session.userId,
    });

    return NextResponse.json({
      success: true,
      image: result.imageDataUrl,
      prompt: result.prompt,
      model: result.model,
      size: result.size,
      quality: result.quality,
      outputFormat: result.outputFormat,
      usage: result.usage,
    });
  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: "JSON invalido" }, { status: 400 });
    }

    if (error instanceof OpenAIConfigurationError) {
      console.error("[AI Images API] OPENAI_API_KEY is not configured.");
      return NextResponse.json({ error: "La generacion de imagenes no esta configurada." }, { status: 503 });
    }

    console.error("[AI Images API]", error);
    return NextResponse.json({ error: "No se pudo generar la imagen." }, { status: 502 });
  }
}
