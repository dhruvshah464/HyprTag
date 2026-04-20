import React from 'react';
import { motion } from 'motion/react';
import { Hash, Sparkles, Zap, ArrowRight, Shield, Globe, Users, Command, Cpu, Target } from 'lucide-react';
import { useAuth } from '../lib/auth';

export default function Login() {
  const { login } = useAuth();

  return (
    <div className="min-h-screen bg-bg-main flex flex-col relative overflow-hidden text-white font-sans">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[20%] right-[10%] w-[40%] h-[40%] bg-brand-accent/5 rounded-full blur-[140px]" />
        <div className="absolute bottom-[10%] left-[10%] w-[30%] h-[30%] bg-white/5 rounded-full blur-[140px]" />
      </div>

      {/* Navigation */}
      <nav className="relative z-20 px-10 py-10 flex items-center justify-between max-w-[1440px] mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-white rounded-[14px] flex items-center justify-center shadow-2xl shadow-white/10 group cursor-pointer transition-all hover:scale-110">
            <Hash className="text-black w-6 h-6" />
          </div>
          <span className="font-display font-bold text-3xl tracking-tighter lowercase">hypr<span className="text-brand-accent">tags</span></span>
        </div>
        <div className="flex items-center gap-10">
          <button onClick={login} className="text-xs font-bold uppercase tracking-[0.2em] text-white/40 hover:text-white transition-colors hidden md:block">The Vision</button>
          <button onClick={login} className="text-xs font-bold uppercase tracking-[0.2em] text-white/40 hover:text-white transition-colors hidden md:block">Intelligence</button>
          <button onClick={login} className="btn-hypr-secondary h-12 px-8 text-xs font-bold uppercase tracking-[0.2em]">Initiate Access</button>
        </div>
      </nav>

      {/* Hero Body */}
      <main className="relative z-10 flex-grow flex flex-col items-center justify-center px-6 max-w-7xl mx-auto text-center pt-20 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-12"
        >
          <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-md">
            <div className="w-2 h-2 rounded-full bg-brand-accent animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/60">Neural Growth Protocol v4.2</span>
          </div>
          
          <h1 className="text-7xl md:text-9xl font-display font-bold leading-[0.85] tracking-tighter hypr-gradient-text">
            Precision <br /> 
            Audience <br />
            <span className="text-brand-accent italic">Velocity.</span>
          </h1>

          <p className="max-w-2xl mx-auto text-xl md:text-2xl text-white/50 font-light leading-relaxed">
            Personalized AI strategist for elite creators. Analyze competitors, visualize your content pipeline, and automate your viral moments.
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-6 pt-6">
            <button 
              onClick={login}
              className="btn-hypr-primary px-12 h-16 text-lg tracking-tight flex items-center gap-4 group"
            >
              Get HyprTags Free <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="btn-hypr-secondary px-12 h-16 text-lg tracking-tight">
               Strategy Deck
            </button>
          </div>
        </motion.div>

        {/* Dynamic Proof */}
        <div className="mt-40 grid grid-cols-1 md:grid-cols-3 gap-12 w-full max-w-5xl text-left border-t border-white/5 pt-20">
           <div className="space-y-4">
              <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group hover:border-brand-accent/50 transition-colors">
                 <Cpu className="text-white w-5 h-5 group-hover:text-brand-accent transition-colors" />
              </div>
              <h4 className="text-xl font-bold tracking-tight">Neural Targeting</h4>
              <p className="text-sm text-white/30 leading-relaxed font-light">Advanced probabilistic models that identify your content's "viral gap" before you post.</p>
           </div>
           <div className="space-y-4">
              <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group hover:border-brand-accent/50 transition-colors">
                 <Target className="text-white w-5 h-5 group-hover:text-brand-accent transition-colors" />
              </div>
              <h4 className="text-xl font-bold tracking-tight">Competitor Intel</h4>
              <p className="text-sm text-white/30 leading-relaxed font-light">Deep-dive into opponent strategy. Extract high-velocity tags from any public profile.</p>
           </div>
           <div className="space-y-4">
              <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group hover:border-brand-accent/50 transition-colors">
                 <Command className="text-white w-5 h-5 group-hover:text-brand-accent transition-colors" />
              </div>
              <h4 className="text-xl font-bold tracking-tight">Strategic Hub</h4>
              <p className="text-sm text-white/30 leading-relaxed font-light">Your mission control for scheduling, content planning, and real-time performance tracking.</p>
           </div>
        </div>
      </main>

      {/* Footer Rail */}
      <footer className="relative z-10 px-10 py-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-10">
         <div className="flex gap-12 items-center opacity-20 filter grayscale hover:opacity-50 hover:grayscale-0 transition-all cursor-crosshair">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Instagram</span>
            <span className="text-[10px] font-bold uppercase tracking-[0.3em]">TikTok</span>
            <span className="text-[10px] font-bold uppercase tracking-[0.3em]">LinkedIn</span>
            <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Threads</span>
         </div>
         <div className="text-[10px] font-mono font-bold tracking-widest text-white/20 uppercase">
            © 2026 HYPRTAGS NEURAL SYSTEMS. ALL RIGHTS RESERVED.
         </div>
      </footer>
    </div>
  );
}
