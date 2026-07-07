import { NextResponse } from "next/server";
import OpenAI from "openai";
import { authService } from "@/modules/auth/auth.service";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const session = await authService.getSession();
    if (!session || (session.role !== "SUPER_ADMIN" && session.role !== "ADMIN")) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { routeId } = await request.json();

    if (!routeId) {
      return NextResponse.json({ error: "Se requiere el ID de la ruta." }, { status: 400 });
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ 
        error: "No hay clave de OpenAI configurada en el servidor (.env). Por favor configura OPENAI_API_KEY." 
      }, { status: 500 });
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Fetch the route details to give context to the AI
    const route = await prisma.routePage.findUnique({
      where: { id: routeId },
    });

    if (!route) {
      return NextResponse.json({ error: "Ruta no encontrada." }, { status: 404 });
    }

    const language = route.slug.includes("transfer") ? "inglés" : "español";

    const prompt = `
Eres un experto redactor de contenido SEO para turismo y traslados privados (transfers). 
Necesito que redactes el cuerpo principal (HTML) para una landing page de venta de traslados.

Datos de la ruta:
- Origen: ${route.originName}
- Destino: ${route.destinationName}
- Título principal (H1): ${route.h1Title}
- Precio base: ${route.basePriceCache ? `Desde ${route.basePriceCache}€` : 'Consultar'}
- Keywords: ${route.seoKeywords}

Requisitos del contenido:
1. Idioma: Escribe todo en ${language}.
2. Formato: Devuelve ÚNICAMENTE HTML válido (sin etiquetas <html> o <body>, solo el contenido interior). Usa etiquetas como <h2>, <h3>, <p>, <ul>, <li> y <strong>. No uses markdown (\`\`\`).
3. Estructura recomendada:
   - Una introducción persuasiva destacando la comodidad, el precio fijo y el chófer privado.
   - Una sección de "Por qué elegirnos para ir de ${route.originName} a ${route.destinationName}".
   - Información práctica del trayecto (distancia aproximada, tiempo, tipo de vehículos).
   - 3 preguntas frecuentes (FAQ) en formato <h3> y <p>.
4. Tono: Profesional, confiable, premium y directo a la venta.
5. Extensión: Alrededor de 400-500 palabras.

¡Adelante, genera el HTML!
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // o gpt-4o si se prefiere mayor calidad
      messages: [
        { role: "system", content: "Eres un asistente experto en SEO y redacción web." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
    });

    let generatedHtml = response.choices[0].message.content || "";
    
    // Clean up potential markdown formatting that OpenAI might output despite instructions
    generatedHtml = generatedHtml.replace(/^```html\n?/, "").replace(/\n?```$/, "");

    return NextResponse.json({ 
      success: true, 
      contentHtml: generatedHtml 
    });

  } catch (error: any) {
    console.error("Error generating AI content:", error);
    return NextResponse.json({ error: error.message || "Error al generar el contenido con IA." }, { status: 500 });
  }
}
