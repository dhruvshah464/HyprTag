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
  Cell,
  LineChart,
  Line
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
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { motion } from 'motion/react';
import { db, auth, handleFirestoreError } from '../lib/firebase';
import { useAuth } from '../lib/auth';
import { collection, query, where, orderBy, onSnapshot, limit, Timestamp } from 'firebase/firestore';
import { format } from 'date-fns';
import { cn } from '../lib/utils';

const COLORS = ['#60a5fa', '#f87171', '#fbbf24', '#c084fc'];

export default function Analytics() {
  const { user } = useAuth();
  const [stats, setStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d' | 'ALL'>('30d');

  useEffect(() => {
    if (!user) return;
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
          collection(db, "posts"),
          where("userId", "==", user.uid),
          where("createdAt", ">=", Timestamp.fromDate(startDate)),
          orderBy("createdAt", "desc"),
          limit(50)
        );
      } else {
        q = query(
          collection(db, "posts"),
          where("userId", "==", user.uid),
          orderBy("createdAt", "desc"),
          limit(100)
        );
      }

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setStats(data.reverse());
        setLoading(false);
      }, (err) => {
        handleFirestoreError(err, 'list', 'posts');
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  }, [user, timeRange]);

  const totalReach = stats.reduce((acc, curr) => acc + (curr.reach || 0), 0);
  const totalEngagement = stats.reduce((acc, curr) => acc + (curr.likes || 0) + (curr.comments || 0), 0);

  const engagementData = [
    { name: 'Signals', value: stats.reduce((acc, curr) => acc + (curr.likes || 0), 0) },
    { name: 'Echoes', value: stats.reduce((acc, curr) => acc + (curr.comments || 0), 0) }
  ];

  const velocityData = stats.slice(-14).map((s, i) => {
    const historical = 40 + (Math.random() * 40);
    return {
      name: s.createdAt ? format(s.createdAt.toDate(), 'MM/dd') : `T-${14-i}`,
      velocity: Math.round(historical),
      projected: Math.round(historical * (1 + (i * 0.05)))
    };
  });

  return (
    <div className="space-y-12 max-w-6xl mx-auto text-left">
      <div className="flex flex-col md:flex-row justify-between items-end gap-10">
        <div className="space-y-6">
           <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-neon/10 border border-brand-neon/30 text-[9px] font-mono uppercase tracking-[0.3em] text-brand-neon">
              Proof-Engine // Neural Metrics
           </div>
           <div className="space-y-2">
             <h1 className="text-6xl md:text-8xl font-display uppercase italic leading-none tracking-tighter text-white">
               Proof <span className="text-brand-neon">Engine</span>
             </h1>
             <p className="text-white/40 text-sm font-mono lowercase tracking-[0.2em] italic">deconstruct reach velocity // engagement signals</p>
           </div>
        </div>
        <div className="flex bg-white/5 border border-white/10 p-1">
           {(['24h', '7d', '30d', 'ALL'] as const).map(t => (
             <button 
               key={t} 
               onClick={() => setTimeRange(t)}
               className={cn(
                 "px-4 py-2 text-[9px] font-mono uppercase tracking-widest transition-all",
                 t === timeRange ? 'bg-brand-neon text-brand-void' : 'text-white/30 hover:text-white'
               )}
             >
               {t}
             </button>
           ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="Reach Capacity" value={totalReach.toLocaleString()} growth="+12.5%" icon={Target} />
        <MetricCard label="Nexus Signals" value={totalEngagement.toLocaleString()} growth="+8.2%" icon={Zap} />
        <MetricCard label="Strategy Cycles" value={stats.length.toString()} growth="Optimal" icon={TrendingUp} />
        <MetricCard label="Elite Quotient" value="78" growth="/100" icon={BarChart3} isAccent />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="hypr-card p-10 lg:col-span-2 relative overflow-hidden bg-brand-surface border-white/5">
          <div className="scanline opacity-10" />
          <div className="absolute top-0 right-0 p-8 opacity-[0.02]">
             <TrendingUp className="w-80 h-80 text-brand-neon" />
          </div>
          <div className="flex justify-between items-center mb-10 relative z-10">
            <h5 className="font-bold flex items-center gap-3 text-[10px] font-mono uppercase tracking-[0.3em] text-white/40">
               Velocity Trajectory
            </h5>
            <div className="flex gap-4">
               <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-brand-neon" />
                  <span className="text-[9px] font-mono text-brand-neon uppercase">Projected Reach</span>
               </div>
            </div>
          </div>
          <div className="h-[320px] w-full relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={velocityData}>
                <defs>
                  <linearGradient id="colorVel" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00ff00" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#00ff00" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.2)" fontSize={9} axisLine={false} tickLine={false} />
                <YAxis stroke="rgba(255,255,255,0.2)" fontSize={9} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#020202', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0px' }}
                  itemStyle={{ fontSize: '10px', fontFamily: 'monospace' }}
                />
                <Area type="monotone" dataKey="projected" stroke="#00ff00" fillOpacity={1} fill="url(#colorVel)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="hypr-card p-10 flex flex-col justify-between bg-brand-surface border-white/5">
          <div className="scanline opacity-10" />
          <h5 className="font-bold mb-10 flex items-center gap-3 text-[10px] font-mono uppercase tracking-[0.3em] text-white/40">
            Signal Mix
          </h5>
          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={engagementData}
                  cx="50%" cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                >
                  <Cell fill="#00ff00" />
                  <Cell fill="#00e5ff" />
                </Pie>
                <Tooltip 
                   contentStyle={{ backgroundColor: '#020202', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-4 mt-10">
             {engagementData.map((d, i) => (
               <div key={i} className="flex justify-between items-center p-4 bg-white/[0.02] border border-white/5">
                 <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5" style={{ backgroundColor: i === 0 ? '#00ff00' : '#00e5ff' }} />
                    <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">{d.name}</span>
                 </div>
                 <span className="text-xl font-display italic text-white">{d.value.toLocaleString()}</span>
               </div>
             ))}
          </div>
        </div>
      </div>

      <div className="hypr-card p-12 bg-brand-surface border-white/5 space-y-10 relative overflow-hidden">
        <div className="scanline opacity-10" />
        <div className="flex justify-between items-center relative z-10">
           <h5 className="text-[10px] font-mono text-white/40 uppercase tracking-[0.4em] font-bold">Trending Nodes</h5>
           <Sparkles className="w-4 h-4 text-brand-neon" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 relative z-10">
          {["marketing", "ai", "viral", "creative", "growth", "tech", "social", "nexus"].map((tag, i) => (
             <div key={i} className="p-4 bg-white/[0.02] border border-white/5 text-center group hover:border-brand-neon/30 transition-all cursor-default">
               <p className="text-[10px] font-mono text-white/30 group-hover:text-brand-neon transition-colors">#{tag}</p>
               <div className="mt-4 pt-4 border-t border-white/5">
                 <p className="text-sm font-display italic text-white">{(Math.random() * 20 + 2).toFixed(1)}K</p>
               </div>
             </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 hypr-card p-12 space-y-12 bg-brand-surface border-brand-neon/10">
          <div className="scanline opacity-10" />
          <div className="flex items-center gap-4 relative z-10">
             <div className="w-1.5 h-8 bg-brand-neon" />
             <div>
               <h3 className="text-4xl font-display uppercase italic tracking-tighter text-white">Strategic <span className="text-brand-neon">Multipliers</span></h3>
               <p className="text-white/40 text-[10px] font-mono uppercase tracking-widest italic">neural directives for expansion</p>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
            <SuggestionItem title="Pattern Interrupt" desc="Switch content headers to negative framing for 24% higher signal acquisition." />
            <SuggestionItem title="Context Anchor" desc="Link script forage to Explore Lab signals. Current nexus affinity is 82%." />
            <SuggestionItem title="Saturation Alert" desc="Node #Marketing is nearing threshold. Pivot to #NeuralGrowth for tap potential." />
            <SuggestionItem title="Peak execution" desc="Optimal deployment window opening in 45m. Matrix ready for broadcast." />
          </div>
        </div>

        <div className="hypr-card p-12 flex flex-col justify-between bg-brand-neon/5 border-brand-neon/20 group relative overflow-hidden">
           <div className="scanline opacity-20" />
           <div className="space-y-10 relative z-10">
              <div className="w-12 h-12 bg-brand-neon flex items-center justify-center">
                 <Cpu className="w-6 h-6 text-brand-void" />
              </div>
              <div className="space-y-4">
                 <h4 className="text-3xl font-display uppercase italic tracking-tighter text-white">Elite <span className="text-brand-neon">Matrix</span></h4>
                 <p className="text-xs font-light italic text-white/60 leading-relaxed">
                   Synchronize with the global curiosity matrix. Automated trending, predictive reach, and unlimited neural forge cycles.
                 </p>
              </div>
              <div className="space-y-3">
                 {[1,2,3].map(i => (
                   <div key={i} className="flex items-center gap-3">
                      <div className="w-1 h-1 bg-brand-neon" />
                      <span className="text-[8px] font-mono text-white/40 uppercase tracking-widest">Protocol-0{i} active</span>
                   </div>
                 ))}
              </div>
           </div>
           
           <button className="w-full py-6 mt-12 bg-white text-brand-void font-display uppercase italic tracking-widest text-xs hover:bg-brand-neon transition-all relative z-10">
              Expansion Required
           </button>
        </div>
      </div>
    </div>
  );
}

function SuggestionItem({ title, desc }: { title: string, desc: string }) {
  return (
    <div className="p-8 bg-white/[0.02] border border-white/5 hover:border-brand-neon/20 transition-all group group-hover:bg-brand-neon/[0.02]">
      <h4 className="text-[10px] font-mono text-brand-neon uppercase tracking-[0.3em] mb-4 font-bold italic">{title}</h4>
      <p className="text-xs text-white/50 leading-relaxed font-light italic">"{desc}"</p>
    </div>
  );
}

function MetricCard({ label, value, growth, icon: Icon, isAccent }: any) {
  return (
    <div className={cn(
      "hypr-card p-10 group relative overflow-hidden bg-brand-surface border-white/5",
      isAccent && "border-brand-neon/20"
    )}>
      <div className="scanline opacity-10" />
      <div className="absolute -right-4 -bottom-4 opacity-[0.02] group-hover:scale-110 transition-all">
         <Icon className="w-40 h-40 text-brand-neon" />
      </div>
      <p className="text-[9px] font-mono text-white/30 uppercase tracking-[0.4em] mb-4">{label}</p>
      <div className="flex items-end justify-between relative z-10">
        <h4 className="text-5xl font-display italic text-white">{value}</h4>
        <span className={cn("text-[9px] font-mono px-2 py-1 border", isAccent ? "bg-brand-neon/10 border-brand-neon text-brand-neon" : "bg-white/5 border-white/10 text-white/40")}>
           {growth}
         </span>
      </div>
    </div>
  );
}
