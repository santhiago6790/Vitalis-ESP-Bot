import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// 🔥 ESTO es lo que evita "Cannot GET /"
app.get("/", (req, res) => {
  res.send("Vitalis API funcionando 🚀");
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

let historialMensajes = [
  {
    role: "system",
    content:
      "Eres Vitalis, un médico experto y empático. Respondes claro, humano y directo."
  }
];

app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    if (!userMessage) {
      return res.status(400).json({ error: "Mensaje vacío" });
    }

    historialMensajes.push({
      role: "user",
      content: userMessage,
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: historialMensajes,
    });

    const botReply = completion.choices[0].message.content;

    historialMensajes.push({
      role: "assistant",
      content: botReply,
    });

    res.json({ reply: botReply });

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error OpenAI" });
  }
});

// IMPORTANTE: Render necesita puerto dinámico
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Servidor funcionando en puerto", PORT);
});
