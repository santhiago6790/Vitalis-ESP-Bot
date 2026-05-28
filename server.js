import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// 🔥 FIX RENDER PATHS
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🔥 SERVIR FRONTEND (IMPORTANTE)
app.use(express.static(__dirname));

// 🔥 HOME
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// 🔑 OPENAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 🧠 memoria simple
let messages = [
  {
    role: "system",
    content:
      "Eres Vitalis, asistente médico claro, humano y útil. No repitas preguntas innecesarias."
  }
];

// 💬 CHAT
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

    res.json({ reply });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error OpenAI" });
  }
});

// 🔥 PORT RENDER
const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log("Servidor corriendo en puerto", PORT);
});
