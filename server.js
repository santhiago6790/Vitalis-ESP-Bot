import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// 🔥 IMPORTANTE: Render health check
app.get("/", (req, res) => {
  res.send("Vitalis API funcionando 🚀");
});

// 🔑 OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 🧠 memoria simple (chat tipo ChatGPT)
let messages = [
  {
    role: "system",
    content:
      "Eres Vitalis, un asistente médico virtual claro, humano y directo. Ayudas con síntomas y salud sin ser robótico."
  }
];

// 💬 CHAT ROUTE
app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    if (!userMessage) {
      return res.status(400).json({ error: "Mensaje vacío" });
    }

    messages.push({
      role: "user",
      content: userMessage,
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
    });

    const reply = completion.choices[0].message.content;

    messages.push({
      role: "assistant",
      content: reply,
    });

    res.json({ reply });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error en OpenAI o servidor" });
  }
});

// 🔥 IMPORTANTE PARA RENDER
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Servidor corriendo en puerto", PORT);
});
