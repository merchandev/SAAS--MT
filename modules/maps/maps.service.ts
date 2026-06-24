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

export const mapsService = {
  async calculateDistanceAndDuration(origin: RouteLocation, destination: RouteLocation): Promise<DistanceDurationResult> {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
      throw new Error("GOOGLE_MAPS_API_KEY is required to calculate real route distance.");
    }

    const searchParams = new URLSearchParams({
      origins: normalizeLocation(origin),
      destinations: normalizeLocation(destination),
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

    return {
      distanceKm: Number((element.distance.value / 1000).toFixed(2)),
      durationMinutes: Math.ceil(element.duration.value / 60),
    };
  }
};
