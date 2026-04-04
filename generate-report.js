import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from 'fs';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function generarInforme() {
  try {
    const athleteId = process.env.ATHLETE_ID;
    const renderUrl = process.env.RENDER_URL;
    const trainerToken = process.env.TRAINER_TOKEN;
    const cerebroMarca = fs.readFileSync('brand-brain.md', 'utf-8');

    console.log(`Conectando con Render... Atleta: ${athleteId}`);

    // 1. CORRECCIÓN DE RUTA: Incluimos /analytics/ que es como está en tu server.py
    const res = await fetch(`${renderUrl}/api/analytics/monthly-summary/${athleteId}`, {
        headers: { 
          'Authorization': `Bearer ${trainerToken.trim()}`,
          'Content-Type': 'application/json'
        }
    });

    if (!res.ok) throw new Error(`Error en Render: ${res.status}`);
    const data = await res.json();

    // 2. MODELO ESTABLE: gemini-1.5-flash (Garantiza que no dé 404)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Eres la Cronista de Andre Molli. 
    Datos de ${data.athlete_name}: ${data.total_completed} entrenos completados este mes.
    Nivel de fatiga media: ${data.avg_fatigue}/10.
    Tests recientes registrados: ${JSON.stringify(data.recent_tests)}.
    
    Contexto de marca y Biblia: 
    ${cerebroMarca}
    
    TAREA: Escribe un mensaje de WhatsApp (máximo 40 palabras) para enviarle al cliente. 
    Usa una metáfora de nuestra Biblia (Cimientos, Fluidez, Cadena o Equilibrio). 
    El tono debe ser profesional, motivador y muy exclusivo.`;

    // 3. GENERACIÓN
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    fs.writeFileSync('informe-whatsapp.txt', text.trim());
    console.log("✅ Informe generado exitosamente con Gemini.");

  } catch (error) {
    console.error("❌ Error en el proceso:", error);
    process.exit(1);
  }
}

generarInforme();
