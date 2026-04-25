"use client";

import React, { useState, useEffect } from "react";
import { 
  LayoutDashboard, 
  MessageSquare, 
  Settings, 
  TrendingUp, 
  Users, 
  PlusCircle,
  Bell,
  Search,
  ChevronRight,
  Sparkles,
  Map,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Download,
  Loader2
} from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("Overview");
  const [loading, setLoading] = useState(true);
  
  // Data State
  const [properties, setProperties] = useState<any[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  const [tours, setTours] = useState<any[]>([]);
  const [faqs, setFaqs] = useState<any[]>([]);
  const [recentMessages, setRecentMessages] = useState<any[]>([]);

  // 1. Initial Data Fetch
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      // Fetch Properties
      const { data: propData } = await supabase.from('properties').select('*');
      if (propData && propData.length > 0) {
        setProperties(propData);
        setSelectedProperty(propData[0]);
        
        // Fetch related data for the first property
        await fetchPropertyDetails(propData[0].id);
      }
      
      setLoading(false);
    };

    fetchData();
  }, []);

  const fetchPropertyDetails = async (propertyId: string) => {
    // Fetch Tours
    const { data: tourData } = await supabase
      .from('tours')
      .select('*')
      .eq('property_id', propertyId);
    setTours(tourData || []);

    // Fetch FAQs
    const { data: faqData } = await supabase
      .from('faqs')
      .select('*')
      .eq('property_id', propertyId);
    setFaqs(faqData || []);

    // Fetch Recent Messages (Live Feed)
    const { data: msgData } = await supabase
      .from('messages')
      .select('*')
      .eq('property_id', propertyId)
      .order('created_at', { ascending: false })
      .limit(5);
    setRecentMessages(msgData || []);
  };

  // Switch property handler
  const handlePropertyChange = (prop: any) => {
    setSelectedProperty(prop);
    fetchPropertyDetails(prop.id);
  };

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  // Handle Empty State (No properties yet)
  if (properties.length === 0) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 p-6 text-center">
        <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center text-primary mb-6">
          <Sparkles size={40} />
        </div>
        <h2 className="text-3xl font-bold mb-2">Welcome to HostBot</h2>
        <p className="opacity-60 max-w-md mb-8">Let's set up your first property (Riad, Hostel, or Apartment) to get your AI Concierge started.</p>
        <button 
          onClick={async () => {
            console.log("Attempting to create first property...");
            const { data, error } = await supabase.from('properties').insert([
              { name: "My First Riad", type: "Riad", location: "Marrakech" }
            ]).select();
            
            if (error) {
              console.error("Supabase Error:", error);
              alert("Error creating property: " + error.message);
            } else if (data) {
              console.log("Success! Reloading...");
              window.location.reload();
            }
          }}
          className="btn-primary"
        >
          Create My First Property
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[url('https://images.unsplash.com/photo-1539650116574-8efeb43e2750?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center">
      <div className="absolute inset-0 bg-slate-50/80 dark:bg-slate-950/90 backdrop-blur-[2px]" />

      {/* Sidebar */}
      <aside className="relative z-10 w-64 glass border-r border-white/20 hidden md:flex flex-col">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
            <span className="bg-primary text-white p-1 rounded-lg">HB</span>
            HostBot
          </h1>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          <NavItem icon={<LayoutDashboard size={20} />} label="Overview" active={activeTab === "Overview"} onClick={() => setActiveTab("Overview")} />
          <NavItem icon={<MessageSquare size={20} />} label="AI Concierge" active={activeTab === "AI Concierge"} onClick={() => setActiveTab("AI Concierge")} />
          <NavItem icon={<Map size={20} />} label="Tours" active={activeTab === "Tours"} onClick={() => setActiveTab("Tours")} />
          <NavItem icon={<TrendingUp size={20} />} label="Revenue" active={activeTab === "Revenue"} onClick={() => setActiveTab("Revenue")} />
          <NavItem icon={<Users size={20} />} label="Guests" active={activeTab === "Guests"} onClick={() => setActiveTab("Guests")} />
          <NavItem icon={<Settings size={20} />} label="Settings" active={activeTab === "Settings"} onClick={() => setActiveTab("Settings")} />
        </nav>

        {/* Property Selector */}
        <div className="p-4 border-t border-white/10">
          <label className="text-[10px] font-bold uppercase tracking-widest opacity-40 px-3 mb-2 block">My Properties</label>
          <div className="relative group">
            <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-white font-bold text-xs">
                  {selectedProperty?.name[0]}
                </div>
                <div>
                  <p className="text-xs font-semibold">{selectedProperty?.name}</p>
                  <p className="text-[10px] opacity-50">{selectedProperty?.location}</p>
                </div>
              </div>
            </div>
            
            <div className="absolute bottom-full left-0 w-full mb-2 glass border border-white/20 rounded-xl overflow-hidden hidden group-hover:block z-50">
              <div className="p-2 space-y-1">
                {properties.map(p => (
                  <div key={p.id} onClick={() => handlePropertyChange(p)} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/10 cursor-pointer">
                    <div className="w-6 h-6 rounded bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">{p.name[0]}</div>
                    <p className="text-[10px] font-semibold">{p.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="relative z-10 flex-1 overflow-y-auto p-8">
        <header className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Salam, {selectedProperty?.name}!</h2>
            <p className="opacity-60">Manage your property's AI and guest experience.</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="btn-primary flex items-center gap-2"><PlusCircle size={18} /> New Booking</button>
          </div>
        </header>

        {activeTab === "Overview" ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard title="Total Revenue" value="Live soon" change="+0%" />
              <StatCard title="Tours Active" value={tours.length.toString()} change="+0%" />
              <StatCard title="AI Handled" value={recentMessages.length.toString()} change="+0%" />
              <StatCard title="FAQs Set" value={faqs.length.toString()} change="+0%" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <section className="lg:col-span-2 glass-card">
                <h3 className="text-xl font-bold mb-6">Live AI Feed</h3>
                <div className="space-y-4">
                  {recentMessages.length > 0 ? recentMessages.map(m => (
                    <ConversationItem key={m.id} name={m.role === 'user' ? 'Guest' : 'HostBot'} message={m.content} time={new Date(m.created_at).toLocaleTimeString()} status={m.role} />
                  )) : (
                    <p className="opacity-40 italic py-10 text-center">No messages yet. Share your Magic Link with guests!</p>
                  )}
                </div>
              </section>

              <section className="glass-card">
                <h3 className="text-xl font-bold mb-6">Quick Controls</h3>
                <ToggleItem label="AI Auto-Reply" description="Enable automated FAQ responses" active={true} />
                <button onClick={() => setActiveTab("AI Concierge")} className="w-full btn-accent mt-6">Update AI Knowledge</button>
              </section>
            </div>
          </>
        ) : activeTab === "AI Concierge" ? (
          <div className="max-w-4xl mx-auto space-y-8">
            <section className="glass-card">
              <h3 className="text-xl font-bold mb-4">Knowledge Base (FAQs)</h3>
              <div className="space-y-4">
                {faqs.map(f => (
                  <FAQItem key={f.id} question={f.question} answer={f.answer} />
                ))}
                <button 
                  onClick={async () => {
                    const q = prompt("Enter Question:");
                    const a = prompt("Enter Answer:");
                    if (q && a) {
                      await supabase.from('faqs').insert([{ property_id: selectedProperty.id, question: q, answer: a }]);
                      fetchPropertyDetails(selectedProperty.id);
                    }
                  }}
                  className="w-full py-3 rounded-xl border-2 border-dashed border-white/20 hover:border-primary/40 transition-colors flex items-center justify-center gap-2 opacity-60 hover:opacity-100"
                >
                  <PlusCircle size={18} /> Add New FAQ
                </button>
              </div>
            </section>
          </div>
        ) : activeTab === "Tours" ? (
          <div className="max-w-5xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold">Experience Management</h3>
              <button 
                onClick={async () => {
                  const t = prompt("Tour Title:");
                  const p = prompt("Price (e.g. 450 DH):");
                  if (t && p) {
                    await supabase.from('tours').insert([{ property_id: selectedProperty.id, title: t, price: p }]);
                    fetchPropertyDetails(selectedProperty.id);
                  }
                }}
                className="btn-primary flex items-center gap-2"
              >
                <PlusCircle size={18} /> Add New Tour
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tours.map(t => (
                <TourCard key={t.id} title={t.title} price={t.price} status={t.status} image={t.image_url || "https://images.unsplash.com/photo-1509233725247-49e657c54213?q=80&w=500&auto=format&fit=crop"} />
              ))}
            </div>
          </div>
        ) : (
          <div className="glass-card text-center py-20">
            <p className="opacity-40 italic">{activeTab} view coming in next update...</p>
          </div>
        )}
      </main>
    </div>
  );
}

// Sub-components
function NavItem({ icon, label, active, onClick }: any) {
  return (
    <div onClick={onClick} className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all ${active ? "bg-primary text-white shadow-lg" : "hover:bg-white/10 opacity-70"}`}>
      {icon} <span className="font-medium">{label}</span>
    </div>
  );
}

function StatCard({ title, value, change }: any) {
  return (
    <div className="glass-card flex flex-col justify-between">
      <p className="text-xs font-bold uppercase opacity-40">{title}</p>
      <div className="flex items-baseline justify-between mt-4">
        <h4 className="text-2xl font-bold">{value}</h4>
        <span className="text-xs font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded-full">{change}</span>
      </div>
    </div>
  );
}

function ToggleItem({ label, description, active }: any) {
  return (
    <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
      <div><p className="font-semibold text-sm">{label}</p><p className="text-xs opacity-50">{description}</p></div>
      <div className={`w-10 h-5 rounded-full relative ${active ? "bg-primary" : "bg-white/20"}`}><div className={`absolute top-1 w-3 h-3 bg-white rounded-full ${active ? "right-1" : "left-1"}`} /></div>
    </div>
  );
}

function ConversationItem({ name, message, time, status }: any) {
  return (
    <div className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-all border border-transparent hover:border-white/10">
      <div className="flex gap-3">
        <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center font-bold text-xs">{name[0]}</div>
        <div>
          <p className="font-semibold text-sm">{name}</p>
          <p className="text-xs opacity-60 truncate max-w-[200px]">{message}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-[10px] opacity-40">{time}</p>
        <span className={`text-[8px] font-bold uppercase px-1.5 py-0.5 rounded-full ${status === 'user' ? 'bg-primary/20 text-primary' : 'bg-green-500/20 text-green-500'}`}>{status}</span>
      </div>
    </div>
  );
}

function FAQItem({ question, answer }: any) {
  return (
    <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
      <div><p className="text-[10px] font-bold uppercase text-primary mb-1">{question}</p><p className="text-sm font-medium">{answer}</p></div>
      <button className="p-2 opacity-40 hover:opacity-100"><ChevronRight size={16} /></button>
    </div>
  );
}

function TourCard({ title, price, status, image }: any) {
  return (
    <div className="glass-card overflow-hidden p-0">
      <img src={image} className="w-full h-24 object-cover" alt="" />
      <div className="p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-[8px] font-bold uppercase bg-primary/10 text-primary px-2 py-0.5 rounded-full">{status}</span>
          <span className="font-bold text-sm text-primary">{price}</span>
        </div>
        <p className="font-bold text-sm">{title}</p>
      </div>
    </div>
  );
}
