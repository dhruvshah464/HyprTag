import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Zap, 
  Sparkles, 
  Search, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Rocket, 
  TrendingUp,
  Brain,
  Timer,
  Loader2
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../lib/auth';
import { geminiService } from '../services/geminiService';

export default function ViralTest() {
  const [input, setInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const navigate = useNavigate();

  const handleTest = async () => {
    if (!input.trim()) return;
    setIsAnalyzing(true);
    
    try {
      const data = await geminiService.analyzeViralPotential(input);
      setResult({
        score: data.score,
        potential: data.score > 80 ? 'EXTREME' : data.score > 60 ? 'HIGH' : 'MODERATE',
        archetype: data.score > 80 ? 'Trend Setter' : 'Curator',
        feedback: data.analysis,
        improvements: [
          "Refine the hook to be more exclusionary",
          "Ensure visual pattern interrupt in first 1.5s",
          "Optimized for 8PM Peak-Attention peak"
        ]
      });
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 text-left">
      <div className="space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-neon/10 border border-brand-neon/30 text-[9px] font-mono uppercase tracking-[0.3em] text-brand-neon">
          Neural-Simulation // Viral Lab
        </div>
        <div className="space-y-2">
           <h1 className="text-6xl md:text-8xl font-display uppercase italic leading-none tracking-tighter text-white lowercase">
             Reality <span className="text-brand-neon">Check</span>
           </h1>
           <p className="text-white/40 text-sm font-mono lowercase tracking-[0.2em] italic">simulate reach before execution</p>
        </div>
      </div>

      {!result ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="hypr-card p-10 space-y-10 relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform">
             <Search className="w-40 h-40 text-brand-neon" />
          </div>
          
          <div className="space-y-4 relative z-10">
            <label className="text-[10px] font-mono text-white/30 uppercase tracking-[0.4em] pl-1">Idea / Hook Input</label>
            <textarea 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Input your experimental hook..."
              className="w-full h-48 bg-white/5 border border-white/5 p-8 text-2xl text-white italic outline-none focus:border-brand-neon transition-all"
            />
          </div>

          <button 
            onClick={handleTest}
            disabled={isAnalyzing || !input.trim()}
            className="w-full hypr-btn hypr-btn-primary flex items-center justify-center gap-4 py-8"
          >
            {isAnalyzing ? (
              <><Loader2 className="w-6 h-6 animate-spin" /> Simulating Curiosity Matrix...</>
            ) : (
              <><Zap className="w-6 h-6" /> Initialize Viral Projection</>
            )}
          </button>
        </motion.div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-8"
        >
          <div className="hypr-card border-brand-neon/20 p-12 flex flex-col md:flex-row items-center justify-between gap-12 group">
             <div className="absolute top-0 left-0 p-12 opacity-[0.02]">
                <Rocket className="w-80 h-80 text-brand-neon" />
             </div>
             
             <div className="relative z-10 flex flex-col items-center md:items-start gap-4">
                <p className="text-[10px] font-mono text-brand-neon uppercase tracking-[0.4em]">Viral Probability</p>
                <div className="flex items-baseline gap-4">
                   <h2 className="text-9xl font-display italic tracking-tighter text-white">{result.score}</h2>
                   <span className="text-2xl font-display font-light text-white/20 italic lowercase">Nexus Score</span>
                </div>
                <div className="px-4 py-1.5 bg-brand-neon/10 border border-brand-neon/40 text-[9px] font-mono text-brand-neon uppercase tracking-widest">
                   {result.potential} Potential
                </div>
             </div>

             <div className="p-8 bg-brand-void/50 border border-white/5 min-w-[320px] space-y-4">
                <p className="text-[9px] font-mono text-white/30 uppercase tracking-widest italic">AI Synthesis</p>
                <p className="text-sm font-light italic text-white/80 leading-relaxed font-sans italic">"{result.feedback}"</p>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="hypr-card p-10 space-y-8">
                <h3 className="text-[10px] font-mono text-white/30 uppercase tracking-[0.4em]">Optimization Directives</h3>
                <div className="space-y-6">
                   {result.improvements.map((imp: string, i: number) => (
                     <div key={i} className="flex gap-4 items-start">
                        <div className="w-1.5 h-1.5 bg-brand-neon mt-1.5 shrink-0" />
                        <p className="text-xs text-white/60 font-mono lowercase tracking-wide leading-relaxed italic">{imp}</p>
                     </div>
                   ))}
                </div>
             </div>

             <div className="hypr-card p-10 border-brand-cyan/20 bg-brand-cyan/[0.02] flex flex-col justify-between group overflow-hidden">
                <div className="space-y-2 relative z-10">
                   <h3 className="text-3xl font-display uppercase italic text-white">Execute <span className="text-brand-cyan">Forge</span></h3>
                   <p className="text-white/40 text-[10px] font-mono lowercase italic">score qualifies for nexus deployment</p>
                </div>
                <button 
                  onClick={() => navigate('/generator', { state: { initialIdea: input } })}
                  className="hypr-btn hypr-btn-primary w-full py-6 mt-12 bg-white text-brand-void hover:bg-brand-cyan hover:text-brand-void"
                >
                  Bridge to Script Forge <ArrowRight className="w-5 h-5 flex-shrink-0" />
                </button>
             </div>
          </div>

          <button 
            onClick={() => setResult(null)}
            className="text-[9px] font-mono text-white/20 uppercase tracking-[0.4em] hover:text-brand-neon transition-colors"
          >
            ← Reset Simulation
          </button>
        </motion.div>
      )}
    </div>
  );
}
