import { afterEach, describe, expect, it, vi } from "vitest";
import { mapsService } from "../modules/maps/maps.service";

describe("Maps Service", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    delete process.env.GOOGLE_MAPS_API_KEY;
  });

  it("fails closed when GOOGLE_MAPS_API_KEY is missing", async () => {
    await expect(
      mapsService.calculateDistanceAndDuration("Airport", "Hotel")
    ).rejects.toThrow("GOOGLE_MAPS_API_KEY is required");
  });

  it("returns real distance and duration from Google Distance Matrix response", async () => {
    process.env.GOOGLE_MAPS_API_KEY = "test-key";
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          status: "OK",
          rows: [
            {
              elements: [
                {
                  status: "OK",
                  distance: { value: 12345 },
                  duration: { value: 1800 },
                },
              ],
            },
          ],
        }),
      })
    );

    const result = await mapsService.calculateDistanceAndDuration("Airport", "Hotel");

    expect(result).toEqual({ distanceKm: 12.35, durationMinutes: 30 });
  });
});
