import { NextRequest, NextResponse } from "next/server";
import { distanceInputSchema } from "@/modules/maps/maps.schemas";
import { mapsService } from "@/modules/maps/maps.service";

import { mapsRateLimiter } from "@/lib/rate-limit";
import { buildRateLimitKey, getRequestMeta } from "@/lib/request-meta";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const requestMeta = getRequestMeta(request.headers);
    if (!(await mapsRateLimiter.check(buildRateLimitKey("maps-api", requestMeta)))) {
      return NextResponse.json({ error: "Demasiadas peticiones. Inténtelo más tarde." }, { status: 429 });
    }

    const body = await request.json();
    const parsed = distanceInputSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Datos de ruta inválidos", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const result = await mapsService.calculateDistanceAndDuration(
      { address: parsed.data.originAddress, placeId: parsed.data.originPlaceId },
      { address: parsed.data.destinationAddress, placeId: parsed.data.destinationPlaceId }
    );

    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    console.error("[Maps Distance API]", error);
    return NextResponse.json(
      { error: "No se pudo calcular la distancia real." },
      { status: 502 }
    );
  }
}
