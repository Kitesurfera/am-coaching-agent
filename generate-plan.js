import { GoogleGenAI } from '@google/genai';
import fs from 'fs';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const enfoque = process.env.ENFOQUE_SEMANAL || "Movimiento Integral";

async function generar() {
  // 1. Leer la Biblia de Marca
  const cerebroMarca = fs.readFileSync('brand-brain.md', 'utf-8');

  const prompt = `Eres la Directora de Estrategia de Andre Molli. 
  Basándote en nuestra identidad y pilares semanales:
  ${cerebroMarca}

  TAREA:
  Diseña la planificación de contenidos de Lunes a Domingo. 
  Enfoque prioritario de esta semana: "${enfoque}".
  
  REGLAS:
  - Alterna formatos (Reels, Carruseles).
  - Usa nuestras metáforas (Cimientos, Cadena, etc.).
  - Los títulos deben ser ganchos (hooks) potentes.

  Devuelve ÚNICAMENTE un objeto JSON válido:
  {
    "enfoque": "${enfoque}",
    "dias": [
      {"dia": "Lunes", "tipo": "Reel", "titulo": "...", "descripcion": "..."},
      ... hasta el Domingo
    ]
  }`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    let texto = response.text.replace(/```json/g, '').replace(/```/g, '').trim();
    fs.writeFileSync('plan-semanal.json', texto);
    console.log("✅ Calendario semanal actualizado con éxito.");
  } catch (error) {
    console.error("Error en la planificación:", error);
  }
}

generar();
