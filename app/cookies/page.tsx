import MarketingHeader from "@/components/marketing/MarketingHeader";
import MarketingFooter from "@/components/marketing/MarketingFooter";
import Link from "next/link";

export const metadata = {
  title: "Política de Cookies | MeTransfers",
  description: "Política de Cookies de MeTransfers GESTION SL.",
};

export default function CookiesPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900 selection:bg-[#D4AF37] selection:text-white">
      <MarketingHeader />
      
      <main className="flex-1 w-full max-w-4xl mx-auto px-6 py-24 md:py-32">
        <div className="bg-white p-8 md:p-14 rounded-2xl shadow-sm border border-gray-200">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-950 mb-4">Política de Cookies</h1>
          <p className="text-sm font-semibold text-gray-500 mb-8 pb-8 border-b border-gray-100 uppercase tracking-wide">
            METRANSFERS GESTION SL · Última actualización: 8 de abril de 2026
          </p>

          <div className="space-y-10 text-gray-700 leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-gray-950 mb-4">1. Responsable del sitio web</h2>
              <ul className="list-none space-y-2 text-gray-600">
                <li><strong className="text-gray-900">Razón social:</strong> METRANSFERS GESTION SL</li>
                <li><strong className="text-gray-900">NIF:</strong> B22522353</li>
                <li><strong className="text-gray-900">Domicilio:</strong> AVDA MARE DE DEU DE MONTSERRAT, NUM 18, PLANTA 5, PUERTA 2, 08970 SANT JOAN DESPÍ (BARCELONA)</li>
                <li><strong className="text-gray-900">Correo electrónico:</strong> <a href="mailto:info@transfersinbarcelona.com" className="text-[#D4AF37] hover:underline font-medium">info@transfersinbarcelona.com</a></li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-950 mb-4">2. Qué son las cookies</h2>
              <p className="text-gray-600">
                Las cookies son pequeños archivos que se descargan en su dispositivo al acceder a determinadas páginas web. Permiten, entre otras cosas, reconocer su navegador, mantener la sesión, recordar preferencias, reforzar la seguridad o facilitar determinadas funcionalidades técnicas del sitio.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-950 mb-4">3. Tipos de cookies</h2>
              <p className="mb-3 text-gray-600">Las cookies pueden clasificarse, entre otros criterios, del siguiente modo:</p>
              <ul className="list-disc pl-5 space-y-2 text-gray-600 marker:text-[#D4AF37]">
                <li><strong className="text-gray-900">Según la entidad que las gestione:</strong> cookies propias y cookies de terceros.</li>
                <li><strong className="text-gray-900">Según su finalidad:</strong> cookies técnicas o necesarias, de preferencias o personalización, de análisis, y de publicidad o publicidad comportamental.</li>
                <li><strong className="text-gray-900">Según el tiempo que permanecen activas:</strong> cookies de sesión y cookies persistentes.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-950 mb-4">4. Cookies utilizadas en transfersinbarcelona.com</h2>
              <p className="mb-3 text-gray-600">
                Con carácter general, este sitio utiliza o puede utilizar cookies técnicas, de sesión y de preferencia estrictamente relacionadas con el funcionamiento de la web y la prestación del servicio solicitado por el usuario. Entre ellas se incluyen, cuando proceda:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-gray-600 marker:text-[#D4AF37] mb-4">
                <li><strong className="text-gray-900">Cookies técnicas de navegación y seguridad:</strong> necesarias para cargar la web, proteger formularios, prevenir usos abusivos y garantizar el funcionamiento básico del sitio.</li>
                <li><strong className="text-gray-900">Cookies asociadas al proceso de reserva o contacto:</strong> necesarias para gestionar solicitudes enviadas por el usuario, mantener datos temporales de sesión y completar procesos esenciales vinculados al servicio contratado.</li>
                <li><strong className="text-gray-900">Cookies de preferencias:</strong> destinadas a recordar opciones expresamente solicitadas por el usuario, como el idioma o determinadas configuraciones de visualización, cuando estas funcionalidades estén habilitadas.</li>
                <li><strong className="text-gray-900">Cookies técnicas de terceros vinculadas al servicio:</strong> determinados proveedores externos integrados en la web, como herramientas de traducción, mapas, contenidos embebidos o pasarelas de pago seguras, pueden instalar sus propias cookies cuando el usuario interactúa con dichas funcionalidades.</li>
              </ul>
              <p className="text-gray-600">
                Este tema no instala por sí mismo cookies de publicidad comportamental. Si en el futuro se incorporan herramientas analíticas no exentas, servicios de personalización avanzada o soluciones publicitarias que requieran consentimiento, se informará al usuario de forma previa y se recabará la autorización correspondiente antes de su activación.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-950 mb-4">5. Base jurídica</h2>
              <p className="text-gray-600">
                Las cookies técnicas o estrictamente necesarias pueden utilizarse sin consentimiento previo cuando resultan imprescindibles para prestar el servicio solicitado por el usuario o para posibilitar la navegación segura por el sitio web. Las cookies no necesarias solo podrán utilizarse cuando exista una base jurídica adecuada y, en los casos exigidos por la normativa, tras obtener el consentimiento informado del usuario.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-950 mb-4">6. Plazo de conservación</h2>
              <p className="text-gray-600">
                Las cookies de sesión permanecen activas únicamente mientras el usuario navega por el sitio y se eliminan al cerrar el navegador. Las cookies persistentes, cuando existan, se conservarán durante el tiempo estrictamente necesario para cumplir su finalidad o hasta que el usuario las elimine manualmente desde la configuración de su navegador o del servicio correspondiente.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-950 mb-4">7. Gestión, configuración y desactivación</h2>
              <p className="mb-4 text-gray-600">
                El usuario puede permitir, bloquear o eliminar las cookies instaladas en su dispositivo mediante la configuración de su navegador. Debe tener en cuenta que la desactivación de cookies técnicas o necesarias puede afectar al correcto funcionamiento del sitio, del proceso de reserva o de determinadas funcionalidades esenciales.
              </p>
              <ul className="list-disc pl-5 space-y-2 text-gray-600 marker:text-[#D4AF37]">
                <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-[#D4AF37] hover:underline font-medium">Configurar cookies en Google Chrome</a></li>
                <li><a href="https://support.mozilla.org/es/kb/habilitar-y-deshabilitar-cookies-sitios-web-rastrear-preferencias" target="_blank" rel="noopener noreferrer" className="text-[#D4AF37] hover:underline font-medium">Configurar cookies en Mozilla Firefox</a></li>
                <li><a href="https://support.apple.com/es-es/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-[#D4AF37] hover:underline font-medium">Configurar cookies en Safari</a></li>
                <li><a href="https://support.microsoft.com/es-es/windows/eliminar-y-administrar-cookies-168dab11-0753-043d-7c16-ede5947fc64d" target="_blank" rel="noopener noreferrer" className="text-[#D4AF37] hover:underline font-medium">Configurar cookies en Microsoft Edge</a></li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-950 mb-4">8. Cookies de terceros</h2>
              <p className="text-gray-600">
                La aceptación, configuración y uso de cookies de terceros se rige por las políticas propias de dichos proveedores. METRANSFERS GESTION SL no puede controlar en todo momento las actualizaciones que esos terceros realicen en sus políticas, por lo que se recomienda al usuario revisar directamente sus condiciones cuando interactúe con herramientas externas integradas o enlazadas desde la web.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-950 mb-4">9. Información adicional y contacto</h2>
              <p className="mb-4 text-gray-600">
                Para obtener más información sobre el tratamiento de datos personales, puede consultar nuestra <Link href="/politica-de-privacidad" className="text-[#D4AF37] hover:underline font-medium">Política de Privacidad</Link>. Si necesita aclaraciones sobre el uso de cookies en este sitio web, puede escribir a <a href="mailto:info@transfersinbarcelona.com" className="text-[#D4AF37] hover:underline font-medium">info@transfersinbarcelona.com</a>.
              </p>
              <p className="text-gray-600">
                La presente Política de Cookies podrá actualizarse cuando se produzcan cambios normativos, técnicos o funcionales en el sitio web. Se recomienda revisarla periódicamente.
              </p>
            </section>
          </div>
        </div>
      </main>
      
      <MarketingFooter />
    </div>
  );
}
