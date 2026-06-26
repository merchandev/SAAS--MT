import crypto from "crypto";

export interface DistanceDurationResult {
  distanceKm: number;
  durationMinutes: number;
}

type RouteLocation = string | {
  address?: string | null;
  placeId?: string | null;
};

type GoogleDistanceMatrixResponse = {
  status: string;
  error_message?: string;
  rows?: Array<{
    elements?: Array<{
      status: string;
      distance?: { value: number };
      duration?: { value: number };
    }>;
  }>;
};

function normalizeLocation(location: RouteLocation): string {
  if (typeof location === "string") {
    return location;
  }

  if (location.placeId) {
    return `place_id:${location.placeId}`;
  }

  if (location.address) {
    return location.address;
  }

  throw new Error("Route location requires an address or placeId.");
}

function getCacheTtlMs() {
  const ttlHours = Number(process.env.MAPS_DISTANCE_CACHE_TTL_HOURS ?? "6");
  return Math.max(1, ttlHours) * 60 * 60 * 1000;
}

function createCacheKey(origin: string, destination: string) {
  return crypto
    .createHash("sha256")
    .update(`${origin}\n${destination}`)
    .digest("hex");
}

async function getCachedDistance(key: string): Promise<DistanceDurationResult | null> {
  if (process.env.NODE_ENV === "test") return null;

  try {
    const { prisma } = await import("@/lib/prisma");
    const cached = await prisma.mapsDistanceCache.findUnique({
      where: { key },
      select: {
        distanceKm: true,
        durationMinutes: true,
        expiresAt: true,
      },
    });

    if (!cached || cached.expiresAt <= new Date()) {
      return null;
    }

    return {
      distanceKm: cached.distanceKm,
      durationMinutes: cached.durationMinutes,
    };
  } catch (error) {
    console.error("[Maps Cache] Read failed:", error);
    return null;
  }
}

async function setCachedDistance(
  key: string,
  origin: string,
  destination: string,
  value: DistanceDurationResult
) {
  if (process.env.NODE_ENV === "test") return;

  try {
    const { prisma } = await import("@/lib/prisma");
    await prisma.mapsDistanceCache.upsert({
      where: { key },
      create: {
        key,
        origin,
        destination,
        distanceKm: value.distanceKm,
        durationMinutes: value.durationMinutes,
        expiresAt: new Date(Date.now() + getCacheTtlMs()),
      },
      update: {
        distanceKm: value.distanceKm,
        durationMinutes: value.durationMinutes,
        expiresAt: new Date(Date.now() + getCacheTtlMs()),
      },
    });
  } catch (error) {
    console.error("[Maps Cache] Write failed:", error);
  }
}

export const mapsService = {
  async calculateDistanceAndDuration(origin: RouteLocation, destination: RouteLocation): Promise<DistanceDurationResult> {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
      throw new Error("GOOGLE_MAPS_API_KEY is required to calculate real route distance.");
    }

    const normalizedOrigin = normalizeLocation(origin);
    const normalizedDestination = normalizeLocation(destination);
    const cacheKey = createCacheKey(normalizedOrigin, normalizedDestination);
    const cached = await getCachedDistance(cacheKey);
    if (cached) return cached;

    const searchParams = new URLSearchParams({
      origins: normalizedOrigin,
      destinations: normalizedDestination,
      key: apiKey,
    });

    const response = await fetch(`https://maps.googleapis.com/maps/api/distancematrix/json?${searchParams}`);

    if (!response.ok) {
      throw new Error(`Google Maps request failed with status ${response.status}.`);
    }

    const data = (await response.json()) as GoogleDistanceMatrixResponse;
    const element = data.rows?.[0]?.elements?.[0];

    if (data.status !== "OK" || element?.status !== "OK" || !element.distance || !element.duration) {
      throw new Error(data.error_message || "Google Maps could not calculate a valid route.");
    }

    const result = {
      distanceKm: Number((element.distance.value / 1000).toFixed(2)),
      durationMinutes: Math.ceil(element.duration.value / 60),
    };

    await setCachedDistance(cacheKey, normalizedOrigin, normalizedDestination, result);

    return result;
  }
};
