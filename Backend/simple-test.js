import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

async function simpleTest() {
  console.log("🧪 Simple Gemini API Test\n");
  
  const apiKey = process.env.GEMINI_API_KEY;
  console.log("🔑 Using API Key:", apiKey?.substring(0, 20) + "...\n");
  
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  
  try {
    console.log("📤 Sending simple request...");
    const result = await model.generateContent("Say 'Hello' in one word");
    const response = await result.response;
    const text = response.text();
    
    console.log("✅ SUCCESS!");
    console.log("📥 Response:", text);
    console.log("\n🎉 API key is working! The chatbot should work now.");
    
  } catch (error) {
    console.log("❌ FAILED!");
    console.log("Error:", error.message);
    
    if (error.message.includes("retry")) {
      console.log("\n⏰ Rate limit detected.");
      console.log("💡 Solution: Wait a few minutes and try again.");
      console.log("📊 Or upgrade your API key at: https://aistudio.google.com/");
    } else if (error.message.includes("API key")) {
      console.log("\n🔑 API key issue detected.");
      console.log("💡 Solution: Get a new API key from: https://aistudio.google.com/apikey");
    } else {
      console.log("\n❓ Unknown error.");
      console.log("Full error:", error);
    }
  }
}

simpleTest();
