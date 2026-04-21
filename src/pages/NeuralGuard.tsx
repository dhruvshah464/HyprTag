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
  Sparkles,
  Activity,
  ChevronRight
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
         
         <div className="w-24 h-24 rounded-3xl bg-white border border-slate-100 flex items-center justify-center relative group shadow-sm">
            <ShieldCheck className="w-12 h-12 text-slate-200 group-hover:text-brand-accent transition-colors" />
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 p-2 bg-slate-900 border border-slate-800 rounded-xl">
               <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest px-2">Elite Locked</span>
            </div>
         </div>

         <div className="space-y-4 max-w-xl">
            <h2 className="text-5xl font-display font-bold italic tracking-tighter text-slate-900">Neural <span className="text-brand-accent">Guard</span></h2>
            <p className="text-xl text-slate-500 font-light italic leading-relaxed">
              "Proprietary deep-scan technology that identifies hashtag suppression signatures before they compromise your reach visibility."
            </p>
         </div>

         <Link to="/upgrade" className="btn-hypr-primary h-16 px-12 text-xs font-bold uppercase tracking-[0.25em] flex items-center gap-3 shadow-xl shadow-brand-accent/20">
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
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-[10px] font-bold uppercase tracking-widest text-emerald-600 shadow-sm">
              <ShieldCheck className="w-3 h-3 fill-current" />
              Elite Security Protocol
           </div>
           <h1 className="font-display font-bold text-4xl italic lowercase tracking-tighter text-slate-900">Neural<span className="text-brand-accent">Guard</span></h1>
           <p className="text-slate-500 max-w-md">Deep-scan your hashtag clusters for suppression signatures and algorithmic traps.</p>
        </div>
      </div>

      <div className="hypr-card p-10 space-y-10 border-slate-200 bg-white shadow-sm text-left">
         <div className="space-y-6">
            <label className="hypr-label ml-1 text-slate-400">Input Cluster for Calibration</label>
            <div className="relative">
               <textarea 
                 value={hashtags}
                 onChange={(e) => setHashtags(e.target.value)}
                 placeholder="#marketing #growth #neural #saas..."
                 className="hypr-input w-full min-h-[120px] text-xl font-light italic bg-slate-50 border-slate-200 focus:bg-white text-slate-900"
               />
               <button 
                 onClick={handleScan}
                 disabled={scanning || !hashtags}
                 className="absolute bottom-4 right-4 h-12 px-8 bg-brand-accent text-white rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 hover:scale-[1.05] active:scale-[0.95] transition-all disabled:opacity-50 shadow-lg shadow-brand-accent/20"
               >
                  {scanning ? <RefreshCw className="w-4 h-4 animate-spin" /> : <><Search className="w-4 h-4" /> Execute Scan</>}
               </button>
            </div>
         </div>

         {result && (
           <motion.div 
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6 border-t border-slate-100"
           >
              <div className="p-6 bg-slate-50 border border-slate-100 rounded-2xl">
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Overall Integrity</p>
                 <div className="flex items-center gap-3">
                    <div className={cn("w-3 h-3 rounded-full", result.overall === 'Safe' ? 'bg-emerald-500' : 'bg-orange-500')} />
                    <span className="text-2xl font-display font-bold italic text-slate-900">{result.overall}</span>
                 </div>
              </div>
              <div className="p-6 bg-slate-50 border border-slate-100 rounded-2xl">
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Visibility Score</p>
                 <div className="flex items-end gap-1">
                    <span className="text-3xl font-display font-bold italic text-brand-accent">{result.score}%</span>
                    <span className="text-[10px] font-bold text-slate-300 mb-2 lowercase tracking-tighter font-mono">Optimal Velocity</span>
                 </div>
              </div>
              <div className="p-6 bg-slate-50 border border-slate-100 rounded-2xl">
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Detected Risks</p>
                 <div className="flex gap-2">
                    {result.detected.map((d: any, i: number) => (
                      <span key={i} className="text-[10px] font-bold text-slate-500 bg-white px-2 py-1 rounded-lg border border-slate-100 italic">
                        #{d.tag}: {d.risk}
                      </span>
                    ))}
                 </div>
              </div>
           </motion.div>
         )}
      </div>

      {/* Elite Monitor Section */}
      {isElite && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
           <div className="flex justify-between items-center px-4">
              <h3 className="text-xs font-bold uppercase tracking-[0.4em] text-slate-400">Tactical Shadow Overwatch</h3>
              <div className="flex items-center gap-4">
                 <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Global Nodes Online
                 </span>
                 <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">Latency: 14ms</span>
              </div>
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-left">
              <div className="lg:col-span-2 hypr-card p-0 bg-slate-900 border-slate-800 shadow-2xl relative overflow-hidden h-[400px]">
                 <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <motion.div 
                      animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.3, 0.1] }}
                      transition={{ duration: 4, repeat: Infinity }}
                      className="w-[500px] h-[500px] border border-brand-accent/30 rounded-full"
                    />
                    <div className="w-4 h-4 bg-brand-accent rounded-full shadow-[0_0_20px_rgba(96,165,250,0.8)]" />
                 </div>

                 <div className="relative z-10 p-10 h-full flex flex-col justify-between">
                    <div className="space-y-1">
                       <h4 className="text-xs font-bold text-brand-accent uppercase tracking-[0.3em] font-mono">Neural Suppression Map</h4>
                       <p className="text-[10px] text-slate-500 font-light italic tracking-tight">"Strategic signal scanning across 14 geographic data nodes."</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                       <MonitoringNode label="NA Cluster" strength="98%" status="Nominal" />
                       <MonitoringNode label="EU Segment" strength="94%" status="Optimal" />
                       <MonitoringNode label="APAC Hub" strength="89%" status="Nominal" />
                       <MonitoringNode label="Global Sync" strength="100%" status="Locked" />
                    </div>
                 </div>
              </div>

              <div className="hypr-card p-8 bg-white border-slate-200 space-y-6 text-left">
                 <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-4">Live Threat Stream</h4>
                 <div className="space-y-4">
                    <ThreatItem tag="trending" type="Viral Decelerator" risk="Critical" />
                    <ThreatItem tag="marketing" type="Logic Sync Error" risk="Low" />
                    <ThreatItem tag="neural" type="None Detected" risk="Zero" isSafe />
                    <ThreatItem tag="growth" type="Suppression Ghost" risk="Moderate" />
                 </div>
              </div>
           </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <div className="hypr-card p-10 space-y-6 bg-white border-slate-200 shadow-sm text-left">
            <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-slate-400">Security Sub-Routines</h3>
            <div className="space-y-4">
               <SecurityItem icon={Globe} title="Domain Extraction" status="Enabled" />
               <SecurityItem icon={RefreshCw} title="Shadowban Sync" status="Operational" />
               <SecurityItem icon={Cpu} title="Deep Core Parsing" status="Scanning..." />
            </div>
         </div>
         <div className="hypr-card p-10 bg-brand-accent/5 border-brand-accent/10 flex flex-col items-center justify-center text-center gap-6 shadow-sm overflow-hidden relative">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-brand-accent/10 rounded-full blur-[100px]" />
            <Sparkles className="w-12 h-12 text-brand-accent animate-pulse relative z-10" />
            <div className="space-y-2 relative z-10">
               <h4 className="text-2xl font-display font-bold italic tracking-tight text-slate-900">Proactive Suppression Protection</h4>
               <p className="text-xs text-slate-500 max-w-xs leading-relaxed italic">
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
       <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center shadow-sm">
          <Icon className="w-5 h-5 text-slate-300" />
       </div>
       <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{label}</span>
    </div>
  );
}

