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
  - Genera 7 días.
  - El "tipo" debe ser estrictamente "Reel" o "Carrusel" (o "Descanso").
  - El "grafico_tipo" debe ser el estilo visual que le pegue: "cimientos", "fluidez", "cadena" o "estructura_grid".
  - Incluye un pequeño "tip" motivador en cada día basado en nuestra filosofía.

  Devuelve ÚNICAMENTE un objeto JSON válido con esta estructura:
  {
    "enfoque_semanal": "${enfoque}",
    "dias": [
      { "dia": "Lunes", "titulo": "Core y Raíces", "tipo": "Reel", "grafico_tipo": "cimientos", "tip": "..." },
      { "dia": "Martes", "titulo": "...", "tipo": "Carrusel", "grafico_tipo": "...", "tip": "..." }
    ]
  }`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    let texto = response.text.replace(/```json/g, '').replace(/```/g, '').trim();
    let planData = JSON.parse(texto);

    fs.writeFileSync('plan-semanal.json', JSON.stringify(planData, null, 2));
    console.log("✅ Planificación Semanal generada correctamente.");
  } catch (error) {
    console.error("❌ Error Crítico en Plan:", error);
  }
}

generarPlan();
