import { notFound } from "next/navigation";
import { PrismaClient } from "@prisma/client";
import { redsysService } from "@/modules/payments/redsys.service";

const prisma = new PrismaClient();

export default async function PaymentRedirectPage({ params }: { params: { code: string } }) {
  const booking = await prisma.booking.findUnique({
    where: { publicCode: params.code }
  });

  if (!booking || booking.paymentStatus === 'PAID') {
    notFound();
  }

  // Generar criptografía para enviar al banco
  const merchantParamsBase64 = redsysService.createMerchantParameters(booking);
  
  // Extraer el orderId que generamos
  const cleanOrder = booking.publicCode.replace(/[^A-Za-z0-9]/g, '').substring(0, 12).padStart(4, '0');
  
  const signature = redsysService.createSignature(merchantParamsBase64, cleanOrder);

  // URL del entorno de pruebas (SIS-T)
  const redsysUrl = "https://sis-t.redsys.es:25443/sis/realizarPago";

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full text-center">
        <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-6"></div>
        <h2 className="text-xl font-bold mb-2">Conectando con el Banco...</h2>
        <p className="text-gray-500 mb-6 text-sm">Serás redirigido a la pasarela segura en unos segundos para abonar €{Number(booking.finalPrice).toFixed(2)}.</p>
        
        {/* Formulario invisible que se auto-envía */}
        <form name="redsys_form" action={redsysUrl} method="POST">
          <input type="hidden" name="Ds_SignatureVersion" value="HMAC_SHA256_V1" />
          <input type="hidden" name="Ds_MerchantParameters" value={merchantParamsBase64} />
          <input type="hidden" name="Ds_Signature" value={signature} />
          
          <button type="submit" className="text-blue-600 font-medium hover:underline text-sm">
            Haz clic aquí si no eres redirigido automáticamente
          </button>
        </form>

        <script dangerouslySetInnerHTML={{
          __html: `document.forms["redsys_form"].submit();`
        }} />
      </div>
    </div>
  );
}