function SecurityItem({ icon: Icon, title, status }: any) {
  return (
    <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-xl group hover:bg-white hover:border-brand-accent/30 transition-all shadow-sm">
       <div className="flex items-center gap-4">
          <Icon className="w-4 h-4 text-slate-400 group-hover:text-brand-accent transition-colors" />
          <span className="text-xs font-bold text-slate-700 tracking-tight">{title}</span>
       </div>
       <span className="text-[9px] font-mono font-bold text-emerald-500 uppercase">{status}</span>
    </div>
  );
}

function MonitoringNode({ label, strength, status }: { label: string, strength: string, status: string }) {
  return (
    <div className="p-4 bg-slate-800/50 border border-slate-700 rounded-xl text-left space-y-1">
       <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">{label}</p>
       <p className="text-lg font-display font-bold text-white italic">{strength}</p>
       <p className="text-[8px] font-bold text-brand-accent uppercase">{status}</p>
    </div>
  );
}

function ThreatItem({ tag, type, risk, isSafe }: { tag: string, type: string, risk: string, isSafe?: boolean }) {
  return (
    <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-xl">
       <div className="space-y-0.5">
          <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest font-mono">#{tag}</p>
          <p className="text-xs font-bold text-slate-800 tracking-tight">{type}</p>
       </div>
       <div className={cn(
         "px-2 py-1 rounded-lg border text-[8px] font-bold uppercase",
         isSafe ? "bg-emerald-50 border-emerald-100 text-emerald-500" : "bg-red-50 border-red-100 text-red-500"
       )}>
          {risk}
       </div>
    </div>
  );
}
