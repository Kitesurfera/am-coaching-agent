import { GoogleGenAI } from '@google/genai';
import fs from 'fs';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const tema = process.env.TEMA_CARRUSEL || "Claves del movimiento";

async function generar() {
  const prompt = `Eres el redactor de contenido para la marca Andre Molli.
  Crea un carrusel educativo de Instagram de 4 diapositivas sobre el tema: "${tema}".
  IMPORTANTE: Usa analogías sutiles sobre el control de la inercia en los giros, la anticipación y la estabilidad en los aterrizajes.
  
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
    console.log("✅ JSON del carrusel generado correctamente.");
  } catch (error) {
    console.error("Error al generar el carrusel:", error);
    // JSON de emergencia por si falla la conexión
    const emergencia = [
        {"titulo": "TEMA: " + tema, "contenido": "Desliza para aprender más sobre cómo gestionar tu movimiento."},
        {"titulo": "LA INERCIA", "contenido": "Controlar la fuerza de tus giros es el primer paso."},
        {"titulo": "EL ATERRIZAJE", "contenido": "La estabilidad al caer define el éxito del movimiento."},
        {"titulo": "ENTRENA CON PROPÓSITO", "contenido": "Guarda este post para tu próxima sesión."}
    ];
    fs.writeFileSync('carrusel.json', JSON.stringify(emergencia, null, 2));
  }
}

generar();
