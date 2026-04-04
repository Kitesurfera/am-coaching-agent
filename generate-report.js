import { GoogleGenAI } from '@google/genai';
import fs from 'fs';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function generarInforme() {
  const athleteId = process.env.ATHLETE_ID;
  const cerebroMarca = fs.readFileSync('brand-brain.md', 'utf-8');

  // Pedimos los datos a tu Render
  const res = await fetch(`https://tu-app-en-render.com/api/analytics/monthly-summary/${athleteId}`, {
      headers: { 'Authorization': `Bearer ${process.env.TRAINER_TOKEN}` }
  });
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

  const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
  
  // Guardamos el informe listo para WhatsApp
  fs.writeFileSync('informe-whatsapp.txt', response.text);
}

generarInforme();
