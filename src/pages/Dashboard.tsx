import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  BarChart3, 
  Target, 
  Calendar, 
  Zap,
  TrendingUp,
  ArrowUpRight,
  Clock,
  Layers,
  Sparkles,
  ChevronRight,
  Layout,
  MessageCircle,
  AlertCircle,
  ShieldCheck,
  Loader2,
  Check,
  ArrowRight,
  Lock,
  X,
  Users,
  Eye,
  Rocket,
  Flame,
  ArrowDownRight,
  DollarSign
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { db, auth, handleFirestoreError } from '../lib/firebase';
import { useAuth } from '../lib/auth';
import { collection, query, where, orderBy, onSnapshot, limit, Timestamp, getCountFromServer } from 'firebase/firestore';
import { format } from 'date-fns';
import { EliteUpgradeModal } from '../components/EliteUpgradeModal';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { Post } from '../lib/types';

export default function Dashboard() {
  const { user, isElite, demoCompleted, setDemoCompleted } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<Post[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [optimizing, setOptimizing] = useState(false);
  const [optSuccess, setOptSuccess] = useState(false);
  const [scheduled, setScheduled] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  // Growth Move Logic
  const growthMove = {
    title: "The 'Pattern Interruption' Reel",
    desc: "Your audience is saturated with talking-head videos. Use a high-velocity montage with bold text overlays.",
    hook: "Most creators are lying to you about...",
    format: "9:16 Video (Reel/TikTok)",
    time: "Best time: 6:45 PM"
  };

  const growthInsights = [
    { title: "Hook Strength", val: "Weak", icon: Zap, status: 'down', desc: "Your last 3 videos lost 40% of viewers in the first 3 seconds." },
    { title: "Monetization", val: "Optimal", icon: DollarSign, status: 'up', desc: "Bio clicks have increased by 12% since the new CTA." },
    { title: "Frequency", val: "Low", icon: Calendar, status: 'warn', desc: "Post 2 more times this week to maintain algorithm momentum." }
  ];

  useEffect(() => {
    if (!user) return;

    const qGenerations = query(
      collection(db, "generations"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc"),
      limit(7)
    );

    const qTasks = query(
      collection(db, "scheduledPosts"),
      where("userId", "==", user.uid)
    );

    const unsubs = [
      onSnapshot(qGenerations, (snapshot) => {
        setStats(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Post[]);
      }),

      onSnapshot(qTasks, (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setTasks(data);
        setScheduled(data.filter((t: any) => t.status === 'scheduled').sort((a,b) => new Date(a.scheduledTime).getTime() - new Date(b.scheduledTime).getTime()));
        setLoading(false);
      })
    ];

    return () => unsubs.forEach(unsub => unsub());
  }, [user?.uid]);

  const totalReach = stats.reduce((acc, curr) => acc + (curr.reach || 0), 0);
  const avgViralScore = stats.length > 0 
    ? Math.round(stats.reduce((acc, curr) => acc + (curr.viralScore || 0), 0) / stats.length) 
    : 84;

  const handleOptimize = async () => {
    if (!isElite) return;
    setOptimizing(true);
    await new Promise(r => setTimeout(r, 2000));
    setOptimizing(false);
    setOptSuccess(true);
    setTimeout(() => setOptSuccess(false), 5000);
  };

  return (
    <div className="space-y-12 pb-20 max-w-[1400px] mx-auto text-left">
      <EliteUpgradeModal 
        isOpen={showUpgradeModal} 
        onClose={() => setShowUpgradeModal(false)}
        title="Scale Your Profits"
        description="Upgrade to unlock automated growth feedback, daily viral scripts, and advanced monetization tools."
      />

      {/* Header Summary */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-8">
        <div className="space-y-4">
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-accent/10 border border-brand-accent/20 text-[10px] font-bold uppercase tracking-widest text-brand-accent font-mono">
              <Rocket className="w-3 h-3" />
              Outcome-Driven Growth System
           </div>
           <h1 className="font-display font-bold text-5xl italic tracking-tighter text-slate-900">Welcome back, <span className="text-brand-accent">{user?.displayName?.split(' ')[0] || 'Creator'}</span></h1>
           <p className="text-slate-500 max-w-sm italic">"The system has identified 2 major growth leaks in your last audit."</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full md:w-auto">
           <QuickAction to="/generator" icon={Rocket} label="Generate" />
           <QuickAction to="/planner" icon={Layout} label="Planner" />
           <QuickAction to="/earn" icon={DollarSign} label="Earn" />
           <QuickAction to="/settings" icon={ShieldCheck} label="Audit" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Today's Growth Move - MAIN PRIORITY */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-8 p-10 bg-slate-900 rounded-[3rem] border border-slate-800 shadow-2xl relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 group-hover:rotate-12 transition-all duration-700">
             <Flame className="w-64 h-64 text-brand-accent" />
          </div>
          
          <div className="relative z-10 space-y-10">
             <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                   <div className="flex items-center gap-2 text-brand-accent font-bold text-[10px] tracking-widest uppercase font-mono">
                      <div className="w-2 h-2 rounded-full bg-brand-accent animate-ping" /> Today's Growth Move
                   </div>
                   <h2 className="text-4xl font-display font-bold italic tracking-tight text-white">{growthMove.title}</h2>
                </div>
                <div className="flex bg-white/5 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/10 items-center gap-4">
                    <div className="text-right">
                       <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Recommended Slot</p>
                       <p className="text-sm font-bold text-white">{growthMove.time}</p>
                    </div>
                    <Clock className="w-5 h-5 text-brand-accent" />
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                   <p className="text-slate-400 font-light italic leading-relaxed text-sm">"{growthMove.desc}"</p>
                   <div className="p-5 bg-white/5 border border-white/10 rounded-2xl space-y-4">
                      <div className="space-y-1">
                         <p className="text-[8px] font-bold text-brand-accent uppercase tracking-widest">The Hook</p>
                         <p className="text-sm font-bold text-white italic">"{growthMove.hook}"</p>
                      </div>
                   </div>
                </div>
                <div className="flex flex-col justify-between items-end gap-6">
                   <div className="flex gap-2">
                      <div className="px-3 py-1 bg-slate-800 border border-slate-700 rounded-lg text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                         {growthMove.format}
                      </div>
                      <div className="px-3 py-1 bg-brand-accent/20 border border-brand-accent/30 rounded-lg text-[10px] font-bold text-brand-accent uppercase tracking-widest">
                         High ROI
                      </div>
                   </div>
                   <button 
                     onClick={() => navigate('/generator')}
                     className="w-full h-16 bg-brand-accent text-white rounded-3xl flex items-center justify-center gap-3 text-[10px] font-bold uppercase tracking-widest hover:scale-[1.02] transition-all shadow-2xl shadow-brand-accent/20"
                   >
                      Generate Content Now <ArrowRight className="w-4 h-4" />
                   </button>
                </div>
             </div>
          </div>
        </motion.div>

        {/* Growth Insights Panel */}
        <div className="lg:col-span-4 p-8 bg-white border border-slate-100 rounded-[3rem] shadow-sm space-y-8">
           <div className="flex justify-between items-center">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Growth Feedback</h3>
              <Sparkles className="w-4 h-4 text-brand-accent" />
           </div>
           
           <div className="space-y-4">
              {growthInsights.map((insight, i) => (
                <div key={i} className="p-6 bg-slate-50 border border-slate-100 rounded-2xl space-y-3 group hover:border-brand-accent/20 transition-all">
                   <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-xl bg-white border border-slate-100 flex items-center justify-center">
                            <insight.icon className={cn("w-4 h-4", 
                              insight.status === 'up' ? "text-emerald-500" : 
                              insight.status === 'down' ? "text-red-500" : "text-amber-500"
                            )} />
                         </div>
                         <span className="text-[10px] font-bold text-slate-900 uppercase tracking-widest">{insight.title}</span>
                      </div>
                      <div className="flex items-center gap-1">
                         <span className={cn("text-[10px] font-bold", 
                            insight.status === 'up' ? "text-emerald-500" : 
                            insight.status === 'down' ? "text-red-500" : "text-amber-500"
                         )}>{insight.val}</span>
                         {insight.status === 'up' ? <TrendingUp className="w-3 h-3 text-emerald-500" /> : 
                          insight.status === 'down' ? <ArrowDownRight className="w-3 h-3 text-red-500" /> : 
                          <AlertCircle className="w-3 h-3 text-amber-500" />}
                      </div>
                   </div>
                   <p className="text-[10px] text-slate-500 font-light leading-relaxed italic">"{insight.desc}"</p>
                </div>
              ))}
           </div>
        </div>
      </div>

      {/* Simplified Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Monthly Growth" value={totalReach.toLocaleString()} change="+122%" icon={Eye} />
        <StatCard label="Pipeline Efficiency" value={`${avgViralScore}%`} change="High" icon={TrendingUp} isAccent />
        <StatCard label="Brand Reach" value="Optimal" icon={Target} isEliteLocked={!isElite} />
        <StatCard label="Revenue Potential" value="$1.2k" change="Est." icon={DollarSign} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
         {/* Reach Chart */}
         <div className="lg:col-span-8 p-10 bg-white border border-slate-100 rounded-[3rem] shadow-sm relative overflow-hidden">
            <div className="flex justify-between items-center mb-10">
               <div className="space-y-1">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                     <BarChart3 className="w-4 h-4 text-brand-accent" />
                     Performance Trends
                  </h3>
               </div>
               <Link to="/analytics" className="text-[10px] font-bold uppercase tracking-widest text-brand-accent hover:underline flex items-center gap-2 font-mono">
                  Advanced Metrics <ArrowUpRight className="w-3 h-3" />
               </Link>
            </div>
            
            <div className="h-[300px]">
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stats.map(s => ({ 
                    name: s.createdAt ? format(s.createdAt.toDate(), 'MM/dd') : '', 
                    reach: s.reach || 0 
                  })).reverse()}>
                    <defs>
                      <linearGradient id="dbReach" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#60a5fa" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} axisLine={false} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={10} axisLine={false} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#ffffff', border: 'none', borderRadius: '12px', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                      itemStyle={{ color: '#2563eb' }}
                    />
                    <Area type="monotone" dataKey="reach" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#dbReach)" />
                  </AreaChart>
               </ResponsiveContainer>
            </div>
         </div>

         {/* Winning Posts */}
         <div className="lg:col-span-4 p-10 bg-white border border-slate-100 rounded-[3rem] shadow-sm space-y-8">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Winning Content</h3>
            <div className="space-y-4">
               {stats.slice(0, 3).map((post, i) => (
                 <div key={post.id || i} className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-100 rounded-2xl group transition-all hover:bg-white hover:border-brand-accent/20">
                    <div className="w-12 h-12 bg-white rounded-xl flex flex-col items-center justify-center border border-slate-100">
                       <span className="text-[14px] font-display font-bold text-slate-900 group-hover:text-brand-accent">{post.viralScore || 85}</span>
                       <span className="text-[6px] font-bold text-slate-400 uppercase tracking-widest">Score</span>
                    </div>
                    <div className="flex-grow">
                       <p className="text-[10px] font-light text-slate-700 line-clamp-1 italic">"{post.content || 'Generating Insights...'}"</p>
                       <p className="text-[8px] font-bold text-emerald-500 uppercase tracking-widest mt-1">High Traction</p>
                    </div>
                    <ArrowUpRight className="w-3 h-3 text-slate-300 group-hover:text-brand-accent transition-colors" />
                 </div>
               ))}
               {stats.length === 0 && (
                 <div className="h-44 flex flex-col items-center justify-center gap-4 border border-dashed border-slate-100 rounded-3xl">
                    <Sparkles className="w-8 h-8 text-slate-100" />
                    <p className="text-[8px] font-bold text-slate-200 uppercase tracking-widest">Awaiting First Win</p>
                 </div>
               )}
            </div>
            <button 
              onClick={handleOptimize}
              disabled={optimizing || optSuccess}
              className="w-full h-14 bg-slate-900 text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-slate-900/10 flex items-center justify-center gap-2"
            >
               {optimizing ? <Loader2 className="w-4 h-4 animate-spin" /> : optSuccess ? <><Check className="w-4 h-4" /> Optimized</> : "Run Full Content Audit"}
            </button>
         </div>
      </div>

      {/* Footer Monetization Teaser */}
      <div className="p-10 bg-emerald-500 rounded-[3rem] text-white flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden group">
         <DollarSign className="absolute -bottom-10 -right-10 w-64 h-64 opacity-10 group-hover:scale-125 transition-transform duration-1000" />
         <div className="space-y-2 relative z-10">
            <h3 className="text-3xl font-display font-bold italic tracking-tighter">Ready to <span className="text-slate-900">Monetize?</span></h3>
            <p className="text-emerald-100 text-sm max-w-sm">Access brand deal templates, DM scripts, and funnel blueprints designed for scale.</p>
         </div>
         <Link to="/earn" className="h-16 px-12 bg-white text-emerald-600 rounded-2xl flex items-center justify-center gap-3 text-[10px] font-bold uppercase tracking-widest hover:scale-[1.02] transition-all shadow-xl shadow-emerald-900/10 relative z-10">
            Open Revenue Lab <ArrowRight className="w-4 h-4" />
         </Link>
      </div>
    </div>
  );
}

function StatCard({ label, value, change, icon: Icon, isAccent, isEliteLocked }: any) {
  return (
    <div className={cn(
      "p-8 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm group relative overflow-hidden active:scale-[0.98] transition-all cursor-default", 
      isAccent && "border-brand-accent/20 bg-brand-accent/[0.02]"
    )}>
      {isEliteLocked && (
        <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-[2px] flex items-center justify-center z-20">
           <div className="flex flex-col items-center gap-2">
              <Lock className="w-4 h-4 text-white" />
              <span className="text-[8px] font-bold text-white uppercase tracking-widest">Locked (Pro)</span>
           </div>
        </div>
      )}
      <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity">
         <Icon className="w-24 h-24" />
      </div>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">{label}</p>
      <div className="flex items-end justify-between relative z-10">
         <h4 className="text-4xl font-display font-bold italic tracking-tighter text-slate-900">{value}</h4>
         {change && (
           <span className={cn(
             "text-[8px] font-bold px-2 py-0.5 rounded-lg border",
             isAccent ? "bg-brand-accent/20 border-brand-accent/30 text-brand-accent" : "bg-slate-100 border-slate-200 text-slate-500"
           )}>
             {change}
           </span>
         )}
      </div>
    </div>
  );
}

function QuickAction({ to, icon: Icon, label }: { to: string, icon: any, label: string }) {
  return (
    <Link to={to} className="flex flex-col items-center justify-center p-6 bg-white border border-slate-100 rounded-3xl hover:border-brand-accent/20 hover:bg-slate-50/50 transition-all group shadow-sm hover:shadow-md">
       <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
          <Icon className="w-5 h-5 text-slate-400 group-hover:text-brand-accent transition-colors" />
       </div>
       <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest group-hover:text-slate-900 transition-colors">{label}</span>
    </Link>
  );
}
