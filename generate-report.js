import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from 'fs';

// Inicializamos la API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function generarInforme() {
  try {
    const athleteId = process.env.ATHLETE_ID;
    const renderUrl = process.env.RENDER_URL;
    const trainerToken = process.env.TRAINER_TOKEN;
    const cerebroMarca = fs.readFileSync('brand-brain.md', 'utf-8');

    console.log(`Conectando con Render... Atleta: ${athleteId}`);

    // 1. Petición a Render
    const res = await fetch(`${renderUrl}/api/analytics/monthly-summary/${athleteId}`, {
        headers: { 
            'Authorization': `Bearer ${trainerToken.trim()}`,
            'Content-Type': 'application/json'
        }
    });

    if (!res.ok) throw new Error(`Error en Render: ${res.status}`);
    const data = await res.json();

    // 2. Configuración del modelo
    // Usamos el nombre corto que es el más compatible con la SDK actual
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Eres la Cronista de Andre Molli. 
    Escribe un mensaje de WhatsApp para ${data.athlete_name}. 
    Datos del mes: ${data.total_completed} entrenos completados, fatiga media de ${data.avg_fatigue}/10. 
    Tests recientes: ${JSON.stringify(data.recent_tests)}.
    
    Usa la filosofía de marca:
    ${cerebroMarca}
    
    INSTRUCCIONES:
    - Máximo 40 palabras.
    - Usa una metáfora de nuestra Biblia (Cimientos, Fluidez, Cadena o Equilibrio).
    - Tono: Profesional, motivador y exclusivo.`;

    // 3. Generación con manejo de errores específico
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    if (!text) throw new Error("La IA no generó contenido.");

    fs.writeFileSync('informe-whatsapp.txt', text.trim());
    console.log("✅ Informe generado exitosamente.");

  } catch (error) {
    console.error("❌ Error en el proceso:", error.message);
    // Si falla el 1.5, intentaremos una última vez con el nombre técnico completo
    process.exit(1);
  }
}

generarInforme();
