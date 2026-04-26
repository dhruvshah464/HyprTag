import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  DollarSign, 
  MessageSquare, 
  Target,
  Zap,
  TrendingUp,
  Sparkles,
  PieChart,
  Copy,
  Check,
  ChevronRight,
  Rocket,
  Search,
  Filter
} from 'lucide-react';
import { cn } from '../lib/utils';

interface Template {
  id: string;
  category: 'brand-deals' | 'dm-scripts' | 'funnels' | 'offers';
  title: string;
  description: string;
  content: string;
  successRate?: string;
}

const TEMPLATES: Template[] = [
  {
    id: '1',
    category: 'brand-deals',
    title: 'Nexus-1: Outreach for Micro-Creators',
    description: 'Perfect for creators between 1k-10k followers. Focuses on engagement over reach.',
    content: `Subject: Partnership Proposal: [Brand Name] x [Your Name]
\nHi [Name],
\nI've been using [Brand] for [Time] and it's a staple in my workflow. My audience of [Follower Count] in [Niche] is currently struggling with [Problem].
\nI'm planning content for next month and would love to feature [Brand] in a dedicated Reel. My last 3 videos hit [Average Views].
\nOpen to a quick chat?
\nBest,
[Your Name]`,
    successRate: 'High'
  },
  {
    id: '2',
    category: 'dm-scripts',
    title: 'The Soft Liquidation DM',
    description: 'Convert new followers into qualified leads without being aggressive.',
    content: `Hi [Name], thanks for joining the Nexus!
\nI noticed you're also building in [Niche]. I actually just built a custom hook generator that solved my reach issue.
\nWould you like me to send over the logic map? No strings attached!`,
    successRate: 'Elite'
  },
  {
    id: '3',
    category: 'funnels',
    title: 'Bio Forge Matrix',
    description: 'Structure that converts 15% of profile visitors into loyalists.',
    content: `Line 1: I help [Who] solve [Problem] via [Mechanism].
Line 2: 🚀 [Proof: e.g. 1M+ reached / Top 1% Niche]
Line 3: Access the Protocol Below 👇
Line 4: [Link]`,
    successRate: 'Optimal'
  }
];

const STEPS = [
  { id: 1, label: 'Grow', icon: TrendingUp, status: 'Completed' },
  { id: 2, label: 'Capture', icon: Target, status: 'Active' },
  { id: 3, label: 'Convert', icon: MessageSquare, status: 'Locked' },
  { id: 4, label: 'Scale', icon: DollarSign, status: 'Locked' }
];

