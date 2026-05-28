import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// 🔥 HEALTH CHECK (Render)
app.get("/", (req, res) => {
  res.send("Vitalis API funcionando 🚀");
});

// 🔑 OPENAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 🧠 historial separado por usuario (NO global bugueado)
let messages = [
  {
    role: "system",
    content: `
Eres Vitalis, un asistente médico virtual.

Reglas:
- No repitas preguntas innecesarias
- No preguntes lo mismo dos veces
- Responde claro, corto y humano
- Si hay síntomas, da orientación médica básica
- Si el usuario pide cita, guía paso a paso sin repetir ciudad
`
  }
];

// 💬 CHAT
app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    if (!userMessage) {
      return res.status(400).json({ error: "Mensaje vacío" });
    }

    // agregar mensaje usuario
    messages.push({
      role: "user",
      content: userMessage,
    });

    // limitar historial (ESTO ES CLAVE 🔥)
    if (messages.length > 12) {
      messages = [messages[0], ...messages.slice(-10)];
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
    });

    const reply = completion.choices[0].message.content;

    messages.push({
      role: "assistant",
      content: reply,
    });

    return res.json({ reply });

  } catch (error) {
    console.error("ERROR OPENAI:", error);
    return res.status(500).json({
      error: "Error en OpenAI o servidor"
    });
  }
});

// 🔥 PORT RENDER
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Servidor corriendo en puerto", PORT);
});
