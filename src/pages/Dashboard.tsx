import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  BarChart3, 
  Target, 
  Calendar, 
  Zap,
  TrendingUp,
  Cpu,
  ArrowUpRight,
  Clock,
  Layers,
  Sparkles,
  ChevronRight,
  Layout,
  MessageCircle,
  Hash,
  AlertCircle,
  ShieldCheck,
  Loader2,
  Check,
  ArrowRight,
  Lock
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Link } from 'react-router-dom';
import { db, auth, handleFirestoreError } from '../lib/firebase';
import { useAuth } from '../lib/auth';
import { collection, query, where, orderBy, onSnapshot, limit, Timestamp } from 'firebase/firestore';
import { format } from 'date-fns';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

interface Task {
  id: string;
  content: string;
  status: 'idea' | 'draft' | 'scheduled' | 'published' | 'pending';
  scheduledTime: string;
  createdAt: any;
}

export default function Dashboard() {
  const { isElite } = useAuth();
  const [stats, setStats] = useState<any[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [optimizing, setOptimizing] = useState(false);
  const [optSuccess, setOptSuccess] = useState(false);
  const [competitors, setCompetitors] = useState<any[]>([]);
  const [scheduled, setScheduled] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth.currentUser) return;

    const qGenerations = query(
      collection(db, "generations"),
      where("userId", "==", auth.currentUser.uid),
      orderBy("createdAt", "desc"),
      limit(7)
    );

    const qTasks = query(
      collection(db, "scheduledPosts"),
      where("userId", "==", auth.currentUser.uid)
    );

    const qCompetitors = query(
      collection(db, "competitorInsights"),
      where("userId", "==", auth.currentUser.uid),
      orderBy("createdAt", "desc"),
      limit(3)
    );

    const unsubs = [
      onSnapshot(qGenerations, (snapshot) => {
        setStats(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).reverse());
      }, (err) => handleFirestoreError(err, 'list', 'generations')),

      onSnapshot(qTasks, (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Task[];
        setTasks(data);
        setScheduled(data.filter(t => t.status === 'scheduled').sort((a,b) => new Date(a.scheduledTime).getTime() - new Date(b.scheduledTime).getTime()));
      }, (err) => handleFirestoreError(err, 'list', 'scheduledPosts')),

      onSnapshot(qCompetitors, (snapshot) => {
        setCompetitors(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setLoading(false);
      }, (err) => handleFirestoreError(err, 'list', 'competitorInsights'))
    ];

    return () => unsubs.forEach(unsub => unsub());
  }, []);

  const totalReach = stats.reduce((acc, curr) => acc + (curr.reach || 0), 0);
  const pipelineIdeas = tasks.filter(t => t.status === 'idea').length;
  const pipelineDrafts = tasks.filter(t => t.status === 'draft').length;

  const handleOptimize = async () => {
    if (!isElite) return;
    setOptimizing(true);
    await new Promise(r => setTimeout(r, 3000));
    setOptimizing(false);
    setOptSuccess(true);
    setTimeout(() => setOptSuccess(false), 5000);
  };

  const chartData = stats.map(s => ({
    name: s.createdAt ? format(s.createdAt.toDate(), 'MM/dd') : '',
    reach: s.reach || 0
  }));

  return (
    <div className="space-y-12 pb-20 max-w-[1400px] mx-auto">
      {/* Header Summary */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-8">
        <div className="space-y-4">
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-accent/10 border border-brand-accent/20 text-[10px] font-bold uppercase tracking-widest text-brand-accent">
              <Cpu className="w-3 h-3 animate-pulse" />
              Strategic Overwatch Active
           </div>
           <h1 className="font-display font-bold text-5xl italic lowercase tracking-tighter text-white">Command<span className="text-brand-accent">Center</span></h1>
           <p className="text-white/40 max-w-sm">Synchronizing your multi-platform growth signals into a single unified objective.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full md:w-auto">
           <QuickAction to="/generator" icon={Zap} label="Init Cluster" />
           <QuickAction to="/planner" icon={Layout} label="Draft Flow" />
           <QuickAction to="/competitors" icon={Target} label="Pulse Scan" />
        </div>
      </div>

      {/* Global Signal Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Reach Aggregate" value={totalReach.toLocaleString()} change="+12%" icon={TrendingUp} />
        <StatCard label="Pipeline Density" value={tasks.length.toString()} change="High" icon={Layers} />
        <StatCard label="Scheduled Load" value={scheduled.length.toString()} change="Optimal" icon={Calendar} />
        <StatCard label="Strategic Score" value="84" change="/100" icon={Sparkles} isAccent />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Trajectory Pane */}
        <div className="lg:col-span-8 hypr-card p-10 bg-white/[0.01] border-white/5 relative overflow-hidden">
           <div className="flex justify-between items-center mb-10">
              <div className="space-y-1">
                 <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-white/40 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-brand-accent" />
                    Neural Reach Trajectory
                 </h3>
                 <p className="text-lg font-display font-light italic text-white/80">Projected connectivity across active clusters</p>
              </div>
              <Link to="/analytics" className="text-[10px] font-bold uppercase tracking-widest text-brand-accent hover:underline flex items-center gap-2">
                 Full Audit <ArrowUpRight className="w-3 h-3" />
              </Link>
           </div>
           
           <div className="h-[340px] w-full">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="dbReach" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#60a5fa" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                    <XAxis dataKey="name" stroke="#ffffff10" fontSize={10} axisLine={false} tickLine={false} />
                    <YAxis stroke="#ffffff10" fontSize={10} axisLine={false} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#09090b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                      itemStyle={{ color: '#60a5fa' }}
                    />
                    <Area type="monotone" dataKey="reach" stroke="#60a5fa" strokeWidth={3} fillOpacity={1} fill="url(#dbReach)" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-white/10 uppercase tracking-[0.4em] font-bold text-xs gap-4">
                   <div className="w-16 h-px bg-white/10" />
                   Awaiting Growth Signals
                   <div className="w-16 h-px bg-white/10" />
                </div>
              )}
           </div>
        </div>

        {/* Pipeline Status */}
        <div className="lg:col-span-4 hypr-card p-10 space-y-10">
           <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-white/40 flex items-center gap-2">
              <Layout className="w-4 h-4 text-brand-accent" />
              Pipeline Metrics
           </h3>
           
           <div className="space-y-6">
              <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl space-y-4">
                 <div className="flex justify-between items-end">
                    <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Incubating Ideas</span>
                    <span className="text-2xl font-display italic text-white/80">{pipelineIdeas}</span>
                 </div>
                 <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: '45%' }} className="h-full bg-white/20" />
                 </div>
              </div>

              <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl space-y-4">
                 <div className="flex justify-between items-end">
                    <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">In Design Phase</span>
                    <span className="text-2xl font-display italic text-white/80">{pipelineDrafts}</span>
                 </div>
                 <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: '65%' }} className="h-full bg-brand-accent/50" />
                 </div>
              </div>

              <Link to="/planner" className="flex items-center justify-center gap-3 w-full h-16 border border-white/5 bg-white/[0.02] rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 hover:text-white hover:bg-white/5 transition-all">
                 Enter Pipeline <ChevronRight className="w-4 h-4" />
              </Link>
           </div>
        </div>
      </div>

      {/* Footer Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         {/* Upcoming Schedule */}
         <div className="hypr-card p-10 space-y-8">
            <div className="flex justify-between items-center">
               <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-white/40 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-brand-accent" />
                  Deployment Sequence
               </h3>
               <Link to="/schedule" className="text-[10px] font-bold uppercase tracking-widest text-brand-accent hover:underline">Full Timeline</Link>
            </div>

            <div className="space-y-4">
               {scheduled.slice(0, 3).map((item, i) => (
                 <div key={item.id} className="flex items-center gap-6 p-5 bg-white/[0.01] border border-white/5 rounded-2xl group hover:border-white/20 transition-all">
                    <div className="w-12 h-12 rounded-xl bg-white/5 flex flex-col items-center justify-center border border-white/5 group-hover:bg-brand-accent/10 transition-colors">
                       <span className="text-[8px] font-bold text-brand-accent uppercase">{format(new Date(item.scheduledTime), 'MMM')}</span>
                       <span className="text-lg font-display font-bold leading-none">{format(new Date(item.scheduledTime), 'dd')}</span>
                    </div>
                    <div className="flex-grow">
                       <p className="text-sm font-light text-white/80 line-clamp-1 italic">"{item.content}"</p>
                       <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.15em] mt-1">
                          Deploying at {format(new Date(item.scheduledTime), 'hh:mm a')}
                       </p>
                    </div>
                    <div className="w-2 h-2 rounded-full bg-brand-accent/40 animate-pulse shadow-[0_0_8px_rgba(96,165,250,0.5)]" />
                 </div>
               ))}
               {scheduled.length === 0 && (
                 <div className="h-44 flex flex-col items-center justify-center gap-4 border border-dashed border-white/5 rounded-3xl">
                    <Calendar className="w-8 h-8 text-white/5" />
                    <p className="text-[10px] font-bold text-white/10 uppercase tracking-widest font-mono">No Active Synchronizations</p>
                 </div>
               )}
            </div>
         </div>

         {/* Strategic Multipliers */}
         <div className={cn(
           "hypr-card p-10 relative overflow-hidden group",
           isElite ? "bg-brand-accent/[0.05] border-brand-accent/40 shadow-2xl shadow-brand-accent/10" : "bg-brand-accent/[0.02] border-brand-accent/20"
         )}>
            <div className="absolute -top-32 -right-32 w-80 h-80 bg-brand-accent/10 rounded-full blur-[120px] group-hover:bg-brand-accent/20 transition-all" />
            
            <div className="relative z-10 space-y-10">
               <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-3xl font-display font-bold italic tracking-tighter mb-4 text-white">Elite<span className="text-brand-accent">Insights</span></h3>
                    <p className="text-white/40 text-sm italic">{isElite ? "\"Neural Guard: No suppression signatures detected. Multi-platform sync operational.\"" : "\"Upgrade to Elite to unlock proactive neural growth scans.\""}</p>
                  </div>
                  {isElite && (
                    <div className="w-10 h-10 rounded-xl bg-brand-accent/20 border border-brand-accent/30 flex items-center justify-center">
                       <ShieldCheck className="w-5 h-5 text-brand-accent" />
                    </div>
                  )}
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <InsightSmall title="Peak Velocity" desc="6:45 PM EST" />
                  <InsightSmall title="Signal Gap" desc={isElite ? "Viral TikTok" : "Locked"} />
                  <InsightSmall title="ROI Trend" desc={isElite ? "+22% Monthly" : "分析中..."} />
                  <InsightSmall title="Neural Guard" desc={isElite ? "ACTIVE" : "OFFLINE"} />
               </div>

               {isElite ? (
                 <button 
                   onClick={handleOptimize}
                   disabled={optimizing || optSuccess}
                   className="w-full h-14 bg-white text-black rounded-2xl text-[10px] font-bold uppercase tracking-[0.25em] hover:bg-brand-accent transition-all shadow-2xl shadow-brand-accent/20 flex items-center justify-center gap-2"
                 >
                    {optimizing ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : optSuccess ? (
                      <><Check className="w-4 h-4" /> Global optimization Complete</>
                    ) : (
                      <>Execute Global Optimization</>
                    )}
                 </button>
               ) : (
                 <Link to="/upgrade" className="w-full h-14 bg-brand-accent text-white rounded-2xl text-[10px] font-bold uppercase tracking-[0.25em] flex items-center justify-center gap-2 hover:scale-[1.02] transition-all">
                    Initialize Elite Access <ArrowRight className="w-4 h-4" />
                 </Link>
               )}
            </div>
         </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, change, icon: Icon, isAccent, isEliteLocked }: any) {
  return (
    <div className={cn(
      "hypr-card p-8 group relative overflow-hidden active:scale-[0.98] transition-all cursor-default", 
      isAccent && "border-brand-accent/20 bg-brand-accent/[0.02]",
      isEliteLocked && "opacity-50 grayscale pointer-events-none"
    )}>
      {isEliteLocked && (
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-20">
           <div className="flex flex-col items-center gap-2">
              <Lock className="w-4 h-4 text-white/50" />
              <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Elite Only</span>
           </div>
        </div>
      )}
      <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-[0.03] transition-opacity">
         <Icon className="w-24 h-24" />
      </div>
      <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-4">{label}</p>
      <div className="flex items-end justify-between relative z-10">
         <h4 className="text-4xl font-display font-bold italic tracking-tighter">{value}</h4>
         <span className={cn(
           "text-[10px] font-bold font-mono px-2 py-0.5 rounded-lg border",
           isAccent ? "bg-brand-accent/20 border-brand-accent/30 text-brand-accent" : "bg-white/5 border-white/10 text-white/40"
         )}>
           {change}
         </span>
      </div>
    </div>
  );
}

function QuickAction({ to, icon: Icon, label }: { to: string, icon: any, label: string }) {
  return (
    <Link to={to} className="flex flex-col items-center justify-center p-6 bg-white/[0.02] border border-white/5 rounded-3xl hover:border-white/20 hover:bg-white/[0.04] transition-all group">
       <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
          <Icon className="w-5 h-5 text-white/40 group-hover:text-brand-accent transition-colors" />
       </div>
       <span className="text-[9px] font-bold text-white/20 uppercase tracking-[0.2em] group-hover:text-white transition-colors">{label}</span>
    </Link>
  );
}

function InsightSmall({ title, desc }: { title: string, desc: string }) {
  return (
    <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl">
       <p className="text-[8px] font-bold text-white/20 uppercase tracking-widest mb-1">{title}</p>
       <p className="text-xs font-bold text-white/80">{desc}</p>
    </div>
  );
}
