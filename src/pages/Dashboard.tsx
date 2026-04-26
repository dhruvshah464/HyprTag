import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Zap,
  TrendingUp,
  ArrowUpRight,
  Sparkles,
  Share2,
  Brain,
  Rocket,
  Flame,
  DollarSign,
  ChevronRight,
  Layout,
  Target,
  BarChart3,
  Loader2,
  Check,
  ArrowRight,
  Globe
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Link, useNavigate } from 'react-router-dom';
import { db } from '../lib/firebase';
import { useAuth } from '../lib/auth';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { geminiService } from '../services/geminiService';
import { contentService } from '../services/contentService';

export default function Dashboard() {
  const { user, level, points, streak } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [growthMove, setGrowthMove] = useState<any>(null);
  const [aiInsights, setAiInsights] = useState<any[]>([]);
  const [optimizing, setOptimizing] = useState(false);
  const [optSuccess, setOptSuccess] = useState(false);

  useEffect(() => {
    if (!user) return;

    const initDashboard = async () => {
      try {
        const move = await geminiService.recommendGrowthMove(user.displayName || "General");
        setGrowthMove(move);
        const insights = await geminiService.getGrowthInsights([]);
        setAiInsights(insights.length > 0 ? insights : [
          { text: "Hook retention is peaking. Push high-stakes format.", status: 'up', metric: 'Retention' },
          { text: "Algorithm alignment optimal for 9PM EST.", status: 'up', metric: 'Network' }
        ]);
        const latest = await contentService.getLatestContent(user.uid);
        setStats(latest);
      } catch (e) {
        console.error("Dashboard Init Failed", e);
      } finally {
        setLoading(false);
      }
    };

    initDashboard();

    const qPosts = query(
      collection(db, "posts"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(qPosts, (snapshot) => {
      setStats(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsub();
  }, [user?.uid]);

  const handleOptimize = async () => {
    setOptimizing(true);
    await new Promise(r => setTimeout(r, 1500));
    setOptimizing(false);
    setOptSuccess(true);
    setTimeout(() => setOptSuccess(false), 3000);
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-10 h-10 border-2 border-brand-neon border-t-transparent" />
          <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-brand-neon">Synchronizing Matrix...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-20">
      {/* Header HUD */}
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-8">
        <div className="space-y-4">
           <div className="flex flex-wrap items-center gap-2">
              <div className="px-2 py-1 bg-brand-neon/10 border border-brand-neon/30 text-[9px] font-mono uppercase tracking-widest text-brand-neon">
                System: Online
              </div>
              <div className="px-2 py-1 bg-brand-cyan/10 border border-brand-cyan/30 text-[9px] font-mono uppercase tracking-widest text-brand-cyan flex items-center gap-1.5">
                <Flame className="w-3 h-3" />
                {streak || 0} Day Streak
              </div>
           </div>
           <div className="space-y-1">
             <h1 className="font-display text-5xl md:text-7xl italic leading-none tracking-tighter uppercase">
               Mission <span className="text-brand-neon">Control</span>
             </h1>
             <p className="text-white/40 text-sm font-mono tracking-tight lowercase">
               operator active // reach velocity increasing // nexus status: elite
             </p>
           </div>
        </div>
        
        {/* Identity HUD Card */}
        <div className="hypr-card min-w-[320px] bg-brand-surface border-white/10 group">
           <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <Brain className="w-24 h-24 text-brand-neon" />
           </div>
           <div className="flex justify-between items-end mb-4 relative z-10">
              <div className="space-y-0.5">
                 <p className="text-[9px] font-mono text-brand-neon uppercase tracking-[0.2em]">Rank Identity</p>
                 <p className="text-2xl font-display uppercase italic text-white tracking-tighter">Growth Architect</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-mono text-brand-neon">Level {level || 1}</p>
                <div className="w-12 h-1 bg-white/5 mt-1 overflow-hidden">
                   <div className="h-full bg-brand-neon w-[60%]" />
                </div>
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Growth Move & Primary Stats */}
        <div className="lg:col-span-8 space-y-6">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <StatCard label="Total Reach" value="42.8K" icon={TrendingUp} trend="+12.4%" />
              <StatCard label="Viral Score" value="89" icon={Zap} trend="Optimal" isNeon />
              <StatCard label="Earnings" value="₹12.4K" icon={DollarSign} trend="+2.1x" />
           </div>
           
           {/* Growth Move (Hero) */}
           <div className="hypr-card border-brand-neon/20 bg-brand-neon/[0.02] p-8 md:p-12 group overflow-hidden">
              <div className="absolute top-0 right-0 p-12 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
                 <Rocket className="w-64 h-64 text-brand-neon rotate-12" />
              </div>
              <div className="relative z-10 space-y-8">
                 <div className="flex justify-between items-start">
                    <div className="space-y-1">
                       <h3 className="text-[10px] font-mono text-brand-neon uppercase tracking-[0.4em]">Trending Intelligence</h3>
                       <p className="text-4xl font-display italic uppercase tracking-tighter text-white">
                         The Paradox Loop
                       </p>
                    </div>
                    <div className="hidden sm:block text-right">
                       <p className="text-[9px] font-mono text-white/30 uppercase">Yield Potential</p>
                       <p className="text-xl font-display text-brand-neon">+124% Reach</p>
                    </div>
                 </div>
                 <div className="space-y-4">
                    <p className="text-white/60 text-sm leading-relaxed max-w-xl font-sans font-light italic">
                       This strategy node is currently peaking in the finance and wellness niches. High conversion for autority-led storytelling.
                    </p>
                    <div className="bg-white/5 border border-white/5 p-4 italic text-sm text-brand-cyan">
                       "Most creators are lying to you about productivity..."
                    </div>
                 </div>
                 <div className="flex flex-wrap gap-4 pt-4">
                    <button 
                      onClick={() => navigate('/ideas')}
                      className="hypr-btn hypr-btn-primary flex items-center gap-3 pr-8"
                    >
                       Access Intel <ChevronRight className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => navigate('/upload')}
                      className="hypr-btn hypr-btn-outline"
                    >
                       Bridge Your Node
                    </button>
                 </div>
              </div>
           </div>
        </div>

        {/* Right Column: Neural Insights & Quick Tools */}
        <div className="lg:col-span-4 space-y-6">
           <div className="hypr-card space-y-6">
              <h3 className="text-[10px] font-mono text-white/40 uppercase tracking-[0.3em]">Neural Insights</h3>
              <div className="space-y-5">
                 {aiInsights.map((ins, i) => (
                    <div key={i} className="flex gap-4 group">
                       <div className="w-8 h-8 bg-white/5 border border-white/5 flex items-center justify-center shrink-0">
                          <Zap className={cn("w-4 h-4", ins.status === 'up' ? "text-brand-neon" : "text-brand-cyan")} />
                       </div>
                       <div className="space-y-1">
                          <p className="text-xs font-light text-white italic group-hover:text-brand-neon transition-colors leading-tight">"{ins.text}"</p>
                          <p className="text-[8px] font-mono text-white/20 uppercase tracking-widest">{ins.metric}</p>
                       </div>
                    </div>
                  ))}
              </div>
              <button 
                onClick={handleOptimize}
                disabled={optimizing || optSuccess}
                className="w-full hypr-btn bg-white/5 border border-white/10 text-white flex items-center justify-center gap-3 hover:bg-brand-neon hover:text-brand-void group overflow-hidden"
              >
                 {optimizing ? (
                   <Loader2 className="w-4 h-4 animate-spin" />
                 ) : optSuccess ? (
                    <span className="flex items-center gap-2"><Check className="w-4 h-4" /> Matrix Aligned</span>
                 ) : (
                    <span className="flex items-center gap-2">Sync Growth Audit <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></span>
                 )}
              </button>
           </div>

           <div className="grid grid-cols-2 gap-4">
              <QuickTool to="/ideas" icon={Globe} label="Lab Feed" />
              <QuickTool to="/viral-test" icon={Brain} label="Simulate" />
              <QuickTool to="/planner" icon={Layout} label="Matrix" />
              <QuickTool to="/earn" icon={Rocket} label="Monetize" />
           </div>
        </div>
      </div>

      {/* Footer Banner */}
      <motion.div 
        whileHover={{ y: -4 }}
        onClick={() => navigate('/earn')}
        className="hypr-card border-brand-cyan/20 bg-brand-cyan/[0.02] p-10 flex flex-col md:flex-row items-center justify-between gap-8 cursor-pointer group"
      >
        <div className="space-y-2 text-center md:text-left">
           <h3 className="text-3xl md:text-4xl font-display italic uppercase tracking-tighter text-white">
             Reach <span className="text-brand-cyan">Liquidation</span> Protocol
           </h3>
           <p className="text-white/40 text-sm italic font-mono">Unlock your first revenue stream today.</p>
        </div>
        <div className="hypr-btn hypr-btn-primary bg-brand-cyan text-brand-void group-hover:px-12 transition-all flex items-center gap-3">
           Initialize Payouts <ArrowRight className="w-4 h-4" />
        </div>
      </motion.div>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, trend, isNeon }: any) {
  return (
    <div className={cn(
      "hypr-card p-6 group transition-all hover:scale-[1.02]",
      isNeon ? "border-brand-neon/30 bg-brand-neon/[0.03]" : "bg-brand-surface border-white/5"
    )}>
      <div className="absolute top-0 right-0 p-4 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
        <Icon className="w-16 h-16" />
      </div>
      <p className="text-[9px] font-mono text-white/40 uppercase tracking-widest mb-4">{label}</p>
      <div className="flex items-end justify-between">
         <h4 className="text-4xl font-display italic text-white leading-none">{value}</h4>
         <span className={cn("text-[9px] font-mono px-2 py-0.5 border", isNeon ? "border-brand-neon/50 text-brand-neon" : "border-white/10 text-white/40")}>
           {trend}
         </span>
      </div>
    </div>
  );
}

function QuickTool({ to, icon: Icon, label }: any) {
  return (
    <Link to={to} className="hypr-card p-4 flex flex-col items-center justify-center gap-3 hover:border-brand-neon/30 hover:bg-white/5 transition-all group aspect-square">
       <Icon className="w-6 h-6 text-white/30 group-hover:text-brand-neon group-hover:scale-110 transition-all" />
       <span className="text-[9px] font-mono uppercase text-white/20 group-hover:text-white tracking-widest">{label}</span>
    </Link>
  );
}
