import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Zap, 
  ShieldCheck, 
  Cpu, 
  Layers, 
  TrendingUp, 
  ArrowRight,
  Check,
  CreditCard,
  Loader2,
  Lock
} from 'lucide-react';
import { useAuth } from '../lib/auth';
import { cn } from '../lib/utils';
import { useNavigate } from 'react-router-dom';

export default function Upgrade() {
  const { upgradeToElite, isElite } = useAuth();
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handlePayment = async () => {
    setProcessing(true);
    // Simulate payment latency
    await new Promise(r => setTimeout(r, 2000));
    await upgradeToElite();
    setProcessing(false);
    setSuccess(true);
    setTimeout(() => navigate('/'), 3000);
  };

  if (isElite && !success) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-6">
         <div className="w-20 h-20 rounded-full bg-brand-accent/20 flex items-center justify-center border border-brand-accent/30 shadow-[0_0_30px_rgba(96,165,250,0.3)]">
            <Sparkles className="w-10 h-10 text-brand-accent" />
         </div>
         <h2 className="text-4xl font-display font-bold italic tracking-tighter">You are already <span className="text-brand-accent">Elite</span></h2>
         <p className="text-white/40 max-w-sm">All strategic assets and neural protocols have been initialized for your account.</p>
         <button onClick={() => navigate('/')} className="btn-hypr-primary px-8 h-12">Return to Command Center</button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-10 space-y-16">
      <div className="text-center space-y-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-accent/10 border border-brand-accent/20 text-[10px] font-bold uppercase tracking-[0.2em] text-brand-accent"
        >
          <Zap className="w-3 h-3 animate-pulse" />
          Neural Capacity Expansion
        </motion.div>
        <h1 className="text-6xl md:text-8xl font-display font-bold italic tracking-tighter leading-none">
          HyprTags <span className="text-brand-accent">Elite</span>
        </h1>
        <p className="text-xl text-white/40 max-w-xl mx-auto font-light leading-relaxed">
          Unlock proprietary growth protocols used by the top 0.1% of digital creators.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Value Proposition */}
        <div className="space-y-8">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <PremiumFeature 
                icon={ShieldCheck} 
                title="Ghost-Ban Guard" 
                desc="Real-time neural scanning of your hashtag clusters to prevent shadowban suppression."
              />
              <PremiumFeature 
                icon={TrendingUp} 
                title="Viral Predicter" 
                desc="Predict signal velocity across platforms before trends hit the general awareness curve."
              />
              <PremiumFeature 
                icon={Cpu} 
                title="Neural Auto-Pilot" 
                desc="Automated post synchronization at peak connectivity windows, optimized by your audience data."
              />
              <PremiumFeature 
                icon={Layers} 
                title="Multi-Org Sync" 
                desc="Manage multiple brand identities and neural clusters from a single command interface."
              />
           </div>

           <div className="hypr-card p-10 bg-white/[0.01] border-white/5 space-y-6">
              <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-white/40">Included Benchmarks</h3>
              <ul className="space-y-4">
                 {[
                   "Unlimited Neural Iterations",
                   "Proprietary Platform Extraction",
                   "Advanced Competitor Deconstruction",
                   "Global Reach Optimization",
                   "Priority API Access (v3.2)"
                 ].map((item, i) => (
                   <li key={i} className="flex items-center gap-4 text-sm font-light text-white/60 italic">
                      <div className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                         <Check className="w-3 h-3 text-emerald-400" />
                      </div>
                      {item}
                   </li>
                 ))}
              </ul>
           </div>
        </div>

        {/* Checkout UI */}
        <div className="sticky top-32">
           <AnimatePresence mode="wait">
             {!success ? (
               <motion.div 
                 key="checkout"
                 initial={{ opacity: 0, scale: 0.95 }}
                 animate={{ opacity: 1, scale: 1 }}
                 exit={{ opacity: 0, scale: 0.95 }}
                 className="hypr-card p-12 border-brand-accent/30 bg-brand-accent/[0.03] shadow-2xl shadow-brand-accent/10 space-y-10"
               >
                  <div className="flex justify-between items-end">
                     <div className="space-y-1">
                        <p className="text-[10px] font-bold text-brand-accent uppercase tracking-widest">Selected Tier</p>
                        <h3 className="text-4xl font-display font-bold italic tracking-tight">Elite Monthly</h3>
                     </div>
                     <div className="text-right">
                        <p className="text-4xl font-display font-medium text-white">$9<span className="text-lg text-white/40">/mo</span></p>
                     </div>
                  </div>

                  <div className="space-y-6">
                     <div className="space-y-3">
                        <label className="hypr-label ml-1">Payment Method</label>
                        <div className="flex items-center gap-4 p-5 bg-white/[0.03] border border-white/10 rounded-2xl">
                           <CreditCard className="w-6 h-6 text-white/40" />
                           <div className="flex-grow">
                              <p className="text-sm font-bold text-white/80">Neural Ledger Payment</p>
                              <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest leading-none mt-1">One-click execution</p>
                           </div>
                           <div className="w-2 h-2 rounded-full bg-brand-accent shadow-[0_0_8px_rgba(96,165,250,0.5)]" />
                        </div>
                     </div>

                     <button 
                       onClick={handlePayment}
                       disabled={processing}
                       className="w-full h-20 bg-brand-accent text-white rounded-[2rem] font-bold uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-brand-accent/20 text-xs"
                     >
                        {processing ? (
                          <Loader2 className="w-6 h-6 animate-spin" />
                        ) : (
                          <>Initialize Elite Protocols <ArrowRight className="w-5 h-5" /></>
                        )}
                     </button>
                     
                     <p className="text-[9px] text-white/20 font-bold uppercase text-center tracking-widest flex items-center justify-center gap-2">
                        <Lock className="w-3 h-3" /> Secure SSL Encryption Active
                     </p>
                  </div>
               </motion.div>
             ) : (
               <motion.div 
                 key="success"
                 initial={{ opacity: 0, scale: 0.9 }}
                 animate={{ opacity: 1, scale: 1 }}
                 className="hypr-card p-12 border-emerald-500/30 bg-emerald-500/[0.03] text-center space-y-8"
               >
                  <div className="w-24 h-24 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto shadow-[0_0_40px_rgba(52,211,153,0.2)]">
                     <Check className="w-12 h-12 text-emerald-400" />
                  </div>
                  <div className="space-y-4">
                     <h3 className="text-4xl font-display font-bold italic tracking-tighter">Payment <span className="text-emerald-400">Verified</span></h3>
                     <p className="text-white/40 font-light italic">"Neural bridge established. All elite sub-routines are now visible."</p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-2xl">
                     <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Redirecting to Intelligence Hub...</p>
                  </div>
               </motion.div>
             )}
           </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function PremiumFeature({ icon: Icon, title, desc }: any) {
  return (
    <div className="p-8 bg-white/[0.02] border border-white/5 rounded-[2.5rem] space-y-6 hover:bg-white/[0.04] transition-all group">
       <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center group-hover:scale-110 group-hover:bg-brand-accent/10 transition-all">
          <Icon className="w-7 h-7 text-white/40 group-hover:text-brand-accent transition-colors" />
       </div>
       <div className="space-y-2">
          <h4 className="text-xl font-bold tracking-tight italic group-hover:text-brand-accent transition-colors">{title}</h4>
          <p className="text-xs text-white/30 leading-relaxed font-light">{desc}</p>
       </div>
    </div>
  );
}
