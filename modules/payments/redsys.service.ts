import crypto from "crypto";

const DEFAULT_REDSYS_TEST_KEY = "sq7HjrUOBfKmC576ILgskD5srU870gJ7";
const SIGNATURE_VERSION = "HMAC_SHA512_V2";

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

function toBase64Url(value: Buffer): string {
  return value
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function fromBase64Url(value: string): string {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  return normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), "=");
}

function zeroPadToBlockSize(value: string, blockSize: number): string {
  const padLength = blockSize - (value.length % blockSize);
  return padLength === blockSize ? value : value + "\0".repeat(padLength);
}

function getRedsysSecretKey(): Buffer {
  const secretKey = process.env.REDSYS_SECRET_KEY || DEFAULT_REDSYS_TEST_KEY;

  if (!process.env.REDSYS_SECRET_KEY && process.env.NODE_ENV === "production") {
    throw new Error("FATAL: REDSYS_SECRET_KEY environment variable is not set.");
  }

  return Buffer.from(secretKey, "base64");
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
  createOrderId,

  createMerchantParameters(booking: RedsysBooking, orderId?: string) {
    const merchantOrderId = orderId ?? createOrderId(booking);
    const amountInCents = Math.round(Number(booking.finalPrice) * 100).toString();
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const params = {
      DS_MERCHANT_AMOUNT: amountInCents,
      DS_MERCHANT_ORDER: merchantOrderId,
      DS_MERCHANT_MERCHANTCODE: process.env.REDSYS_MERCHANT_CODE || "999008881",
      DS_MERCHANT_CURRENCY: "978",
      DS_MERCHANT_TRANSACTIONTYPE: "0",
      DS_MERCHANT_TERMINAL: process.env.REDSYS_TERMINAL || "1",
      DS_MERCHANT_MERCHANTURL: `${appUrl}/api/redsys/callback`,
      DS_MERCHANT_URLOK: `${appUrl}/booking/success?paid=true`,
      DS_MERCHANT_URLKO: `${appUrl}/booking/error`,
      DS_MERCHANT_MERCHANTDATA: booking.publicCode,
    };

    return Buffer.from(JSON.stringify(params)).toString("base64");
  },

  createSignature(merchantParamsBase64: string, orderId: string) {
    const decodedSecret = getRedsysSecretKey();
    const cipher = crypto.createCipheriv("des-ede3-cbc", decodedSecret, Buffer.alloc(8, 0));
    cipher.setAutoPadding(false);

    const paddedOrderId = zeroPadToBlockSize(orderId, 8);
    const derivedKey = Buffer.concat([cipher.update(paddedOrderId, "utf8"), cipher.final()]);

    return toBase64Url(
      crypto.createHmac("sha512", derivedKey).update(merchantParamsBase64).digest()
    );
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
      <form id="redsys_form" action="${escapeHtml(redsysUrl)}" method="POST">
        <input type="hidden" name="Ds_SignatureVersion" value="${SIGNATURE_VERSION}" />
        <input type="hidden" name="Ds_MerchantParameters" value="${escapeHtml(merchantParams)}" />
        <input type="hidden" name="Ds_Signature" value="${escapeHtml(signature)}" />
      </form>
      <script>
        document.getElementById('redsys_form').submit();
      </script>
    `;
  }
};
