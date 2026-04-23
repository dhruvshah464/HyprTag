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
  ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-brand-accent selection:text-white overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-slate-950 rounded-xl flex items-center justify-center shadow-lg overflow-hidden">
              <img src="/logo.png" alt="Logo" className="w-full h-full object-cover scale-150" />
            </div>
            <span className="text-2xl font-display font-bold tracking-tighter italic">Hypr<span className="text-brand-accent">Tags</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <Link to="/how-it-works" className="text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors uppercase tracking-widest">How it Works</Link>
            <a href="#features" className="text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors uppercase tracking-widest">Protocols</a>
            <a href="#elite" className="text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors uppercase tracking-widest">Elite</a>
            <Link to="/login" className="px-6 py-3 bg-slate-950 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-slate-950/20">
               Initialize App
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-6">
        <div className="absolute top-0 right-0 -z-10 w-[600px] h-[600px] bg-brand-accent/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 -z-10 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px]" />
        
        <div className="max-w-7xl mx-auto text-center space-y-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-50 border border-slate-100 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400"
          >
            <Sparkles className="w-3 h-3 text-brand-accent" />
            Next-Gen Creator Intelligence v4.0
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="text-7xl md:text-[10rem] font-display font-bold italic tracking-tighter leading-none"
          >
            DOMINATE THE <br />
            <span className="text-brand-accent italic drop-shadow-2xl">ALGORITHM.</span>
          </motion.h1>

          <p className="max-w-2xl mx-auto text-xl text-slate-500 font-light italic leading-relaxed">
            Neural growth synchronization for the next generation of digital empires. <br className="hidden md:block" />
            Strategic reach extraction powered by proprietary social signals.
          </p>

          <div className="flex flex-col md:flex-row justify-center gap-6">
            <Link to="/login" className="group h-20 px-12 bg-slate-950 text-white rounded-[2rem] flex items-center justify-center gap-4 text-sm font-bold uppercase tracking-[0.3em] hover:scale-105 transition-all shadow-2xl shadow-slate-950/20">
               Start Free Calibration <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/how-it-works" className="group h-20 px-12 bg-white border border-slate-200 text-slate-950 rounded-[2rem] flex items-center justify-center gap-4 text-sm font-bold uppercase tracking-[0.3em] hover:bg-slate-50 transition-all">
               Deconstruct Engine <Cpu className="w-5 h-5" />
            </Link>
          </div>

          {/* Social Proof */}
          <div className="pt-20 space-y-8">
             <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-slate-300">Synchronized with World-Class Creators</p>
             <div className="flex flex-wrap justify-center gap-12 opacity-30 grayscale hover:grayscale-0 transition-all">
                <Globe className="w-12 h-12" />
                <Cpu className="w-12 h-12" />
                <TrendingUp className="w-12 h-12" />
                <Layers className="w-12 h-12" />
             </div>
          </div>
        </div>
      </section>

      {/* Feature Matrix */}
      <section id="features" className="py-32 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto space-y-20">
          <div className="text-center space-y-4">
             <h2 className="text-4xl font-display font-bold italic tracking-tight">Tactical <span className="text-brand-accent">Protocols.</span></h2>
             <p className="text-slate-500">Every tool built for exponential reach visibility.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <FeatureCard 
              icon={Cpu}
              title="Neural Generator"
              desc="Deep-learning hashtag extraction based on real-time platform saturation signals."
            />
            <FeatureCard 
              icon={TrendingUp}
              title="Viral Velocity"
              desc="Proprietary engine that identifies content clusters before they hit absolute peak saturation."
            />
            <FeatureCard 
              icon={ShieldCheck}
              title="Shadow-Guard"
              desc="Continuous monitoring for hashtag suppression to keep your reach at maximum output."
            />
          </div>
        </div>
      </section>

      {/* Elite Mockup */}
      <section id="elite" className="py-32 px-6 overflow-hidden">
         <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-10 text-left">
               <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-accent/10 border border-brand-accent/20 text-[10px] font-bold uppercase tracking-widest text-brand-accent">
                  <Lock className="w-3 h-3" /> Exclusive Infrastructure
               </div>
               <h2 className="text-6xl font-display font-bold italic tracking-tighter leading-none text-slate-900 text-left">The Elite <br className="hidden md:block" /> Command Hub.</h2>
               <p className="text-xl text-slate-500 font-light italic leading-relaxed">
                  "The most advanced creator interface ever built. A single pane of glass for multi-platform dominance."
               </p>
               <ul className="space-y-6">
                  <EliteBullet text="Ghost-Ban Guard Protection" />
                  <EliteBullet text="Proprietary Multi-Platform Sync" />
                  <EliteBullet text="Priority Signal Extraction" />
               </ul>
               <Link to="/upgrade" className="inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.3em] text-brand-accent hover:gap-5 transition-all">
                  Analyze Elite Features <ChevronRight className="w-4 h-4" />
               </Link>
            </div>

            <div className="relative group">
               <div className="absolute -inset-4 bg-brand-accent/20 rounded-[3rem] blur-3xl group-hover:bg-brand-accent/30 transition-all" />
               <div className="relative bg-slate-950 rounded-[3rem] p-1 shadow-2xl border border-slate-800">
                  <img 
                    src="https://picsum.photos/seed/dashboard/1920/1080?grayscale" 
                    alt="Strategic Dashboard" 
                    className="rounded-[2.8rem] opacity-40 grayscale hover:grayscale-0 transition-all duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                     <div className="w-20 h-20 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center shadow-2xl animate-pulse overflow-hidden">
                        <img src="/logo.png" alt="Logo" className="w-12 h-12 object-cover scale-150" />
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* Pricing Hub */}
      <section id="pricing" className="py-32 px-6 bg-slate-50">
         <div className="max-w-7xl mx-auto space-y-24">
            <div className="text-center space-y-6">
               <h2 className="text-5xl md:text-7xl font-display font-bold italic tracking-tighter">Elite <span className="text-brand-accent">Calibration.</span></h2>
               <p className="text-xl text-slate-500 font-light italic max-w-2xl mx-auto">Select your protocol. Scale your influence with precision-engineered AI intelligence.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto text-left">
              {/* Free Plan */}
              <div className="p-12 bg-white border border-slate-100 rounded-[3rem] text-left space-y-8 group hover:border-brand-accent/30 hover:shadow-2xl hover:shadow-brand-accent/10 transition-all flex flex-col justify-between">
                 <div className="space-y-8">
                    <div className="space-y-2">
                       <h3 className="text-2xl font-bold italic tracking-tight text-slate-800">Vanguard</h3>
                       <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Core Protocol</p>
                    </div>
                    <div className="text-5xl font-display font-bold italic text-slate-900">₹0 <span className="text-sm font-sans font-light text-slate-400 tracking-normal">/ life</span></div>
                    <ul className="space-y-4">
                       {["5 Neural Generations / Week", "Core Hashtag Intelligence", "Basic Competitor Tracking"].map((f, i) => (
                          <li key={i} className="flex items-center gap-3 text-sm text-slate-500">
                             <CheckCircle2 className="w-4 h-4 text-brand-accent" /> {f}
                          </li>
                       ))}
                    </ul>
                 </div>
                 <Link to="/login" className="w-full mt-12 h-14 bg-slate-50 border border-slate-100 text-slate-900 rounded-2xl flex items-center justify-center text-[10px] font-bold uppercase tracking-[0.25em] hover:bg-slate-100 transition-colors">Initialize Free</Link>
              </div>

              {/* Elite Plan */}
              <div className="p-12 bg-white border border-brand-accent/20 rounded-[3rem] text-left space-y-8 group hover:border-brand-accent/50 hover:shadow-2xl hover:shadow-brand-accent/20 transition-all flex flex-col justify-between relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Sparkles className="w-20 h-20 text-brand-accent animate-pulse" />
                 </div>
                 <div className="space-y-8">
                    <div className="space-y-2">
                       <div className="flex items-center justify-between">
                          <h3 className="text-2xl font-bold italic tracking-tight text-brand-primary">Elite</h3>
                          <span className="px-3 py-1 rounded-full bg-brand-accent text-white text-[8px] font-bold uppercase tracking-widest shadow-lg shadow-brand-accent/30">Most Viral</span>
                       </div>
                       <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-accent">Neural Supremacy</p>
                    </div>
                    <div className="text-5xl font-display font-bold italic text-slate-900">₹749 <span className="text-sm font-sans font-light text-slate-400 tracking-normal">/ month</span></div>
                    <ul className="space-y-4">
                       {[
                         "Unlimited Neural Generations", 
                         "Ghost-Ban Guard Protection", 
                         "Viral Prediction Engine",
                         "Advanced Neural Automations"
                       ].map((f, i) => (
                          <li key={i} className="flex items-center gap-3 text-sm text-slate-700 font-medium">
                             <CheckCircle2 className="w-4 h-4 text-brand-accent" /> {f}
                          </li>
                       ))}
                    </ul>
                 </div>
                 <Link to="/login" className="w-full mt-12 h-14 bg-brand-accent text-white rounded-2xl flex items-center justify-center text-[10px] font-bold uppercase tracking-[0.25em] shadow-xl shadow-brand-accent/20 hover:scale-105 transition-all">Unlock Elite Status</Link>
              </div>
           </div>
         </div>
      </section>

      {/* Footer / CTA */}
      <section className="py-40 bg-slate-950 text-white relative">
         <div className="max-w-7xl mx-auto text-center space-y-16">
            <h2 className="text-8xl md:text-[12rem] font-display font-bold italic tracking-tighter leading-none opacity-20 select-none">HYPRTAGS.</h2>
            <div className="space-y-8">
               <h3 className="text-3xl font-display italic font-bold">Ready to synchronize?</h3>
               <Link to="/login" className="h-20 px-16 bg-white text-slate-900 inline-flex items-center justify-center gap-4 text-sm font-bold uppercase tracking-[0.4em] rounded-[2rem] hover:scale-105 transition-all hover:bg-brand-accent">
                  Initialize Protocol <ArrowRight className="w-5 h-5" />
               </Link>
            </div>
            
            <div className="pt-20 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 px-6">
               <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest text-left">© 2026 HyprTags Strategic. All signals reserved.</p>
               <div className="flex gap-8">
                  <Link to="/how-it-works" className="text-[10px] font-bold text-white/20 uppercase tracking-widest hover:text-white transition-colors text-left">Protocol Guide</Link>
                  <a href="#" className="text-[10px] font-bold text-white/20 uppercase tracking-widest hover:text-white transition-colors text-left">Security</a>
                  <a href="#" className="text-[10px] font-bold text-white/20 uppercase tracking-widest hover:text-white transition-colors text-left">Protocols</a>
               </div>
            </div>
         </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, desc }: any) {
  return (
    <div className="p-12 bg-white border border-slate-100 rounded-[3rem] text-left space-y-8 group hover:border-brand-accent/30 hover:shadow-2xl hover:shadow-brand-accent/10 transition-all">
       <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:scale-110 group-hover:bg-brand-accent/10 transition-all">
          <Icon className="w-8 h-8 text-slate-300 group-hover:text-brand-accent transition-colors" />
       </div>
       <div className="space-y-4">
          <h3 className="text-2xl font-display font-bold italic tracking-tight text-slate-900 group-hover:text-brand-accent transition-colors">{title}</h3>
          <p className="text-slate-500 font-light leading-relaxed italic">{desc}</p>
       </div>
    </div>
  );
}

function EliteBullet({ text }: { text: string }) {
  return (
    <li className="flex items-center gap-4 text-slate-600 italic text-left">
       <div className="w-6 h-6 rounded-full bg-brand-accent/10 flex items-center justify-center shrink-0">
          <CheckCircle2 className="w-4 h-4 text-brand-accent" />
       </div>
       <span className="text-lg font-light tracking-tight">{text}</span>
    </li>
  );
}
