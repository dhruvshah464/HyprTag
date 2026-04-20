import React, { useState } from 'react';
import { motion } from 'motion/react';
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
    accent: 'text-white/40'
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
  return (
    <div className="space-y-16 pb-20 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 text-left">
        <div className="space-y-4">
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-white/40">
              <Zap className="w-3 h-3 text-brand-accent fill-current" />
              Neural Flow Protocol
           </div>
           <h1 className="font-display font-bold text-4xl italic lowercase tracking-tighter">Active<span className="text-brand-accent">Automations</span></h1>
           <p className="text-white/40 max-w-sm">Deploy autonomous sub-routines to manage your strategic growth 24/7.</p>
        </div>
        <button className="btn-hypr-primary h-12 px-8 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
           <Plus className="w-4 h-4" /> Create Flow
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {AUTOMATIONS.map((item) => (
          <div key={item.id} className="hypr-card p-10 flex flex-col group hover:border-white/20 transition-all cursor-pointer relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <item.icon className="w-20 h-20" />
             </div>
             
             <div className="w-16 h-16 rounded-[1.5rem] bg-white/[0.02] border border-white/5 flex items-center justify-center mb-10 group-hover:bg-white/[0.04] transition-colors">
                <item.icon className={cn("w-7 h-7", item.accent)} />
             </div>
             
             <div className="space-y-4 flex-grow">
               <h3 className="font-bold text-2xl italic tracking-tight">{item.title}</h3>
               <p className="text-base text-white/40 font-light leading-relaxed mb-10">{item.description}</p>
             </div>

             <div className="pt-8 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                   <div className={cn("w-2 h-2 rounded-full", item.status === 'Active' ? 'bg-brand-accent shadow-[0_0_10px_rgba(96,165,250,0.5)]' : 'bg-white/10')} />
                   <span className={cn("text-[10px] font-bold uppercase tracking-widest", item.status === 'Active' ? 'text-white' : 'text-white/20')}>
                      {item.status}
                   </span>
                </div>
                <button className={cn(
                  "w-12 h-6 rounded-full border transition-all flex items-center px-1",
                  item.status === 'Active' ? 'bg-brand-accent/20 border-brand-accent/30' : 'bg-white/5 border-white/10'
                )}>
                   <div className={cn("w-4 h-4 rounded-full transition-all", item.status === 'Active' ? 'bg-brand-accent translate-x-6' : 'bg-white/20')} />
                </button>
             </div>
          </div>
        ))}
      </div>

      <div className="hypr-card p-12 border-brand-accent/20 bg-brand-accent/[0.02] relative overflow-hidden group">
         <div className="absolute -top-32 -right-32 w-96 h-96 bg-brand-accent/10 rounded-full blur-[160px] group-hover:bg-brand-accent/20 transition-all duration-700" />
         
         <div className="max-w-xl relative z-10 space-y-10">
            <div className="space-y-6">
              <h3 className="font-display font-bold text-4xl italic flex items-center gap-4 tracking-tighter">
                 <Sparkles className="text-brand-accent w-10 h-10 animate-pulse" />
                 HyprTags <span className="text-brand-accent">Elite</span>
              </h3>
              <p className="text-white/50 text-xl leading-relaxed font-light italic">
                 "Bridge the cross-platform divide. Identify viral signals on TikTok before they reach the Instagram saturation point."
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <FeatureHighlight icon={ShieldCheck} label="Ghost-Ban Guard" />
               <FeatureHighlight icon={Cpu} label="Neural Recaptioning" />
               <FeatureHighlight icon={Layers} label="Multi-Org Sync" />
               <FeatureHighlight icon={TrendingUp} label="ROI Projection" />
            </div>

            <button className="btn-hypr-primary px-10 h-14 text-xs font-bold uppercase tracking-[0.2em] flex items-center gap-3 group shadow-2xl shadow-brand-accent/20">
               Initialize Elite Access ($9/mo) <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
         </div>
      </div>
    </div>
  );
}

function FeatureHighlight({ icon: Icon, label }: any) {
  return (
    <div className="flex items-center gap-4 group/item">
       <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center group-hover/item:border-brand-accent/30 transition-all">
          <Icon className="w-4 h-4 text-white/30 group-hover/item:text-brand-accent transition-colors" />
       </div>
       <span className="text-xs font-bold text-white/40 group-hover/item:text-white transition-colors uppercase tracking-widest">{label}</span>
    </div>
  );
}
