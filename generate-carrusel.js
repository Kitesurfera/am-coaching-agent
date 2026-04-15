import { GoogleGenAI } from '@google/genai';
import fs from 'fs';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const tema = process.env.TEMA_CARRUSEL || "Movimiento Eficiente";
const pexelsKey = process.env.PEXELS_API_KEY;
const overlayText = process.env.OVERLAY_TEXT === 'true';
const imgFile = process.env.IMG_FILE;

async function generar() {
  let cerebroMarca = "";
  try { cerebroMarca = fs.readFileSync('brand-brain.md', 'utf-8'); } catch(e) {}

  // Revisar si el usuario subió imágenes propias
  let customImages = [];
  let numSlides = 4; // Por defecto 4
  if (imgFile && imgFile !== 'none') {
      try {
          const data = fs.readFileSync(imgFile, 'utf-8');
          customImages = JSON.parse(data);
          numSlides = customImages.length > 0 ? customImages.length : 4;
      } catch(e) { console.log("⚠️ No se encontraron imágenes locales, usando Pexels."); }
  }

  // Si no queremos texto, obligamos a Gemini a dejar los campos vacíos
  const reglaTexto = overlayText 
    ? "Genera títulos potentes y contenido persuasivo." 
    : "IMPORTANTE: El usuario no quiere texto sobre la imagen. Los campos 'titulo' y 'contenido' DEBEN ser strings vacíos (\"\").";

  const prompt = `Eres la Directora de Arte de Andre Molli. 
  Identidad: ${cerebroMarca}

  TAREA:
  Diseña un carrusel de Instagram de ${numSlides} diapositivas sobre: "${tema}".
  
  REGLAS:
  1. ${reglaTexto}
  2. Crea un 'search_query' EN INGLÉS para buscar fondo de alto impacto (ej: "female athlete explosive landing").

  Devuelve ÚNICAMENTE un array JSON válido de ${numSlides} elementos:
  [
    {"titulo": "...", "contenido": "...", "grafico_tipo": "estructura_grid", "search_query": "female athlete power stance"}
  ]`;

  try {
    const model = ai.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let texto = response.text().replace(/```json/g, '').replace(/```/g, '').trim();
    let slides = JSON.parse(texto);

    console.log(`🧠 IA ha definido la estructura de ${numSlides} slides.`);

    // Asignar imágenes (Propias o Pexels) y configuración de texto
    for (let i = 0; i < slides.length; i++) {
        slides[i].mostrar_texto = overlayText; // Le pasamos la bandera a Remotion
        
        if (customImages.length > 0) {
            // Usamos las imágenes que subiste
            slides[i].imagen_fondo = customImages[i] || customImages[0];
        } else if (pexelsKey) {
            // Usamos Pexels si no subiste nada
            const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(slides[i].search_query)}&per_page=1&orientation=portrait`;
            const pexelsRes = await fetch(url, { headers: { Authorization: pexelsKey } });
            if (pexelsRes.ok) {
                const data = await pexelsRes.json();
                slides[i].imagen_fondo = data.photos?.[0]?.src?.large2x || null; 
            }
        }
    }

    fs.writeFileSync('carrusel.json', JSON.stringify(slides, null, 2));
    console.log("✅ JSON del carrusel generado y empaquetado.");
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

generar();
