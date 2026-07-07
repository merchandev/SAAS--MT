import MarketingHeader from "@/components/marketing/MarketingHeader";
import MarketingFooter from "@/components/marketing/MarketingFooter";
import Link from "next/link";

export const metadata = {
  title: "Aviso Legal | Transfers in Barcelona",
  description: "Aviso Legal de Transfers in Barcelona GESTION SL.",
};

export default function LegalNoticePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900 selection:bg-[#D4AF37] selection:text-white">
      <MarketingHeader />
      
      <main className="flex-1 w-full max-w-4xl mx-auto px-6 py-24 md:py-32">
        <div className="bg-white p-8 md:p-14 rounded-2xl shadow-sm border border-gray-200">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-950 mb-4">Aviso Legal</h1>
          <p className="text-sm font-semibold text-gray-500 mb-8 pb-8 border-b border-gray-100 uppercase tracking-wide">
            METRANSFERS GESTION SL
          </p>

          <div className="space-y-10 text-gray-700 leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-gray-950 mb-4">1. INFORMACIÓN IDENTIFICATIVA</h2>
              <p className="mb-3 text-gray-600">
                En cumplimiento con el deber de información recogido en el artículo 10 de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y del Comercio Electrónico (LSSI-CE), a continuación se reflejan los siguientes datos:
              </p>
              <ul className="list-none space-y-2 text-gray-600">
                <li><strong className="text-gray-900">Titular del sitio web:</strong> METRANSFERS GESTION SL</li>
                <li><strong className="text-gray-900">NIF:</strong> B22522353</li>
                <li><strong className="text-gray-900">Domicilio Social:</strong> AVDA MARE DE DEU DE MONTSERRAT, NUM 18, PLANTA 5, PUERTA 2, 08970 SANT JOAN DESPÍ – (BARCELONA)</li>
                <li><strong className="text-gray-900">Correo electrónico de contacto:</strong> <a href="mailto:info@transfersinbarcelona.com" className="text-[#D4AF37] hover:underline font-medium">info@transfersinbarcelona.com</a></li>
                <li><strong className="text-gray-900">Actividad:</strong> Transporte de viajeros y gestión de servicios turísticos.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-950 mb-4">2. CONDICIONES DE USO</h2>
              <p className="mb-4 text-gray-600">
                El acceso y/o uso de este portal atribuye la condición de USUARIO, que acepta, desde dicho acceso y/o uso, las Condiciones Generales de Uso aquí reflejadas.
              </p>
              <p className="text-gray-600">
                El sitio web proporciona acceso a informaciones, servicios o datos (en adelante, “los contenidos”) en Internet pertenecientes a METRANSFERS GESTION SL. El USUARIO asume la responsabilidad del uso del portal. Dicha responsabilidad se extiende al registro que fuese necesario para acceder a determinados servicios o contenidos (como el formulario de reservas).
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-950 mb-4">3. PROPIEDAD INTELECTUAL E INDUSTRIAL</h2>
              <p className="mb-4 text-gray-600">
                METRANSFERS GESTION SL es titular de todos los derechos de propiedad intelectual e industrial de su página web, así como de los elementos contenidos en la misma (a título enunciativo: imágenes, sonido, audio, vídeo, software o textos; marcas o logotipos, combinaciones de colores, estructura y diseño, selección de materiales usados, programas de ordenador necesarios para su funcionamiento, acceso y uso, etc.).
              </p>
              <p className="text-gray-600">
                En virtud de lo dispuesto en los artículos 8 y 32.1, párrafo segundo, de la Ley de Propiedad Intelectual, quedan expresamente prohibidas la reproducción, la distribución y la comunicación pública, incluida su modalidad de puesta a disposición, de la totalidad o parte de los contenidos de esta página web, con fines comerciales, en cualquier soporte y por cualquier medio técnico, sin la autorización de METRANSFERS GESTION SL.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-950 mb-4">4. EXCLUSIÓN DE GARANTÍAS Y RESPONSABILIDAD</h2>
              <p className="text-gray-600">
                EL PRESTADOR no se hace responsable, en ningún caso, de los daños y perjuicios de cualquier naturaleza que pudieran ocasionar, a título enunciativo: errores u omisiones en los contenidos, falta de disponibilidad del portal o la transmisión de virus o programas maliciosos o lesivos en los contenidos, a pesar de haber adoptado todas las medidas tecnológicas necesarias para evitarlo.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-950 mb-4">5. MODIFICACIONES</h2>
              <p className="text-gray-600">
                METRANSFERS GESTION SL se reserva el derecho de efectuar sin previo aviso las modificaciones que considere oportunas en su portal, pudiendo cambiar, suprimir o añadir tanto los contenidos y servicios que se presten a través de la misma como la forma en la que éstos aparezcan presentados o localizados en su portal.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-950 mb-4">6. ENLACES (LINKS)</h2>
              <p className="text-gray-600">
                En el caso de que en el sitio web se dispusiesen enlaces o hipervínculos hacía otros sitios de Internet, METRANSFERS GESTION SL no ejercerá ningún tipo de control sobre dichos sitios y contenidos. En ningún caso asumirá responsabilidad alguna por los contenidos de algún enlace perteneciente a un sitio web ajeno.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-950 mb-4">7. DERECHO DE EXCLUSIÓN</h2>
              <p className="text-gray-600">
                METRANSFERS GESTION SL se reserva el derecho a denegar o retirar el acceso al portal y/o los servicios ofrecidos sin necesidad de preaviso, a instancia propia o de un tercero, a aquellos usuarios que incumplan las presentes Condiciones Generales de Uso.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-950 mb-4">8. PROTECCIÓN DE DATOS</h2>
              <p className="text-gray-600">
                Todo lo relativo a la política de protección de datos se encuentra recogido en el documento de <Link href="/politica-de-privacidad" className="text-[#D4AF37] hover:underline font-medium">Política de Privacidad</Link> de la entidad, conforme al Reglamento (UE) 2016/679 (RGPD) y la Ley Orgánica 3/2018 (LOPDGDD).
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-950 mb-4">9. LEGISLACIÓN APLICABLE Y JURISDICCIÓN</h2>
              <p className="text-gray-600">
                La relación entre METRANSFERS GESTION SL y el USUARIO se regirá por la normativa española vigente y cualquier controversia se someterá a los Juzgados y Tribunales de la ciudad de Barcelona.
              </p>
            </section>
          </div>
        </div>
      </main>
      
      <MarketingFooter />
    </div>
  );
}
