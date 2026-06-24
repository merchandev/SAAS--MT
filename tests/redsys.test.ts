import { describe, it, expect, beforeEach } from "vitest";
import { redsysService } from "../modules/payments/redsys.service";

const booking = {
  id: "booking-abcdef1234",
  finalPrice: 150.25,
  publicCode: "MT-2026-X9Y8",
  createdAt: "2026-06-23T00:00:00.000Z",
  payments: [],
};

function toBase64Url(value: string) {
  return Buffer.from(value)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

describe("Redsys Service", () => {
  beforeEach(() => {
    process.env.REDSYS_SECRET_KEY = "sq7HjrUOBfKmC576ILgskD5srU870gJ7";
    process.env.REDSYS_MERCHANT_CODE = "999008881";
    process.env.REDSYS_TERMINAL = "1";
    process.env.NEXT_PUBLIC_APP_URL = "http://localhost:3000";
  });

  it("creates Redsys-compatible merchant parameters", () => {
    const orderId = redsysService.createOrderId(booking);
    const base64Params = redsysService.createMerchantParameters(booking, orderId);
    const parsed = JSON.parse(Buffer.from(base64Params, "base64").toString("utf8"));

    expect(orderId).toBe("2026EF123401");
    expect(orderId).toMatch(/^\d{4}[A-Z0-9]{8}$/);
    expect(parsed.DS_MERCHANT_AMOUNT).toBe("15025");
    expect(parsed.DS_MERCHANT_ORDER).toBe(orderId);
    expect(parsed.DS_MERCHANT_CURRENCY).toBe("978");
    expect(parsed.DS_MERCHANT_MERCHANTDATA).toBe("MT-2026-X9Y8");
  });

  it("generates deterministic HMAC_SHA512_V2 URL-safe signatures", () => {
    const orderId = "2026EF123401";
    const paramsBase64 = redsysService.createMerchantParameters(booking, orderId);

    const signature = redsysService.createSignature(paramsBase64, orderId);
    const repeatedSignature = redsysService.createSignature(paramsBase64, orderId);

    expect(redsysService.signatureVersion).toBe("HMAC_SHA512_V2");
    expect(signature).toBe(repeatedSignature);
    expect(signature).toMatch(/^[A-Za-z0-9_-]+$/);
    expect(signature.length).toBeGreaterThan(80);
    expect(redsysService.signaturesMatch(signature, repeatedSignature)).toBe(true);
  });

  it("generates an auto-submit form using Redsys V2 fields", () => {
    const form = redsysService.generateHtmlForm(booking, "2026EF123401");

    expect(form).toContain('name="Ds_SignatureVersion" value="HMAC_SHA512_V2"');
    expect(form).toContain('name="Ds_MerchantParameters"');
    expect(form).toContain('name="Ds_Signature"');
    expect(form).not.toContain("HMAC_SHA256_V1");
  });

  it("decodes standard Base64 and Base64URL Redsys responses", () => {
    const json = JSON.stringify({ Ds_Response: "0000", Ds_Order: "2026EF123401" });
    const standardResult = redsysService.decodeResponse(Buffer.from(json).toString("base64"));
    const urlSafeResult = redsysService.decodeResponse(toBase64Url(json));

    expect(standardResult.Ds_Response).toBe("0000");
    expect(urlSafeResult.Ds_Order).toBe("2026EF123401");
  });
});
