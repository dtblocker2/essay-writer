const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const GoogleGenAI = require("@google/genai").GoogleGenAI;
const path = require("path");
dotenv.config();

const app = express();
const port = 3000;

// middle man to connect browser and backend
app.use(cors());
app.use(express.json());

// Serve frontend files
app.use(express.static(__dirname));

// Render index.html if someone visits "/"
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

const ai = new GoogleGenAI({ apiKey: process.env.googleAPIKey });

app.post("/generate", async (req, res) => {
  const topic = req.body.prompt;
  if (!topic) return res.status(400).json({ error: "Topic is required" });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `write essay on topic: ${topic}`,
    });
    const output = response.text;
    res.json({ output });
  } catch (err) {
    console.error("Gemini API Error:", err);
    res.status(500).json({ error: "Failed to fetch Gemini response" });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
