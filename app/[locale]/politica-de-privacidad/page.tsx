import MarketingHeader from "@/components/marketing/MarketingHeader";
import MarketingFooter from "@/components/marketing/MarketingFooter";

export const metadata = {
  title: "Política de Privacidad | Transfers in Barcelona",
  description: "Política de Privacidad de Transfers in Barcelona GESTION SL.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900 selection:bg-[#D4AF37] selection:text-white">
      <MarketingHeader />
      
      <main className="flex-1 w-full max-w-4xl mx-auto px-6 py-24 md:py-32">
        <div className="bg-white p-8 md:p-14 rounded-2xl shadow-sm border border-gray-200">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-950 mb-4">Política de Privacidad</h1>
          <p className="text-sm font-semibold text-gray-500 mb-8 pb-8 border-b border-gray-100 uppercase tracking-wide">
            METRANSFERS GESTION SL · Última revisión: 13 de enero de 2026
          </p>

          <div className="space-y-10 text-gray-700 leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-gray-950 mb-4">1. Identificación del Responsable del Tratamiento</h2>
              <ul className="list-none space-y-2 text-gray-600">
                <li><strong className="text-gray-900">Razón Social:</strong> METRANSFERS GESTION SL</li>
                <li><strong className="text-gray-900">NIF:</strong> B22522353</li>
                <li><strong className="text-gray-900">Domicilio Fiscal:</strong> AVDA MARE DE DEU DE MONTSERRAT, NUM 18, PLANTA 5, PUERTA 2, 08970 SANT JOAN DESPÍ – (BARCELONA)</li>
                <li><strong className="text-gray-900">Contacto Privacidad:</strong> <a href="mailto:info@transfersinbarcelona.com" className="text-[#D4AF37] hover:underline font-medium">info@transfersinbarcelona.com</a></li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-950 mb-4">2. Aceptación Vinculante</h2>
              <p className="text-gray-600">
                Al utilizar nuestros servicios, navegar por nuestra plataforma o completar el proceso de configuración de una reserva, usted reconoce haber leído, comprendido y aceptado sin reservas que sus datos personales sean tratados conforme a los términos aquí expuestos. La formalización de una reserva constituye un contrato entre las partes, legitimando el tratamiento de los datos necesarios para la ejecución del servicio.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-950 mb-4">3. Datos Objeto de Tratamiento</h2>
              <p className="mb-3 text-gray-600">Recopilamos los datos estrictamente necesarios para la prestación del servicio:</p>
              <ul className="list-disc pl-5 space-y-2 text-gray-600 marker:text-[#D4AF37]">
                <li><strong className="text-gray-900">Datos de Reserva:</strong> Nombre, apellidos, teléfono, correo electrónico y detalles del trayecto/servicio solicitado.</li>
                <li><strong className="text-gray-900">Datos de Facturación:</strong> Dirección postal y NIF/DNI (según los datos de registro fiscal de la entidad).</li>
                <li><strong className="text-gray-900">Datos de Navegación:</strong> Dirección IP, cookies y metadatos para garantizar la seguridad del sitio.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-950 mb-4">4. Finalidad del Tratamiento</h2>
              <p className="mb-3 text-gray-600">Sus datos serán tratados con el fin de:</p>
              <ul className="list-disc pl-5 space-y-2 text-gray-600 marker:text-[#D4AF37]">
                <li><strong className="text-gray-900">Gestión de Reservas:</strong> Tramitar, confirmar y ejecutar los servicios de transporte o gestión contratados.</li>
                <li><strong className="text-gray-900">Atención al Cliente:</strong> Resolver dudas y proporcionar soporte a través del punto único de contacto info@transfersinbarcelona.com.</li>
                <li><strong className="text-gray-900">Cumplimiento Legal:</strong> Emitir facturas y cumplir con las obligaciones tributarias ante la AEAT.</li>
                <li><strong className="text-gray-900">Seguridad:</strong> Prevenir fraudes y usos no autorizados de la plataforma.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-950 mb-4">5. Legitimación</h2>
              <p className="mb-3 text-gray-600">La base legal para el tratamiento es:</p>
              <ul className="list-disc pl-5 space-y-2 text-gray-600 marker:text-[#D4AF37]">
                <li><strong className="text-gray-900">Ejecución Contractual:</strong> Necesaria para procesar su reserva y prestarle el servicio solicitado.</li>
                <li><strong className="text-gray-900">Obligación Legal:</strong> Derivada de la normativa fiscal y mercantil vigente en España.</li>
                <li><strong className="text-gray-900">Consentimiento:</strong> Otorgado explícitamente al marcar la casilla de aceptación en nuestros formularios.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-950 mb-4">6. Conservación y Destinatarios</h2>
              <ul className="list-disc pl-5 space-y-2 text-gray-600 marker:text-[#D4AF37]">
                <li><strong className="text-gray-900">Plazos:</strong> Los datos se conservarán durante el tiempo que dure la relación comercial y, posteriormente, durante los plazos legales de prescripción (generalmente 6 años para documentos contables según el Código de Comercio).</li>
                <li><strong className="text-gray-900">Cesiones:</strong> No se cederán datos a terceros ajenos a la operativa del servicio, salvo obligación legal ante autoridades competentes.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-950 mb-4">7. Derechos del Interesado</h2>
              <p className="mb-4 text-gray-600">
                Usted puede ejercer sus derechos de Acceso, Rectificación, Supresión, Limitación, Portabilidad y Oposición enviando una comunicación escrita acompañada de copia de su DNI a: <a href="mailto:info@transfersinbarcelona.com" className="text-[#D4AF37] hover:underline font-medium">info@transfersinbarcelona.com</a>.
              </p>
              <p className="text-gray-600">
                Asimismo, tiene derecho a retirar su consentimiento en cualquier momento y a presentar una reclamación ante la Agencia Española de Protección de Datos (AEPD) si considera que sus derechos han sido vulnerados.
              </p>
            </section>
          </div>
        </div>
      </main>
      
      <MarketingFooter />
    </div>
  );
}
