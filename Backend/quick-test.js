import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

async function quickTest() {
  const apiKey = process.env.GEMINI_API_KEY;
  console.log("🔑 API Key:", apiKey?.substring(0, 20) + "...\n");
  
  const genAI = new GoogleGenerativeAI(apiKey);
  
  const modelsToTry = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-pro", "gemini-flash-latest"];
  
  for (const modelName of modelsToTry) {
    console.log(`\n🧪 Testing: ${modelName}`);
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent("Say hello");
      const response = await result.response;
      const text = response.text();
      
      console.log(`✅ ${modelName} WORKS!`);
      console.log(`Response: ${text}`);
      console.log(`\n🎉 Use this model in your code!`);
      break;
      
    } catch (error) {
      console.log(`❌ ${modelName} failed: ${error.message.substring(0, 100)}`);
    }
  }
}

quickTest();
