import { GoogleGenAI } from '@google/genai';
import fs from 'fs';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const enfoque = process.env.ENFOQUE_PLAN || "Fuerza y Estabilidad";

async function generarPlan() {
  const cerebroMarca = fs.readFileSync('brand-brain.md', 'utf-8');

  const prompt = `Eres el Estratega Deportivo Jefe de Andre Molli.
  Absorbe nuestra identidad y metáforas universales (Cimientos, Fluidez, Cadena, Equilibrio):
  ${cerebroMarca}

  TAREA:
  Crea un plan de entrenamiento semanal estratégico con el enfoque: "${enfoque}".
  
  REGLAS:
  - Genera 7 días. Algunos días pueden ser "Descanso Activo".
  - Cada día debe tener un "tipo" que coincida con uno de nuestros gráficos (cimientos, fluidez, cadena, estructura_grid).
  - Incluye un pequeño "tip" motivador en cada día basado en nuestra filosofía (inercia, aterrizajes, control).

  Devuelve ÚNICAMENTE un objeto JSON válido con esta estructura:
  {
    "enfoque_semanal": "${enfoque}",
    "dias": [
      { "dia": "Lunes", "titulo": "Core y Raíces", "tipo": "cimientos", "tip": "..." },
      { "dia": "Martes", "titulo": "...", "tipo": "...", "tip": "..." },
      ... (hasta Domingo)
    ]
  }`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    let texto = response.text.replace(/```json/g, '').replace(/```/g, '').trim();
    let planData = JSON.parse(texto);

    // Guardamos el JSON que leerá Remotion
    fs.writeFileSync('plan-semanal.json', JSON.stringify(planData, null, 2));
    console.log("✅ Planificación Semanal generada.");
  } catch (error) {
    console.error("❌ Error Crítico en Plan:", error);
  }
}

generarPlan();
