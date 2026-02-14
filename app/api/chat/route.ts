import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: process.env.DEEPSEEK_API_KEY
});

// 1. Pones la constante aquí, fuera de la función POST
const systemPrompt = `
Eres un analista financiero de precisión. Vas a recibir un JSON con datos de 3 periodos: 7, 30 y 90 días.
Debes devolver UNICAMENTE un objeto JSON con este formato:
{
  "analisis_7d": "string breve",
  "analisis_30d": "string breve",
  "analisis_90d": "string breve",
  "comparativa": "Tendencia entre los tres periodos",
  "consejo_urgente": "Acción para ahorrar hoy"
}
Usa los datos de transacciones y categorías para ser específico. Responde en español.
`;

export async function POST(req: Request) {
  try {
    const { stats, userQuestion } = await req.json();

    if (!process.env.DEEPSEEK_API_KEY) {
      return NextResponse.json({ error: "API Key no configurada" }, { status: 500 });
    }

    const response = await openai.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        { role: 'system',
          content: systemPrompt},
        { role: "user", 
          content: `Datos de gastos: ${JSON.stringify(stats)}. Pregunta del usuario: ${userQuestion}` }
      ],
      response_format: { type: 'json_object' }
    });

    const aiContent = response.choices[0].message.content || "{}";
    // Parseamos el texto para enviarlo como un objeto JSON real
    const parsedData = JSON.parse(aiContent);
    return NextResponse.json(parsedData);

  } catch (error) {
    console.error("Error en API Chat:", error);
    return NextResponse.json({ error: "Error al procesar la IA" }, { status: 500 });
  }
}