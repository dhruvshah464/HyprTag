import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Hash, Sparkles, Zap, ArrowRight, Shield, Globe, Users, Command, Cpu, Target, Check, Loader2, AlertCircle, TrendingUp, BarChart3, X } from 'lucide-react';
import { useAuth } from '../lib/auth';
import { cn } from '../lib/utils';

export default function Login() {
  const { login, isLoggingIn, authError } = useAuth();

  const [showDemo, setShowDemo] = React.useState(false);

  return (
    <div className="min-h-screen bg-bg-main flex flex-col relative overflow-hidden text-slate-900 font-sans">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-brand-accent/5 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-white rounded-full blur-[140px]" />
      </div>

      {/* Navigation */}
      <nav className="relative z-30 px-6 md:px-10 py-8 flex items-center justify-between max-w-[1440px] mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 md:w-11 md:h-11 bg-slate-900 rounded-[12px] md:rounded-[14px] flex items-center justify-center shadow-2xl shadow-slate-900/10 group cursor-pointer transition-all hover:scale-110">
            <Hash className="text-white w-5 h-5 md:w-6 md:h-6" />
          </div>
          <span className="font-display font-bold text-2xl md:text-3xl tracking-tighter lowercase">hypr<span className="text-brand-accent">tags</span></span>
        </div>
        <div className="flex items-center gap-4 md:gap-10">
          <a href="#features" className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 hover:text-slate-900 transition-colors hidden md:block">Strategic Logic</a>
          <a href="#pricing" className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 hover:text-slate-900 transition-colors hidden md:block">Elite Plans</a>
          <button 
            disabled={isLoggingIn}
            onClick={login} 
            className="btn-hypr-secondary h-11 md:h-12 px-6 md:px-8 text-[10px] font-bold uppercase tracking-[0.2em] flex items-center gap-2 border shadow-sm"
          >
            {isLoggingIn ? <Loader2 className="w-4 h-4 animate-spin text-brand-accent" /> : "Access Protocol"}
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
          <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/80 border border-slate-100 backdrop-blur-md shadow-sm">
            <div className="w-2 h-2 rounded-full bg-brand-accent animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500">Neural Growth Protocol v4.28</span>
          </div>
          
          <h1 className="text-6xl md:text-[9.5rem] font-display font-bold leading-[0.8] tracking-tighter hypr-gradient-text px-4 py-4">
            Predict. <br /> 
            Extract. <br />
            <span className="text-brand-accent italic">Dominate.</span>
          </h1>

          <p className="max-w-3xl mx-auto text-xl md:text-2xl text-slate-500 font-light leading-relaxed px-4 italic">
            "The first server-authoritative AI strategist for elite content creators. Use neural velocity modeling to capture audience gaps before they saturate."
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-6 pt-6">
            <button 
              onClick={login}
              disabled={isLoggingIn}
              className="btn-hypr-primary px-10 md:px-12 h-16 text-lg tracking-tight flex items-center gap-4 group w-full md:w-auto justify-center"
            >
              {isLoggingIn ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                <>Initialize Growth Core <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></>
              )}
            </button>
            <button 
              onClick={() => setShowDemo(true)}
              className="btn-hypr-secondary px-10 md:px-12 h-16 text-lg tracking-tight w-full md:w-auto flex items-center justify-center gap-3"
            >
               <Zap className="w-5 h-5 text-brand-accent" /> Watch Neural Demo
            </button>
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

        {/* Neural Preview Section (Demo) */}
        <section id="demo" className="mt-48 space-y-16">
           <div className="max-w-2xl mx-auto space-y-4">
              <h2 className="text-4xl md:text-6xl font-display font-bold italic tracking-tighter text-slate-900">The <span className="text-brand-accent">Strategic</span> Blueprint.</h2>
              <p className="text-slate-500 text-lg font-light leading-relaxed font-sans">See how HyprTags deconstructs raw signals into actionable, high-velocity assets.</p>
           </div>

           <div className="relative group max-w-5xl mx-auto">
              <div className="absolute inset-0 bg-brand-accent/[0.03] rounded-[40px] blur-[80px] -z-10 group-hover:bg-brand-accent/5 transition-all duration-700" />
              <div 
                onClick={() => setShowDemo(true)}
                className="hypr-card aspect-video w-full overflow-hidden flex items-center justify-center bg-slate-50 border-slate-200 relative group-hover:border-brand-accent/30 transition-all p-0 shadow-2xl cursor-pointer"
              >
                 <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop')] bg-cover bg-center opacity-5 group-hover:opacity-10 transition-opacity" />
                 
                 {/* Simulated UI Overlay */}
                 <div className="relative z-10 w-[85%] h-[75%] bg-white rounded-3xl border border-slate-200 shadow-2xl flex flex-col overflow-hidden text-left translate-y-4 group-hover:translate-y-0 transition-transform duration-700">
                    <div className="h-12 border-b border-slate-100 flex items-center px-6 gap-3 bg-slate-50/50">
                       <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                       <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                       <div className="w-32 h-2 bg-slate-100 rounded-full ml-4" />
                    </div>
                    <div className="flex-grow flex p-8 gap-8">
                       <div className="w-[30%] space-y-6">
                          <div className="h-40 bg-slate-50 rounded-2xl relative overflow-hidden flex items-center justify-center">
                             <Sparkles className="w-8 h-8 text-slate-200" />
                             <div className="absolute inset-0 bg-gradient-to-br from-brand-accent/5 to-transparent" />
                          </div>
                          <div className="space-y-3">
                             <div className="h-2 w-full bg-slate-50 rounded-full" />
                             <div className="h-2 w-[70%] bg-slate-50 rounded-full" />
                          </div>
                       </div>
                       <div className="flex-grow space-y-8">
                          <div className="grid grid-cols-3 gap-6">
                             {[Zap, TrendingUp, Target].map((Icon, i) => (
                               <div key={i} className="h-24 bg-white border border-slate-100 rounded-2xl flex flex-col items-center justify-center gap-3 shadow-sm group-hover:border-brand-accent/10 transition-colors">
                                  <Icon className={cn("w-5 h-5", i === 0 ? "text-brand-accent" : "text-slate-200")} />
                                  <div className={cn("h-1 w-10 rounded-full", i === 0 ? "bg-brand-accent/10" : "bg-slate-50")} />
                               </div>
                             ))}
                          </div>
                          <div className="h-full min-h-[140px] bg-slate-50/30 border border-slate-100 rounded-[2rem] p-8 flex flex-col items-center justify-center gap-4">
                             <BarChart3 className="w-12 h-12 text-slate-200" />
                             <div className="flex flex-col items-center gap-2">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Aggregating Signal Velocity...</span>
                                <div className="w-48 h-1 bg-slate-200 rounded-full overflow-hidden">
                                   <div className="h-full w-2/3 bg-brand-accent animate-[shimmer_2s_infinite]" />
                                </div>
                             </div>
                          </div>
                       </div>
                    </div>
                 </div>

                 {/* Play Button Overlay */}
                 <div className="absolute inset-0 flex items-center justify-center z-20">
                    <div className="w-24 h-24 rounded-full bg-white/60 backdrop-blur-3xl border border-white flex items-center justify-center hover:scale-110 active:scale-95 transition-all cursor-pointer group/play shadow-2xl shadow-brand-accent/20">
                       <div className="w-0 h-0 border-t-[12px] border-t-transparent border-l-[20px] border-l-brand-accent border-b-[12px] border-b-transparent translate-x-1" />
                    </div>
                 </div>
              </div>
           </div>
        </section>

        {/* Features Grid */}
        <div id="features" className="mt-48 grid grid-cols-1 md:grid-cols-3 gap-12 w-full max-w-6xl text-left border-t border-slate-100 pt-24 mx-auto">
           <div className="space-y-6 group">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center border border-slate-100 group-hover:border-brand-accent/50 transition-all shadow-sm group-hover:shadow-xl group-hover:shadow-brand-accent/5">
                 <Cpu className="text-slate-400 w-6 h-6 group-hover:text-brand-accent transition-colors" />
              </div>
              <h4 className="text-2xl font-bold tracking-tight italic text-slate-900 capitalize">Neural Target Logic</h4>
              <p className="text-base text-slate-500 leading-relaxed font-light italic">"Our proprietary LLM analyzes multi-modal signals to identify suppressed reach clusters before they ban-trap your account."</p>
           </div>
           <div className="space-y-6 group">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center border border-slate-100 group-hover:border-brand-accent/50 transition-all shadow-sm group-hover:shadow-xl group-hover:shadow-brand-accent/5">
                 <Target className="text-slate-400 w-6 h-6 group-hover:text-brand-accent transition-colors" />
              </div>
              <h4 className="text-2xl font-bold tracking-tight italic text-slate-900 capitalize">Competitor Extraction</h4>
              <p className="text-base text-slate-500 leading-relaxed font-light italic">"Zero-latency extraction of viral strategic moves from any public profile. Monitor what moves their audience in real-time."</p>
           </div>
           <div className="space-y-6 group">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center border border-slate-100 group-hover:border-brand-accent/50 transition-all shadow-sm group-hover:shadow-xl group-hover:shadow-brand-accent/5">
                 <Command className="text-slate-400 w-6 h-6 group-hover:text-brand-accent transition-colors" />
              </div>
              <h4 className="text-2xl font-bold tracking-tight italic text-slate-900 capitalize">Strategic Overwatch</h4>
              <p className="text-base text-slate-500 leading-relaxed font-light italic">"Your tactical command hub for cross-platform deployment. Schedule and automate signal peaks without manual intervention."</p>
           </div>
        </div>

        {/* Demo Video Modal */}
        <AnimatePresence>
          {showDemo && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowDemo(false)}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-2xl"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 40 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 40 }}
                className="relative z-10 w-full max-w-6xl aspect-video bg-black rounded-[2.5rem] border border-white/10 shadow-3xl overflow-hidden shadow-brand-accent/20"
              >
                <div className="absolute top-6 right-6 z-20">
                  <button 
                    onClick={() => setShowDemo(false)}
                    className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-white/20 transition-all text-white"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                
                {/* Real Demo Video / Interactive Simulation */}
                <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                   <video 
                     autoPlay 
                     muted 
                     loop 
                     playsInline
                     className="w-full h-full object-cover opacity-60"
                     poster="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop"
                   >
                     {/* Using a high-quality technology background video since we don't have a specific demo file */}
                     <source src="https://assets.mixkit.co/videos/preview/mixkit-software-developer-working-on-his-computer-34354-large.mp4" type="video/mp4" />
                   </video>
                   
                   <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                   
                   <div className="absolute bottom-12 left-12 right-12 flex flex-col md:flex-row items-end justify-between gap-6 pointer-events-none">
                      <div className="space-y-4 text-left">
                         <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-accent border border-brand-accent/50 text-[8px] font-bold uppercase tracking-widest text-white shadow-xl shadow-brand-accent/30">
                            Neural Sync Active
                         </div>
                         <h3 className="text-4xl md:text-5xl font-display font-bold italic tracking-tighter text-white">Neural Cluster v4.2<br /><span className="text-brand-accent">Infiltration Protocol</span></h3>
                      </div>
                      <div className="hidden md:block">
                         <div className="p-6 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 flex items-center gap-6">
                            <div className="flex flex-col gap-1">
                               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Signal Velocity</p>
                               <p className="text-3xl font-display font-medium text-white italic">84.2%</p>
                            </div>
                            <div className="w-12 h-12 flex items-center justify-center bg-brand-accent/20 rounded-2xl border border-brand-accent/30">
                               <TrendingUp className="text-brand-accent w-6 h-6" />
                            </div>
                         </div>
                      </div>
                   </div>
                </div>

                <div className="absolute inset-0 pointer-events-none border-[12px] border-slate-900/50 rounded-[2.5rem]" />
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Pricing Section */}
        <section id="pricing" className="mt-48 space-y-24">
           <div className="space-y-6 max-w-2xl mx-auto">
              <h2 className="text-5xl md:text-7xl font-display font-bold italic tracking-tighter hypr-gradient-text">Elite Access Plans.</h2>
              <p className="text-lg text-slate-500 font-light leading-relaxed">Choose your protocol. Scale your influence with precision-engineered AI intelligence.</p>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto text-left">
              {/* Free Plan */}
              <div className="hypr-card border-slate-200 bg-white p-10 flex flex-col justify-between shadow-sm">
                 <div className="space-y-8 text-left">
                    <div className="space-y-2">
                       <h3 className="text-2xl font-bold italic tracking-tight text-slate-800">Vanguard</h3>
                       <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Free Core Protocol</p>
                    </div>
                    <div className="text-5xl font-display font-bold italic text-slate-900">$0 <span className="text-sm font-sans font-light text-slate-400 tracking-normal">/ life</span></div>
                    <ul className="space-y-4">
                       {["5 Neural Generations / Week", "Core Hashtag Intelligence", "Basic Competitor Tracking", "7-Day Analytics History"].map((f, i) => (
                          <li key={i} className="flex items-center gap-3 text-sm text-slate-500">
                             <Check className="w-4 h-4 text-brand-accent" /> {f}
                          </li>
                       ))}
                    </ul>
                 </div>
                 <button onClick={login} className="btn-hypr-secondary w-full mt-12 h-14 text-[10px] font-bold uppercase tracking-[0.25em]">Initialize Free</button>
              </div>

              {/* Elite Plan */}
              <div className="hypr-card border-brand-accent/20 bg-brand-accent/[0.02] p-10 flex flex-col justify-between relative overflow-hidden shadow-2xl shadow-brand-accent/10">
                 <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Sparkles className="w-20 h-20 text-brand-accent animate-pulse" />
                 </div>
                 <div className="space-y-8 text-left">
                    <div className="space-y-2">
                       <div className="flex items-center justify-between">
                          <h3 className="text-2xl font-bold italic tracking-tight text-brand-primary">Elite</h3>
                          <span className="px-3 py-1 rounded-full bg-brand-accent text-white text-[8px] font-bold uppercase tracking-widest shadow-lg shadow-brand-accent/30">Recommended</span>
                       </div>
                       <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-accent">Neural Supremacy</p>
                    </div>
                    <div className="text-5xl font-display font-bold italic text-slate-900">$29 <span className="text-sm font-sans font-light text-slate-400 tracking-normal">/ month</span></div>
                    <ul className="space-y-4">
                       {[
                         "Unlimited Neural Generations", 
                         "Neural Guard Profile Protection", 
                         "Deep Competitor Infiltration", 
                         "Viral Prediction Engine",
                         "Advanced Neural Automations"
                       ].map((f, i) => (
                          <li key={i} className="flex items-center gap-3 text-sm text-slate-700 font-medium">
                             <Check className="w-4 h-4 text-brand-accent" /> {f}
                          </li>
                       ))}
                    </ul>
                 </div>
                 <button onClick={login} className="btn-hypr-primary w-full mt-12 h-14 text-[10px] font-bold uppercase tracking-[0.25em] shadow-xl shadow-brand-accent/20">Unlock Elite Status</button>
              </div>
           </div>
        </section>
      </main>

      {/* Footer Rail */}
      <footer className="relative z-30 px-10 py-16 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-10 max-w-[1440px] mx-auto w-full">
         <div className="flex gap-8 md:gap-12 items-center opacity-30 filter grayscale hover:opacity-100 hover:grayscale-0 transition-all cursor-crosshair">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 hover:text-brand-accent">Instagram</span>
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 hover:text-brand-accent">TikTok</span>
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 hover:text-brand-accent">LinkedIn</span>
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 hover:text-brand-accent">Threads</span>
         </div>
         <div className="text-[10px] font-mono font-bold tracking-widest text-slate-300 uppercase text-center md:text-right">
            © 2026 HYPRTAGS NEURAL SYSTEMS. ALL RIGHTS RESERVED. <br />
            <span className="text-[8px] opacity-70">ENGINEERED FOR SUPREMACY.</span>
         </div>
      </footer>
    </div>
  );
}
