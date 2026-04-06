import { GoogleGenAI } from '@google/genai';
import fs from 'fs';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const tema = process.env.TEMA_CARRUSEL || "Movimiento Eficiente";
const pexelsKey = process.env.PEXELS_API_KEY; // La nueva llave de Pexels

async function generar() {
  const cerebroMarca = fs.readFileSync('brand-brain.md', 'utf-8');

  // El prompt ahora exige palabras clave de búsqueda específicas
  const prompt = `Eres la Directora de Arte y Estrategia de Andre Molli. 
  Absorbe nuestra identidad y metáforas universales (Cimientos, Fluidez, Cadena, Equilibrio):
  ${cerebroMarca}

  TAREA:
  Diseña un carrusel de Instagram de 4 diapositivas sobre: "${tema}".
  
  REGLAS DE DISEÑO:
  1. Cada diapositiva debe tener un elemento gráfico *aesthetic* (ej: "cimientos", "fluidez", "cadena", "equilibrio", "estructura_grid").
  2. Crea un 'search_query' EN INGLÉS para buscar una imagen de fondo. Debe ser específico para atletas de alto impacto (ej: "female athlete core training", "woman balance board", "female athlete explosive landing", "woman kitesurfing fitness"). Siempre mujeres.

  Devuelve ÚNICAMENTE un array JSON válido:
  [
    {"titulo": "Gancho", "contenido": "...", "grafico_tipo": "estructura_grid", "search_query": "female athlete power stance"},
    {"titulo": "Idea 1", "contenido": "...", "grafico_tipo": "cimientos", "search_query": "woman lower body stability"},
    {"titulo": "Idea 2", "contenido": "...", "grafico_tipo": "fluidez", "search_query": "female dynamic movement"},
    {"titulo": "CTA", "contenido": "...", "grafico_tipo": "estructura_grid", "search_query": "female athlete portrait dark"}
  ]`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    let texto = response.text.replace(/```json/g, '').replace(/```/g, '').trim();
    let slides = JSON.parse(texto);

    console.log("🧠 IA ha definido la estructura. Buscando recursos visuales...");

    // Si tenemos la llave de Pexels, buscamos las imágenes
    if (pexelsKey) {
        for (let slide of slides) {
            const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(slide.search_query)}&per_page=1&orientation=portrait`;
            const pexelsRes = await fetch(url, { headers: { Authorization: pexelsKey } });
            
            if (pexelsRes.ok) {
                const data = await pexelsRes.json();
                // Guardamos la URL de la imagen en alta calidad
                slide.imagen_fondo = data.photos?.[0]?.src?.large2x || null; 
            } else {
                slide.imagen_fondo = null;
            }
        }
    }

    fs.writeFileSync('carrusel.json', JSON.stringify(slides, null, 2));
    console.log("✅ JSON del carrusel aesthetic generado y empaquetado.");
  } catch (error) {
    console.error("❌ Error Crítico:", error);
  }
}

generar();
