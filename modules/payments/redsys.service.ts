import crypto from 'crypto';

/**
 * Servicio criptográfico oficial para la pasarela Redsys (MAC256)
 */
export const redsysService = {
  createMerchantParameters(booking: any) {
    // Redsys espera el total en céntimos (ej. 10.50 EUR -> 1050)
    const amountInCents = Math.round(Number(booking.finalPrice) * 100).toString();
    
    // OrderID debe ser único, 4 dígitos numéricos seguidos de alfanuméricos.
    // Usaremos parte del publicCode (MT-2026-ABCD) limpio.
    const cleanOrder = booking.publicCode.replace(/[^A-Za-z0-9]/g, '').substring(0, 12).padStart(4, '0');

    const params = {
      DS_MERCHANT_AMOUNT: amountInCents,
      DS_MERCHANT_ORDER: cleanOrder,
      DS_MERCHANT_MERCHANTCODE: process.env.REDSYS_MERCHANT_CODE || '999008881',
      DS_MERCHANT_CURRENCY: '978', // EUR
      DS_MERCHANT_TRANSACTIONTYPE: '0', // Autorización
      DS_MERCHANT_TERMINAL: process.env.REDSYS_TERMINAL || '1',
      DS_MERCHANT_MERCHANTURL: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/redsys/callback`,
      DS_MERCHANT_URLOK: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/booking/success?paid=true`,
      DS_MERCHANT_URLKO: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/booking/error`,
    };

    const jsonParams = JSON.stringify(params);
    return Buffer.from(jsonParams).toString('base64');
  },

  createSignature(merchantParamsBase64: string, orderId: string) {
    const secretKey = process.env.REDSYS_SECRET_KEY || 'sq7HjrUOBfKmC576ILgskD5srU870gJ7'; // Clave de test por defecto
    const decodedSecret = Buffer.from(secretKey, 'base64');

    // 1. 3DES Cipher (IV nulo)
    const cipher = crypto.createCipheriv('des-ede3-cbc', decodedSecret, Buffer.alloc(8, 0));
    cipher.setAutoPadding(false);

    // Padding de nulos para que orderId sea múltiplo de 8
    let paddedOrderId = orderId;
    const padLength = 8 - (paddedOrderId.length % 8);
    if (padLength !== 8) {
      paddedOrderId += '\0'.repeat(padLength);
    }

    let derivedKey = cipher.update(paddedOrderId, 'utf8');
    derivedKey = Buffer.concat([derivedKey, cipher.final()]);

    // 2. HMAC SHA256
    const hmac = crypto.createHmac('sha256', derivedKey);
    hmac.update(merchantParamsBase64);
    
    return hmac.digest('base64');
  },

  decodeResponse(base64Params: string) {
    const decoded = Buffer.from(base64Params, 'base64').toString('utf8');
    return JSON.parse(decoded);
  }
};
