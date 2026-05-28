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

// 🔥 FIX PATH RENDER
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🔥 VERIFICAR SI EXISTE INDEX.HTML
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// 🔥 OPENAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 🔥 CHAT
app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Eres Vitalis, asistente médico claro y útil."
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

  } catch (err) {
    console.error("ERROR:", err);
    res.status(500).send("Error server");
  }
});

// 🔥 PORT RENDER
const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log("Servidor activo en puerto", PORT);
});
