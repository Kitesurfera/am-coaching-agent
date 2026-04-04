import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from 'fs';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function generarInforme() {
  try {
    const athleteId = process.env.ATHLETE_ID;
    const renderUrl = process.env.RENDER_URL;
    const trainerToken = process.env.TRAINER_TOKEN;
    const cerebroMarca = fs.readFileSync('brand-brain.md', 'utf-8');

    console.log(`🚀 Iniciando proceso para atleta: ${athleteId}`);

    // 1. Obtener datos de Render
    const res = await fetch(`${renderUrl}/api/analytics/monthly-summary/${athleteId}`, {
        headers: { 
            'Authorization': `Bearer ${trainerToken.trim()}`,
            'Content-Type': 'application/json'
        }
    });

    if (!res.ok) throw new Error(`Error en Render: ${res.status}`);
    const data = await res.json();
    console.log(`✅ Datos de ${data.athlete_name} recibidos.`);

    // 2. Intentar generar con varios modelos (Resiliencia)
    // Probamos el 1.5-flash, luego el pro, luego el genérico
    const modelosAProbar = ["gemini-1.5-flash", "gemini-1.5-flash-latest", "gemini-pro"];
    let text = "";

    for (const nombreModelo of modelosAProbar) {
        try {
            console.log(`🤖 Intentando con modelo: ${nombreModelo}...`);
            const model = genAI.getGenerativeModel({ model: nombreModelo });
            
            const prompt = `Eres la Cronista de Andre Molli. 
            Escribe un mensaje de WhatsApp para ${data.athlete_name}. 
            Datos: ${data.total_completed} entrenos, fatiga ${data.avg_fatigue}/10. 
            Tests: ${JSON.stringify(data.recent_tests)}.
            Filosofía: ${cerebroMarca}
            REGLA: Máximo 40 palabras, tono profesional y usa una metáfora de la Biblia (Cimientos, Fluidez, Cadena o Equilibrio).`;

            const result = await model.generateContent(prompt);
            text = result.response.text();
            
            if (text) {
                console.log(`✨ Éxito con ${nombreModelo}`);
                break; 
            }
        } catch (err) {
            console.warn(`⚠️ Falló ${nombreModelo}: ${err.message}`);
            continue; // Prueba el siguiente modelo
        }
    }

    if (!text) throw new Error("Ningún modelo de Google respondió correctamente.");

    // 3. Guardar resultado
    fs.writeFileSync('informe-whatsapp.txt', text.trim());
    console.log("✅ Informe guardado en informe-whatsapp.txt");

  } catch (error) {
    console.error("❌ Error Crítico:", error.message);
    process.exit(1);
  }
}

generarInforme();
