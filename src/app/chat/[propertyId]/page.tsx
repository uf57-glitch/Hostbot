"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Send, 
  Wifi, 
  Coffee, 
  Map, 
  Info, 
  MessageCircle,
  Sparkles
} from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function GuestChatPage({ params }: { params: { propertyId: string } }) {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [guestId, setGuestId] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // 1. Initialize Guest ID and Fetch History
  useEffect(() => {
    // Unique ID for this guest session
    let id = localStorage.getItem("hostbot_guest_id");
    if (!id) {
      id = "guest_" + Math.random().toString(36).substring(7);
      localStorage.setItem("hostbot_guest_id", id);
    }
    setGuestId(id);

    // Fetch existing chat history from Supabase
    const fetchHistory = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('property_id', params.propertyId)
        .eq('guest_id', id)
        .order('created_at', { ascending: true });

      if (data && data.length > 0) {
        setMessages(data);
      } else {
        setMessages([{ role: "assistant", content: "Salam! Welcome to our Riad. I'm your AI Concierge. How can I help you today?" }]);
      }
    };

    fetchHistory();
  }, [params.propertyId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (forcedInput?: string) => {
    const textToSend = forcedInput || input;
    if (!textToSend.trim()) return;

    // Update UI immediately
    const userMessage = { role: "user", content: textToSend };
    setMessages((prev) => [...prev, userMessage]);
    if (!forcedInput) setInput("");
    setIsTyping(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: textToSend, propertyId: params.propertyId, guestId }),
      });
      const data = await res.json();
      
      setIsTyping(false);
      if (data.response) {
        setMessages((prev) => [...prev, { role: "assistant", content: data.response }]);
      }
    } catch (error) {
      setIsTyping(false);
      setMessages((prev) => [...prev, { role: "assistant", content: "Sorry, I'm having connection issues." }]);
    }
  };

  const QuickAction = ({ icon, label, onClick }: { icon: React.ReactNode, label: string, onClick: () => void }) => (
    <button onClick={onClick} className="flex flex-col items-center gap-1 min-w-[70px] transition-transform active:scale-90">
      <div className="w-12 h-12 rounded-2xl glass flex items-center justify-center text-primary shadow-sm">
        {icon}
      </div>
      <span className="text-[10px] font-bold uppercase tracking-wider opacity-60">{label}</span>
    </button>
  );

  return (
    <div className="flex flex-col h-screen bg-[url('https://images.unsplash.com/photo-1548013146-72479768bbaa?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center">
      <div className="absolute inset-0 bg-slate-50/70 dark:bg-slate-950/80 backdrop-blur-sm" />

      <header className="relative z-10 p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white font-bold shadow-lg shadow-primary/20">HB</div>
          <div>
            <h1 className="font-bold text-lg leading-none">Anouar's Riad</h1>
            <div className="flex items-center gap-1.5 mt-1">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">AI Concierge Online</span>
            </div>
          </div>
        </div>
        <button className="p-2 rounded-full glass border-white/40"><Info size={20} className="opacity-60" /></button>
      </header>

      <div className="relative z-10 px-6 pb-4 overflow-x-auto no-scrollbar flex gap-6">
        <QuickAction icon={<Wifi size={20} />} label="WiFi" onClick={() => handleSend("What is the WiFi password?")} />
        <QuickAction icon={<Coffee size={20} />} label="Breakfast" onClick={() => handleSend("When is breakfast served?")} />
        <QuickAction icon={<Map size={20} />} label="Tours" onClick={() => handleSend("What tours do you recommend?")} />
        <QuickAction icon={<MessageCircle size={20} />} label="Support" onClick={() => handleSend("I need to speak to a human.")} />
      </div>

      <main ref={scrollRef} className="relative z-10 flex-1 overflow-y-auto px-6 space-y-4 pb-24 scroll-smooth">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
            <div className={`max-w-[85%] p-4 rounded-2xl shadow-sm ${msg.role === "user" ? "bg-primary text-white rounded-tr-none" : "glass border-white/30 text-slate-800 dark:text-slate-100 rounded-tl-none"}`}>
              <p className="text-[15px] leading-relaxed">{msg.content}</p>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="glass border-white/30 p-4 rounded-2xl rounded-tl-none flex gap-1">
              <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce" />
              <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:0.2s]" />
              <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        )}
      </main>

      <footer className="fixed bottom-0 left-0 right-0 p-6 z-20">
        <div className="max-w-xl mx-auto relative group">
          <div className="absolute inset-0 bg-white/20 dark:bg-black/20 backdrop-blur-xl rounded-full border border-white/40 shadow-2xl" />
          <div className="relative flex items-center p-2">
            <div className="pl-4 text-primary"><Sparkles size={20} /></div>
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask me anything..." 
              className="flex-1 bg-transparent border-none focus:ring-0 px-4 py-3 text-[15px] outline-none"
            />
            <button onClick={() => handleSend()} className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shadow-lg active:scale-90 transition-transform">
              <Send size={18} />
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
