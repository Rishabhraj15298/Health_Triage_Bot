import React, { useState, useRef, useEffect } from "react";
import { Send, Stethoscope, Bot, User, Sparkles } from "lucide-react";
import { useAuth } from "@clerk/clerk-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const CHAT_ENDPOINT = `${API_URL}/api/chatbot/message`;

// Dedicated component for a single message
const Message = ({ sender, text }) => {
  const isBot = sender === "bot";
  
  return (
    <div className={`flex gap-3 ${isBot ? 'justify-start' : 'justify-end'} animate-fade-in-up`}>
      {isBot && (
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center border border-blue-500/30 shadow-lg">
          <Bot className="w-5 h-5 text-white" />
        </div>
      )}
      
      <div className={`max-w-[70%] ${isBot ? 'order-2' : 'order-1'}`}>
        <div className={`px-5 py-3 rounded-2xl ${
          isBot 
            ? 'bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 text-gray-100 rounded-tl-sm' 
            : 'bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-tr-sm shadow-lg shadow-blue-900/30'
        }`}>
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{text}</p>
        </div>
      </div>
      
      {!isBot && (
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center border border-blue-400/30 shadow-lg order-2">
          <User className="w-5 h-5 text-white" />
        </div>
      )}
    </div>
  );
};

// Loading indicator component
const LoadingIndicator = () => {
  return (
    <div className="flex gap-3 justify-start animate-fade-in-up">
      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center border border-blue-500/30 shadow-lg">
        <Bot className="w-5 h-5 text-white" />
      </div>
      
      <div className="px-5 py-3 rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-tl-sm">
        <div className="flex gap-1.5">
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  );
};

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Welcome! I am your AI Medical Assistant 🩺. Please describe your symptoms or medical query, and I'll help guide you to the appropriate care." }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { getToken } = useAuth();

  // Ref for auto-scrolling
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    console.log("📤 Sending message:", userMessage);
    
    // 1. Show user message
    setMessages(prev => [...prev, { sender: "user", text: userMessage }]);
    setInput("");
    setIsLoading(true);

    try {
      // Get authentication token
      const token = await getToken();
      console.log("🔑 Got auth token:", token ? "✅" : "❌");

      console.log("🌐 Sending request to:", CHAT_ENDPOINT);
      const res = await fetch(CHAT_ENDPOINT, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ query: userMessage })
      });

      console.log("📡 Response status:", res.status, res.statusText);
      const data = await res.json();
      console.log("📦 Response data:", data);

      if (!res.ok) {
        throw new Error(data.message || `Server error: ${res.status}`);
      }

      // 2. Show bot response
      setMessages(prev => [...prev, { sender: "bot", text: data.answer || "Sorry, I received an invalid response." }]);
    } catch (err) {
      console.error("❌ API Error:", err);
      console.error("Error name:", err.name);
      console.error("Error message:", err.message);
      
      let errorMessage = "Sorry, I couldn't process your request. Please try again. 🤖";
      
      if (err.message.includes("Failed to fetch")) {
        errorMessage = "Cannot connect to server. Please check if the backend is running. 🔌";
      } else if (err.message.includes("401") || err.message.includes("Unauthorized")) {
        errorMessage = "Authentication error. Please try logging in again. 🔐";
      } else if (err.message.includes("429") || err.message.includes("rate limit")) {
        errorMessage = "Too many requests. Please wait a moment and try again. 🕐";
      } else if (err.message.includes("API rate limit exceeded")) {
        errorMessage = err.message; // Use the specific message from backend
      }
      
      setMessages(prev => [
        ...prev,
        { sender: "bot", text: errorMessage }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F] flex flex-col relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e3a8a15_1px,transparent_1px),linear-gradient(to_bottom,#1e3a8a15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>
      
      {/* Floating orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-600/20 rounded-full blur-3xl animate-float-slow"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-float-slower"></div>

      {/* Header */}
      <header className="relative z-10 bg-gradient-to-r from-gray-900/80 to-gray-800/80 backdrop-blur-xl border-b border-gray-700/50 shadow-xl">
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-900/50">
            <Stethoscope className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              AI Medical Assistant
              <Sparkles className="w-5 h-5 text-blue-400 animate-pulse" />
            </h1>
            <p className="text-sm text-gray-400">Intelligent symptom assessment & triage</p>
          </div>
        </div>
      </header>

      {/* Chat Window */}
      <div className="flex-1 overflow-y-auto px-6 py-8 relative z-10">
        <div className="max-w-5xl mx-auto space-y-6">
          {messages.map((msg, idx) => (
            <Message key={idx} sender={msg.sender} text={msg.text} />
          ))}
          
          {isLoading && <LoadingIndicator />}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="relative z-10 bg-gradient-to-r from-gray-900/80 to-gray-800/80 backdrop-blur-xl border-t border-gray-700/50">
        <div className="max-w-5xl mx-auto px-6 py-5">
          <div className="flex gap-3 items-end">
            <div className="flex-1 relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Describe your symptoms or ask a medical question..."
                disabled={isLoading}
                className="w-full px-5 py-4 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
            <button 
              onClick={sendMessage} 
              disabled={!input.trim() || isLoading}
              className="px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 hover:shadow-lg hover:shadow-blue-900/50 flex items-center gap-2 group"
            >
              <span>{isLoading ? 'Sending...' : 'Send'}</span>
              <Send className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
          
          <p className="text-xs text-gray-500 mt-3 text-center">
            This AI assistant provides guidance only. Always consult healthcare professionals for medical decisions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;