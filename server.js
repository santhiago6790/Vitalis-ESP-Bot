import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// 🔥 IMPORTANTE: aquí servimos el HTML desde la raíz
app.get("/", (req, res) => {
  res.sendFile(process.cwd() + "/index.html");
});

// IA
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

let messages = [
  {
    role: "system",
    content: "Eres Vitalis, asistente médico claro y humano."
  }
];

app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    messages.push({ role: "user", content: userMessage });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
    });

    const reply = completion.choices[0].message.content;

    messages.push({ role: "assistant", content: reply });

    res.json({ reply });

  } catch (error) {
    console.error(error);
    res.json({ reply: "Error con la IA" });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log("Servidor corriendo en puerto", PORT);
});
