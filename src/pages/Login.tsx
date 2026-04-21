import React from 'react';
import { motion } from 'motion/react';
import { Hash, Sparkles, Zap, ArrowRight, Shield, Globe, Users, Command, Cpu, Target, Check, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '../lib/auth';
import { cn } from '../lib/utils';

export default function Login() {
  const { login, isLoggingIn, authError } = useAuth();

  return (
    <div className="min-h-screen bg-bg-main flex flex-col relative overflow-hidden text-white font-sans">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-brand-accent/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-white/[0.02] rounded-full blur-[140px]" />
      </div>

      {/* Navigation */}
      <nav className="relative z-30 px-6 md:px-10 py-8 flex items-center justify-between max-w-[1440px] mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 md:w-11 md:h-11 bg-white rounded-[12px] md:rounded-[14px] flex items-center justify-center shadow-2xl shadow-white/10 group cursor-pointer transition-all hover:scale-110">
            <Hash className="text-black w-5 h-5 md:w-6 md:h-6" />
          </div>
          <span className="font-display font-bold text-2xl md:text-3xl tracking-tighter lowercase">hypr<span className="text-brand-accent">tags</span></span>
        </div>
        <div className="flex items-center gap-4 md:gap-10">
          <a href="#features" className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 hover:text-white transition-colors hidden md:block">Protocol</a>
          <a href="#pricing" className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 hover:text-white transition-colors hidden md:block">Pricing</a>
          <button 
            disabled={isLoggingIn}
            onClick={login} 
            className="btn-hypr-secondary h-11 md:h-12 px-6 md:px-8 text-[10px] font-bold uppercase tracking-[0.2em] flex items-center gap-2"
          >
            {isLoggingIn ? <Loader2 className="w-4 h-4 animate-spin" /> : "Initiate Access"}
          </button>
        </div>
      </nav>

      {/* Hero Body */}
      <main className="relative z-20 flex-grow flex flex-col px-6 max-w-7xl mx-auto text-center pt-24 md:pt-32 pb-24 md:pb-32">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-12"
        >
          <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-md">
            <div className="w-2 h-2 rounded-full bg-brand-accent animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/60">Neural Growth Protocol v4.2</span>
          </div>
          
          <h1 className="text-6xl md:text-[10rem] font-display font-bold leading-[0.8] tracking-tighter hypr-gradient-text px-4">
            Precision <br /> 
            Audience <br />
            <span className="text-brand-accent italic">Velocity.</span>
          </h1>

          <p className="max-w-2xl mx-auto text-xl md:text-2xl text-white/50 font-light leading-relaxed px-4">
            Personalized AI strategist for elite creators. Analyze competitors, visualize your content pipeline, and automate your viral moments.
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-6 pt-6">
            <button 
              onClick={login}
              disabled={isLoggingIn}
              className="btn-hypr-primary px-10 md:px-12 h-16 text-lg tracking-tight flex items-center gap-4 group w-full md:w-auto justify-center"
            >
              {isLoggingIn ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                <>Get Started Free <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></>
              )}
            </button>
            <a href="#pricing" className="btn-hypr-secondary px-10 md:px-12 h-16 text-lg tracking-tight w-full md:w-auto flex items-center justify-center">
               View Strategy Plans
            </a>
          </div>

          {authError && (
             <motion.div 
               initial={{ opacity: 0, y: 10 }} 
               animate={{ opacity: 1, y: 0 }}
               className="max-w-md mx-auto p-4 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-400 text-sm"
             >
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p className="text-left font-medium">{authError}</p>
             </motion.div>
          )}
        </motion.div>

        {/* Features Grid */}
        <div id="features" className="mt-48 grid grid-cols-1 md:grid-cols-3 gap-12 w-full max-w-6xl text-left border-t border-white/5 pt-20">
           <div className="space-y-6">
              <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group hover:border-brand-accent/50 transition-colors">
                 <Cpu className="text-white w-5 h-5 group-hover:text-brand-accent transition-colors" />
              </div>
              <h4 className="text-2xl font-bold tracking-tight italic">Neural Targeting</h4>
              <p className="text-base text-white/30 leading-relaxed font-light">Advanced probabilistic models that identify your content's "viral gap" before you post. Stop guessing, start growing.</p>
           </div>
           <div className="space-y-6">
              <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group hover:border-brand-accent/50 transition-colors">
                 <Target className="text-white w-5 h-5 group-hover:text-brand-accent transition-colors" />
              </div>
              <h4 className="text-2xl font-bold tracking-tight italic">Competitor Intel</h4>
              <p className="text-base text-white/30 leading-relaxed font-light">Deep-dive into opponent strategy. Extract high-velocity tags from any public profile with 99% accuracy through neural extraction.</p>
           </div>
           <div className="space-y-6">
              <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group hover:border-brand-accent/50 transition-colors">
                 <Command className="text-white w-5 h-5 group-hover:text-brand-accent transition-colors" />
              </div>
              <h4 className="text-2xl font-bold tracking-tight italic">Strategic Hub</h4>
              <p className="text-base text-white/30 leading-relaxed font-light">Your mission control for scheduling, content planning, and real-time performance tracking across all neural nodes.</p>
           </div>
        </div>

        {/* Pricing Section */}
        <section id="pricing" className="mt-48 space-y-24">
           <div className="space-y-6 max-w-2xl mx-auto">
              <h2 className="text-5xl md:text-7xl font-display font-bold italic tracking-tighter hypr-gradient-text">Elite Access Plans.</h2>
              <p className="text-lg text-white/40 font-light leading-relaxed">Choose your protocol. Scale your influence with precision-engineered AI intelligence.</p>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto text-left">
              {/* Free Plan */}
              <div className="hypr-card border-white/5 bg-white/[0.01] p-10 flex flex-col justify-between">
                 <div className="space-y-8">
                    <div className="space-y-2">
                       <h3 className="text-2xl font-bold italic tracking-tight">Vanguard</h3>
                       <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/20">Free Core Protocol</p>
                    </div>
                    <div className="text-5xl font-display font-bold italic">$0 <span className="text-sm font-sans font-light text-white/20 tracking-normal">/ life</span></div>
                    <ul className="space-y-4">
                       {["5 Neural Generations / Week", "Core Hashtag Intelligence", "Basic Competitor Tracking", "7-Day Analytics History"].map((f, i) => (
                          <li key={i} className="flex items-center gap-3 text-sm text-white/40">
                             <Check className="w-4 h-4 text-emerald-500/50" /> {f}
                          </li>
                       ))}
                    </ul>
                 </div>
                 <button onClick={login} className="btn-hypr-secondary w-full mt-12 h-14 text-[10px] font-bold uppercase tracking-[0.25em]">Initialize Free</button>
              </div>

              {/* Elite Plan */}
              <div className="hypr-card border-brand-accent/20 bg-brand-accent/[0.02] p-10 flex flex-col justify-between relative overflow-hidden shadow-[0_0_80px_rgba(96,165,250,0.05)]">
                 <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Sparkles className="w-20 h-20 text-brand-accent animate-pulse" />
                 </div>
                 <div className="space-y-8">
                    <div className="space-y-2">
                       <div className="flex items-center justify-between">
                          <h3 className="text-2xl font-bold italic tracking-tight">Elite</h3>
                          <span className="px-3 py-1 rounded-full bg-brand-accent text-black text-[8px] font-bold uppercase tracking-widest">Recommended</span>
                       </div>
                       <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-accent">Neural Supremacy</p>
                    </div>
                    <div className="text-5xl font-display font-bold italic">$29 <span className="text-sm font-sans font-light text-white/20 tracking-normal">/ month</span></div>
                    <ul className="space-y-4">
                       {[
                         "Unlimited Neural Generations", 
                         "Neural Guard Profile Protection", 
                         "Deep Competitor Infiltration", 
                         "Viral Prediction Engine",
                         "Advanced Neural Automations"
                       ].map((f, i) => (
                          <li key={i} className="flex items-center gap-3 text-sm text-white/90">
                             <Check className="w-4 h-4 text-brand-accent" /> {f}
                          </li>
                       ))}
                    </ul>
                 </div>
                 <button onClick={login} className="btn-hypr-primary w-full mt-12 h-14 text-[10px] font-bold uppercase tracking-[0.25em]">Unlock Elite Status</button>
              </div>
           </div>
        </section>
      </main>

      {/* Footer Rail */}
      <footer className="relative z-30 px-10 py-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-10 max-w-[1440px] mx-auto w-full">
         <div className="flex gap-8 md:gap-12 items-center opacity-20 filter grayscale hover:opacity-50 hover:grayscale-0 transition-all cursor-crosshair">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Instagram</span>
            <span className="text-[10px] font-bold uppercase tracking-[0.3em]">TikTok</span>
            <span className="text-[10px] font-bold uppercase tracking-[0.3em]">LinkedIn</span>
            <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Threads</span>
         </div>
         <div className="text-[10px] font-mono font-bold tracking-widest text-white/20 uppercase text-center md:text-right">
            © 2026 HYPRTAGS NEURAL SYSTEMS. ALL RIGHTS RESERVED. <br />
            <span className="text-[8px] opacity-50">ENGINEERED FOR SUPREMACY.</span>
         </div>
      </footer>
    </div>
  );
}
