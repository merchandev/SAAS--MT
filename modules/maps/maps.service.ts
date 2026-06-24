export interface DistanceDurationResult {
  distanceKm: number;
  durationMinutes: number;
}

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

export const mapsService = {
  async calculateDistanceAndDuration(origin: string, destination: string): Promise<DistanceDurationResult> {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
      throw new Error("GOOGLE_MAPS_API_KEY is required to calculate real route distance.");
    }

    const searchParams = new URLSearchParams({
      origins: origin,
      destinations: destination,
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
