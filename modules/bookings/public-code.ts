import type { Prisma } from "@prisma/client";

export async function generateUniquePublicCode(client: any): Promise<string> {
  // We use raw SQL to atomically increment the counter stored in SystemSetting
  let result: any[] = [];
  
  try {
    result = await client.$queryRaw`
      UPDATE "SystemSetting"
      SET "value" = CAST(CAST("value" AS INTEGER) + 1 AS TEXT), "updatedAt" = NOW()
      WHERE "key" = 'NEXT_BOOKING_CODE'
      RETURNING "value"
    `;
  } catch (error) {
    console.error("Error updating NEXT_BOOKING_CODE:", error);
  }

  if (!result || result.length === 0) {
    // If the setting doesn't exist, we insert it starting with the next value 10001
    // and we return 10000 for this booking.
    try {
      await client.$queryRaw`
        INSERT INTO "SystemSetting" ("id", "key", "value", "updatedAt")
        VALUES (gen_random_uuid(), 'NEXT_BOOKING_CODE', '10001', NOW())
        ON CONFLICT ("key") DO NOTHING
      `;
    } catch (insertError) {
      // In case of conflict due to concurrency, another transaction might have inserted it
      result = await client.$queryRaw`
        UPDATE "SystemSetting"
        SET "value" = CAST(CAST("value" AS INTEGER) + 1 AS TEXT), "updatedAt" = NOW()
        WHERE "key" = 'NEXT_BOOKING_CODE'
        RETURNING "value"
      `;
      if (result && result.length > 0) {
        return (parseInt(result[0].value) - 1).toString();
      }
    }
    return "10000";
  }

  // The counter was updated successfully. Since it holds the NEXT value to be used (e.g., 10001), 
  // we subtract 1 to get the current value (e.g., 10000) for this booking.
  return (parseInt(result[0].value) - 1).toString();
}
