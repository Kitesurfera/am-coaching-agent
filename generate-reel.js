import { GoogleGenAI } from '@google/genai';
import fs from 'fs';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const archivo = process.env.ARCHIVO_MEDIA || "entreno.mp4"; // Si subes uno, usa ese, si no, busca stock
const pexelsKey = process.env.PEXELS_API_KEY;

async function generarReel() {
  const cerebroMarca = fs.readFileSync('brand-brain.md', 'utf-8');

  const prompt = `Eres el Filmmaker y Copywriter de Andre Molli. 
  Contexto: ${cerebroMarca}

  Crea la estructura para un Reel de Instagram impactante.
  
  Devuelve ÚNICAMENTE un objeto JSON con esta estructura:
  {
    "hook_visual": "Texto en pantalla inicial",
    "voiceover": "Guion corto de lo que dirá la voz",
    "copy_post": "El texto descriptivo para subir a Instagram",
    "grafico_tipo": "cimientos | fluidez | cadena | equilibrio | estructura_grid",
    "video_search_query": "Término en inglés para buscar un clip de video (ej: 'female athlete core training', 'woman stretching dynamic', 'female workout outdoor'). Solo mujeres."
  }`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    let texto = response.text.replace(/```json/g, '').replace(/```/g, '').trim();
    let reelData = JSON.parse(texto);

    console.log("🎬 Guion de Reel listo. Buscando stock de video...");

    // Buscamos un video en formato vertical (portrait)
    if (pexelsKey && archivo === "entreno1.mp4") { 
        const url = `https://api.pexels.com/videos/search?query=${encodeURIComponent(reelData.video_search_query)}&per_page=1&orientation=portrait`;
        const pexelsRes = await fetch(url, { headers: { Authorization: pexelsKey } });
        
        if (pexelsRes.ok) {
            const data = await pexelsRes.json();
            // Pexels devuelve varios archivos de calidad. Cogemos el primero HD que encuentre.
            const hdVideo = data.videos?.[0]?.video_files?.find(v => v.quality === 'hd') || data.videos?.[0]?.video_files?.[0];
            reelData.video_fondo_url = hdVideo ? hdVideo.link : null;
        }
    }

reelData.archivo_local = archivo !== "entreno1.mp4" ? archivo : null;

    fs.writeFileSync('props.json', JSON.stringify(reelData, null, 2));
    fs.writeFileSync('post-generado.txt', reelData.copy_post);
    console.log("✅ Configuración de Reel generada.");
  } catch (error) {
    console.error("❌ Error Crítico:", error);
  }
}

generarReel();
