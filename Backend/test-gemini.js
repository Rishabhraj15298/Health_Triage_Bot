import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

async function testGeminiAPI() {
  console.log("🔍 Testing Gemini API Key...\n");
  
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    console.error("❌ GEMINI_API_KEY not found in .env file");
    return;
  }
  
  console.log("🔑 API Key found:", apiKey.substring(0, 20) + "...");
  console.log("📏 API Key length:", apiKey.length, "characters\n");
  
  const genAI = new GoogleGenerativeAI(apiKey);
  
  // Try different models
  const modelsToTry = [
    "gemini-pro",
    "gemini-1.5-pro",
    "gemini-1.5-flash",
    "gemini-2.0-flash-exp"
  ];
  
  for (const modelName of modelsToTry) {
    console.log(`\n🧪 Testing model: ${modelName}`);
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent("Say hello");
      const response = await result.response;
      const text = response.text();
      console.log(`✅ ${modelName} works!`);
      console.log(`   Response: ${text.substring(0, 50)}...`);
      break; // If one works, we're good
    } catch (error) {
      console.log(`❌ ${modelName} failed:`, error.message);
    }
  }
}

testGeminiAPI().catch(console.error);
