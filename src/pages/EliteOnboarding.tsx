import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Zap, 
  ShieldCheck, 
  Cpu, 
  TrendingUp, 
  Layers, 
  ArrowRight,
  Check,
  Loader2,
  Sparkles,
  Command,
  Activity,
  Globe
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { cn } from '../lib/utils';

const PROTOCOLS = [
  {
    id: 'ghostban',
    icon: ShieldCheck,
    title: 'Ghost-Ban Guard',
    status: 'Initializing...',
  },
  {
    id: 'velocity',
    icon: TrendingUp,
    title: 'Viral Velocity Engine',
    status: 'Calibrating...',
  },
  {
    id: 'neural',
    icon: Cpu,
    title: 'Neural Sync Sub-routines',
    status: 'Loading...',
  },
  {
    id: 'multi',
    icon: Layers,
    title: 'Multi-Org Nexus',
    status: 'Mapping...',
  }
];

export default function EliteOnboarding() {
  const [phase, setPhase] = useState(1);
  const [loadingProtocol, setLoadingProtocol] = useState(0);
  const [completeProtocols, setCompleteProtocols] = useState<string[]>([]);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (phase === 2) {
      const interval = setInterval(() => {
        setLoadingProtocol(prev => {
          if (prev < PROTOCOLS.length) {
             setCompleteProtocols(curr => [...curr, PROTOCOLS[prev].id]);
          }
          
          if (prev >= PROTOCOLS.length - 1) {
            clearInterval(interval);
            setTimeout(() => setPhase(3), 1500);
            return prev;
          }
          return prev + 1;
        });
      }, 1500);
      return () => clearInterval(interval);
    }
  }, [phase]);

  const handleFinish = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Neural Network Background Implication */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-accent/10 rounded-full blur-[120px] mix-blend-screen opacity-50" />
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:32px_32px] opacity-10" />
      </div>

      <div className="relative z-10 w-full max-w-4xl">
        <AnimatePresence mode="wait">
          {phase === 1 && (
            <motion.div 
              key="phase1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
              className="text-center space-y-12"
            >
              <motion.div 
                animate={{ 
                  boxShadow: ['0 0 20px rgba(96,165,250,0.2)', '0 0 60px rgba(96,165,250,0.5)', '0 0 20px rgba(96,165,250,0.2)']
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-32 h-32 rounded-full border-2 border-brand-accent/50 flex items-center justify-center mx-auto bg-slate-900/50 backdrop-blur-xl"
              >
                <Zap className="w-16 h-16 text-brand-accent fill-brand-accent/20" />
              </motion.div>

              <div className="space-y-6">
                <h1 className="text-6xl md:text-8xl font-display font-bold italic tracking-tighter leading-none">
                  UPLINK <span className="text-brand-accent">VERIFIED.</span>
                </h1>
                <p className="text-xl text-slate-400 font-light max-w-xl mx-auto italic">
                  Digital presence authenticated. Transitioning to superior creator protocols.
                </p>
              </div>

              <div className="flex justify-center gap-2">
                 {[1, 2, 3].map(i => (
                   <motion.div 
                    key={i}
                    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 1, 0.3] }}
                    transition={{ delay: i * 0.2, repeat: Infinity }}
                    className="w-2 h-2 rounded-full bg-brand-accent"
                   />
                 ))}
              </div>

              <button 
                onClick={() => setPhase(2)}
                className="group relative px-12 py-6 bg-white text-slate-950 font-bold uppercase tracking-[0.4em] text-xs skew-x-[-12deg] overflow-hidden transition-all hover:skew-x-0"
              >
                <div className="absolute inset-0 bg-brand-accent translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500 origin-left" />
                <span className="relative z-10 flex items-center gap-3">
                  Initialize Elite OS <ArrowRight className="w-4 h-4" />
                </span>
              </button>
            </motion.div>
          )}

          {phase === 2 && (
            <motion.div 
              key="phase2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-16"
            >
              <div className="text-left space-y-4">
                <div className="flex items-center gap-3 text-brand-accent font-mono text-[10px] tracking-[0.5em] font-bold uppercase">
                  <Activity className="w-4 h-4 animate-pulse" /> Strategic Synchronization in Progress
                </div>
                <h2 className="text-5xl font-display font-bold italic tracking-tight">Deploying <span className="text-brand-accent border-b-2 border-brand-accent/30 pb-1">Protocols.</span></h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {PROTOCOLS.map((protocol, i) => (
                  <motion.div 
                    key={protocol.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className={cn(
                      "p-8 rounded-[2rem] border transition-all duration-500 flex flex-col gap-6",
                      completeProtocols.includes(protocol.id) 
                        ? "bg-emerald-500/5 border-emerald-500/20" 
                        : i === loadingProtocol 
                          ? "bg-brand-accent/5 border-brand-accent/40" 
                          : "bg-slate-900 border-slate-800 opacity-40 grayscale"
                    )}
                  >
                    <div className="flex justify-between items-start">
                      <div className={cn(
                        "w-12 h-12 rounded-2xl flex items-center justify-center",
                        completeProtocols.includes(protocol.id) ? "bg-emerald-500/20 text-emerald-500" : "bg-brand-accent/20 text-brand-accent"
                      )}>
                        <protocol.icon className="w-6 h-6" />
                      </div>
                      <div className="text-[10px] font-mono font-bold uppercase tracking-widest">
                        {completeProtocols.includes(protocol.id) ? (
                          <span className="text-emerald-500 flex items-center gap-1"><Check className="w-3 h-3" /> Ready</span>
                        ) : i === loadingProtocol ? (
                          <span className="text-brand-accent flex items-center gap-2"><Loader2 className="w-3 h-3 animate-spin" /> {protocol.status}</span>
                        ) : (
                          <span className="text-slate-500">Queued</span>
                        )}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-lg font-bold italic tracking-tight">{protocol.title}</h3>
                      <p className="text-[10px] text-slate-400 font-light leading-relaxed">System initialized at latency: 0.2ms</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Console Output Implication */}
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 font-mono text-[9px] text-brand-accent/50 space-y-1">
                <p>&gt; ELITE_PROFILE_SCAN_INIT: {user?.email}</p>
                <p>&gt; AUTH_LEVEL_HIERARCHY: LEVEL_9_COMMANDER</p>
                <p>&gt; NEURAL_LINK_INTEGRITY: 100%</p>
                <p>&gt; PROPRIETARY_ALGO_LOADED: INSTA_X_TIKTOK_SYNC_V4.2</p>
              </div>
            </motion.div>
          )}

          {phase === 3 && (
            <motion.div 
              key="phase3"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-16"
            >
              <div className="space-y-6">
                <motion.div 
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  className="w-40 h-40 bg-gradient-to-br from-emerald-400 to-brand-accent rounded-[3rem] mx-auto flex items-center justify-center shadow-[0_0_50px_rgba(52,211,153,0.3)]"
                >
                  <Check className="w-24 h-24 text-white" strokeWidth={3} />
                </motion.div>
                <div className="space-y-2">
                  <h2 className="text-5xl font-display font-bold italic tracking-tighter">ELITE PROTOCOLS <span className="text-emerald-400">ACTIVE.</span></h2>
                  <p className="text-slate-400 font-light italic">Welcome to the restricted tier of high-velocity influence.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <EliteQuickStat icon={Sparkles} label="Proprietary Tools" value="12 New" />
                <EliteQuickStat icon={Globe} label="Signal Reach" value="Global 360°" />
                <EliteQuickStat icon={Command} label="Priority Status" value="Tier 1" />
              </div>

              <button 
                onClick={handleFinish}
                className="group w-full max-w-sm h-20 bg-emerald-500 hover:bg-emerald-400 text-white font-bold uppercase tracking-[0.5em] text-xs flex items-center justify-center gap-4 transition-all shadow-2xl shadow-emerald-500/20"
              >
                Access Command Center <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function EliteQuickStat({ icon: Icon, label, value }: any) {
  return (
    <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-2 group hover:border-emerald-500/50 transition-colors">
       <Icon className="w-8 h-8 text-emerald-400 mx-auto group-hover:scale-110 transition-transform" />
       <div className="space-y-0.5">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{label}</p>
          <p className="text-lg font-bold italic text-white">{value}</p>
       </div>
    </div>
  );
}
