"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, MessageSquare, Shield, TrendingUp, ChevronRight, LayoutDashboard } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-primary/10">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass border-b border-slate-200/50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold">HB</div>
            <span className="text-xl font-bold tracking-tight text-primary">HostBot</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="btn-primary flex items-center gap-2 text-sm">
              <LayoutDashboard size={16} /> Dashboard
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent -z-10" />
        
        <div className="max-w-4xl mx-auto text-center space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest">
            <Sparkles size={14} /> AI-Powered Hospitality
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1]">
            Elevate your <span className="text-primary">Moroccan Riad</span> with AI.
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Automate guest support, upsell local experiences, and manage your property—all from one premium dashboard designed for modern hosts.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/dashboard" className="btn-primary px-8 py-4 text-lg flex items-center gap-2 w-full sm:w-auto">
              Get Started for Free <ChevronRight size={20} />
            </Link>
            <Link href="/chat/demo" className="px-8 py-4 rounded-full border border-slate-200 font-medium hover:bg-white transition-all w-full sm:w-auto">
              See Guest Experience
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard 
            icon={<MessageSquare className="text-primary" size={24} />}
            title="AI Concierge"
            description="24/7 automated support for FAQs like WiFi, breakfast times, and check-out instructions."
          />
          <FeatureCard 
            icon={<TrendingUp className="text-primary" size={24} />}
            title="Revenue Growth"
            description="Smart upselling of desert tours, day trips, and local experiences directly to your guests."
          />
          <FeatureCard 
            icon={<Shield className="text-primary" size={24} />}
            title="Easy Management"
            description="A premium dashboard built for Moroccan hosts to manage multiple Riads, Hostels, and Apartments."
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-slate-200 mt-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 opacity-60">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-slate-400 flex items-center justify-center text-white font-bold text-[10px]">HB</div>
            <span className="font-bold">HostBot © 2024</span>
          </div>
          <p className="text-sm">Built for the future of Moroccan hospitality.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-8 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
      <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-slate-600 leading-relaxed">{description}</p>
    </div>
  );
}
