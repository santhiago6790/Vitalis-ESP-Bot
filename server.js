import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();

// ===== PATH RENDER =====
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ===== MIDDLEWARE =====
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// ===== FRONTEND =====
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// ===== OPENAI =====
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 🔥 CHECK CRÍTICO (Render logs)
console.log("API KEY EXISTE:", !!process.env.OPENAI_API_KEY);

// ===== MEMORIA CHAT =====
let messages = [
  {
    role: "system",
    content:
      "Eres Vitalis, un asistente médico virtual claro, humano y directo. Respondes de forma simple y empática."
  }
];

// ===== CHAT =====
app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    if (!userMessage) {
      return res.status(400).json({ reply: "Mensaje vacío" });
    }

    // guardar usuario
    messages.push({
      role: "user",
      content: userMessage,
    });

    // llamada OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages,
    });

    console.log("OPENAI RAW:", JSON.stringify(completion, null, 2));

    // respuesta segura (ANTI undefined)
    const reply = completion?.choices?.[0]?.message?.content;

    const finalReply =
      reply && reply.trim().length > 0
        ? reply
        : "No pude generar respuesta en este momento.";

    // guardar respuesta
    messages.push({
      role: "assistant",
      content: finalReply,
    });

    res.json({ reply: finalReply });

  } catch (error) {
    console.error("ERROR BACKEND:", error);

    res.status(500).json({
      reply: "Error en servidor o en OpenAI",
    });
  }
});

// ===== PORT RENDER =====
const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log("Servidor corriendo en puerto", PORT);
});
