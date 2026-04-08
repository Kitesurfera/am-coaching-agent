import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from 'fs';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function generarInforme() {
  try {
    const athleteId = process.env.ATHLETE_ID;
    const renderUrl = process.env.RENDER_URL || "https://fit-tracker-backend-rtx2.onrender.com";
    const trainerToken = process.env.TRAINER_TOKEN;
    const cerebroMarca = fs.readFileSync('brand-brain.md', 'utf-8');

    console.log(`🚀 Iniciando proceso para atleta: ${athleteId}`);
    
    // --- DEBUG: Verificamos el token sin exponerlo ---
    if (!trainerToken) {
        throw new Error("El TRAINER_TOKEN no está llegando desde GitHub Secrets.");
    }
    console.log(`🔑 Token detectado (empieza por: ${trainerToken.substring(0, 10)}...)`);
    // -------------------------------------------------

    console.log(`🔗 Conectando a: ${renderUrl}/api/analytics/monthly-summary/${athleteId}`);

    const res = await fetch(`${renderUrl}/api/analytics/monthly-summary/${athleteId}`, {
        method: 'GET',
        headers: { 
            'Authorization': `Bearer ${trainerToken.trim()}`,
            'Content-Type': 'application/json'
        }
    });

    if (!res.ok) {
        // Si falla, intentamos leer el motivo del error del servidor
        const errorText = await res.text();
        throw new Error(`Error en Render: ${res.status} - ${errorText}`);
    }
    
    const data = await res.json();
    console.log(`✅ Datos de ${data.athlete_name} recibidos.`);

    const model = genAI.getGenerativeModel({ 
        model: "gemini-3-flash-preview" 
    });

    const prompt = `Eres la Cronista de Andre Molli. 
    Escribe un mensaje de WhatsApp para ${data.athlete_name}. 
    Datos del mes: ${data.total_completed} entrenos completados, fatiga media de ${data.avg_fatigue}/5. 
    Tests recientes: ${JSON.stringify(data.recent_tests)}.
    
    Filosofía de marca:
    ${cerebroMarca}
    
    TAREA:
    - Máximo 40 palabras.
    - Usa una metáfora de nuestra Biblia (Cimientos, Fluidez, Cadena o Equilibrio).
    - Tono: Profesional, motivador y exclusivo.`;

    console.log("🤖 Generando contenido con Gemini 3 Flash Preview...");
    
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    if (!text) throw new Error("La IA no generó contenido.");

    fs.writeFileSync('informe-whatsapp.txt', text.trim());
    console.log("✅ Informe guardado con éxito.");

  } catch (error) {
    console.error("❌ Error Crítico:", error.message);
    process.exit(1);
  }
}

generarInforme();
