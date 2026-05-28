import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// 🔥 FRONTEND (si tienes index.html en el mismo repo)
app.use(express.static("public"));

// 🔥 HEALTH CHECK (Render necesita esto)
app.get("/", (req, res) => {
  res.send("Vitalis API funcionando 🚀");
});

// 🔑 OPENAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 🧠 MEMORIA CHAT
let messages = [
  {
    role: "system",
    content:
      "Eres Vitalis, un asistente médico claro, humano y directo. Ayudas a usuarios con síntomas de salud de forma empática."
  }
];

// 💬 RUTA CHAT
app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    if (!userMessage) {
      return res.status(400).json({ reply: "Mensaje vacío" });
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
    console.error("ERROR OPENAI:", error);
    res.status(500).json({
      reply: "Error en servidor o OpenAI"
    });
  }
});

// 🔥 PUERTO RENDER
const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log("Servidor corriendo en puerto", PORT);
  console.log("API KEY OK:", !!process.env.OPENAI_API_KEY);
});
