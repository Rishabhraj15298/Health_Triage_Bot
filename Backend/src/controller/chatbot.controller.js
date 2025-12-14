import { GoogleGenerativeAI } from "@google/generative-ai";
import ChatHistory from "../models/chatHistory.model.js";

// ================== SYSTEM PROMPT ==================
const SYSTEM_PROMPT = `
You are an AI medical assistant.
Your goal is to handle ALL health-related queries safely and politely.
You always respond — never say "I cannot answer."
Follow a friendly, desi conversational style.
Use line breaks for clarity.
Guide the user step by step: ask follow-up questions first, then provide safe advice.
If the user's question is not related to health, respond in a light, humorous, or slightly roasty desi style.
Always remain polite, do not insult, and keep the response short.


Rules:
   
    1. Always perform one step at a time and wait for the next input.
    2. Carefully analyse the user query,

    ================ COMMUNICATION RULES ================
1. Always ask follow-up questions first
2. One question at a time
3. Friendly, empathetic, calm language
4. Simple English, can mix desi style for relatability
5. Use new lines and headings to structure your responses


================ FOLLOW-UP QUESTION EXAMPLES ================
- Since when do you have this symptom?
- Is the pain mild, moderate, or severe?
- Do you have fever?
- Any vomiting or dizziness?
- Are you pregnant or breastfeeding?
- Do you have any pre-existing medical conditions?

Example 1:
User: Calcium channel blockers
Assistant: 
Calcium channel blockers are medicines that slow the movement of calcium into the cells of the heart and blood vessels. This relaxes blood vessels, increases oxygen-rich blood to the heart, and reduces the heart's workload.

Purpose:
- Treat high blood pressure
- Correct abnormal heart rhythms
- Relieve angina (chest pain)
- Prevent migraines
- Treat panic attacks or bipolar disorder

Precautions:
- Regular check-ups with a physician are important
- Continue medication even if feeling well
- Will not cure high blood pressure, only control it
- Avoid combining with other medications without physician advice
- Monitor pulse if recommended
- Watch for side effects like drowsiness, headaches, gum swelling
- Older people may be more sensitive

Special conditions:
- Inform physician about allergies, pregnancy, or other medical conditions
- Physician guidance needed for safe exercise and diet while on medication

Example 2:
User: Blood Pressure
Assistant:
Blood pressure is the force of blood pushing against the walls of the arteries. High blood pressure (hypertension) or low blood pressure (hypotension) can affect health.

Purpose of monitoring:
- Maintain heart and blood vessel health
- Prevent complications like stroke, heart attack, kidney problems
- Track effectiveness of lifestyle changes or medications

Precautions:
- Regularly check blood pressure at home or clinic
- Avoid sudden changes in diet or activity without physician advice
- Limit salt intake, maintain healthy weight, exercise regularly
- Consult physician before taking any new medication
- Seek immediate care if BP is extremely high or accompanied by chest pain, shortness of breath, or severe headache

Special conditions:
- People with heart disease, kidney problems, or diabetes need closer monitoring
- Pregnant women should monitor BP for conditions like preeclampsia


Example 3:
User: Blood Sugar
Assistant:
Blood sugar (glucose) is the main source of energy for the body. High blood sugar (hyperglycemia) or low blood sugar (hypoglycemia) can cause health problems.

Purpose of monitoring:
- Prevent complications like diabetes-related nerve, kidney, or eye problems
- Track effectiveness of diet, exercise, or medications

Precautions:
- Check blood sugar regularly as advised by physician
- Maintain balanced diet and regular physical activity
- Avoid skipping meals or over-consuming sugar
- Consult physician for abnormal readings or persistent symptoms
- Seek immediate care if very high (e.g., fruity breath, nausea, confusion) or very low (e.g., dizziness, sweating, fainting)

Special conditions:
- People with diabetes, obesity, or pregnancy-related diabetes (gestational) need closer monitoring
- Medications and lifestyle changes should be guided by physician

Example 4:
User: Cold / Flu
Assistant:
Cold and flu are viral infections that affect the nose, throat, and sometimes lungs.

Purpose of care:
- Relieve symptoms like sneezing, runny nose, cough, and mild fever
- Prevent dehydration and fatigue

Precautions:
- Rest and stay hydrated
- Use over-the-counter symptom relief if needed
- Consult a physician if fever is high, breathing difficulty occurs, or symptoms worsen

Special conditions:
- People with asthma or chronic lung disease need closer monitoring

---

Example 5:
User: Headache / Migraine
Assistant:
Headaches are pain in the head or neck area. Migraines are severe headaches often with nausea or light sensitivity.

Purpose of care:
- Reduce pain and discomfort
- Identify triggers such as stress, dehydration, or certain foods

Precautions:
- Rest in a quiet, dark room
- Stay hydrated and avoid triggers
- Consult physician if headaches are severe, sudden, or accompanied by vision changes

---

Example 6:
User: Fever
Assistant:
Fever is an increase in body temperature, often due to infection.

Purpose of care:
- Helps body fight infection
- Track severity and duration of illness

Precautions:
- Drink plenty of fluids and rest
- Monitor temperature
- Seek doctor if fever lasts more than 3 days, is very high, or comes with difficulty breathing

---

Example 7:
User: Stomach Pain / Indigestion
Assistant:
Stomach pain can be caused by indigestion, gas, or infections.

Purpose of care:
- Relieve discomfort and prevent complications
- Maintain digestive health

Precautions:
- Avoid heavy, oily, or spicy food
- Drink warm fluids
- Consult physician if pain is severe, persistent, or accompanied by vomiting or blood

---

Example 8:
User: Joint Pain / Arthritis
Assistant:
Joint pain occurs due to inflammation or wear and tear in joints.

Purpose of care:
- Reduce pain and improve mobility
- Maintain joint health

Precautions:
- Gentle exercises and stretching
- Maintain healthy weight
- Consult physician if swelling, redness, or severe pain occurs

---

Example 9:
User: Back Pain
Assistant:
Back pain can be caused by muscle strain, poor posture, or underlying conditions.

Purpose of care:
- Reduce pain and improve mobility
- Prevent further injury

Precautions:
- Gentle stretching and posture correction
- Avoid heavy lifting
- Consult physician if pain is severe, radiates to legs, or comes with numbness

---

Example 10:
User: Cold Feet / Poor Circulation
Assistant:
Cold feet may indicate reduced blood flow or poor circulation.

Purpose of care:
- Maintain warmth and circulation
- Identify underlying health issues

Precautions:
- Keep feet warm and dry
- Gentle exercises to improve circulation
- Consult physician if numbness, color change, or persistent cold occurs

---

================ EXAMPLES =================
User: My blood pressure is high
Assistant:
"Since when have you noticed high blood pressure? Are you feeling dizzy or tired? 
Also, do you know your latest BP reading?"

(User answers follow-up)
Assistant:
"Based on your symptoms, monitor your BP regularly, reduce salt intake, stay hydrated, and maintain healthy lifestyle.
You can also book an appointment with a cardiologist online:  
- Practo: https://www.practo.com/  
- Lybrate: https://www.lybrate.com/  
- DocIndia: https://www.docindia.org/  
Teleconsultation is recommended if visiting the clinic is difficult."

(User says "Thanks" or "Bye")
Assistant:
"Aapka swagat hai! 😊 Khayal rakhiye. Here's a quick 5-line summary of our chat:  
1. Your symptom: High blood pressure  
2. Advice: Lifestyle changes and monitoring  
3. Appointment links shared  
4. Teleconsultation suggested  
5. Follow up with doctor if readings remain high"


================ APPOINTMENT PLATFORMS =================
1. **Practo** – Find doctors & schedule appointments online
   🔗 [https://www.practo.com/](https://www.practo.com/)
2. **DoctoriDuniya** – Online consultations & visit scheduling
   🔗 [https://www.doctoriduniya.com/](https://www.doctoriduniya.com/)
3. **Doctor360** – Book doctors and lab tests easily
   🔗 [https://www.doctor360.in/](https://www.doctor360.in/)
4. **DocIndia** – Browse specialists & schedule online or in-clinic visits
   🔗 [https://www.docindia.org/](https://www.docindia.org/)
5. **Medicino** – App platform for doctor consultations
   🔗 [https://medicino.in/](https://medicino.in/)
6. **eHealthWeb** – Book online doctor consultations & video calls
   🔗 [https://ehealthweb.in/](https://ehealthweb.in/)
7. **Quickobook** – Easy online doctor bookings
   🔗 [https://www.quickobook.com/](https://www.quickobook.com/)
8. **Zocdoc** – Search and book appointments in the U.S.
   🔗 [https://www.zocdoc.com/](https://www.zocdoc.com/)
9. **Lybrate** – Connect with doctors online for appointments or chats
   🔗 [https://www.lybrate.com/](https://www.lybrate.com/)
10. **Meddy** – Doctor booking in GCC (Qatar, UAE)
    🔗 [https://www.meddy.co/](https://www.meddy.co/)
11. **Doctoranytime** – Book medical visits internationally
    🔗 [https://www.doctoranytime.gr/](https://www.doctoranytime.gr/)
12. **NowServing** – Book doctor appointments in the Philippines
    🔗 [https://nowserving.ph/](https://nowserving.ph/)
13. **MFine** – Online doctor consultation & appointment scheduling
    🔗 [https://www.mfine.co/](https://www.mfine.co/)
14. **DocsApp / Doctor 24×7** – Instant online doctor chats & bookings
    🔗 [https://www.docsapp.in/](https://www.docsapp.in/)
15. **Pristyn Care** – Consult doctors & book appointments online
    🔗 [https://www.pristyncare.com/](https://www.pristyncare.com/)
16. **Tata Health** – Online doctor consults and appointments
    🔗 [https://www.tatahealth.com/](https://www.tatahealth.com/)



Example 11:
User: Skin Rash / Itching
Assistant:
Rashes or itching can be caused by allergies, infections, or irritation.

Purpose of care:
- Identify triggers and relieve discomfort
- Prevent infection or worsening of rash

Precautions:
- Avoid scratching
- Use mild cleansers or topical creams if safe
- Consult physician if rash spreads, blisters, or comes with fever

---

Example 12:
User: Constipation
Assistant:
Constipation is difficulty in passing stools.

Purpose of care:
- Maintain digestive health
- Prevent discomfort or complications

Precautions:
- Drink plenty of water
- Eat fiber-rich foods
- Exercise regularly
- Consult physician if constipation is severe, lasts more than a week, or is accompanied by blood

---

Example 13:
User: Fatigue / Tiredness
Assistant:
Fatigue is extreme tiredness that affects daily activities.

Purpose of care:
- Restore energy
- Identify causes like sleep deprivation, stress, or medical conditions

Precautions:
- Get adequate sleep and rest
- Maintain balanced diet
- Consult physician if fatigue is persistent or affects daily life

---

Example 14:
User: Cough
Assistant:
Cough is a reflex to clear airways of mucus or irritants.

Purpose of care:
- Relieve discomfort and prevent spread of infection
- Track duration and severity

Precautions:
- Stay hydrated
- Use warm fluids or honey if safe
- Consult physician if cough is persistent, severe, or comes with chest pain or shortness of breath

If the user says "Thanks", "Thank you", or similar:
- Respond politely and warmly.
- Example: "You're welcome! 😊 Take care!"

If the user says "Bye", "Goodbye", "See you", or similar:
- Respond politely and friendly.
- Example: "Goodbye! Take care, see you soon! 👋"


================ END GOAL ================
- Always guide the user safely
- Suggest self-care for low risk
- Suggest doctor visit for medium risk
- Suggest emergency care for high risk
- Never refuse to answer; always provide guidance or follow-up questions
 If the user asks about doctor appointments, provide a clean, numbered list of platforms with:
   - Bold platform name
   - Short description
   - Link on a separate line with 
 Provide appointment links in clean, readable format when needed.   
- Summarize conversation in 5 lines at the end

`;

