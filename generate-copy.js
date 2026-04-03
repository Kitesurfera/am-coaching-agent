import { GoogleGenAI } from '@google/genai';
import fs from 'fs';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function generar() {
  // 1. El agente lee la Biblia de la marca
  const cerebroMarca = fs.readFileSync('brand-brain.md', 'utf-8');

  // 2. Construimos la instrucción maestra
  const prompt = `
  Eres el redactor experto y estratega de contenido para la cuenta de Instagram de Andre Molli.
  
  Aquí tienes nuestra Biblia de Marca. Debes absorber esta identidad y respetarla al 100%:
  ${cerebroMarca}

  TU TAREA:
  Escribe un copy para Instagram (máximo 150 palabras) que acompañe a un video de entrenamiento físico. 
  Aplica orgánicamente nuestras metáforas (inercia, aterrizajes estables o conexión de los pies) para explicar la importancia del control en el ejercicio de hoy.
  Añade un llamado a la acción (hook) potente al principio y hashtags relevantes al final.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    fs.writeFileSync('post-generado.txt', response.text);
    console.log("✅ Copy generado con éxito usando el Cerebro de Marca.");
  } catch (error) {
    console.error("Error al generar el copy:", error);
    fs.writeFileSync('post-generado.txt', "Error al conectar con el cerebro de IA.");
  }
}

generar();
