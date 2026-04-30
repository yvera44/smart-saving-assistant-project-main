import 'dotenv/config'; 
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

// Initialize Gemini instead of OpenAI
const model = new ChatGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY, // Make sure to add this to your .env
  model: "gemini-2.5-flash",
  maxRetries: 2,
});

async function askAssistant(question) {
  try {
    const response = await model.invoke(question);
    console.log("Assistant:", response.content);
  } catch (error) {
    console.error("Error calling AI:", error.message);
  }
}

askAssistant("What are 3 names for a saving app?");