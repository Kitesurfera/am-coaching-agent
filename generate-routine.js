import { GoogleGenAI } from '@google/genai';
import fs from 'fs';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const renderUrl = process.env.RENDER_URL;
const token = process.env.TRAINER_TOKEN;

const athleteId = process.env.ATHLETE_ID;
const macroName = process.env.MACRO_NOMBRE || "General";
const microName = process.env.MICRO_NOMBRE || "General";
const microTipo = (process.env.MICRO_TIPO || "General").toLowerCase();
const microId = process.env.MICRO_ID || null;
const dias = parseInt(process.env.DIAS) || 1;
const foco = process.env.FOCO || "Mantenimiento y técnica";

async function generarRutina() {
  // 🛡️ PARACAÍDAS 1: Si no hay archivo de marca, no explotamos
  let cerebroMarca = "";
  try {
      cerebroMarca = fs.readFileSync('brand-brain.md', 'utf-8');
  } catch (e) {
      console.log("⚠️ No se encontró brand-brain.md, usando ADN base...");
      cerebroMarca = "Entrenador de élite de kitesurf freestyle. Foco en inercia, aterrizajes y prevención de lesiones.";
  }

  // 🛡️ PARACAÍDAS 2: Si Render está dormido y no da memoria, seguimos
  let ejemplosPracticos = "";
  try {
      const memRes = await fetch(`${renderUrl}/api/brain/memory/examples`, {
          headers: { 'Authorization': `Bearer ${token}` }
      });
      if (memRes.ok) {
          const memData = await memRes.json();
          if (memData.examples && memData.examples.length > 0) {
              ejemplosPracticos = `\n\n### EJEMPLOS REALES DE ANDRE:\n${JSON.stringify(memData.examples, null, 2)}`;
          }
      }
  } catch(e) {
      console.log("⚠️ Render no devolvió memoria reciente. Seguimos a ciegas.");
  }

  let fechas = [];
  let hoy = new Date();
  for(let i=0; i<dias; i++){
      let d = new Date(hoy);
      d.setDate(hoy.getDate() + i);
      fechas.push(d.toISOString().split('T')[0]);
  }

  const reglasPeriodizacion = `
  REGLAS DE PERIODIZACIÓN OBLIGATORIAS (Tipo de microciclo: ${microTipo.toUpperCase()}):
  - Si es "ajuste" o "descarga": Prioriza técnica, movilidad articular. CERO impacto.
  - Si es "carga" o "desarrollo": Aumenta volumen. Cimientos estructurales y control excéntrico.
  - Si es "impacto" o "choque": Alta intensidad, baja duración. Foco en transferencia y aterrizajes inerciales.
  - Si es "competición" o "tapering": Volumen bajísimo, intensidad máxima. Priorizar velocidad mental.
  - Si es "general": Equilibrio progresivo clásico.
  `;

  const prompt = `Aquí está nuestra Biblia de Marca:
  ${cerebroMarca}
  ${ejemplosPracticos}

  TAREA: Crea un bloque de entrenamiento de ${dias} días.
  CONTEXTO ACTUAL:
  - Fase Macrociclo: ${macroName}
  - Fase Microciclo: ${microName}
  - TIPO DE MICROCICLO: ${microTipo.toUpperCase()}
  - Foco técnico: ${foco}

  ${reglasPeriodizacion}

  Devuelve ÚNICAMENTE un JSON con la propiedad "workouts" conteniendo un array de ${dias} objetos.
  
  ESTRUCTURA JSON:
  {
    "workouts": [
      {
        "title": "DÍA 1: [Nombre]",
        "description": "...",
        "notes": "...",
        "exercises": [ { "name": "...", "sets": 3, "reps": "10", "notes": "..." } ]
      }
    ]
  }`;

  try {
    console.log(`🧠 Pensando bloque de ${dias} días para fase de ${microTipo.toUpperCase()}...`);
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      // 🛡️ PARACAÍDAS 3: Obligamos a Gemini a devolver JSON puro y duro
      config: { responseMimeType: "application/json" }
    });

    let rutinaData;
    try {
        rutinaData = JSON.parse(response.text.trim());
    } catch(e) {
        // Limpiador extremo por si Gemini mete formato markdown a pesar de la orden
        let texto = response.text.replace(/```json/g, '').replace(/```/g, '').trim();
        rutinaData = JSON.parse(texto);
    }
    
    let finalWorkouts = rutinaData.workouts.map((w, index) => {
        return {
            ...w,
            athlete_id: athleteId,
            date: fechas[index],
            microciclo_id: microId === "" || microId === "null" ? null : microId,
            is_ai: true 
        };
    });

    console.log(`🎬 Inyectando ${finalWorkouts.length} rutinas en la base de datos...`);

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
        throw new Error(`Error ${apiRes.status} de Render: ${errorText}`);
    }

    console.log("✅ Bloque completo inyectado con éxito.");
  } catch (error) {
    console.error("❌ Error Crítico:", error);
    process.exit(1); 
  }
}

generarRutina();