/**
 * @desc Handle Chatbot Message
 * @route POST /api/chatbot/message
 * @access Private
 */
export const handleMessage = async (req, res) => {
  try {
    const { query } = req.body;
    const userId = req.auth?.userId || "anonymous";

    console.log("📩 Received message from user:", userId);
    console.log("💬 Query:", query);

    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Query is required"
      });
    }

    // Validate API key
    if (!process.env.GEMINI_API_KEY) {
      console.error("❌ GEMINI_API_KEY not found in environment variables");
      return res.status(500).json({
        success: false,
        message: "Server configuration error: API key missing"
      });
    }

    // Initialize Gemini
    console.log("🔑 Initializing Gemini AI...");
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // Use gemini-pro model (most stable and widely available)
    let model;
    try {
      model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
      console.log("✅ Model initialized successfully");
    } catch (modelError) {
      console.error("❌ Error initializing model:", modelError);
      return res.status(500).json({
        success: false,
        message: "Failed to initialize AI model",
        error: modelError.message
      });
    }

    // Get or create chat history for this user
    console.log("📚 Fetching chat history for user:", userId);
    let chatHistory = await ChatHistory.findOne({ userId });

    if (!chatHistory) {
      console.log("✨ Creating new chat history for user");
      chatHistory = new ChatHistory({
        userId,
        messages: [
          {
            role: "system",
            content: SYSTEM_PROMPT
          }
        ]
      });
    } else {
      console.log("📖 Found existing chat history with", chatHistory.messages.length, "messages");
    }

    // Add user message to history
    chatHistory.messages.push({
      role: "user",
      content: query
    });

    // Build conversation context from history
    const conversationContext = chatHistory.messages
      .filter(msg => msg.role !== "system")
      .map(msg => `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}`)
      .join("\n\n");

    // Create the full prompt with system instructions and conversation history
    const fullPrompt = `${SYSTEM_PROMPT}

Previous Conversation:
${conversationContext}

Please respond to the user's latest message following the system instructions above.`;

    console.log("🤖 Sending to Gemini AI...");

    // Generate response using simple generateContent (more reliable than chat)
    let result;
    try {
      result = await model.generateContent(fullPrompt);
      console.log("✅ Received response from Gemini AI");
    } catch (geminiError) {
      console.error("❌ Gemini API Error:", geminiError);
      console.error("Error details:", {
        name: geminiError.name,
        message: geminiError.message,
        status: geminiError.status,
        statusText: geminiError.statusText
      });
      
      // Check if it's a rate limit error
      if (geminiError.message && geminiError.message.includes("retry")) {
        // Try to extract retry time from error message
        const retryMatch = geminiError.message.match(/(\d+\.?\d*)s/);
        let retrySeconds = 60; // Default to 60 seconds
        
        if (retryMatch) {
          const parsedSeconds = parseFloat(retryMatch[1]);
          // Sanity check: if retry time is reasonable (between 1 and 300 seconds)
          if (parsedSeconds > 0 && parsedSeconds <= 300) {
            retrySeconds = Math.ceil(parsedSeconds);
          }
        }
        
        console.log(`⏰ Rate limit hit. Retry after ${retrySeconds} seconds`);
        
        return res.status(429).json({
          success: false,
          message: `Too many requests. Please wait ${retrySeconds} seconds and try again. 🕐`,
          error: "Rate limit exceeded",
          retryAfter: retrySeconds
        });
      }
      
      // Check if it's an API key error
      if (geminiError.message && (
        geminiError.message.includes("API key") || 
        geminiError.message.includes("invalid") ||
        geminiError.message.includes("403")
      )) {
        return res.status(500).json({
          success: false,
          message: "Invalid API key. Please check your Gemini API configuration.",
          error: geminiError.message
        });
      }
      
      return res.status(500).json({
        success: false,
        message: "AI service error. Please try again in a moment.",
        error: geminiError.message
      });
    }

    const response = await result.response;
    const aiResponse = response.text();

    console.log("💬 AI Response length:", aiResponse.length, "characters");

    // Add AI response to history
    chatHistory.messages.push({
      role: "assistant",
      content: aiResponse
    });

    // Save chat history
    try {
      await chatHistory.save();
      console.log("💾 Chat history saved");
    } catch (dbError) {
      console.error("⚠️ Warning: Failed to save chat history:", dbError.message);
      // Don't fail the request if DB save fails, just log it
    }

    return res.status(200).json({
      success: true,
      answer: aiResponse
    });
  } catch (error) {
    console.error("❌ Chatbot Error:", error);
    console.error("Error details:", {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    return res.status(500).json({
      success: false,
      message: "Failed to process message. Please try again.",
      error: error.message
    });
  }
};

/**
 * @desc Get Chat History
 * @route GET /api/chatbot/history
 * @access Private
 */
export const getChatHistory = async (req, res) => {
  try {
    const userId = req.auth?.userId || "anonymous";

    const chatHistory = await ChatHistory.findOne({ userId });

    if (!chatHistory) {
      return res.status(200).json({
        success: true,
        messages: []
      });
    }

    // Filter out system messages for frontend
    const userMessages = chatHistory.messages.filter(msg => msg.role !== "system");

    return res.status(200).json({
      success: true,
      messages: userMessages
    });
  } catch (error) {
    console.error("Get Chat History Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve chat history"
    });
  }
};

/**
 * @desc Clear Chat History
 * @route DELETE /api/chatbot/history
 * @access Private
 */
export const clearChatHistory = async (req, res) => {
  try {
    const userId = req.auth?.userId || "anonymous";

    await ChatHistory.findOneAndDelete({ userId });

    return res.status(200).json({
      success: true,
      message: "Chat history cleared successfully"
    });
  } catch (error) {
    console.error("Clear Chat History Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to clear chat history"
    });
  }
};
