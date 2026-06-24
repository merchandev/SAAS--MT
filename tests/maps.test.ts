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

  it("prefers Google place IDs when provided", async () => {
    process.env.GOOGLE_MAPS_API_KEY = "test-key";
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        status: "OK",
        rows: [
          {
            elements: [
              {
                status: "OK",
                distance: { value: 1000 },
                duration: { value: 120 },
              },
            ],
          },
        ],
      }),
    });
    vi.stubGlobal("fetch", fetchMock);

    await mapsService.calculateDistanceAndDuration(
      { address: "Fallback origin", placeId: "origin-place" },
      { address: "Fallback destination", placeId: "destination-place" }
    );

    const url = fetchMock.mock.calls[0][0] as string;
    expect(url).toContain("origins=place_id%3Aorigin-place");
    expect(url).toContain("destinations=place_id%3Adestination-place");
  });
});
