import React, { useState, useEffect, useRef } from "react";
import {
  Send,
  Bot,
  Sparkles,
  ChevronRight,
  Mic,
  User,
  HeartPulse,
  History,
  ClipboardList,
  Stethoscope,
  RotateCcw,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useNavigate } from "react-router";
import { supabase, backendUrl } from "../supabaseClient";

type Analysis = {
  severity: "Mild" | "Moderate" | "Serious" | "Critical";
  score: number;
  summary: string;
  steps: string[];
  specialist: {
    name: string;
    type: string;
    rating: number;
    image: string;
  };
};

export function HealthAI() {
  const navigate = useNavigate();

  const initialMessage = {
    role: "assistant",
    content: "Hello! I'm your CareFlow AI Health Assistant. How can I help you today?",
    timestamp: new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };

  const [messages, setMessages] = useState([initialMessage]);

  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  //  Backend API call
  const analyzeHealth = async (text: string) => {
    const token = localStorage.getItem('careflow_token');

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(`${backendUrl}/analyze-health`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        message: text,
      }),
    });

    if (!res.ok) throw new Error("Server error");

    return await res.json();
  };

  const handleClearChat = async () => {
    const token = localStorage.getItem('careflow_token');
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    try {
      await fetch(`${backendUrl}/clear-chat`, {
        method: "POST",
        headers,
      });
    } catch (e) {
      console.error("Failed to clear backend chat history", e);
    }

    setMessages([
      {
        role: "assistant",
        content: "I've cleared our previous conversation. What would you like to discuss now?",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      }
    ]);
    setAnalysis(null);
  };

  // Handle Send
  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = {
      role: "user",
      content: input,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMsg]);

    const currentInput = input;
    setInput("");
    setIsTyping(true);

    try {
      const result = await analyzeHealth(currentInput);
      setIsTyping(false);

      // 🔹 If AI still gathering info
      if (!result.ready) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: result.reply,
            timestamp: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          },
        ]);
        return;
      }

      // 🔹 If AI completed analysis
      setAnalysis({
        severity: result.severity,
        score: 0,
        summary: result.summary,
        steps: result.steps || [],
        specialist: {
          name: result.specialist?.name ?? "Specialist doctor",
          type: result.specialist?.type ?? "Relevant specialist",
          rating: result.specialist?.rating ?? 4.5,
          image:
            "https://images.unsplash.com/photo-1559839734-2b71ea197ec2",
        },
      });

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            result.reply ||
            "Thank you for the details. I've completed your assessment. Please review the panel.",
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);

      // Save last assessment for Dashboard (local demo persistence)
      try {
        localStorage.setItem(
          "careflow:last_health_assessment",
          JSON.stringify({
            at: Date.now(),
            severity: result.severity,
            summary: result.summary,
            steps: result.steps || [],
            reply: result.reply || "",
          }),
        );
      } catch { }

      // Auto redirect if Critical
      if (result.severity === "Critical") {
        navigate("/emergency", { state: { autoData: result } });
      }
    } catch {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "AI service is currently unavailable.",
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    }
  };

  return (
    <div className="h-full max-w-4xl mx-auto flex flex-col">
      {/* Chat Section */}
      <div className="flex-1 flex flex-col bg-white rounded-3xl border shadow-lg overflow-hidden min-h-[500px]">
        <header className="px-6 py-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
              <Bot size={22} />
            </div>
            <div>
              <h3 className="font-bold text-neutral-900">CareFlow AI</h3>
              <span className="text-xs text-neutral-500">
                AI Assistant is active
              </span>
            </div>
          </div>
          <button
            onClick={handleClearChat}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-bold text-neutral-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
          >
            <RotateCcw size={16} />
            New Topic
          </button>
        </header>

        {/* Messages */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-6 space-y-6 bg-neutral-50/30"
        >
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "flex gap-3 max-w-[85%]",
                msg.role === "user" ? "ml-auto flex-row-reverse" : ""
              )}
            >
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center mt-1",
                  msg.role === "user"
                    ? "bg-black text-white"
                    : "bg-blue-600 text-white"
                )}
              >
                {msg.role === "user" ? (
                  <User size={16} />
                ) : (
                  <Sparkles size={16} />
                )}
              </div>
              <div className="space-y-1">
                <div
                  className={cn(
                    "px-4 py-3 rounded-2xl text-sm shadow-sm",
                    msg.role === "user"
                      ? "bg-black text-white rounded-tr-none"
                      : "bg-white border rounded-tl-none"
                  )}
                >
                  {msg.content}
                </div>
                <p className="text-[10px] text-neutral-400">
                  {msg.timestamp}
                </p>
              </div>
            </motion.div>
          ))}

          {isTyping && (
            <div className="flex gap-3 max-w-[85%]">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center">
                <Sparkles size={16} />
              </div>
              <div className="bg-white border px-4 py-3 rounded-2xl">
                {isTyping && (
                  <div className="flex gap-3 max-w-[85%]">
                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center">
                      <Sparkles size={16} />
                    </div>
                    <div className="bg-white border px-4 py-3 rounded-2xl animate-pulse">
                      CareFlow AI is thinking...
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-4 border-t bg-white">
          <div className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Describe your symptoms..."
              className="w-full bg-neutral-50 border rounded-2xl pl-4 pr-20 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="absolute right-2 p-2 bg-blue-600 text-white rounded-xl"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}