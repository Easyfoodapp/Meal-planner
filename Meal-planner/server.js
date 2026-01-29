import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.post("/api/generate", async (req, res) => {
  const { persons, diet, budget } = req.body;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4-turbo",
        messages: [
          { role: "system", content: "Du lager ukesmeny, handleliste og ca priser i NOK." },
          { role: "user", content: `Lag ukesmeny for ${persons} personer. Kosthold: ${diet}. Budsjett: ${budget} kr.` }
        ],
        max_tokens: 500
      })
    });

    const data = await response.json();
    res.json({ message: data.choices[0].message.content });
  } catch (err) {
    res.status(500).json({ error: "AI-feil" });
  }
});

app.listen(PORT, () => console.log("Server kjører"));
