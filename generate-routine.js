import { GoogleGenAI } from '@google/genai';
import fs from 'fs';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const renderUrl = process.env.RENDER_URL;
const token = process.env.TRAINER_TOKEN;

const athleteId = process.env.ATHLETE_ID;
const macroName = process.env.MACRO_NOMBRE || "General";
const microName = process.env.MICRO_NOMBRE || "General";
const microId = process.env.MICRO_ID || null;
const dias = parseInt(process.env.DIAS) || 1;
const foco = process.env.FOCO || "Mantenimiento y técnica";

async function generarRutina() {
  const cerebroMarca = fs.readFileSync('brand-brain.md', 'utf-8');

  // Generamos el array de fechas en Node.js para estar 100% seguros
  let fechas = [];
  let hoy = new Date();
  for(let i=0; i<dias; i++){
      let d = new Date(hoy);
      d.setDate(hoy.getDate() + i);
      fechas.push(d.toISOString().split('T')[0]);
  }

  const prompt = `Eres el Head Coach y Director de Rendimiento de Andre Molli.
  Aquí está nuestra Biblia de Marca (inercia, aterrizajes, control):
  ${cerebroMarca}

  TAREA:
  Debes crear un bloque de entrenamiento de ${dias} días para nuestro atleta.
  
  CONTEXTO ACTUAL:
  - Fase Macrociclo: ${macroName}
  - Fase Microciclo: ${microName}
  - Foco técnico solicitado por Andre: ${foco}

  REGLAS:
  1. Aplica nuestros conceptos estéticos en los nombres de las sesiones y ejercicios.
  2. Crea progresión si son varios días (no repitas la misma rutina exacta).
  3. Formato estricto. Devuelve ÚNICAMENTE un objeto JSON con una propiedad "workouts" que contenga un array de ${dias} objetos. No incluyas fechas ni IDs en el JSON, solo esto:

  {
    "workouts": [
      {
        "title": "DÍA 1: [Nombre Potente]",
        "description": "...",
        "notes": "...",
        "exercises": [ { "name": "...", "sets": 3, "reps": "10", "notes": "..." } ]
      }
      // ... continuar hasta ${dias} rutinas
    ]
  }`;

  try {
    console.log(`🧠 Pensando bloque de ${dias} días. Foco: ${foco}...`);
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    let texto = response.text.replace(/```json/g, '').replace(/```/g, '').trim();
    let rutinaData = JSON.parse(texto);
    
    // Inyectamos las fechas, el atleta y el ID del microciclo (si existe) a cada rutina generada
    let finalWorkouts = rutinaData.workouts.map((w, index) => {
        return {
            ...w,
            athlete_id: athleteId,
            date: fechas[index],
            microciclo_id: microId === "" ? null : microId
        };
    });

    console.log(`🎬 Array de ${finalWorkouts.length} rutinas listo. Inyectando en Render (Bulk)...`);

    // Usamos la ruta /workouts/bulk que tu FastAPI ya tiene configurada para inyectar múltiples
    const apiRes = await fetch(`${renderUrl}/api/workouts/bulk`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ workouts: finalWorkouts })
    });

    if (!apiRes.ok) {
        const errorText = await apiRes.text();
        throw new Error(`Error en Render: ${apiRes.status} - ${errorText}`);
    }

    console.log("✅ Bloque completo inyectado en MongoDB.");
  } catch (error) {
    console.error("❌ Error Crítico:", error);
    process.exit(1); 
  }
}

generarRutina();
