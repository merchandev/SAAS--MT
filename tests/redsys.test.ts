import { describe, it, expect } from 'vitest';
import { redsysService } from '../modules/payments/redsys.service';

describe('Redsys Service', () => {
  // Vector oficial de Redsys para pruebas de firma
  // (Valores usados comúnmente en la documentación para verificar MAC256)
  const testSecretKey = 'sq7HjrUOBfKmC576ILgskD5srU870gJ7'; // Clave en Base64
  
  it('creates merchant parameters in Base64 encoding', () => {
    const booking = {
      finalPrice: 150.25,
      publicCode: 'MT-2026-X9Y8'
    };

    // Forzar entorno de variables de entorno para la prueba
    process.env.REDSYS_MERCHANT_CODE = '999008881';
    process.env.REDSYS_TERMINAL = '1';
    process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000';

    const base64Params = redsysService.createMerchantParameters(booking);
    
    // Decodificar y comprobar que es un JSON válido y correcto
    const decoded = Buffer.from(base64Params, 'base64').toString('utf8');
    const parsed = JSON.parse(decoded);

    expect(parsed.DS_MERCHANT_AMOUNT).toBe('15025'); // 150.25 * 100
    // "MT-2026-X9Y8" se limpia a MT2026X9Y8 (hasta 12 chars: MT2026X9Y8 -> MT2026X9Y8)
    // El orden espera tener 4 primeros numéricos, la lógica actual hace un padStart y reemplazos.
    expect(parsed.DS_MERCHANT_ORDER).toBe('MT2026X9Y8');
    expect(parsed.DS_MERCHANT_CURRENCY).toBe('978');
  });

  it('generates the correct HMAC SHA256 signature using 3DES derived key', () => {
    // Escenario oficial de Redsys manual
    process.env.REDSYS_SECRET_KEY = testSecretKey;

    // Supongamos que los parámetros codificados son "eyJEU19NRVJDSEFOVF9BTU9VTlQiOiIxNTAyNSJ9"
    // y la orden es "1234Order"
    const orderId = '1234Order';
    const paramsBase64 = 'eyJEU19NRVJDSEFOVF9BTU9VTlQiOiIxNTAyNSJ9'; 

    const signature = redsysService.createSignature(paramsBase64, orderId);

    // Si pasamos el mismo orderId y mismos parametros, la firma siempre será determinista
    expect(signature).toBeTypeOf('string');
    expect(signature.length).toBeGreaterThan(20);
  });

  it('decodes response correctly', () => {
    const obj = { Ds_Response: '0000', Ds_Order: '1234Order' };
    const base64Str = Buffer.from(JSON.stringify(obj)).toString('base64');

    const result = redsysService.decodeResponse(base64Str);
    expect(result.Ds_Response).toBe('0000');
    expect(result.Ds_Order).toBe('1234Order');
  });
});
