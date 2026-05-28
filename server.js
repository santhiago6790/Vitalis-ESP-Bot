import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";
import path from "path";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// 🔥 SERVIR FRONTEND
app.use(express.static("public"));

// 🔥 HEALTH CHECK (Render)
app.get("/", (req, res) => {
  res.sendFile(process.cwd() + "/public/index.html");
});

// 🔑 OPENAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 🧠 MEMORIA SIMPLE
let messages = [
  {
    role: "system",
    content:
      "Eres Vitalis, un asistente médico claro, humano y directo."
  }
];

// 💬 CHAT
app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    if (!userMessage) {
      return res.json({ reply: "Escribe un mensaje" });
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
    res.json({
      reply: "Error conectando con la IA"
    });
  }
});

// 🔥 RENDER PORT
const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log("Servidor corriendo en puerto", PORT);
});
