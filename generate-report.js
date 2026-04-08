import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from 'fs';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function generarInformes() {
  try {
    const rawIds = process.env.ATHLETE_ID; // Recibe "id1,id2,id3"
    const athleteIds = rawIds.split(',').map(id => id.trim());
    const renderUrl = process.env.RENDER_URL || "https://fit-tracker-backend-rtx2.onrender.com";
    const trainerToken = process.env.TRAINER_TOKEN;
    const cerebroMarca = fs.readFileSync('brand-brain.md', 'utf-8');

    console.log(`🚀 Iniciando proceso por lotes para: ${athleteIds.length} atletas`);

    for (const id of athleteIds) {
        try {
            console.log(`--- Procesando: ${id} ---`);
            const res = await fetch(`${renderUrl}/api/analytics/monthly-summary/${id}`, {
                headers: { 'Authorization': `Bearer ${trainerToken.trim()}` }
            });

            if (!res.ok) {
                console.error(`⚠️ Fallo en Render para ${id}: ${res.status}`);
                continue;
            }

            const data = await res.json();
            const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

            const prompt = `Eres la Cronista de Andre Molli. Escribe un mensaje de WhatsApp para ${data.athlete_name}. 
            Datos del mes: ${data.total_completed} entrenos, fatiga media ${data.avg_fatigue}/5. 
            Filosofía: ${cerebroMarca}. 
            Máximo 40 palabras. Usa una metáfora de marca (Cimientos, Fluidez, Cadena o Equilibrio).`;

            const result = await model.generateContent(prompt);
            const text = result.response.text();

            // Guardamos con nombre único para que no se pisen
            fs.writeFileSync(`informe-${id}.txt`, text.trim());
            console.log(`✅ Informe de ${data.athlete_name} listo.`);
            
        } catch (err) {
            console.error(`❌ Error con atleta ${id}:`, err.message);
        }
    }
  } catch (error) {
    console.error("❌ Error Maestro:", error.message);
    process.exit(1);
  }
}

generarInformes();
