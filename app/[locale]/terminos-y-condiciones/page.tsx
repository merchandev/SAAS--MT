import MarketingHeader from "@/components/marketing/MarketingHeader";
import MarketingFooter from "@/components/marketing/MarketingFooter";

export const metadata = {
  title: "Términos y Condiciones | Transfers in Barcelona",
  description: "Términos y Condiciones de Transfers in Barcelona GESTION SL.",
};

export default function TermsAndConditionsPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900 selection:bg-[#D4AF37] selection:text-white">
      <MarketingHeader />
      
      <main className="flex-1 w-full max-w-4xl mx-auto px-6 py-24 md:py-32">
        <div className="bg-white p-8 md:p-14 rounded-2xl shadow-sm border border-gray-200">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-950 mb-4">Términos y Condiciones</h1>
          <p className="text-sm font-semibold text-gray-500 mb-8 pb-8 border-b border-gray-100 uppercase tracking-wide">
            Última actualización: 16 de enero de 2026
          </p>

          <div className="space-y-10 text-gray-700 leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-gray-950 mb-4">1. MARCO LEGAL APLICABLE</h2>
              <p className="mb-3 text-gray-600">El presente contrato se rige por lo dispuesto en la legislación española vigente, específicamente:</p>
              <ul className="list-disc pl-5 space-y-2 text-gray-600 marker:text-[#D4AF37]">
                <li>Ley 16/1987, de 30 de julio, de Ordenación de los Transportes Terrestres (LOTT) y su Reglamento (ROTT).</li>
                <li>Ley 34/2002 (LSSI-CE) sobre servicios de la sociedad de la información.</li>
                <li>Real Decreto Legislativo 1/2007, por el que se aprueba el texto refundido de la Ley General para la Defensa de los Consumidores y Usuarios.</li>
                <li>Reglamento (UE) 2016/679 (RGPD) en materia de protección de datos.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-950 mb-4">2. IDENTIFICACIÓN DE LAS PARTES</h2>
              <ul className="list-none space-y-2 text-gray-600">
                <li><strong className="text-gray-900">El Prestador:</strong> METRANSFERS GESTION SL, con NIF B22522353 y domicilio social en AVDA MARE DE DEU DE MONTSERRAT, NUM 18, PLANTA 5, PUERTA 2, 08970 SANT JOAN DESPÍ (BARCELONA).</li>
                <li><strong className="text-gray-900">El Cliente:</strong> Persona física o jurídica que formaliza la reserva y garantiza tener capacidad legal para contratar.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-950 mb-4">3. OBLIGACIÓN DE NOTIFICACIÓN Y REQUISITOS DEL SERVICIO</h2>
              <p className="mb-6 text-gray-600">
                Para garantizar la seguridad y legalidad del transporte, el Cliente tiene la obligación inexcusable de declarar las siguientes necesidades en el formulario de reserva:
              </p>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">3.1. Sistemas de Retención Infantil (SRI)</h3>
                  <p className="text-gray-600">
                    Conforme al Artículo 117 del Reglamento General de Circulación, es obligatorio el uso de sillas homologadas para menores de estatura igual o inferior a 135 cm. El Cliente debe seleccionar el número y tipo de sillas necesarias en el formulario. La omisión de este dato facultará al conductor a denegar el servicio por razones de seguridad, sin derecho a reembolso.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">3.2. Equipaje Extraordinario</h3>
                  <p className="text-gray-600">
                    La capacidad del vehículo está limitada por su ficha técnica. El transporte de maletas adicionales, material deportivo (golf, esquí) o bultos voluminosos debe ser notificado. EL PRESTADOR se reserva el derecho de cobrar suplementos o denegar el transporte si el volumen excede la capacidad del maletero del vehículo contratado.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">3.3. Transporte de Mascotas</h3>
                  <p className="text-gray-600">
                    El transporte de animales domésticos está sujeto a notificación previa y debe realizarse en trasportines homologados proporcionados por el cliente, salvo acuerdo en contrario. Los perros guía viajarán sin coste adicional conforme a la normativa vigente.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-950 mb-4">4. PASARELA DE PAGO Y SEGURIDAD (REDSYS)</h2>
              <p className="mb-4 text-gray-600">
                El pago de los servicios se efectuará mediante tarjeta de crédito o débito a través de la pasarela de pago segura Redsys.
              </p>
              <ul className="list-disc pl-5 space-y-2 text-gray-600 marker:text-[#D4AF37]">
                <li><strong className="text-gray-900">Seguridad:</strong> El sistema utiliza protocolos de encriptación SSL y autenticación 3D Secure (Verified by Visa / Mastercard ID Check).</li>
                <li><strong className="text-gray-900">Confirmación:</strong> El contrato se perfecciona en el momento en que EL PRESTADOR recibe la confirmación de la autorización de pago por parte de la entidad bancaria.</li>
                <li><strong className="text-gray-900">Fraude:</strong> EL PRESTADOR se reserva el derecho de anular cualquier transacción ante sospechas de uso fraudulento de tarjetas.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-950 mb-4">5. DERECHO DE DESISTIMIENTO Y POLÍTICA DE CANCELACIÓN</h2>
              <p className="mb-4 text-gray-600">
                En virtud del Artículo 103 l) del Real Decreto Legislativo 1/2007, el derecho de desistimiento no será aplicable a los servicios de transporte de pasajeros si el contrato prevé una fecha o un periodo de ejecución específicos. No obstante, EL PRESTADOR ofrece las siguientes condiciones comerciales:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-gray-600 marker:text-[#D4AF37]">
                <li><strong className="text-gray-900">Cancelación con &gt;24 horas:</strong> Devolución del 100% del importe mediante el mismo sistema de pago (Redsys).</li>
                <li><strong className="text-gray-900">Cancelación con &lt;24 horas o No-Show:</strong> Penalización del 100% del valor de la reserva.</li>
                <li><strong className="text-gray-900">Retrasos de vuelos:</strong> EL PRESTADOR monitoriza los vuelos. No obstante, si el retraso excede los 90 minutos sobre la hora prevista, el servicio quedará sujeto a disponibilidad de flota, pudiendo incurrir en gastos de espera adicionales.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-950 mb-4">6. RESPONSABILIDAD LIMITADA</h2>
              <p className="mb-3 text-gray-600">EL PRESTADOR no será responsable por incumplimientos derivados de:</p>
              <ul className="list-disc pl-5 space-y-2 text-gray-600 marker:text-[#D4AF37]">
                <li>Fuerza mayor o causas fortuitas (cortes de carretera, condiciones climáticas adversas, huelgas generales).</li>
                <li>Errores en los datos facilitados por el cliente en el formulario de reserva (ej. fecha errónea o número de teléfono incorrecto).</li>
                <li>Incumplimiento de las normas de seguridad por parte de los pasajeros (uso de cinturón, comportamiento disruptivo).</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-950 mb-4">7. JURISDICCIÓN Y LEY APLICABLE</h2>
              <p className="text-gray-600">
                Para la resolución de cualquier litigio derivado de la interpretación o ejecución de este contrato, las partes se someten a la legislación española. En caso de controversia, se recurrirá a los Juzgados y Tribunales de Barcelona, salvo que el cliente ostente la condición de consumidor, en cuyo caso se atenderá a la competencia territorial establecida por ley.
              </p>
            </section>
          </div>
        </div>
      </main>
      
      <MarketingFooter />
    </div>
  );
}
