import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Vitalis API funcionando 🚀");
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY?.trim(),
});

// Memoria del chat con las instrucciones de médico empático corregidas
let historialMensajes = [
    { 
        role: "system", 
        content: "Eres Vitalis, un médico experto y empático de Vitalis EPS. Tu prioridad absoluta es atender y responder DIRECTAMENTE a los síntomas, dolores o preguntas de salud que te haga el usuario. NO saludes de forma robótica ni repitas un menú de servicios si el usuario te está manifestando un dolor. Si te dice que le duele algo, bríndale orientación médica inmediata, consejos de alivio y apoyo humano. Sé directo, profesional y muy natural." 
    }
];

app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    if (!userMessage) {
        return res.status(400).json({ error: "El mensaje es obligatorio" });
    }

    // 1. Guardamos el nuevo mensaje del usuario en la memoria
    historialMensajes.push({
      role: "user",
      content: userMessage
    });

    // 2. Le mandamos todo el historial acumulado a OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: historialMensajes
    });

    const botReply = completion.choices[0].message.content;

    // 3. Guardamos la respuesta de Vitalis en la memoria
    historialMensajes.push({
      role: "assistant",
      content: botReply
    });

    // 4. Devolvemos la respuesta real al frontend
    res.json({
      reply: botReply
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Error con OpenAI"
    });
  }
});

app.listen(3000, () => {
  console.log("Servidor funcionando en puerto 3000");
});
