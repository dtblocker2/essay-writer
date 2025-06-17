import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();//contents of dotenv are now available as environment variables
const api_key = process.env.googleAPIKey
const ai = new GoogleGenAI({ apiKey: api_key });

async function main(topic, words = 100) {
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: `write essay on topic: ${topic} in ${words} words`,
  });
  console.log(response.text);
}

main('memes');