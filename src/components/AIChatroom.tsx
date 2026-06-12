import React, { useState, useRef, useEffect } from "react";
import { Send, Sparkles, User, ShieldAlert, BadgeCheck, HelpCircle } from "lucide-react";
import { ChatMessage, UserProfile } from "../types";

interface AIChatroomProps {
  userProfile: UserProfile;
}

export function AIChatroom({ userProfile }: AIChatroomProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    return [
      {
        id: "welcome-msg",
        sender: "ai",
        text: `Hello! I am your RetireWise AI Financial Assistant, trained on direct fiduciary advisory metrics. 

I can help you build high-yielding mutual fund roadmaps, compare brokers (such as Vanguard, Fidelity, Zerodha, Groww), optimize section write-offs, or evaluate standard capital structures.

What financial questions can I explain for you today?`,
        timestamp: new Date()
      }
    ];
  });
  const [inputText, setInputText] = useState("");
  const [isAiTyping, setIsAiTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Quick advice queries suggested in prompt
  const suggestedQueries = [
    "Where should I invest ₹50,000?",
    "Which app is best for beginners?",
    "How much should I save monthly?",
    "Can I retire at 55?",
    "Which mutual funds suit me?"
  ];

  // Auto scroll
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isAiTyping]);

  const handleSendMessage = async (customMessage?: string) => {
    const query = (customMessage || inputText).trim();
    if (!query) return;

    // Clear input
    if (!customMessage) setInputText("");

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: "user",
      text: query,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsAiTyping(true);

    try {
      // Map previous messages to simple query history
      const formattedHistory = messages.map((m) => ({
        role: m.sender === "user" ? "user" : "model",
        content: m.text
      }));

      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: query,
          history: formattedHistory,
          userProfile
        }),
      });

      if (!res.ok) throw new Error("Our financial API servers returned a busy notice. Please retry.");
      const data = await res.json();

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text: data.text || "I apologize, I am experiencing temporary high-frequency requests. Please try again shortly.",
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text: `🚨 Services Unavailable: ${err.message}`,
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsAiTyping(false);
    }
  };

  return (
    <div id="ai-chatroom-wrapper" className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-gray-150 dark:border-slate-850 rounded-2xl shadow-xl overflow-hidden flex flex-col h-[650px]">
        
        {/* Chat header */}
        <div className="bg-slate-50 dark:bg-slate-950 px-6 py-4 border-b border-gray-150 dark:border-slate-850 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-xl">
              <Sparkles className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <h3 className="font-sans font-bold text-sm text-gray-900 dark:text-white flex items-center gap-1.5">
                RetireWise Financial Chat Advisor
                <span className="text-[10px] font-semibold bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded-full uppercase tracking-wider">Live & Active</span>
              </h3>
              <p className="text-[11px] text-gray-400 dark:text-slate-500">Fully contextualized with tax laws using Gemini AI</p>
            </div>
          </div>
          
          <div className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-slate-500 font-mono">
            <BadgeCheck className="h-4 w-4 text-emerald-500" />
            SECURED END-TO-END
          </div>
        </div>

        {/* Message feed stream */}
        <div className="flex-grow overflow-y-auto p-6 space-y-4 bg-slate-50/50 dark:bg-slate-930/10">
          {messages.map((m) => {
            const isUser = m.sender === "user";
            return (
              <div 
                key={m.id} 
                className={`flex gap-3.5 max-w-[85%] ${isUser ? "ml-auto flex-row-reverse" : "mr-auto"}`}
              >
                {/* Avatar Icon */}
                <div className={`p-2 rounded-xl h-fit shrink-0 ${isUser ? "bg-blue-600 text-white" : "bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-350"}`}>
                  {isUser ? <User className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
                </div>

                <div className={`space-y-1 ${isUser ? "text-right" : ""}`}>
                  <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                    isUser 
                      ? "bg-blue-600 text-white rounded-tr-none" 
                      : "bg-white dark:bg-slate-850 border border-gray-100 dark:border-slate-800 text-gray-850 dark:text-slate-200 rounded-tl-none pr-6 shadow-sm whitespace-pre-line"
                  }`}>
                    {m.text}
                  </div>
                  <span className="text-[10px] text-gray-400 font-mono block pl-1">
                    {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            );
          })}

          {/* AI typing simulation */}
          {isAiTyping && (
            <div className="flex gap-3.5 mr-auto">
              <div className="p-2 rounded-xl bg-gray-100 dark:bg-slate-800 text-gray-650 h-fit shrink-0">
                <Sparkles className="h-4 w-4 animate-spin text-blue-500" />
              </div>
              <div className="bg-white dark:bg-slate-850 border border-gray-100 dark:border-slate-800 p-4 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
              </div>
            </div>
          )}

          <div ref={scrollRef}></div>
        </div>

        {/* Suggested tags block */}
        <div className="px-6 py-3 bg-slate-50/70 dark:bg-slate-950 border-t border-gray-150 dark:border-slate-850">
          <span className="text-[10px] font-bold text-gray-400 dark:text-slate-550 uppercase tracking-widest block mb-2">SUGGESTED RETIREMENT INQUIRIES</span>
          <div className="flex flex-wrap gap-2">
            {suggestedQueries.map((q, idx) => (
              <button
                id={`ai-chat-prompt-pill-${idx}`}
                key={idx}
                onClick={() => handleSendMessage(q)}
                className="text-xs transition-all bg-white hover:bg-blue-50 dark:bg-slate-900 dark:hover:bg-blue-950 hover:text-blue-600 dark:hover:text-blue-400 border border-gray-200 dark:border-slate-800 rounded-lg px-3 py-1.5 font-sans font-medium hover:scale-[1.01] hover:cursor-pointer"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Form controls */}
        <div className="p-4 bg-white dark:bg-slate-900 border-t border-gray-150 dark:border-slate-850">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
            className="flex gap-2.5 items-center"
          >
            <input
              id="ai-chatroom-input"
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Query anything: 'Is NPS better than mutual funds?' or 'Explain VOO ETF'..."
              className="flex-grow bg-gray-50 dark:bg-slate-950 text-sm text-gray-900 dark:text-white rounded-xl border border-gray-250 dark:border-slate-800 px-4 py-3 focus:outline-none focus:border-blue-500"
            />
            
            <button
              id="ai-send-msg-btn"
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 p-3 text-white rounded-xl transition duration-150 flex items-center justify-center shrink-0 hover:cursor-pointer"
            >
              <Send className="h-5 w-5" />
            </button>
          </form>
          
          <p className="text-[10px] text-gray-400 dark:text-slate-500 mt-2 text-center flex items-center justify-center gap-1">
            <HelpCircle className="h-3 w-3" />
            Always verify advice. Secure fiduciary guidelines implemented.
          </p>
        </div>
      </div>
    </div>
  );
}
