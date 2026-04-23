import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Zap, 
  Clock, 
  Bell, 
  ShieldCheck, 
  ArrowRight,
  TrendingUp,
  Cpu,
  BarChart,
  Layers,
  Sparkles,
  Plus,
  Power
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuth } from '../lib/auth';
import { useNavigate } from 'react-router-dom';

const AUTOMATIONS = [
  {
    id: 'trend-alert',
    title: 'Velocity Trigger',
    description: 'Real-time notifications sent via WebSocket when a hashtag in your neural cluster exceeds 85% growth threshold.',
    status: 'Active',
    icon: Bell,
    accent: 'text-brand-accent'
  },
  {
    id: 'auto-optimize',
    title: 'Adaptive Captioning',
    description: 'Proprietary AI context-aware recycler that re-architects your top-performing captions for multi-platform resonance.',
    status: 'Standby',
    icon: Cpu,
    accent: 'text-slate-400'
  },
  {
    id: 'optimal-post',
    title: 'Peak Signal Sync',
    description: 'Synchronization protocol that aligns your post sequence with projected global audience peak connectivity.',
    status: 'Enabled',
    icon: Clock,
    accent: 'text-brand-accent'
  }
];

export default function Automations() {
  const { isElite } = useAuth();
  const navigate = useNavigate();
  const [showCreateModal, setShowCreateModal] = useState(false);

  return (
    <div className="space-y-16 pb-20 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 text-left">
        <div className="space-y-4">
           {isElite ? (
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-[10px] font-bold uppercase tracking-widest text-emerald-600 shadow-sm">
                <ShieldCheck className="w-3 h-3 animate-pulse" />
                Elite Core Active: Unrestricted Flows
             </div>
           ) : (
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-accent/5 border border-brand-accent/20 text-[10px] font-bold uppercase tracking-widest text-brand-accent">
                <Zap className="w-3 h-3 text-brand-accent fill-current" />
                Neural Flow Protocol
             </div>
           )}
           <h1 className="font-display font-bold text-4xl italic lowercase tracking-tighter text-slate-900">Active<span className="text-brand-accent">Automations</span></h1>
           <p className="text-slate-500 max-w-sm">Deploy autonomous sub-routines to manage your strategic growth 24/7.</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="btn-hypr-primary h-12 px-8 text-xs font-bold uppercase tracking-widest flex items-center gap-2"
        >
           <Plus className="w-4 h-4" /> Create Flow
        </button>
      </div>

      {/* Creation Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-6"
          >
             <motion.div 
               initial={{ scale: 0.9, opacity: 0, y: 20 }}
               animate={{ scale: 1, opacity: 1, y: 0 }}
               exit={{ scale: 0.9, opacity: 0, y: 20 }}
               className="w-full max-w-lg bg-white border border-slate-200 rounded-[2.5rem] p-12 shadow-2xl relative"
             >
                <button 
                  onClick={() => setShowCreateModal(false)}
                  className="absolute top-8 right-8 p-2 text-slate-400 hover:text-slate-900 transition-colors"
                >
                   <Plus className="w-6 h-6 rotate-45" />
                </button>

                <div className="space-y-8">
                   <div className="space-y-3">
                      <div className="w-12 h-12 rounded-2xl bg-brand-accent/10 flex items-center justify-center border border-brand-accent/20">
                         <Zap className="w-6 h-6 text-brand-accent" />
                      </div>
                      <h3 className="text-2xl font-display font-bold italic tracking-tight text-slate-900">New Neural <span className="text-brand-accent">Flow</span></h3>
                      <p className="text-sm text-slate-500 leading-relaxed font-light italic">"Specify the growth trigger and autonomous response sequence."</p>
                   </div>

                   <div className="space-y-6">
                      <div className="space-y-3">
                         <label className="hypr-label ml-1">Flow Identity</label>
                         <input type="text" placeholder="e.g. VIRAL_PULSE_GUARD" className="hypr-input text-sm font-mono tracking-widest" />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                         <div className="space-y-3 text-left">
                            <label className="hypr-label ml-1">Trigger Signal</label>
                            <select className="hypr-input text-xs font-bold uppercase tracking-widest bg-white">
                               <option>Engagement Threshold</option>
                               <option>Velocity Spike</option>
                               <option>Schedule Conflict</option>
                            </select>
                         </div>
                         <div className="space-y-3 text-left">
                            <label className="hypr-label ml-1">Response Mode</label>
                            <select className="hypr-input text-xs font-bold uppercase tracking-widest bg-white">
                               <option>Auto-Update</option>
                               <option>Neural Notify</option>
                               <option>Bypass Protocol</option>
                            </select>
                         </div>
                      </div>

                      <button 
                        onClick={() => setShowCreateModal(false)}
                        className="w-full h-16 bg-brand-accent text-white rounded-2xl font-bold uppercase tracking-[0.3em] shadow-xl shadow-brand-accent/20 hover:scale-[1.02] active:scale-[0.98] transition-all text-xs"
                      >
                         Deploy Automation
                      </button>
                   </div>
                </div>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

       <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {AUTOMATIONS.map((item) => (
          <div key={item.id} className="hypr-card p-10 flex flex-col group hover:border-brand-accent/20 transition-all cursor-pointer relative overflow-hidden bg-white border-slate-200 shadow-sm hover:shadow-xl">
             <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity">
                <item.icon className="w-20 h-20" />
             </div>
             
             <div className="w-16 h-16 rounded-[1.5rem] bg-slate-50 border border-slate-100 flex items-center justify-center mb-10 group-hover:bg-brand-accent/5 transition-colors">
                <item.icon className={cn("w-7 h-7", item.accent)} />
             </div>
             
             <div className="space-y-4 flex-grow">
               <h3 className="font-bold text-2xl italic tracking-tight text-slate-800">{item.title}</h3>
               <p className="text-base text-slate-500 font-light leading-relaxed mb-10">{item.description}</p>
             </div>

             <div className="pt-8 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                   <div className={cn("w-2 h-2 rounded-full", item.status === 'Active' ? 'bg-brand-accent shadow-[0_0_10px_rgba(96,165,250,0.5)]' : 'bg-slate-200')} />
                   <span className={cn("text-[10px] font-bold uppercase tracking-widest", item.status === 'Active' ? 'text-slate-900' : 'text-slate-400')}>
                      {item.status}
                   </span>
                </div>
                <button className={cn(
                  "w-12 h-6 rounded-full border transition-all flex items-center px-1 shadow-inner",
                  item.status === 'Active' ? 'bg-brand-accent/20 border-brand-accent/30' : 'bg-slate-100 border-slate-200'
                )}>
                   <div className={cn("w-4 h-4 rounded-full transition-all", item.status === 'Active' ? 'bg-brand-accent translate-x-6' : 'bg-slate-300')} />
                </button>
             </div>
          </div>
        ))}
      </div>

      {!isElite && (
        <div className="hypr-card p-12 border-brand-accent/20 bg-brand-accent/[0.02] relative overflow-hidden group shadow-2xl">
           <div className="absolute -top-32 -right-32 w-96 h-96 bg-brand-accent/10 rounded-full blur-[160px] group-hover:bg-brand-accent/20 transition-all duration-700" />
           
           <div className="max-w-xl relative z-10 space-y-10">
              <div className="space-y-6">
                <h3 className="font-display font-bold text-4xl italic flex items-center gap-4 tracking-tighter text-slate-900">
                   <Sparkles className="text-brand-accent w-10 h-10 animate-pulse" />
                   HyprTags <span className="text-brand-accent">Elite</span>
                </h3>
                <p className="text-slate-500 text-xl leading-relaxed font-light italic">
                   "Bridge the cross-platform divide. Identify viral signals on TikTok before they reach the Instagram saturation point."
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <FeatureHighlight icon={ShieldCheck} label="Ghost-Ban Guard" />
                 <FeatureHighlight icon={Cpu} label="Neural Recaptioning" />
                 <FeatureHighlight icon={Layers} label="Multi-Org Sync" />
                 <FeatureHighlight icon={TrendingUp} label="ROI Projection" />
              </div>

              <button 
                onClick={() => navigate('/upgrade')}
                className="btn-hypr-primary px-10 h-14 text-xs font-bold uppercase tracking-[0.2em] flex items-center gap-3 group shadow-xl shadow-brand-accent/20"
              >
                 Initialize Elite Access ($9/mo) <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
           </div>
        </div>
      )}
    </div>
  );
}

function FeatureHighlight({ icon: Icon, label }: any) {
  return (
    <div className="flex items-center gap-4 group/item">
       <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center group-hover/item:border-brand-accent/30 transition-all">
          <Icon className="w-4 h-4 text-slate-400 group-hover/item:text-brand-accent transition-colors" />
       </div>
       <span className="text-xs font-bold text-slate-400 group-hover/item:text-slate-900 transition-colors uppercase tracking-widest">{label}</span>
    </div>
  );
}
