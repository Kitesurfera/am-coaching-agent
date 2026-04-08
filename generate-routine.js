import { GoogleGenAI } from '@google/genai';
import fs from 'fs';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const renderUrl = process.env.RENDER_URL;
const token = process.env.TRAINER_TOKEN;

const athleteId = process.env.ATHLETE_ID;
const macroName = process.env.MACRO_NOMBRE || "General";
const microName = process.env.MICRO_NOMBRE || "General";
const microTipo = (process.env.MICRO_TIPO || "General").toLowerCase(); // Capturamos el TIPO
const microId = process.env.MICRO_ID || null;
const dias = parseInt(process.env.DIAS) || 1;
const foco = process.env.FOCO || "Mantenimiento y técnica";

async function generarRutina() {
  const cerebroMarca = fs.readFileSync('brand-brain.md', 'utf-8');

  let ejemplosPracticos = "";
  try {
      const memRes = await fetch(`${renderUrl}/api/brain/memory/examples`, {
          headers: { 'Authorization': `Bearer ${token}` }
      });
      if (memRes.ok) {
          const memData = await memRes.json();
          if (memData.examples && memData.examples.length > 0) {
              ejemplosPracticos = `\n\n### EJEMPLOS REALES DE ANDRE (MACHINE LEARNING):\nAnaliza estas rutinas escritas recientemente por Andre. Fíjate en cómo escribe las notas y cómo agrupa los ejercicios:\n${JSON.stringify(memData.examples, null, 2)}`;
          }
      }
  } catch(e) {
      console.log("Usando ADN base sin memoria reciente.");
  }

  let fechas = [];
  let hoy = new Date();
  for(let i=0; i<dias; i++){
      let d = new Date(hoy);
      d.setDate(hoy.getDate() + i);
      fechas.push(d.toISOString().split('T')[0]);
  }

  // REGLAS DINÁMICAS BASADAS EN EL TIPO DE CICLO
  const reglasPeriodizacion = `
  REGLAS DE PERIODIZACIÓN OBLIGATORIAS (Basadas en el tipo de microciclo: ${microTipo.toUpperCase()}):
  - Si es "ajuste" o "descarga": Prioriza la técnica pura, la movilidad articular, la 'Fluidez' y ejercicios isométricos. Reduce el volumen a la mitad. CERO impacto articular y muy baja fatiga del Sistema Nervioso Central (SNC).
  - Si es "carga" o "desarrollo": Aumenta el volumen total (sets x reps). Construye los 'Cimientos'. Enfócate en fuerza estructural y control excéntrico pesado. Fatiga media-alta.
  - Si es "impacto" o "choque": Alta intensidad, baja duración. Foco en transferencia rápida, aterrizajes inerciales y explosividad. Fatiga del SNC muy alta. Las notas deben exigir máxima concentración.
  - Si es "competición" o "tapering": Volumen bajísimo pero intensidad máxima (activación neural). Movimientos muy específicos del deporte. Priorizar velocidad y agudeza mental sobre el cansancio físico.
  - Si es "general": Mantén un equilibrio progresivo clásico.
  `;

  const prompt = `Eres el Head Coach y Director de Rendimiento de Andre Molli.
  
  Aquí está nuestra Biblia de Marca (Teoría):
  ${cerebroMarca}
  ${ejemplosPracticos}

  TAREA:
  Crea un bloque de entrenamiento de ${dias} días.
  
  CONTEXTO ACTUAL:
  - Fase Macrociclo: ${macroName}
  - Fase Microciclo: ${microName}
  - TIPO DE MICROCICLO: ${microTipo.toUpperCase()}
  - Foco técnico solicitado por Andre: ${foco}

  ${reglasPeriodizacion}

  REGLAS ESTRICTAS DE FORMATO:
  1. Si hay ejemplos reales, IMITA su estilo de redacción.
  2. Aplica las metáforas de nuestra Biblia en las descripciones, pero respetando las reglas de volumen e intensidad del Tipo de Microciclo.
  3. Devuelve ÚNICAMENTE un objeto JSON válido con la propiedad "workouts" conteniendo un array de ${dias} objetos.

  ESTRUCTURA JSON ESPERADA:
  {
    "workouts": [
      {
        "title": "DÍA 1: [Nombre Potente relacionado con la fase y el foco]",
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
    });

    let texto = response.text.replace(/```json/g, '').replace(/```/g, '').trim();
    let rutinaData = JSON.parse(texto);
    
    let finalWorkouts = rutinaData.workouts.map((w, index) => {
        return {
            ...w,
            athlete_id: athleteId,
            date: fechas[index],
            microciclo_id: microId === "" ? null : microId,
            is_ai: true 
        };
    });

    console.log(`🎬 Inyectando ${finalWorkouts.length} rutinas de ${microTipo.toUpperCase()} en Render...`);

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
