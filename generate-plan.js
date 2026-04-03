import { GoogleGenAI } from '@google/genai';
import fs from 'fs';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function generar() {
  // 1. Leer el Cerebro (La Biblia)
  const cerebroMarca = fs.readFileSync('brand-brain.md', 'utf-8');
  
  // 2. Obtener el mes actual para que la IA sepa dónde mirar
  const mesActual = new Date().toLocaleString('es-ES', { month: 'long' });
  const anioActual = new Date().getFullYear();

  // 3. El prompt ahora es dinámico y extrae la info del Cerebro
  const prompt = `Eres la Directora de Estrategia de Andre Molli. 
  Hoy es un domingo de ${mesActual} de ${anioActual}.

  CONTEXTO DE MARCA:
  ${cerebroMarca}

  INSTRUCCIÓN DE ENFOQUE:
  1. Busca en la sección "Ciclo Anual de Enfoques" de la Biblia qué toca en el mes de ${mesActual}.
  2. Si existe un enfoque manual prioritario ("${process.env.ENFOQUE_SEMANAL || 'ninguno'}"), úsalo.
  3. Si no hay enfoque manual, usa el que corresponde al mes de ${mesActual} según la Biblia.

  TAREA:
  Diseña la planificación de contenidos de Lunes a Domingo. 
  Asegúrate de que cada post use nuestras metáforas universales y el tono de Andre.

  Devuelve ÚNICAMENTE un objeto JSON válido:
  {
    "enfoque": "El tema detectado en la Biblia para este mes",
    "dias": [
      {"dia": "Lunes", "tipo": "Reel", "titulo": "...", "descripcion": "..."},
      ... hasta el Domingo
    ]
  }`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    let texto = response.text.replace(/```json/g, '').replace(/```/g, '').trim();
    fs.writeFileSync('plan-semanal.json', texto);
    
    console.log(`✅ Plan generado exitosamente para ${mesActual}.`);
  } catch (error) {
    console.error("Error en la planificación estratégica:", error);
  }
}

generar();
