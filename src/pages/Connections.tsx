import React from 'react';
import { motion } from 'motion/react';
import { 
  Instagram, 
  Twitter, 
  Linkedin, 
  Facebook, 
  Globe, 
  CheckCircle2, 
  AlertCircle, 
  Plus, 
  ArrowRight as ArrowRightIcon,
  Zap,
  MessageCircle,
  Share2
} from 'lucide-react';
import { cn } from '../lib/utils';

const PLATFORMS = [
  { 
    id: 'instagram', 
    name: 'Instagram', 
    icon: Instagram, 
    color: 'text-pink-500', 
    bg: 'bg-pink-500/10', 
    connected: true,
    handle: '@creator_digital'
  },
  { 
    id: 'tiktok', 
    name: 'TikTok', 
    icon: MessageCircle, 
    color: 'text-[#ff0050]', 
    bg: 'bg-[#ff0050]/10', 
    connected: false,
    handle: null
  },
  { 
    id: 'linkedin', 
    name: 'LinkedIn', 
    icon: Linkedin, 
    color: 'text-blue-600', 
    bg: 'bg-blue-600/10', 
    connected: true,
    handle: 'in/creator-official'
  },
  { 
    id: 'twitter', 
    name: 'Twitter / X', 
    icon: Twitter, 
    color: 'text-sky-400', 
    bg: 'bg-sky-400/10', 
    connected: false,
    handle: null
  },
  { 
    id: 'meta', 
    name: 'Meta Business', 
    icon: Facebook, 
    color: 'text-blue-800', 
    bg: 'bg-blue-800/10', 
    connected: false,
    handle: null
  },
];

export default function Connections() {
  return (
    <div className="max-w-4xl mx-auto space-y-16 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 text-left">
        <div className="space-y-4">
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-white/40">
              <Globe className="w-3 h-3 text-brand-accent" />
              API Synchronization
           </div>
           <h1 className="font-display font-bold text-4xl italic lowercase tracking-tighter">Social<span className="text-brand-accent">Hub</span></h1>
           <p className="text-white/40 max-w-sm">Authorize and manage your multi-platform social ecosystem with high-fidelity sync.</p>
        </div>
        <div className="flex -space-x-3">
           {PLATFORMS.filter(p => p.connected).map(p => (
             <motion.div 
               whileHover={{ y: -5, zIndex: 10 }}
               key={p.id} 
               className={cn("w-12 h-12 rounded-full border-2 border-bg-main flex items-center justify-center shadow-2xl cursor-pointer bg-bg-card", p.bg)}
             >
                <p.icon className={cn("w-6 h-6", p.color)} />
             </motion.div>
           ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {PLATFORMS.map((platform) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            key={platform.id} 
            className="hypr-card p-8 flex items-center justify-between group hover:border-white/10 active:scale-[0.98] relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/[0.01] rounded-full blur-3xl -z-10 group-hover:bg-white/[0.03] transition-colors" />
            
            <div className="flex items-center gap-5">
               <div className={cn("w-16 h-16 rounded-[1.25rem] flex items-center justify-center transition-all duration-500 group-hover:scale-110 shadow-inner", platform.bg)}>
                  <platform.icon className={cn("w-8 h-8", platform.color)} />
               </div>
               <div className="space-y-1">
                  <h3 className="font-bold text-lg tracking-tight">{platform.name}</h3>
                  <div className="flex items-center gap-1.5 pt-0.5">
                     {platform.connected ? (
                       <div className="flex flex-col">
                         <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> 
                            Active Connection
                         </span>
                         <span className="text-[10px] text-white/20 font-mono mt-1">{platform.handle}</span>
                       </div>
                     ) : (
                       <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest flex items-center gap-1.5">
                          <AlertCircle className="w-3 h-3" /> Link Required
                       </span>
                     )}
                  </div>
               </div>
            </div>
            
            {platform.connected ? (
              <button className="text-[10px] font-bold text-white/20 hover:text-brand-accent uppercase tracking-[0.2em] transition-colors px-4 py-2 hover:bg-brand-accent/5 rounded-lg">Revoke</button>
            ) : (
              <button className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] flex items-center gap-2 group/btn transition-all">
                 Authorize <ArrowRightIcon className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
              </button>
            )}
          </motion.div>
        ))}
        
        <div className="hypr-card p-8 border-dashed border-white/5 flex flex-col items-center justify-center gap-4 text-center group cursor-pointer hover:bg-white/[0.01] hover:border-white/10 transition-all">
           <div className="w-14 h-14 rounded-full border border-white/5 flex items-center justify-center text-white/10 group-hover:text-white group-hover:border-white/10 transition-all">
              <Plus className="w-6 h-6" />
           </div>
           <div className="space-y-1">
              <p className="font-bold text-sm tracking-tight">Add Meta Ads</p>
              <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Connect for Pixel Data</p>
           </div>
        </div>
      </div>

      {/* Auto-Sync Banner */}
      <div className="hypr-card p-10 bg-white/[0.01] border-white/5 relative overflow-hidden group">
         <div className="absolute top-[-20%] right-[-10%] p-8 opacity-5 transition-transform duration-700 group-hover:scale-110">
            <Share2 className="w-48 h-48 text-white" />
         </div>
         <div className="max-w-xl relative z-10 space-y-6">
            <div className="inline-flex items-center gap-3">
               <div className="p-2 bg-brand-accent/10 rounded-xl">
                  <Zap className="w-6 h-6 text-brand-accent fill-current" />
               </div>
               <h3 className="font-display font-bold text-2xl lowercase tracking-tighter">Auto-Sync <span className="text-white/40">Protocol</span></h3>
            </div>
            <p className="text-white/40 leading-relaxed font-light text-base">
              HyprTags automatically aggregates engagement cross-signals from your connected endpoints every 6 hours. This refined data stream powers our neural velocity predictors.
            </p>
            <div className="flex items-center gap-10 pt-4">
               <div className="flex items-center gap-4 pointer-events-none opacity-50">
                  <div className="w-10 h-5 bg-white/20 rounded-full relative p-1">
                     <div className="w-3 h-3 bg-white rounded-full ml-auto" />
                  </div>
                  <span className="text-[10px] font-bold text-white uppercase tracking-[0.2em]">Background Engine</span>
               </div>
               <div className="text-[10px] font-mono text-white/20 uppercase tracking-widest">Next resonance: 2h 45m</div>
            </div>
         </div>
      </div>
    </div>
  );
}
