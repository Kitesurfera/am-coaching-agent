import { GoogleGenAI } from '@google/genai';
import fs from 'fs';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const tema = process.env.TEMA_CARRUSEL || "Claves del movimiento";

async function generar() {
  // 1. El agente lee la Biblia de la marca (Cerebro)
  const cerebroMarca = fs.readFileSync('brand-brain.md', 'utf-8');

  // 2. Construimos la instrucción maestra inyectando la identidad
  const prompt = `Eres el redactor experto y estratega de contenido para la marca Andre Molli.
  
  Aquí tienes nuestra Biblia de Marca. Debes absorber esta identidad, tono y metáforas universales (Cimientos, Fluidez, Cadena, Equilibrio) y respetarla al 100%:
  ${cerebroMarca}

  TAREA:
  Crea un carrusel educativo de Instagram de 4 diapositivas sobre el tema: "${tema}".
  Aplica orgánicamente nuestras metáforas de marca para explicar el tema de forma elegante.
  
  Devuelve ÚNICAMENTE un array JSON válido con esta estructura exacta, sin texto adicional:
  [
    {"titulo": "Gancho corto y potente", "contenido": "Explicación de la primera idea..."},
    {"titulo": "Segunda idea", "contenido": "Desarrollo..."},
    {"titulo": "Tercera idea", "contenido": "Desarrollo..."},
    {"titulo": "Cierre / Llamada a la acción", "contenido": "Conclusión..."}
  ]`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    // Limpiamos el texto para asegurar que sea un JSON válido
    let texto = response.text.replace(/```json/g, '').replace(/```/g, '').trim();
    fs.writeFileSync('carrusel.json', texto);
    console.log("✅ JSON del carrusel generado correctamente con identidad de marca.");
  } catch (error) {
    console.error("Error al generar el carrusel:", error);
    // JSON de emergencia por si falla la conexión (usando metáforas universales)
    const emergencia = [
        {"titulo": "TEMA: " + tema, "contenido": "Desliza para aprender más sobre cómo moverte con propósito."},
        {"titulo": "LOS CIMIENTOS", "contenido": "Toda fuerza nace de una base sólida y enraizada."},
        {"titulo": "LA FLUIDEZ", "contenido": "Busca el control en cada fase, no la rigidez."},
        {"titulo": "ENTRENA INTELIGENTE", "contenido": "Guarda este post para tu próxima sesión."}
    ];
    fs.writeFileSync('carrusel.json', JSON.stringify(emergencia, null, 2));
  }
}

generar();
