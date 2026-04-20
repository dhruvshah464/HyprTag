import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, 
  Search, 
  AlertCircle, 
  CheckCircle2, 
  XCircle,
  Zap,
  Globe,
  RefreshCw,
  Cpu,
  ArrowUpRight,
  Sparkles
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuth } from '../lib/auth';
import { Link } from 'react-router-dom';

const PLATFORMS = [
  { id: 'ig', label: 'Instagram', icon: Globe },
  { id: 'tt', label: 'TikTok', icon: Zap },
  { id: 'fb', label: 'Facebook', icon: Globe },
  { id: 'li', label: 'LinkedIn', icon: Globe }
];

export default function NeuralGuard() {
  const { isElite } = useAuth();
  const [hashtags, setHashtags] = useState('');
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleScan = async () => {
    if (!hashtags) return;
    setScanning(true);
    // Simulate neural scan
    await new Promise(r => setTimeout(r, 2500));
    const list = hashtags.split(' ').map(t => t.trim().replace('#', ''));
    
    setResult({
      overall: list.length > 5 ? 'High' : 'Safe',
      score: Math.floor(Math.random() * 30 + 70),
      detected: list.slice(0, 2).map(t => ({ tag: t, risk: Math.random() > 0.7 ? 'Moderate' : 'Low' })),
      recommendation: "Cluster density represents optimal variance. No suppression signatures detected."
    });
    setScanning(false);
  };

  if (!isElite) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 text-center space-y-10 relative overflow-hidden">
         <div className="absolute inset-0 bg-brand-accent/[0.02] rounded-full blur-[160px] -z-10" />
         
         <div className="w-24 h-24 rounded-3xl bg-white/5 border border-white/5 flex items-center justify-center relative group">
            <ShieldCheck className="w-12 h-12 text-white/10 group-hover:text-brand-accent transition-colors" />
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 p-2 bg-[#09090b] border border-white/10 rounded-xl">
               <span className="text-[8px] font-bold text-white/50 uppercase tracking-widest px-2">Elite Locked</span>
            </div>
         </div>

         <div className="space-y-4 max-w-xl">
            <h2 className="text-5xl font-display font-bold italic tracking-tighter">Neural <span className="text-brand-accent">Guard</span></h2>
            <p className="text-xl text-white/40 font-light italic leading-relaxed">
              "Proprietary deep-scan technology that identifies hashtag suppression signatures before they compromise your reach visibility."
            </p>
         </div>

         <Link to="/upgrade" className="btn-hypr-primary h-16 px-12 text-xs font-bold uppercase tracking-[0.25em] flex items-center gap-3">
            Initialize Security Protocols <ArrowUpRight className="w-4 h-4" />
         </Link>

         <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-12">
            <FeatureMini icon={Search} label="Index Check" />
            <FeatureMini icon={AlertCircle} label="Shadowban Predict" />
            <FeatureMini icon={Sparkles} label="Cluster Optimization" />
            <FeatureMini icon={RefreshCw} label="Real-Time Sync" />
         </div>
      </div>
    );
  }

  return (
    <div className="space-y-12 max-w-6xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 text-left">
        <div className="space-y-4">
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold uppercase tracking-widest text-emerald-400">
              <ShieldCheck className="w-3 h-3 fill-current" />
              Elite Security Protocol
           </div>
           <h1 className="font-display font-bold text-4xl italic lowercase tracking-tighter">Neural<span className="text-brand-accent">Guard</span></h1>
           <p className="text-white/40 max-w-md">Deep-scan your hashtag clusters for suppression signatures and algorithmic traps.</p>
        </div>
      </div>

      <div className="hypr-card p-10 space-y-10 border-white/10 bg-white/[0.01]">
         <div className="space-y-6">
            <label className="hypr-label ml-1">Input Cluster for Calibration</label>
            <div className="relative">
               <textarea 
                 value={hashtags}
                 onChange={(e) => setHashtags(e.target.value)}
                 placeholder="#marketing #growth #neural #saas..."
                 className="hypr-input w-full min-h-[120px] text-xl font-light italic"
               />
               <button 
                 onClick={handleScan}
                 disabled={scanning || !hashtags}
                 className="absolute bottom-4 right-4 h-12 px-8 bg-brand-accent text-white rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 hover:scale-[1.05] active:scale-[0.95] transition-all disabled:opacity-50"
               >
                  {scanning ? <RefreshCw className="w-4 h-4 animate-spin" /> : <><Search className="w-4 h-4" /> Execute Scan</>}
               </button>
            </div>
         </div>

         {result && (
           <motion.div 
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6 border-t border-white/5"
           >
              <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
                 <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest mb-4">Overall Integrity</p>
                 <div className="flex items-center gap-3">
                    <div className={cn("w-3 h-3 rounded-full", result.overall === 'Safe' ? 'bg-emerald-500' : 'bg-orange-500')} />
                    <span className="text-2xl font-display font-bold italic">{result.overall}</span>
                 </div>
              </div>
              <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
                 <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest mb-4">Visibility Score</p>
                 <div className="flex items-end gap-1">
                    <span className="text-3xl font-display font-bold italic text-brand-accent">{result.score}%</span>
                    <span className="text-[10px] font-bold text-white/20 mb-2">Optimal</span>
                 </div>
              </div>
              <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
                 <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest mb-4">Detected Risks</p>
                 <div className="flex gap-2">
                    {result.detected.map((d: any, i: number) => (
                      <span key={i} className="text-[10px] font-bold text-white/50 bg-white/5 px-2 py-1 rounded-lg border border-white/5">
                        #{d.tag}: {d.risk}
                      </span>
                    ))}
                 </div>
              </div>
           </motion.div>
         )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <div className="hypr-card p-10 space-y-6 bg-white/[0.01]">
            <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-white/40">Security Sub-Routines</h3>
            <div className="space-y-4">
               <SecurityItem icon={Globe} title="Domain Extraction" status="Enabled" />
               <SecurityItem icon={RefreshCw} title="Shadowban Sync" status="Operational" />
               <SecurityItem icon={Cpu} title="Deep Core Parsing" status="Scanning..." />
            </div>
         </div>
         <div className="hypr-card p-10 bg-brand-accent/10 border-brand-accent/20 flex flex-col items-center justify-center text-center gap-6">
            <Sparkles className="w-12 h-12 text-brand-accent animate-pulse" />
            <div className="space-y-2">
               <h4 className="text-2xl font-display font-bold italic tracking-tight">Proactive Suppression Protection</h4>
               <p className="text-xs text-white/40 max-w-xs leading-relaxed italic">
                 NeuralGuard automatically adjusts your suggested hashtags to avoid daily algorithmic volatility.
               </p>
            </div>
         </div>
      </div>
    </div>
  );
}

function FeatureMini({ icon: Icon, label }: any) {
  return (
    <div className="flex flex-col items-center gap-3">
       <div className="w-12 h-12 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-center">
          <Icon className="w-5 h-5 text-white/20" />
       </div>
       <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest">{label}</span>
    </div>
  );
}

function SecurityItem({ icon: Icon, title, status }: any) {
  return (
    <div className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-xl group hover:bg-white/[0.04] transition-all">
       <div className="flex items-center gap-4">
          <Icon className="w-4 h-4 text-white/20 group-hover:text-brand-accent transition-colors" />
          <span className="text-xs font-bold text-white/60 tracking-tight">{title}</span>
       </div>
       <span className="text-[9px] font-mono font-bold text-emerald-500/60 uppercase">{status}</span>
    </div>
  );
}
