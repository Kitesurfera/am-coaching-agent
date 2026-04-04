import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from 'fs';

// Inicializamos la API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function generarInforme() {
  try {
    const athleteId = process.env.ATHLETE_ID;
    const renderUrl = process.env.RENDER_URL;
    const trainerToken = process.env.TRAINER_TOKEN;
    const cerebroMarca = fs.readFileSync('brand-brain.md', 'utf-8');

    console.log(`🚀 Iniciando proceso para atleta: ${athleteId}`);

    // 1. Petición a Render
    const res = await fetch(`${renderUrl}/api/analytics/monthly-summary/${athleteId}`, {
        headers: { 
            'Authorization': `Bearer ${trainerToken.trim()}`,
            'Content-Type': 'application/json'
        }
    });

    if (!res.ok) throw new Error(`Error en Render: ${res.status}`);
    const data = await res.json();
    console.log(`✅ Datos de ${data.athlete_name} recibidos.`);

    // 2. CONFIGURACIÓN DEL MODELO (Basado en tu captura)
    // Usamos el ID exacto que aparece bajo el nombre en tu imagen
    const model = genAI.getGenerativeModel({ 
        model: "gemini-3-flash-preview" 
    });

    const prompt = `Eres la Cronista de Andre Molli. 
    Escribe un mensaje de WhatsApp para ${data.athlete_name}. 
    Datos del mes: ${data.total_completed} entrenos completados, fatiga media de ${data.avg_fatigue}/10. 
    Tests recientes: ${JSON.stringify(data.recent_tests)}.
    
    Filosofía de marca:
    ${cerebroMarca}
    
    TAREA:
    - Máximo 40 palabras.
    - Usa una metáfora de nuestra Biblia (Cimientos, Fluidez, Cadena o Equilibrio).
    - Tono: Profesional, motivador y exclusivo. No uses demasiados emojis.`;

    console.log("🤖 Generando contenido con Gemini 3 Flash Preview...");
    
    // 3. Generación
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
