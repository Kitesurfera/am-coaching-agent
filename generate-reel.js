import { GoogleGenAI } from '@google/genai';
import fs from 'fs';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const archivo = process.env.ARCHIVO_MEDIA || "entreno1.mp4"; 
const pexelsKey = process.env.PEXELS_API_KEY;

async function generarReel() {
  const cerebroMarca = fs.readFileSync('brand-brain.md', 'utf-8');

  // Integración: Redactor Experto + Filmmaker
  const prompt = `Eres el Filmmaker, Director de Arte y Redactor Experto para la cuenta de Instagram de Andre Molli. 
  Aquí tienes nuestra Biblia de Marca. Debes absorber esta identidad y respetarla al 100%:
  ${cerebroMarca}

  TU TAREA:
  Crea la estructura completa para un Reel de Instagram impactante sobre entrenamiento físico, combinando el diseño visual, guion en off y el copy del post.
  
  REGLAS ESTRICTAS PARA EL COPY DE INSTAGRAM ("copy_post"):
  - Máximo 150 palabras.
  - Aplica orgánicamente nuestras metáforas (la inercia de los giros, los aterrizajes estables de alto impacto y la conexión firme de los pies con las botas/tabla) para explicar la importancia del control en el ejercicio.
  - Añade un llamado a la acción (hook) potente al principio y hashtags relevantes al final.

  Devuelve ÚNICAMENTE un objeto JSON válido con esta estructura exacta:
  {
    "hook_visual": "Texto corto y potente en pantalla inicial",
    "voiceover": "Guion corto de lo que dirá la voz en off",
    "copy_post": "El texto descriptivo final para subir a Instagram siguiendo las reglas del redactor.",
    "grafico_tipo": "cimientos | fluidez | cadena | equilibrio | estructura_grid",
    "video_search_query": "Término en inglés para buscar un clip de video (ej: 'female athlete core training', 'woman dynamic balance', 'female workout outdoor'). Solo mujeres."
  }`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    let texto = response.text.replace(/```json/g, '').replace(/```/g, '').trim();
    let reelData = JSON.parse(texto);

    console.log("🎬 Guion visual y Copy listos. Buscando stock de video...");

    // Buscamos un video en formato vertical (portrait)
    if (pexelsKey && archivo === "entreno1.mp4") { 
        const url = `https://api.pexels.com/videos/search?query=${encodeURIComponent(reelData.video_search_query)}&per_page=1&orientation=portrait`;
        const pexelsRes = await fetch(url, { headers: { Authorization: pexelsKey } });
        
        if (pexelsRes.ok) {
            const data = await pexelsRes.json();
            // Pexels devuelve varios archivos. Cogemos el HD.
            const hdVideo = data.videos?.[0]?.video_files?.find(v => v.quality === 'hd') || data.videos?.[0]?.video_files?.[0];
            reelData.video_fondo_url = hdVideo ? hdVideo.link : null;
        }
    }

    // Le decimos a Remotion si debe usar el vídeo local o el de Pexels
    reelData.archivo_local = archivo !== "entreno1.mp4" ? archivo : null;

    // Guardamos los props visuales para Remotion
    fs.writeFileSync('props.json', JSON.stringify(reelData, null, 2));
    
    // Guardamos el copy en el archivo de texto para que el Hub pueda mostrarlo y copiarlo
    fs.writeFileSync('post-generado.txt', reelData.copy_post);
    
    console.log("✅ Configuración de Reel y Copy generados con éxito.");
  } catch (error) {
    console.error("❌ Error Crítico:", error);
    fs.writeFileSync('post-generado.txt', "Error al conectar con el cerebro de IA para generar el copy.");
  }
}

generarReel();
