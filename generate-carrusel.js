import { GoogleGenAI } from '@google/genai';
import fs from 'fs';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const tema = process.env.TEMA_CARRUSEL || "Movimiento Eficiente";

async function generar() {
  const cerebroMarca = fs.readFileSync('brand-brain.md', 'utf-8');

  const prompt = `Eres la Directora de Arte y Estrategia de Andre Molli. 
  Absorbe nuestra identidad y metáforas universales (Cimientos, Fluidez, Cadena, Equilibrio):
  ${cerebroMarca}

  TAREA:
  Diseña un carrusel de Instagram de 4 diapositivas sobre: "${tema}".
  
  REGLAS DE DISEÑO:
  Cada diapositiva debe incluir, además del texto, un elemento gráfico *aesthetic* relacionado con el entrenamiento técnico (ej: un diagrama de "raíz" para los pies, una cuadrícula técnica de estructura, una onda de energía para la fluidez, etc.).

  Devuelve ÚNICAMENTE un array JSON válido:
  [
    {"titulo": "Gancho", "contenido": "...", "grafico_tipo": "cimientos | fluidez | cadena | equilibrio | estructura_grid"},
    {"titulo": "Idea 1", "contenido": "...", "grafico_tipo": "..."},
    {"titulo": "Idea 2", "contenido": "...", "grafico_tipo": "..."},
    {"titulo": "CTA", "contenido": "...", "grafico_tipo": "estructura_grid"}
  ]`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    let texto = response.text.replace(/```json/g, '').replace(/```/g, '').trim();
    fs.writeFileSync('carrusel.json', texto);
    console.log("✅ JSON del carrusel estético generado.");
  } catch (error) {
    console.error("Error:", error);
  }
}

generar();
