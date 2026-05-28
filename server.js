import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Vitalis API funcionando 🚀");
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 💬 CHAT SIN MEMORIA GLOBAL (ESTABLE EN RENDER)
app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    if (!userMessage) {
      return res.status(400).json({ error: "Mensaje vacío" });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
Eres Vitalis, un asistente médico virtual.

Reglas:
- Responde como médico humano
- NO repitas el saludo cada vez
- NO ignores el mensaje del usuario
- Responde directamente al síntoma
- Si hay dolor o enfermedad, da orientación clara
- No hagas preguntas innecesarias repetidas
          `
        },
        {
          role: "user",
          content: userMessage
        }
      ]
    });

    const reply = completion.choices[0].message.content;

    res.json({ reply });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Error en OpenAI o servidor"
    });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log("Servidor corriendo en puerto", PORT);
});
