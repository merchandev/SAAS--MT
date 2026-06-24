import crypto from "crypto";

function toBase64Url(value: Buffer | string): string {
  const buffer = typeof value === "string" ? Buffer.from(value) : value;
  return buffer.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function createSignature(merchantParamsBase64: string, orderId: string, secretKeyBase64: string) {
  // 1. Decode secret key
  const decodedSecret = Buffer.from(secretKeyBase64, "base64");
  
  // 2. Encrypt Order ID with 3DES
  const cipher = crypto.createCipheriv("des-ede3-cbc", decodedSecret, Buffer.alloc(8, 0));
  // Some implementations say we need to pad the orderId to a multiple of 8 bytes with null characters. Let's try standard PKCS7 first or manual padding.
  // Actually Redsys requires the orderId to be padded with \0 to a multiple of 8 bytes before encryption.
  // Wait, let's test.
  
  // Redsys uses Zero padding for the order ID.
  cipher.setAutoPadding(false);
  const paddedOrderId = Buffer.alloc(Math.ceil(orderId.length / 8) * 8, 0);
  paddedOrderId.write(orderId, "utf8");
  
  const derivedKey = Buffer.concat([cipher.update(paddedOrderId), cipher.final()]);
  
  // 3. HMAC SHA256
  const hmac = crypto.createHmac("sha256", derivedKey);
  hmac.update(merchantParamsBase64);
  const result = hmac.digest("base64");
  return result;
}

const secret = "sq7HjrUOBfKmC576ILgskD5srU870gJ7"; // Example base64-like secret
const orderId = "2024123456";
const paramsBase64 = Buffer.from('{"DS_MERCHANT_AMOUNT":"1000","DS_MERCHANT_ORDER":"2024123456","DS_MERCHANT_MERCHANTCODE":"999008881","DS_MERCHANT_CURRENCY":"978","DS_MERCHANT_TRANSACTIONTYPE":"0","DS_MERCHANT_TERMINAL":"1"}').toString('base64');

console.log(createSignature(paramsBase64, orderId, secret));
