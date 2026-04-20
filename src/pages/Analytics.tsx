import React, { useEffect, useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  MessageCircle, 
  Heart, 
  Share2,
  Calendar,
  Layers,
  ArrowUpRight,
  Target,
  Zap,
  BarChart3,
  Cpu,
  ShieldCheck
} from 'lucide-react';
import { motion } from 'motion/react';
import { db, auth, handleFirestoreError } from '../lib/firebase';
import { useAuth } from '../lib/auth';
import { collection, query, where, orderBy, onSnapshot, limit, Timestamp } from 'firebase/firestore';
import { format } from 'date-fns';
import { cn } from '../lib/utils';

const COLORS = ['#60a5fa', '#f87171', '#fbbf24', '#c084fc'];

export default function Analytics() {
  const { isElite } = useAuth();
  const [stats, setStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d' | 'ALL'>('30d');

  useEffect(() => {
    if (!auth.currentUser) return;
    setLoading(true);

    try {
      const now = new Date();
      let startDate: Date | null = null;

      if (timeRange === '24h') {
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      } else if (timeRange === '7d') {
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      } else if (timeRange === '30d') {
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      }

      let q;
      if (startDate) {
        q = query(
          collection(db, "generations"),
          where("userId", "==", auth.currentUser.uid),
          where("createdAt", ">=", Timestamp.fromDate(startDate)),
          orderBy("createdAt", "desc"),
          limit(50)
        );
      } else {
        q = query(
          collection(db, "generations"),
          where("userId", "==", auth.currentUser.uid),
          orderBy("createdAt", "desc"),
          limit(100)
        );
      }

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setStats(data.reverse());
        setLoading(false);
      }, (err) => {
        handleFirestoreError(err, 'list', 'generations');
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  }, [timeRange]);

  const totalReach = stats.reduce((acc, curr) => acc + (curr.reach || 0), 0);
  const totalEngagement = stats.reduce((acc, curr) => acc + (curr.likes || 0) + (curr.comments || 0), 0);

  const reachData = stats.map(s => ({
    name: s.createdAt ? format(s.createdAt.toDate(), 'MM/dd') : '',
    reach: s.reach || 0
  }));

  const engagementData = [
    { name: 'Likes', value: stats.reduce((acc, curr) => acc + (curr.likes || 0), 0) },
    { name: 'Comments', value: stats.reduce((acc, curr) => acc + (curr.comments || 0), 0) }
  ];

  return (
    <div className="space-y-16 pb-20 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div className="space-y-4">
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-white/40">
              <Cpu className="w-3 h-3 text-brand-accent" />
              Neural Performance Core
           </div>
           <h1 className="font-display font-bold text-4xl italic lowercase tracking-tighter">Growth<span className="text-brand-accent">Insights</span></h1>
           <p className="text-white/40 max-w-md">Deconstruct your reach velocity and engagement signals with precision analytics.</p>
        </div>
        <div className="flex bg-white/5 border border-white/5 p-1 rounded-2xl">
           {(['24h', '7d', '30d', 'ALL'] as const).map(t => (
             <button 
               key={t} 
               onClick={() => setTimeRange(t)}
               className={cn(
                 "px-4 py-2 rounded-xl text-[10px] font-bold transition-all",
                 t === timeRange ? 'bg-white text-black shadow-lg' : 'text-white/20 hover:text-white'
               )}
             >
               {t}
             </button>
           ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard label="Total Reach Capacity" value={totalReach.toLocaleString()} growth="+12.5%" icon={Target} />
        <MetricCard label="Signal Engagements" value={totalEngagement.toLocaleString()} growth="+8.2%" icon={Zap} />
        <MetricCard label="Strategic Velocity" value={stats.length.toString()} growth="Optimal" icon={TrendingUp} />
        <MetricCard label="Elite Quotient" value="78" growth="/100" icon={BarChart3} isAccent />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="hypr-card p-10 lg:col-span-2 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
             <BarChart3 className="w-32 h-32 text-brand-accent" />
          </div>
          <h5 className="font-bold mb-10 flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-white/40">
            <Layers className="w-4 h-4 text-brand-accent" />
            Reach Trajectory Hub
          </h5>
          <div className="h-[360px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={reachData}>
                <defs>
                  <linearGradient id="colorReach" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ffffff" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#ffffff" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis dataKey="name" stroke="#ffffff15" fontSize={10} axisLine={false} tickLine={false} tickMargin={10} />
                <YAxis stroke="#ffffff15" fontSize={10} axisLine={false} tickLine={false} tickMargin={10} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(0,0,0,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', backdropFilter: 'blur(20px)', padding: '16px' }} 
                  itemStyle={{ color: '#fff', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="reach" stroke="#ffffff" fillOpacity={1} fill="url(#colorReach)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="hypr-card p-10 flex flex-col justify-between">
          <h5 className="font-bold mb-10 flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-white/40">
            <Share2 className="w-4 h-4 text-brand-accent" />
            Engagement Mix
          </h5>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={engagementData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={95}
                  paddingAngle={10}
                  dataKey="value"
                  stroke="none"
                >
                  {engagementData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} className="focus:outline-none" />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(0,0,0,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', backdropFilter: 'blur(20px)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-8">
             {engagementData.map((d, i) => (
               <div key={i} className="flex flex-col gap-2 p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                 <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                   <span className="text-[10px] text-white/30 font-bold uppercase tracking-widest">{d.name}</span>
                 </div>
                 <p className="text-xl font-display font-medium italic">{d.value.toLocaleString()}</p>
               </div>
             ))}
          </div>
        </div>
      </div>

      <div className="hypr-card p-10 space-y-10">
        <div className="flex justify-between items-center">
           <h5 className="font-bold flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-white/40">High-Velocity Signals</h5>
           <button className="text-[10px] font-bold text-brand-accent uppercase tracking-widest hover:underline">Full Asset Audit</button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {["marketing", "ai", "saas", "influencer", "growth", "tech", "socialmedia", "entrepreneur"].map((tag, i) => (
             <motion.div 
               whileHover={{ scale: 1.05 }}
               key={i} 
               className="p-4 bg-white/[0.01] border border-white/5 rounded-2xl hover:border-white/20 transition-all cursor-default text-center group"
             >
               <p className="text-xs font-mono text-white/80 group-hover:text-brand-accent transition-colors">#{tag}</p>
               <div className="mt-3 pt-3 border-t border-white/5">
                 <p className="text-[9px] text-white/20 font-bold uppercase tracking-widest">Reach</p>
                 <p className="text-xs font-bold text-white/60">{(Math.random() * 20 + 2).toFixed(1)}k</p>
               </div>
             </motion.div>
          ))}
        </div>
      </div>

      {/* Growth Suggestions & Upgrade Prompt */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 hypr-card p-10 space-y-10 bg-white/[0.01] border-white/5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-accent/10 flex items-center justify-center border border-brand-accent/20">
              <TrendingUp className="w-6 h-6 text-brand-accent" />
            </div>
            <div>
              <h3 className="text-2xl font-display font-bold italic tracking-tighter">Growth <span className="text-brand-accent">Multipliers</span></h3>
              <p className="text-white/40 text-sm">Strategic recommendations based on your current performance index.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SuggestionItem 
              title="Carousel Dominance"
              desc="Your visual content has 3.4x more reach capacity than text-only assets. Shift strategy to 70% carousel posts."
            />
            <SuggestionItem 
              title="Optimal Deployment"
              desc="Signals show peak connectivity at 6:45 PM EST. Schedule next 3 posts within this window for 40% more engagement."
            />
            <SuggestionItem 
              title="Signal Saturation"
              desc="Cluster #SaaS is reaching saturation. Pivot to #NeuralGrowth to capture untapped audience velocity."
            />
            <SuggestionItem 
              title="Competitor Gap"
              desc="Top competitors are leveraging 'Day in life' hooks. Neural logs suggest a 22% engagement boost for this theme."
            />
          </div>
        </div>

        <div className={cn(
          "hypr-card p-10 flex flex-col justify-between overflow-hidden relative",
          isElite ? "bg-emerald-500/[0.05] border-emerald-500/20" : "bg-brand-accent/[0.05] border-brand-accent/20"
        )}>
          <div className={cn(
            "absolute top-0 right-0 w-48 h-48 rounded-full blur-[80px] -z-10 translate-x-1/2 -translate-y-1/2",
            isElite ? "bg-emerald-500/10" : "bg-brand-accent/10"
          )} />
          
          <div className="space-y-8 relative z-10">
            <div className={cn(
              "w-14 h-14 rounded-2xl flex items-center justify-center border shadow-lg",
              isElite 
                ? "bg-emerald-500/20 border-emerald-500/30 shadow-emerald-500/20" 
                : "bg-brand-accent/20 border-brand-accent/30 shadow-brand-accent/20"
            )}>
              {isElite ? <ShieldCheck className="w-8 h-8 text-white" /> : <Cpu className="w-8 h-8 text-white" />}
            </div>
            <div className="space-y-3">
              <h4 className="text-2xl font-display font-bold italic tracking-tight">HyprTags <span className="text-white">{isElite ? 'Elite Core' : 'Elite'}</span></h4>
              <p className="text-white/60 text-base leading-relaxed font-light italic">
                {isElite 
                  ? "All neural capacity expansion modules are active. Automated synchronization and viral prediction systems are operational."
                  : "Unlock the full capacity of our Neural Engine. Predictive trends, automated peak-hour posting, and multi-org insights."}
              </p>
            </div>
            
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-xs font-bold text-white/50 uppercase tracking-widest italic leading-none">
                <div className={cn("w-1.5 h-1.5 rounded-full", isElite ? "bg-emerald-500" : "bg-brand-accent")} />
                {isElite ? "Pattern Prediction: ACTIVE" : "Advanced Pattern Prediction"}
              </li>
              <li className="flex items-center gap-3 text-xs font-bold text-white/50 uppercase tracking-widest italic leading-none">
                <div className={cn("w-1.5 h-1.5 rounded-full", isElite ? "bg-emerald-500" : "bg-brand-accent")} />
                {isElite ? "Strategic Scans: UNLIMITED" : "Unlimited Strategic Scans"}
              </li>
              <li className="flex items-center gap-3 text-xs font-bold text-white/50 uppercase tracking-widest italic leading-none">
                <div className={cn("w-1.5 h-1.5 rounded-full", isElite ? "bg-emerald-500" : "bg-brand-accent")} />
                {isElite ? "Neural Bridging: ON" : "API Context Injection"}
              </li>
            </ul>
          </div>
          
          <button 
            onClick={() => !isElite && (window.location.href='/upgrade')}
            className={cn(
              "w-full h-16 mt-12 rounded-2xl text-xs font-bold uppercase tracking-[0.2em] transition-all shadow-xl",
              isElite 
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-emerald-500/10 cursor-default" 
                : "bg-white text-black hover:bg-brand-accent shadow-brand-accent/10"
            )}
          >
            {isElite ? 'Neural Matrix Initialized' : 'Upgrade for $9 / mo'}
          </button>
        </div>
      </div>
    </div>
  );
}

function SuggestionItem({ title, desc }: { title: string, desc: string }) {
  return (
    <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-white/10 transition-all group">
      <h4 className="text-sm font-bold text-white/80 mb-2 group-hover:text-brand-accent transition-colors flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-brand-accent" />
        {title}
      </h4>
      <p className="text-xs text-white/40 leading-relaxed font-light">{desc}</p>
    </div>
  );
}

function MetricCard({ label, value, growth, icon: Icon, isAccent }: any) {
  return (
    <div className={cn(
      "hypr-card p-8 group relative overflow-hidden",
      isAccent && "border-brand-accent/20 bg-brand-accent/[0.02]"
    )}>
      <div className="absolute -right-4 -bottom-4 opacity-[0.02] group-hover:opacity-[0.05] group-hover:scale-110 transition-all">
         <Icon className="w-32 h-32" />
      </div>
      <p className={cn("text-[10px] font-bold uppercase tracking-widest mb-4", isAccent ? "text-brand-accent" : "text-white/30")}>{label}</p>
      <div className="flex items-end justify-between">
        <h4 className="text-4xl font-display font-medium italic tracking-tighter">{value}</h4>
        <span className={cn("text-xs font-bold font-mono px-2 py-0.5 rounded-lg border", isAccent ? "bg-brand-accent/20 border-brand-accent/20 text-brand-accent" : "bg-emerald-500/10 border-emerald-500/10 text-emerald-500")}>
           {growth}
        </span>
      </div>
    </div>
  );
}
