import { GoogleGenAI } from '@google/genai';
import fs from 'fs';

// Conectar con la API usando el secreto de GitHub
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function generarCopy() {
  const prompt = `
    Eres el copywriter de 'Andre Molli', una entrenadora física online y presencial.
    Escribe un pie de foto para Instagram (máximo 4 párrafos cortos).
    El tono debe ser motivacional, profesional, directo y hablar sobre disciplina y movimiento inteligente.
    No uses saludos. Termina con un Call to Action para mandar un mensaje y pedir más información y añade 5 hashtags relevantes.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    const textoGenerado = response.text;
    
    // Guardar el texto en un archivo
    fs.writeFileSync('post-generado.txt', textoGenerado);
    console.log("¡Copy generado con éxito! Revisa el archivo post-generado.txt");
    
  } catch (error) {
    console.error("Error al generar el copy:", error);
  }
}

generarCopy();
