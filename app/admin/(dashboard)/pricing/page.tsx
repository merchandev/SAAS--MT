import { getDiscountCodes, getPriceRules } from "@/modules/pricing/pricing.actions";
import { DiscountCodesClient } from "./components/DiscountCodesClient";
import { PriceRulesClient } from "./components/PriceRulesClient";

export const dynamic = "force-dynamic";

export default async function PricingPage() { 
  const discountCodes = await getDiscountCodes();
  const priceRules = await getPriceRules();

  return (
    <div className="space-y-8 max-w-6xl mx-auto pt-6 pb-20">
      <div>
        <h3 className="text-3xl font-bold tracking-tight text-gray-900">Estructura de Precios</h3>
        <p className="text-gray-500 mt-2">Configuración de códigos de descuento y reglas de precios globales.</p>
      </div>

      {/* Códigos de Descuento */}
      <section>
        <DiscountCodesClient initialCodes={discountCodes} />
      </section>

      <hr className="border-gray-200" />

      {/* Reglas de Precio */}
      <section>
        <PriceRulesClient initialRules={priceRules} />
      </section>
    </div>
  ) 
}
