import express from "express";
import axios from "axios";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

/* MongoDB connection */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("Mongo error:", err));

/* health route */
app.get("/", (req, res) => {
  res.send("AI Server Running");
});

/* AI route */
app.post("/api/ask-ai", async (req, res) => {
  try {
    const prompt = req.body.prompt;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt missing" });
    }

    console.log("Prompt:", prompt);

    const aiResponse = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        timeout: 20000,
      },
    );

    const answer =
      aiResponse.data?.choices?.[0]?.message?.content || "No response from AI";

    res.json({ answer });
  } catch (err) {
    console.error("AI ERROR:", err.response?.data || err.message);

    res.status(500).json({
      error: "AI request failed",
      details: err.message,
    });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
