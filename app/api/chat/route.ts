import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: process.env.DEEPSEEK_API_KEY
});

export async function POST(req: Request) {
  try {
    const { stats, userQuestion } = await req.json();

    if (!process.env.DEEPSEEK_API_KEY) {
      return NextResponse.json({ error: "API Key no configurada" }, { status: 500 });
    }

    const response = await openai.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: "Eres un analista financiero..." },
        { role: "user", content: `Datos: ${JSON.stringify(stats)}. Pregunta: ${userQuestion}` }
      ],
    });

    return NextResponse.json({ text: response.choices[0].message.content });
  } catch (error) {
    console.error("Error en API Chat:", error);
    // Esto asegura que siempre devuelvas JSON, incluso en el error
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}