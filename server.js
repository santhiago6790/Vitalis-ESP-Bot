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

// 🧠 CHAT CONTROLADO (ESTO ES LA CLAVE)
app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
Eres Vitalis, un asistente médico.

REGLAS IMPORTANTES:
- NO inventes citas, fechas o confirmaciones
- NO digas "cita agendada" nunca
- SOLO das orientación médica
- Si el usuario pide agendar, SOLO dices que lo conectas con el sistema de citas
- Haz preguntas médicas paso a paso (máximo 1 pregunta por mensaje)
- No repitas preguntas ya hechas
- No crees flujos automáticos de agenda

ESTILO:
- corto
- claro
- humano
- tipo médico real
          `
        },
        {
          role: "user",
          content: userMessage
        }
      ]
    });

    res.json({
      reply: completion.choices[0].message.content
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Error IA"
    });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log("Servidor corriendo en puerto", PORT);
});
