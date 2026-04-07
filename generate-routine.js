import { GoogleGenAI } from '@google/genai';
import fs from 'fs';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const renderUrl = process.env.RENDER_URL;
const token = process.env.TRAINER_TOKEN;
const athleteId = process.env.ATHLETE_ID;
const macro = process.env.MACRO_CICLO;
const micro = process.env.MICRO_CICLO;

async function generarRutina() {
  const cerebroMarca = fs.readFileSync('brand-brain.md', 'utf-8');

  const prompt = `Eres el Head Coach y Director de Rendimiento de Andre Molli.
  Aquí está nuestra Biblia de Marca (inercia, aterrizajes, control):
  ${cerebroMarca}

  TAREA:
  Genera una sesión de entrenamiento (rutina) de Alto Rendimiento para nuestro atleta.
  Contexto del entrenamiento:
  - Macrociclo: ${macro}
  - Microciclo: ${micro}

  REGLAS:
  1. Aplica nuestros conceptos estéticos y metáforas en la descripción y las notas de los ejercicios.
  2. Debe ser un reto realista pero muy técnico.
  3. Formato estricto para base de datos.

  Devuelve ÚNICAMENTE un objeto JSON válido con esta estructura:
  {
    "athlete_id": "${athleteId}",
    "title": "Nombre potente de la sesión (ej: CIMIENTOS DE IMPACTO)",
    "description": "Breve descripción motivacional y técnica de la sesión.",
    "exercises": [
      { "name": "Nombre del ejercicio", "sets": 3, "reps": "10", "notes": "Foco en la absorción del aterrizaje" },
      { "name": "Otro ejercicio", "sets": 4, "reps": "45 seg", "notes": "Mantén la cadena estable" }
    ]
  }`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    let texto = response.text.replace(/```json/g, '').replace(/```/g, '').trim();
    let rutinaData = JSON.parse(texto);
    
    // Le ponemos la fecha de hoy para que aparezca activa en la App
    rutinaData.date = new Date().toISOString().split('T')[0];

    console.log("🎬 Rutina generada por la IA. Inyectando en la Base de Datos...");

    // ⚠️ ATENCIÓN: Asumo que tu endpoint para crear rutinas es /api/workouts. 
    // Si en tu backend de Render se llama diferente, cámbialo aquí abajo.
    const apiRes = await fetch(`${renderUrl}/api/workouts`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(rutinaData)
    });

    if (!apiRes.ok) {
        const errorText = await apiRes.text();
        throw new Error(`Error en Render: ${apiRes.status} - ${errorText}`);
    }

    console.log("✅ Rutina inyectada y asignada al atleta con éxito.");
  } catch (error) {
    console.error("❌ Error Crítico:", error);
    process.exit(1); // Detiene la acción de GitHub si hay fallo
  }
}

generarRutina();
