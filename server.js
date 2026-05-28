async function askAI(message) {
    try {
        const response = await fetch("/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ message })
        });

        const data = await response.json();

        console.log("RESPUESTA BACKEND:", data); // 🔥 IMPORTANTE DEBUG

        if (!data.reply) {
            return "Error: no llegó respuesta de la IA";
        }

        return data.reply;

    } catch (error) {
        console.error("ERROR FETCH:", error);
        return "Error conectando con el servidor";
    }
}
