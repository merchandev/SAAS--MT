export interface DistanceDurationResult {
  distanceKm: number;
  durationMinutes: number;
}

export const mapsService = {
  /**
   * Calcula la distancia real y el tiempo estimado usando Google Maps API.
   * Si no hay API KEY, hace un fallback mock para no romper MVP.
   */
  async calculateDistanceAndDuration(origin: string, destination: string): Promise<DistanceDurationResult> {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    
    if (!apiKey) {
      console.warn("GOOGLE_MAPS_API_KEY not found. Using mock distance calculation.");
      // Fake logic para propósitos de dev
      const baseDistance = 25;
      const calculatedDistance = baseDistance + (Math.abs(origin.length - destination.length));
      return {
        distanceKm: Number(calculatedDistance.toFixed(2)),
        durationMinutes: Math.floor(calculatedDistance * 1.5)
      };
    }

    try {
      const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(origin)}&destinations=${encodeURIComponent(destination)}&key=${apiKey}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.status === "OK" && data.rows[0]?.elements[0]?.status === "OK") {
        const element = data.rows[0].elements[0];
        const distanceMeters = element.distance.value;
        const durationSeconds = element.duration.value;

        return {
          distanceKm: Number((distanceMeters / 1000).toFixed(2)),
          durationMinutes: Math.ceil(durationSeconds / 60)
        };
      } else {
        console.warn("Google Maps API couldn't find route:", data);
        throw new Error("Google Maps API returned an error or no route found.");
      }
    } catch (error) {
      console.error("Error calculating distance with Google Maps:", error);
      // Fallback para evitar romper la reserva si Maps API falla
      return {
        distanceKm: 30,
        durationMinutes: 45
      };
    }
  }
};
