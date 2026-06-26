import { describe, expect, it } from "vitest";
import { publicBookingSchema } from "../modules/bookings/bookings.schemas";

const validBooking = {
  customerName: "Test Customer",
  customerEmail: "customer@example.com",
  customerPhone: "+34600000000",
  vehicleId: "11111111-1111-4111-8111-111111111111",
  originAddress: "Airport Terminal 1",
  destinationAddress: "Hotel Center",
  serviceDate: "2099-01-01",
  serviceTime: "23:45",
  tripType: "ONE_WAY",
  passengers: 2,
  luggage: 1,
};

describe("booking schemas", () => {
  it("accepts service times inside the 24-hour range", () => {
    expect(publicBookingSchema.safeParse(validBooking).success).toBe(true);
  });

  it("rejects impossible service times", () => {
    const result = publicBookingSchema.safeParse({
      ...validBooking,
      serviceTime: "99:99",
    });

    expect(result.success).toBe(false);
  });
});
