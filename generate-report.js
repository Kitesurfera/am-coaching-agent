import { GoogleGenAI } from '@google/genai';
import fs from 'fs';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function generarInforme() {
  try {
    const athleteId = process.env.ATHLETE_ID;
    const renderUrl = process.env.RENDER_URL;
    const trainerToken = process.env.TRAINER_TOKEN;
    
    const cerebroMarca = fs.readFileSync('brand-brain.md', 'utf-8');

    console.log(`Conectando con Render en: ${renderUrl} para el atleta: ${athleteId}`);

    const res = await fetch(`${renderUrl}/api/analytics/monthly-summary/${athleteId}`, {
        headers: { 'Authorization': `Bearer ${trainerToken}` }
    });

    if (!res.ok) {
        throw new Error(`Error en el servidor de Render: ${res.status}`);
    }

    const data = await res.json();

    const prompt = `Eres la Cronista de Andre Molli. 
    Basándote en estos datos de progreso de ${data.athlete_name}:
    - Entrenos completados: ${data.total_completed}
    - Fatiga media: ${data.avg_fatigue}/10
    - Tests recientes: ${JSON.stringify(data.recent_tests)}

    Identidad de marca: ${cerebroMarca}

    TAREA: Escribe un mensaje corto (30-40 palabras) para enviarle por WhatsApp. 
    Usa una metáfora de nuestra Biblia (Cimientos, Fluidez, Cadena o Equilibrio) que encaje con sus datos.
    El mensaje debe sonar exclusivo, profesional y motivador.`;

    // USANDO LA SINTAXIS QUE TE FUNCIONA (Gemini 3 Flash)
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash',
      contents: prompt,
    });

    // En esta librería el texto se extrae así:
    let text = response.text.trim();
    
    fs.writeFileSync('informe-whatsapp.txt', text);
    console.log("✅ Informe generado y guardado en informe-whatsapp.txt");

  } catch (error) {
    console.error("❌ Error en el Agente Cronista:", error);
    process.exit(1);
  }
}

generarInforme();
