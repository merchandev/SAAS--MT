const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const templates = [
    {
      name: "Conoce el Proyecto",
      description: "Plantilla de bienvenida y presentación del proyecto",
      subject: "¡Bienvenido! Conoce más sobre nuestro proyecto",
      html: `
        <div style="font-family: Arial, sans-serif; max-w: 600px; margin: 0 auto; color: #333;">
          <h1 style="color: #2563eb;">¡Bienvenido a nuestro proyecto!</h1>
          <p>Hola {{firstName}},</p>
          <p>Nos alegra mucho que te hayas unido a nuestra comunidad. Queremos compartir contigo todo lo que estamos construyendo para mejorar tu experiencia.</p>
          <p>En este proyecto, nos enfocamos en ofrecerte las mejores herramientas para facilitar tus traslados y gestiones.</p>
          <br/>
          <a href="#" style="background-color: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Descubre más</a>
          <br/><br/>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 12px; color: #999;">Si tienes alguna pregunta, no dudes en responder a este correo o contactarnos al {{phone}}.</p>
        </div>
      `,
    },
    {
      name: "Ventas / Oferta Especial",
      description: "Plantilla para ofertas, descuentos y promociones",
      subject: "Oferta Exclusiva para tus próximos traslados",
      html: `
        <div style="font-family: Arial, sans-serif; max-w: 600px; margin: 0 auto; color: #333; border: 1px solid #eaeaea; padding: 20px; border-radius: 8px;">
          <h2 style="color: #e11d48; text-align: center;">¡Tenemos una oferta para ti!</h2>
          <p>Hola {{firstName}},</p>
          <p>Por tiempo limitado, estamos ofreciendo un descuento especial en todos nuestros servicios de transporte. ¡No dejes pasar esta oportunidad!</p>
          <div style="background-color: #f87171; color: white; padding: 15px; text-align: center; font-size: 20px; font-weight: bold; border-radius: 5px; margin: 20px 0;">
            CÓDIGO: VERANO2026
          </div>
          <p>Utiliza este código al realizar tu próxima reserva y obtén un 15% de descuento.</p>
          <br/>
          <div style="text-align: center;">
            <a href="#" style="background-color: #111827; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; display: inline-block;">Reservar Ahora</a>
          </div>
          <br/>
          <p style="font-size: 12px; color: #666; text-align: center;">*Válido hasta agotar disponibilidad.</p>
        </div>
      `,
    },
    {
      name: "Boletín Informativo (Newsletter)",
      description: "Plantilla mensual para noticias y actualizaciones",
      subject: "Las últimas noticias de este mes",
      html: `
        <div style="font-family: Arial, sans-serif; max-w: 600px; margin: 0 auto; color: #333;">
          <div style="background-color: #f3f4f6; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
            <h2 style="margin: 0; color: #1f2937;">Boletín Mensual</h2>
          </div>
          <div style="padding: 20px; border: 1px solid #f3f4f6;">
            <p>Hola {{firstName}},</p>
            <p>Aquí tienes un resumen de todo lo nuevo que hemos preparado para ti durante este mes.</p>
            
            <h3 style="color: #4b5563;">1. Nueva flota de vehículos</h3>
            <p>Hemos incorporado 10 nuevas furgonetas premium a nuestra flota para garantizar la máxima comodidad.</p>
            
            <h3 style="color: #4b5563;">2. Mejora en tiempos de espera</h3>
            <p>Gracias a nuestro nuevo sistema, hemos reducido los tiempos de espera en los aeropuertos en un 25%.</p>
            
            <br/>
            <p>Gracias por confiar en nosotros.</p>
          </div>
        </div>
      `,
    }
  ];

  for (const template of templates) {
    await prisma.emailTemplate.upsert({
      where: { name: template.name },
      update: {
        description: template.description,
        subject: template.subject,
        html: template.html,
      },
      create: template,
    });
    console.log(\`Plantilla agregada/actualizada: \${template.name}\`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
