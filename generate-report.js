import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from 'fs';

// 1. Forzamos la versión v1 de la API (evitamos la beta que da error 404)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function generarInforme() {
  try {
    const athleteId = process.env.ATHLETE_ID;
    const renderUrl = process.env.RENDER_URL;
    const trainerToken = process.env.TRAINER_TOKEN;
    const cerebroMarca = fs.readFileSync('brand-brain.md', 'utf-8');

    console.log(`🚀 Iniciando proceso para atleta: ${athleteId}`);

    const res = await fetch(`${renderUrl}/api/analytics/monthly-summary/${athleteId}`, {
        headers: { 
            'Authorization': `Bearer ${trainerToken.trim()}`,
            'Content-Type': 'application/json'
        }
    });

    if (!res.ok) throw new Error(`Error en Render: ${res.status}`);
    const data = await res.json();
    console.log(`✅ Datos de ${data.athlete_name} recibidos.`);

    // 2. Usamos el modelo más potente y estable de 2026
    // Si eres usuario Pro, este es tu modelo:
    const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash", // O "gemini-2.0-flash" si ya lo activaste
    }, { apiVersion: "v1" }); // <--- CLAVE: Forzamos V1

    const prompt = `Eres la Cronista de Andre Molli. 
    Escribe un mensaje de WhatsApp para ${data.athlete_name}. 
    - Entrenos: ${data.total_completed}
    - Fatiga: ${data.avg_fatigue}/10
    - Tests: ${JSON.stringify(data.recent_tests)}
    - Filosofía: ${cerebroMarca}
    REGLA: Máximo 40 palabras, tono profesional y usa una metáfora de la Biblia (Cimientos, Fluidez, Cadena o Equilibrio).`;

    console.log("🤖 Generando contenido...");
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    if (text) {
        fs.writeFileSync('informe-whatsapp.txt', text.trim());
        console.log("✅ Informe guardado exitosamente.");
    }

  } catch (error) {
    console.error("❌ Error Crítico:", error.message);
    // Si el error persiste, es probable que la API Key necesite permisos de "Pay-as-you-go" en Google Cloud
    process.exit(1);
  }
}

generarInforme();
