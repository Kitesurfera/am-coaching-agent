import { GoogleGenAI } from '@google/genai';
import fs from 'fs';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const enfoque = process.env.ENFOQUE_SEMANAL || "Bienestar general y fuerza";

async function generar() {
  const cerebroMarca = fs.readFileSync('brand-brain.md', 'utf-8');

  const prompt = `Eres la estratega de contenido senior de Andre Molli. 
  Basándote en nuestra Biblia de Marca:
  ${cerebroMarca}

  TAREA:
  Crea una planificación de contenido para 7 días (Lunes a Domingo) con el enfoque: "${enfoque}".
  Cada día debe tener un objetivo claro y usar nuestras metáforas (Cimientos, Fluidez, etc.).

  Devuelve ÚNICAMENTE un objeto JSON con esta estructura:
  {
    "enfoque": "${enfoque}",
    "dias": [
      {"dia": "Lunes", "tipo": "Reel", "titulo": "...", "descripcion": "..."},
      {"dia": "Martes", "tipo": "Carrusel", "titulo": "...", "descripcion": "..."},
      ... así hasta el Domingo
    ]
  }`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    let texto = response.text.replace(/```json/g, '').replace(/```/g, '').trim();
    fs.writeFileSync('plan-semanal.json', texto);
    console.log("✅ Planificación semanal guardada.");
  } catch (error) {
    console.error("Error:", error);
  }
}

generar();
