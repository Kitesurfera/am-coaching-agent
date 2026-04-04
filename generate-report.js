import { GoogleGenerativeAI } from "@google/generative-ai"; // Importación oficial 2026
import fs from 'fs';

// Inicializamos la llave
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function generarInforme() {
  try {
    const athleteId = process.env.ATHLETE_ID;
    const renderUrl = process.env.RENDER_URL;
    const trainerToken = process.env.TRAINER_TOKEN;
    const cerebroMarca = fs.readFileSync('brand-brain.md', 'utf-8');

    console.log(`Conectando con Render... Atleta: ${athleteId}`);

    // 1. Petición al Backend de Render
    const res = await fetch(`${renderUrl}/api/analytics/monthly-summary/${athleteId}`, {
        headers: { 'Authorization': `Bearer ${trainerToken.trim()}` }
    });

    if (!res.ok) throw new Error(`Error en Render: ${res.status}`);
    const data = await res.json();

    // 2. Configuración de Gemini 3 Flash
    const model = genAI.getGenerativeModel({ model: "gemini-3-flash" });

    const prompt = `Eres la Cronista de Andre Molli. 
    Datos de ${data.athlete_name}: ${data.total_completed} entrenos, fatiga ${data.avg_fatigue}/10.
    Tests recientes: ${JSON.stringify(data.recent_tests)}.
    Filosofía de marca: ${cerebroMarca}
    
    TAREA: Escribe un mensaje de WhatsApp (30-40 palabras) motivador y profesional. 
    Usa una metáfora de nuestra Biblia (Cimientos, Fluidez, Cadena o Equilibrio).`;

    // 3. Generación de contenido
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    fs.writeFileSync('informe-whatsapp.txt', text.trim());
    console.log("✅ Informe generado con Gemini 3 Flash con éxito.");

  } catch (error) {
    console.error("❌ Error en el proceso:", error);
    process.exit(1);
  }
}

generarInforme();
