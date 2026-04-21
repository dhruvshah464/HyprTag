import React from 'react';
import { motion } from 'motion/react';
import { 
  Zap, 
  ShieldCheck, 
  Cpu, 
  TrendingUp, 
  ArrowRight,
  Sparkles,
  Globe,
  Layers,
  CheckCircle2,
  Lock,
  ChevronRight,
  Hash,
  Target,
  BarChart3,
  Calendar,
  Smartphone,
  Server
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HowItWorks() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-brand-accent selection:text-white overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-slate-950 rounded-xl flex items-center justify-center shadow-lg">
              <Zap className="w-6 h-6 text-brand-accent fill-brand-accent" />
            </div>
            <span className="text-2xl font-display font-bold tracking-tighter italic">Hypr<span className="text-brand-accent">Tags</span></span>
          </Link>
          <div className="flex items-center gap-8">
            <Link to="/" className="text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors uppercase tracking-widest hidden md:block">Home</Link>
            <Link to="/login" className="px-6 py-3 bg-slate-950 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-slate-950/20">
               Initialize App
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Header */}
      <section className="pt-40 pb-20 px-6 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-50 border border-slate-100 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400"
          >
            <Server className="w-3 h-3 text-brand-accent" />
            Strategic Architecture Guide
          </motion.div>
          <h1 className="text-6xl md:text-8xl font-display font-bold italic tracking-tighter leading-none">
            How HyprTags <br /> <span className="text-brand-accent">Analyzes & Wins.</span>
          </h1>
          <p className="text-xl text-slate-500 font-light italic leading-relaxed max-w-2xl mx-auto">
            A deep-dive into our neural engine, data extraction protocols, and the elite architecture that powers exponential growth.
          </p>
        </div>
      </section>

      {/* Core Protocol Flow */}
      <section className="py-20 px-6 bg-slate-50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
             <div className="space-y-4">
                <div className="w-12 h-12 bg-slate-950 text-brand-accent rounded-full flex items-center justify-center font-display font-bold text-xl italic">1</div>
                <h3 className="text-xl font-bold italic">Ingestion</h3>
                <p className="text-xs text-slate-500 italic">"We extract millions of raw social signals across Instagram, TikTok, and X every hour."</p>
             </div>
             <div className="space-y-4">
                <div className="w-12 h-12 bg-slate-950 text-brand-accent rounded-full flex items-center justify-center font-display font-bold text-xl italic">2</div>
                <h3 className="text-xl font-bold italic">Processing</h3>
                <p className="text-xs text-slate-500 italic">"Our LLM filters noise and identifies reach clusters with the highest velocity scores."</p>
             </div>
             <div className="space-y-4">
                <div className="w-12 h-12 bg-slate-950 text-brand-accent rounded-full flex items-center justify-center font-display font-bold text-xl italic">3</div>
                <h3 className="text-xl font-bold italic">Optimization</h3>
                <p className="text-xs text-slate-500 italic">"Tailored tag clusters are generated based on your niche and current platform volatility."</p>
             </div>
             <div className="space-y-4">
                <div className="w-12 h-12 bg-slate-950 text-brand-accent rounded-full flex items-center justify-center font-display font-bold text-xl italic">4</div>
                <h3 className="text-xl font-bold italic">Deployment</h3>
                <p className="text-xs text-slate-500 italic">"Finalized assets are synchronized with your content planner for peak window execution."</p>
             </div>
          </div>
        </div>
      </section>

      {/* Feature Deep Dive */}
      <section className="py-32 px-6">
         <div className="max-w-7xl mx-auto space-y-32">
            
            {/* Feature 1: Neural Generator */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
               <div className="space-y-8">
                  <div className="w-16 h-16 bg-brand-accent/10 rounded-2xl flex items-center justify-center">
                     <Cpu className="w-8 h-8 text-brand-accent" />
                  </div>
                  <h2 className="text-5xl font-display font-bold italic tracking-tighter">01. Neural Tag <br /> <span className="text-brand-accent">Generator</span></h2>
                  <p className="text-lg text-slate-500 font-light italic leading-relaxed">
                     Our core AI engine doesn't just find hashtags; it predicts their future reach. It analyzes the "velocity" of a cluster—how many creators are using it versus how many eyeballs are actually consuming it.
                  </p>
                  <div className="space-y-4">
                     <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        <span className="text-sm font-bold text-slate-700">Dynamic Multi-Modal Analysis</span>
                     </div>
                     <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        <span className="text-sm font-bold text-slate-700">Platform-Specific Weighting</span>
                     </div>
                  </div>
                  <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Elite Blueprint</p>
                     <p className="text-xs italic text-slate-500 leading-relaxed">"Elite members get access to <strong>Velocity Prediction</strong>, identifying tags that are about to trend 48 hours before they saturate."</p>
                  </div>
               </div>
               <div className="relative group">
                  <div className="absolute -inset-4 bg-brand-accent/5 rounded-[3rem] blur-2xl transition-all" />
                  <div className="relative hypr-card bg-slate-950 p-8 border-slate-800">
                     <div className="space-y-6">
                        <div className="h-4 bg-slate-800 rounded-full w-1/3" />
                        <div className="grid grid-cols-2 gap-4">
                           <div className="h-24 bg-slate-900 rounded-2xl border border-slate-800" />
                           <div className="h-24 bg-slate-900 rounded-2xl border border-slate-800 border-brand-accent/20" />
                        </div>
                        <div className="h-32 bg-brand-accent/5 rounded-2xl border border-brand-accent/20 flex flex-col items-center justify-center gap-2">
                           <Sparkles className="w-6 h-6 text-brand-accent animate-pulse" />
                           <span className="text-[8px] font-bold text-brand-accent uppercase tracking-widest">Generating Strategic Clusters...</span>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            {/* Feature 2: Competitor Intel */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
               <div className="order-2 lg:order-1 relative group">
                  <div className="absolute -inset-4 bg-brand-accent/5 rounded-[3rem] blur-2xl transition-all" />
                  <div className="relative hypr-card bg-white p-8 border-slate-100 shadow-xl">
                     <div className="flex items-center gap-4 mb-8">
                        <div className="w-10 h-10 rounded-full bg-slate-100" />
                        <div className="space-y-1">
                           <div className="h-3 bg-slate-200 rounded-full w-32" />
                           <div className="h-2 bg-slate-100 rounded-full w-20" />
                        </div>
                     </div>
                     <div className="space-y-4">
                        <div className="h-2 bg-slate-50 rounded-full w-full" />
                        <div className="h-2 bg-slate-50 rounded-full w-[80%]" />
                        <div className="grid grid-cols-3 gap-3 pt-4 font-mono text-[8px] text-brand-accent">
                           <div className="p-2 border border-brand-accent/10 rounded-lg">#EXTRACTION_COMPLETE</div>
                           <div className="p-2 border border-brand-accent/10 rounded-lg">#SIGNAL_LOCK</div>
                           <div className="p-2 border border-brand-accent/10 rounded-lg">#REACH_PROBABLE</div>
                        </div>
                     </div>
                  </div>
               </div>
               <div className="order-1 lg:order-2 space-y-8">
                  <div className="w-16 h-16 bg-brand-accent/10 rounded-2xl flex items-center justify-center">
                     <Target className="w-8 h-8 text-brand-accent" />
                  </div>
                  <h2 className="text-5xl font-display font-bold italic tracking-tighter">02. Competitor <br /> <span className="text-brand-accent">Intel extraction</span></h2>
                  <p className="text-lg text-slate-500 font-light italic leading-relaxed">
                     Don't guess what works for your competitors. Infiltrate their strategy. HyprTags extracts the specific tag-timing combinations that are driving their viral peaks.
                  </p>
                  <div className="space-y-4">
                     <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        <span className="text-sm font-bold text-slate-700">Profile Deconstruction</span>
                     </div>
                     <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        <span className="text-sm font-bold text-slate-700">Real-Time Signal Monitoring</span>
                     </div>
                  </div>
                  <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Elite Blueprint</p>
                     <p className="text-xs italic text-slate-500 leading-relaxed">"Elite members get <strong>unlimited profile scans</strong> and historical tracking to see how a competitor's strategy evolves over months."</p>
                  </div>
               </div>
            </div>

            {/* Feature 3: Neural Guard */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
               <div className="space-y-8">
                  <div className="w-16 h-16 bg-brand-accent/10 rounded-2xl flex items-center justify-center">
                     <ShieldCheck className="w-8 h-8 text-brand-accent" />
                  </div>
                  <h2 className="text-5xl font-display font-bold italic tracking-tighter">03. Neural Guard <br /> <span className="text-brand-accent">Protection</span></h2>
                  <p className="text-lg text-slate-500 font-light italic leading-relaxed">
                     Stop getting shadowbanned by using the wrong tags at the wrong time. Our Neural Guard scans every suggestion against a real-time "ban-signal" database.
                  </p>
                  <div className="space-y-4">
                     <div className="flex items-center gap-3">
                        <Lock className="w-5 h-5 text-brand-accent" />
                        <span className="text-sm font-bold text-slate-900 italic">EXCLUSIVE TO ELITE MEMBERS</span>
                     </div>
                     <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        <span className="text-sm font-bold text-slate-700">Shadowban Mitigation</span>
                     </div>
                     <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        <span className="text-sm font-bold text-slate-700">Automatic Tag Replacement</span>
                     </div>
                  </div>
               </div>
               <div className="relative group">
                  <div className="absolute -inset-4 bg-emerald-500/5 rounded-[3rem] blur-2xl transition-all" />
                  <div className="relative hypr-card bg-white p-8 border-emerald-100 shadow-xl overflow-hidden">
                     <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl" />
                     <div className="space-y-6">
                        <div className="flex justify-between items-center">
                           <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Neural Safety Monitor</div>
                           <div className="px-2 py-1 bg-emerald-500 text-white text-[8px] font-bold rounded-md animate-pulse">SYSTEM_SECURE</div>
                        </div>
                        <div className="space-y-3">
                           {[1, 2, 3].map(i => (
                             <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                                <div className="h-2 bg-slate-200 rounded-full w-24" />
                                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                             </div>
                           ))}
                        </div>
                     </div>
                  </div>
               </div>
            </div>

         </div>
      </section>

      {/* Pricing Bifurcation Table */}
      <section className="py-32 px-6 bg-slate-950 text-white">
         <div className="max-w-5xl mx-auto space-y-20">
            <div className="text-center space-y-4">
               <h2 className="text-4xl md:text-6xl font-display font-bold italic tracking-tighter uppercase">Protocol <span className="text-brand-accent">Bifurcation.</span></h2>
               <p className="text-slate-400 italic">"The definitive split between standard and elite performance."</p>
            </div>

            <div className="overflow-x-auto">
               <table className="w-full text-left border-collapse">
                  <thead>
                     <tr className="border-b border-white/10 uppercase font-mono text-[10px] tracking-widest text-slate-500">
                        <th className="py-6 px-4">Feature Set</th>
                        <th className="py-6 px-4">Vanguard (Free)</th>
                        <th className="py-6 px-4 text-brand-accent">Elite (₹749)</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-light">
                     <BifurcationRow label="AI Generations" free="5 / week" elite="Unlimited" />
                     <BifurcationRow label="Velocity Mapping" free="Basic" elite="Advanced Neural" />
                     <BifurcationRow label="Competitor Scans" free="Limited Profile" elite="Deep Extraction" />
                     <BifurcationRow label="Neural Guard" free="Unavailable" elite="Real-time Shield" />
                     <BifurcationRow label="Growth Sync" free="Manual" elite="Automated Post Sync" />
                     <BifurcationRow label="Social Hub" free="1 Account" elite="Unlimited Accounts" />
                     <BifurcationRow label="Analytics" free="7 Days" elite="Lifetime Deep Dive" />
                     <BifurcationRow label="API Versions" free="Stable (v2.0)" elite="Bleeding Edge (v3.2)" />
                  </tbody>
               </table>
            </div>

            <div className="text-center pt-10">
               <Link to="/login" className="px-12 h-16 bg-white text-slate-950 inline-flex items-center justify-center gap-4 text-sm font-bold uppercase tracking-[0.4em] rounded-[2rem] hover:scale-105 transition-all hover:bg-brand-accent">
                  Initialize Your Plan <ArrowRight className="w-5 h-5" />
               </Link>
            </div>
         </div>
      </section>

      {/* Final Safety CTA */}
      <footer className="py-20 px-6 text-center space-y-12 max-w-[1440px] mx-auto w-full">
         <div className="flex justify-center gap-10 opacity-30 grayscale hover:grayscale-0 transition-opacity">
            <Globe className="w-10 h-10" />
            <Layers className="w-10 h-10" />
            <Sparkles className="w-10 h-10" />
         </div>
         <p className="text-[10px] font-mono font-bold tracking-widest text-slate-300 uppercase">
            © 2026 HYPRTAGS NEURAL SYSTEMS. ARCHITECTED FOR SUPREMACY.
         </p>
      </footer>
    </div>
  );
}

function BifurcationRow({ label, free, elite }: { label: string, free: string, elite: string }) {
  return (
    <tr className="group hover:bg-white/[0.02] transition-colors">
       <td className="py-6 px-4 font-bold italic tracking-tight">{label}</td>
       <td className="py-6 px-4 text-slate-400 italic text-sm">{free}</td>
       <td className="py-6 px-4 text-brand-accent font-bold italic">{elite}</td>
    </tr>
  );
}
