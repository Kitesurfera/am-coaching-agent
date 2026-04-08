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
  // 1. Cargamos la TEORÍA (Tu archivo Markdown)
  const cerebroMarca = fs.readFileSync('brand-brain.md', 'utf-8');

  // 2. Cargamos la PRÁCTICA (Las últimas 5 sesiones manuales de Andre)
  let ejemplosPracticos = "";
  try {
      const memRes = await fetch(`${renderUrl}/api/brain/memory/examples`, {
          headers: { 'Authorization': `Bearer ${token}` }
      });
      if (memRes.ok) {
          const memData = await memRes.json();
          if (memData.examples && memData.examples.length > 0) {
              ejemplosPracticos = `\n\n### EJEMPLOS REALES DE ANDRE (MACHINE LEARNING):\nAnaliza estas rutinas escritas recientemente por Andre. Fíjate en cómo escribe las notas, cómo agrupa los ejercicios y la carga de trabajo:\n${JSON.stringify(memData.examples, null, 2)}`;
          }
      }
  } catch(e) {
      console.log("No se pudieron cargar ejemplos de la DB, usando solo el ADN base.");
  }

  // 3. Generamos fechas
  let fechas = [];
  let hoy = new Date();
  for(let i=0; i<dias; i++){
      let d = new Date(hoy);
      d.setDate(hoy.getDate() + i);
      fechas.push(d.toISOString().split('T')[0]);
  }

  // 4. El Súper-Prompt
  const prompt = `Eres el Head Coach y Director de Rendimiento de Andre Molli.
  
  Aquí está nuestra Biblia de Marca (Teoría):
  ${cerebroMarca}
  ${ejemplosPracticos}

  TAREA:
  Crea un bloque de entrenamiento de ${dias} días.
  
  CONTEXTO ACTUAL:
  - Fase Macrociclo: ${macroName}
  - Fase Microciclo: ${microName}
  - Foco técnico solicitado: ${foco}

  REGLAS ESTRICTAS:
  1. Si hay ejemplos reales, IMITA su estilo de redacción en los campos "notes" y la forma de nombrar ejercicios.
  2. Aplica las metáforas de nuestra Biblia (Fluidez, Cimientos, Cadena) en las descripciones.
  3. Formato estricto. Devuelve ÚNICAMENTE un objeto JSON con la propiedad "workouts" conteniendo un array de ${dias} objetos.

  ESTRUCTURA JSON ESPERADA:
  {
    "workouts": [
      {
        "title": "DÍA 1: [Nombre Potente]",
        "description": "...",
        "notes": "...",
        "exercises": [ { "name": "...", "sets": 3, "reps": "10", "notes": "..." } ]
      }
    ]
  }`;

  try {
    console.log(`🧠 Pensando bloque de ${dias} días combinando Teoría + Machine Learning...`);
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    let texto = response.text.replace(/```json/g, '').replace(/```/g, '').trim();
    let rutinaData = JSON.parse(texto);
    
    let finalWorkouts = rutinaData.workouts.map((w, index) => {
        return {
            ...w,
            athlete_id: athleteId,
            date: fechas[index],
            microciclo_id: microId === "" ? null : microId,
            is_ai: true // Vital para que no aprenda de sus propios textos
        };
    });

    console.log(`🎬 Inyectando ${finalWorkouts.length} rutinas hiper-personalizadas en Render...`);

    const apiRes = await fetch(`${renderUrl}/api/workouts/bulk`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ workouts: finalWorkouts })
    });

    if (!apiRes.ok) {
        throw new Error(`Error en Render: ${apiRes.status}`);
    }

    console.log("✅ Bloque completo inyectado en MongoDB.");
  } catch (error) {
    console.error("❌ Error Crítico:", error);
    process.exit(1); 
  }
}

generarRutina();
