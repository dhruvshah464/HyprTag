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

import { useAuth } from '../lib/auth';
import { db } from '../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

export default function Connections() {
  const { user, profile } = useAuth();
  
  const connections = profile?.connections || {};

  const handleToggle = async (platformId: string, isConnected: boolean) => {
    if (!user) return;
    const userRef = doc(db, 'users', user.uid);
    await setDoc(userRef, {
      connections: {
        ...connections,
        [platformId]: !isConnected
      }
    }, { merge: true });
  };

  const PLATFORMS = [
    { 
      id: 'instagram', 
      name: 'Instagram', 
      icon: Instagram, 
      color: 'text-pink-500', 
      bg: 'bg-pink-500/10', 
      connected: !!connections.instagram,
      handle: profile?.socialHandles?.instagram || (!!connections.instagram ? '@linked_account' : null)
    },
    { 
      id: 'tiktok', 
      name: 'TikTok', 
      icon: MessageCircle, 
      color: 'text-[#ff0050]', 
      bg: 'bg-[#ff0050]/10', 
      connected: !!connections.tiktok,
      handle: profile?.socialHandles?.tiktok || (!!connections.tiktok ? '@linked_account' : null)
    },
    { 
      id: 'linkedin', 
      name: 'LinkedIn', 
      icon: Linkedin, 
      color: 'text-blue-600', 
      bg: 'bg-blue-600/10', 
      connected: !!connections.linkedin,
      handle: profile?.socialHandles?.linkedin || (!!connections.linkedin ? 'in/linked-account' : null)
    },
    { 
      id: 'twitter', 
      name: 'Twitter / X', 
      icon: Twitter, 
      color: 'text-sky-400', 
      bg: 'bg-sky-400/10', 
      connected: !!connections.twitter,
      handle: profile?.socialHandles?.twitter || (!!connections.twitter ? '@linked_account' : null)
    },
    { 
      id: 'meta', 
      name: 'Meta Business', 
      icon: Facebook, 
      color: 'text-blue-800', 
      bg: 'bg-blue-800/10', 
      connected: !!connections.meta,
      handle: profile?.socialHandles?.meta || (!!connections.meta ? 'Business Manager' : null)
    },
  ];
  return (
    <div className="max-w-4xl mx-auto space-y-16 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 text-left">
        <div className="space-y-4">
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-100 text-[10px] font-bold uppercase tracking-widest text-slate-400 shadow-sm">
              <Globe className="w-3 h-3 text-brand-accent" />
              API Synchronization
           </div>
           <h1 className="font-display font-bold text-4xl italic lowercase tracking-tighter text-slate-900">Social<span className="text-brand-accent">Hub</span></h1>
           <p className="text-slate-500 max-w-sm">Authorize and manage your multi-platform social ecosystem with high-fidelity sync.</p>
        </div>
        <div className="flex -space-x-3">
           {PLATFORMS.filter(p => p.connected).map(p => (
             <motion.div 
               whileHover={{ y: -5, zIndex: 10 }}
               key={p.id} 
               className={cn("w-12 h-12 rounded-full border-2 border-white flex items-center justify-center shadow-lg cursor-pointer bg-white", p.bg)}
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
            className="hypr-card p-8 flex items-center justify-between group hover:border-brand-accent/20 active:scale-[0.98] relative overflow-hidden bg-white border-slate-200 shadow-sm"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-full blur-3xl -z-10 group-hover:bg-brand-accent/5 transition-colors" />
            
            <div className="flex items-center gap-5">
               <div className={cn("w-16 h-16 rounded-[1.25rem] flex items-center justify-center transition-all duration-500 group-hover:scale-110 shadow-inner", platform.bg)}>
                  <platform.icon className={cn("w-8 h-8", platform.color)} />
               </div>
               <div className="space-y-1">
                  <h3 className="font-bold text-lg tracking-tight text-slate-800">{platform.name}</h3>
                  <div className="flex items-center gap-1.5 pt-0.5 text-left">
                     {platform.connected ? (
                       <div className="flex flex-col">
                         <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> 
                            Active Connection
                         </span>
                         <span className="text-[10px] text-slate-400 font-mono mt-1">
                           {platform.handle}
                         </span>
                       </div>
                     ) : (
                       <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest flex items-center gap-1.5">
                          <AlertCircle className="w-3 h-3" /> Link Required
                       </span>
                     )}
                  </div>
               </div>
            </div>
            
            <button 
              onClick={() => handleToggle(platform.id, platform.connected)}
              className={cn(
                "px-6 py-3 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] flex items-center gap-2 transition-all border",
                platform.connected 
                  ? "text-slate-400 hover:text-red-500 hover:bg-red-50 hover:border-red-100 border-transparent text-right" 
                  : "bg-slate-50 hover:bg-white border-slate-100 hover:border-brand-accent text-slate-600 hover:text-brand-accent shadow-sm"
              )}
            >
               {platform.connected ? "Revoke" : "Authorize"}
               {!platform.connected && <ArrowRightIcon className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />}
            </button>
          </motion.div>
        ))}
        
        <div className="hypr-card p-8 border-dashed border-slate-200 flex flex-col items-center justify-center gap-4 text-center group cursor-pointer hover:bg-slate-50 hover:border-brand-accent/30 transition-all bg-transparent shadow-none">
           <div className="w-14 h-14 rounded-full border border-slate-200 flex items-center justify-center text-slate-300 group-hover:text-brand-accent group-hover:border-brand-accent transition-all">
              <Plus className="w-6 h-6" />
           </div>
           <div className="space-y-1">
              <p className="font-bold text-sm tracking-tight text-slate-800">Add Meta Ads</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Connect for Pixel Data</p>
           </div>
        </div>
      </div>

      <div className="hypr-card p-10 bg-white border-slate-200 relative overflow-hidden group shadow-md">
         <div className="absolute top-[-20%] right-[-10%] p-8 opacity-[0.03] transition-transform duration-700 group-hover:scale-110 shadow-inner">
            <Share2 className="w-48 h-48 text-brand-accent" />
         </div>
         <div className="max-w-xl relative z-10 space-y-6 text-left">
            <div className="inline-flex items-center gap-3">
               <div className="p-2 bg-brand-accent/10 rounded-xl">
                  <Zap className="w-6 h-6 text-brand-accent fill-current" />
               </div>
               <h3 className="font-display font-bold text-2xl lowercase tracking-tighter text-slate-900">Auto-Sync <span className="text-slate-400">Protocol</span></h3>
            </div>
            <p className="text-slate-500 leading-relaxed font-light text-base">
              HyprTags automatically aggregates engagement cross-signals from your connected endpoints every 6 hours. This refined data stream powers our neural velocity predictors.
            </p>
            <div className="flex items-center gap-10 pt-4">
               <div className="flex items-center gap-4 pointer-events-none opacity-50">
                  <div className="w-10 h-5 bg-slate-200 rounded-full relative p-1 shadow-inner">
                     <div className="w-3 h-3 bg-white rounded-full ml-auto shadow-sm" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Background Engine</span>
               </div>
               <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Next resonance: 2h 45m</div>
            </div>
         </div>
      </div>
    </div>
  );
}
