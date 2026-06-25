import crypto from "crypto";

const SIGNATURE_VERSION = "HMAC_SHA256_V1";

// Evaluate secret at startup so it crashes early if missing
const REDSYS_SECRET_KEY = process.env.REDSYS_SECRET_KEY;
if (!REDSYS_SECRET_KEY && process.env.NODE_ENV === "production") {
  if (process.env.NEXT_PUBLIC_IS_BUILDING === "true") {
    console.warn("WARNING: REDSYS_SECRET_KEY is missing (ignored during build).");
  } else {
    throw new Error("FATAL: REDSYS_SECRET_KEY environment variable is not set. Payments will fail.");
  }
}

// Optional fallback ONLY for local development, never used in production
const effectiveSecret = REDSYS_SECRET_KEY || "sq7HjrUOBfKmC576ILgskD5srU870gJ7";

type RedsysBooking = {
  id?: string;
  publicCode: string;
  finalPrice: unknown;
  createdAt?: Date | string;
  payments?: Array<{
    providerOrderId: string | null;
    status: string;
  }>;
};

function toBase64Url(value: Buffer | string): string {
  const buffer = typeof value === "string" ? Buffer.from(value) : value;

  return buffer
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function fromBase64Url(value: string): string {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  return normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), "=");
}

function getRedsysSecretKey(): string {
  return effectiveSecret;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function createOrderId(booking: RedsysBooking): string {
  const year = new Date(booking.createdAt ?? Date.now()).getUTCFullYear().toString();
  const source = (booking.id || booking.publicCode).replace(/[^A-Za-z0-9]/g, "").toUpperCase();
  const uniquePart = source.slice(-6).padStart(6, "0");
  const attemptCount = (booking.payments?.filter((payment) => payment.providerOrderId).length ?? 0) + 1;
  const attemptPart = attemptCount.toString(36).toUpperCase().padStart(2, "0").slice(-2);
  return `${year}${uniquePart}${attemptPart}`;
}

export const redsysService = {
  signatureVersion: SIGNATURE_VERSION,
  merchantCode: process.env.REDSYS_MERCHANT_CODE || "999008881",
  terminal: process.env.REDSYS_TERMINAL || "1",
  createOrderId,

  createMerchantParameters(booking: RedsysBooking, orderId?: string) {
    const merchantOrderId = orderId ?? createOrderId(booking);
    const amountInCents = Math.round(Number(booking.finalPrice) * 100).toString();
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const params = {
      DS_MERCHANT_AMOUNT: amountInCents,
      DS_MERCHANT_ORDER: merchantOrderId,
      DS_MERCHANT_MERCHANTCODE: this.merchantCode,
      DS_MERCHANT_CURRENCY: "978",
      DS_MERCHANT_TRANSACTIONTYPE: "0",
      DS_MERCHANT_TERMINAL: this.terminal,
      DS_MERCHANT_MERCHANTURL: `${appUrl}/api/redsys/callback`,
      DS_MERCHANT_URLOK: `${appUrl}/booking/success?code=${booking.publicCode}&paid=true`,
      DS_MERCHANT_URLKO: `${appUrl}/booking/error?code=${booking.publicCode}`,
      DS_MERCHANT_MERCHANTDATA: booking.publicCode,
    };

    return toBase64Url(JSON.stringify(params));
  },

  createSignature(merchantParamsBase64: string, orderId: string) {
    // 1. Decodificar la clave secreta
    const decodedSecret = Buffer.from(getRedsysSecretKey(), "base64");
    
    // 2. Cifrar el orderId con 3DES usando la clave decodificada
    const cipher = crypto.createCipheriv("des-ede3-cbc", decodedSecret, Buffer.alloc(8, 0));
    cipher.setAutoPadding(false);
    
    // El orderId debe rellenarse con ceros (\0) hasta ser múltiplo de 8
    const paddedOrderId = Buffer.alloc(Math.ceil(orderId.length / 8) * 8, 0);
    paddedOrderId.write(orderId, "utf8");
    
    const derivedKey = Buffer.concat([cipher.update(paddedOrderId), cipher.final()]);
    
    // 3. Crear HMAC-SHA256 con la clave derivada
    const hmac = crypto.createHmac("sha256", derivedKey);
    hmac.update(merchantParamsBase64);
    
    return toBase64Url(hmac.digest());
  },

  signaturesMatch(receivedSignature: string, expectedSignature: string) {
    const received = Buffer.from(receivedSignature);
    const expected = Buffer.from(expectedSignature);
    return received.length === expected.length && crypto.timingSafeEqual(received, expected);
  },

  decodeResponse(base64Params: string) {
    const decoded = Buffer.from(fromBase64Url(base64Params), "base64").toString("utf8");
    return JSON.parse(decoded);
  },

  generateHtmlForm(booking: RedsysBooking, orderId?: string) {
    const merchantOrderId = orderId ?? createOrderId(booking);
    const merchantParams = this.createMerchantParameters(booking, merchantOrderId);
    const signature = this.createSignature(merchantParams, merchantOrderId);
    const redsysUrl = process.env.REDSYS_URL || "https://sis-t.redsys.es:25443/sis/realizarPago";

    return `
      <form id="redsys-form" action="${escapeHtml(redsysUrl)}" method="POST">
        <input type="hidden" name="Ds_SignatureVersion" value="${SIGNATURE_VERSION}" />
        <input type="hidden" name="Ds_MerchantParameters" value="${escapeHtml(merchantParams)}" />
        <input type="hidden" name="Ds_Signature" value="${escapeHtml(signature)}" />
        <noscript>
          <button type="submit">Continuar al pago</button>
        </noscript>
      </form>
      <script>
        document.getElementById("redsys-form")?.submit();
      </script>
    `;
  }
};