export default function Earn() {
  const [currentStep, setCurrentStep] = useState(2);
  const [followerGoal, setFollowerGoal] = useState(5000);
  const [activeCategory, setActiveCategory] = useState('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const estimatedYield = Math.floor((followerGoal * 0.25) + 500);

  const handleCopy = (id: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-12 pb-20">
      {/* Header HUD */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-10">
        <div className="space-y-6">
           <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-cyan/10 border border-brand-cyan/30 text-[10px] font-mono uppercase tracking-[0.3em] text-brand-cyan">
              Revenue Protocol v2.4
           </div>
           <div className="space-y-2">
             <h1 className="text-6xl md:text-8xl font-display uppercase italic italic leading-none tracking-tighter text-white">
               Liquidity <span className="text-brand-cyan">Protocol</span>
             </h1>
             <p className="text-white/40 text-sm font-mono lowercase tracking-widest italic">mastering the exchange of attention for capital</p>
           </div>
        </div>

        <div className="hypr-card min-w-[360px] bg-brand-surface border-brand-cyan/20 p-8 space-y-6">
           <div className="flex justify-between items-center font-mono text-[9px] uppercase tracking-widest text-brand-cyan/60">
              <span>Overall Progress</span>
              <span>STEP 0{currentStep} / 04</span>
           </div>
           <div className="grid grid-cols-4 gap-2">
              {[1,2,3,4].map(i => (
                <div key={i} className={cn("h-1", i <= currentStep ? "bg-brand-cyan" : "bg-white/10")} />
              ))}
           </div>
           <div className="flex justify-between items-center">
              <span className="text-[9px] font-mono text-white/20 uppercase tracking-widest italic">Phase: Capture Velocity</span>
              <Sparkles className="w-3 h-3 text-brand-cyan" />
           </div>
        </div>
      </div>

      {/* Journey Map replaced with Revenue Nodes */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
         <RevenueNode label="Pipeline Liquidity" value="₹12,482" trend="+12.4%" />
         <RevenueNode label="Active Unlock Nodes" value="14" trend="+2 new" />
         <RevenueNode label="Strategy Royalty" value="12.4%" trend="Standard" />
         <RevenueNode label="Elite Scaling" value="Active" trend="Level 4" isAccent />
      </div>

      {/* Yield Simulator replaced with Revenue Breakdown */}
      <div className="hypr-card p-12 bg-brand-surface border-white/5 space-y-12 group overflow-hidden relative">
         <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
            <PieChart className="w-80 h-80 text-brand-cyan" />
         </div>
         
         <div className="space-y-4 relative z-10">
            <h2 className="text-4xl font-display uppercase italic tracking-tighter text-white">Revenue <span className="text-brand-cyan">Matrix</span></h2>
            <p className="text-white/40 text-sm font-mono tracking-widest lowercase italic">breakdown of strategic asset performance</p>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-12 gap-8 relative z-10">
            <div className="md:col-span-12 lg:col-span-8 space-y-4">
               <RewardItem title="Strategy Unlock Protocol" sub="14 Unlocks @ ₹600 avg" amount="₹8,400" />
               <RewardItem title="Remix Royalties" sub="421 Remixes // Level 2 Bonus" amount="₹2,140" />
               <RewardItem title="Niche Dominance Bonus" sub="Ends in 14h // SaaS Growth" amount="₹1,942" />
            </div>

            <div className="md:col-span-12 lg:col-span-4 p-12 bg-brand-cyan/[0.03] border border-brand-cyan/20 flex flex-col justify-center items-center text-center space-y-6">
               <p className="text-[9px] font-mono text-brand-cyan uppercase tracking-[0.3em]">Total Intelligence Yield</p>
               <h3 className="text-7xl font-display italic tracking-tighter text-white">
                  ₹12,482
               </h3>
               <button className="hypr-btn hypr-btn-outline border-brand-cyan/40 text-brand-cyan w-full text-[9px] group overflow-hidden">
                  <span className="relative z-10">Initialize Payout Protocol</span>
                  <div className="absolute inset-0 bg-brand-cyan translate-y-full group-hover:translate-y-0 transition-transform" />
               </button>
            </div>
         </div>
      </div>

      {/* Resource Lab */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
         <div className="lg:col-span-4 space-y-6">
            <div className="relative">
              <input 
                type="text" placeholder="Protocol Search..."
                className="w-full h-12 bg-white/5 border border-white/5 pl-4 text-xs font-mono text-white outline-none focus:border-brand-cyan transition-all"
              />
            </div>
            <div className="space-y-1">
               {['all', 'brand-deals', 'dm-scripts', 'funnels'].map(cat => (
                 <button 
                  key={cat} onClick={() => setActiveCategory(cat)}
                  className={cn(
                    "w-full px-4 py-3 border transition-all text-left uppercase text-[9px] font-mono tracking-widest",
                    activeCategory === cat ? "bg-brand-cyan border-brand-cyan text-brand-void" : "bg-white/5 border-transparent text-white/40 hover:bg-white/10"
                  )}
                 >
                   {cat.replace('-', ' ')}
                 </button>
               ))}
            </div>
            <div className="p-6 bg-brand-surface border border-white/5 italic text-xs text-white/40 leading-relaxed font-mono">
               System Alert: Brand outreach is most effective between 09:00 - 11:00 UTC. Synchronize your pitches to this window.
            </div>
         </div>

         <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            {TEMPLATES.map((t) => (
              <div key={t.id} className="hypr-card p-8 border border-white/5 space-y-6 flex flex-col justify-between group">
                 <div className="space-y-4">
                    <div className="flex justify-between items-start">
                       <h3 className="text-lg font-display uppercase italic text-white leading-tight">{t.title}</h3>
                       <Check className="w-4 h-4 text-brand-cyan/20 group-hover:text-brand-cyan" />
                    </div>
                    <p className="text-xs text-white/40 font-light italic leading-relaxed">{t.description}</p>
                 </div>
                 <div className="space-y-4">
                    <div className="p-4 bg-brand-void/50 border border-white/5 text-[9px] font-mono text-white/60 whitespace-pre-wrap max-h-32 overflow-y-auto">
                       {t.content}
                    </div>
                    <button 
                      onClick={() => handleCopy(t.id, t.content)}
                      className="w-full h-10 border border-white/10 text-[8px] font-mono uppercase tracking-[0.2em] text-white/40 hover:border-brand-cyan hover:text-brand-cyan transition-all flex items-center justify-center gap-2"
                    >
                       {copiedId === t.id ? 'Copied to Matrix' : 'Extract Template'}
                    </button>
                 </div>
              </div>
            ))}
         </div>
      </div>
    </div>
  );
}

function RevenueNode({ label, value, trend, isAccent }: any) {
  return (
    <div className={cn(
      "hypr-card p-6 group transition-all",
      isAccent ? "border-brand-cyan/30 bg-brand-cyan/[0.03]" : "bg-brand-surface border-white/5"
    )}>
      <p className="text-[9px] font-mono text-white/40 uppercase tracking-widest mb-4">{label}</p>
      <div className="flex items-end justify-between">
         <h4 className="text-4xl font-display italic text-white leading-none">{value}</h4>
         <span className={cn("text-[8px] font-mono px-2 py-0.5 border", isAccent ? "border-brand-cyan text-brand-cyan" : "border-white/10 text-white/40")}>
           {trend}
         </span>
      </div>
    </div>
  );
}

function RewardItem({ title, sub, amount }: { title: string, sub: string, amount: string }) {
  return (
    <div className="flex justify-between items-center p-6 bg-white/[0.02] border border-white/5 group hover:border-brand-cyan/20 transition-all">
       <div className="space-y-1">
          <h4 className="text-[11px] font-mono text-white uppercase tracking-widest italic">{title}</h4>
          <p className="text-[9px] font-mono text-white/20 uppercase tracking-tighter">{sub}</p>
       </div>
       <div className="text-right">
          <p className="text-xl font-display italic text-brand-cyan">{amount}</p>
          <div className="w-12 h-0.5 bg-brand-cyan/20 ml-auto mt-1" />
       </div>
    </div>
  );
}
