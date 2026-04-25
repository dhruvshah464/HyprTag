import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  DollarSign, 
  MessageSquare, 
  Mail, 
  PieChart, 
  Copy, 
  Check, 
  ArrowUpRight, 
  Target,
  FileText,
  MousePointer2,
  Zap,
  TrendingUp,
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
    title: 'First Pitch: Outreach for Micro-Creators',
    description: 'Perfect for creators between 1k-10k followers. Focuses on engagement over reach.',
    content: `Subject: Partnership Proposal: Hi [Brand Name] x [Your Name]

Hi [Name/Brand Team],

I've been a huge fan of [Brand] ever since [Specific detail about the product].

I am a creator in the [Your Niche] space with a highly engaged audience of [Follower Count] who regularly ask me about [Problem your niche has].

I'm currently planning my content for next month and would love to feature [Brand] in a dedicated [Reel/Video]. My audience engagement rate is [Engagement %], which is [x%] higher than the industry average.

Would you be open to a quick chat about how we can drive [Specific goal like sales/awareness] for [Brand] next month?

Best,
[Your Name]`,
    successRate: 'High'
  },
  {
    id: '2',
    category: 'dm-scripts',
    title: 'Follower to Client Conversion',
    description: 'A soft-sell approach for new followers who fit your ideal client profile.',
    content: `Hi [Name], 

Thanks for the follow! I noticed you're also into [Topic/Niche]. 

I actually just put together a quick [PDF/Freebie] on how to [Solve specific problem]. Would you like me to send it over? No strings attached!`,
    successRate: 'Elite'
  },
  {
    id: '3',
    category: 'funnels',
    title: 'Bio Optimization Formula',
    description: 'The "Who, What, Why" structure that converts profile visits into followers.',
    content: `Line 1: I help [Target Audience] [Result you provide].
Line 2: [Your authority: e.g. Helped 100+ clients / 1M+ Views].
Line 3: [Clear CTA with emoji] 👇
Line 4: [Link]`,
    successRate: '92%'
  },
  {
    id: '4',
    category: 'brand-deals',
    title: 'Follow-up Script (7 Days Later)',
    description: 'Stay top-of-mind without being annoying.',
    content: `Hi [Name], 

Just wanted to bump this to the top of your inbox.

I actually just had a post go viral in the [Niche] space ([Link to post]), and the audience is really asking for recommendations like [Brand].

Would love to bridge that gap. Let me know if you're interested!`,
    successRate: 'Medium'
  },
  {
    id: '5',
    category: 'offers',
    title: 'Digital Product Pricing Matrix',
    description: 'How to price your guides, presets, or courses for maximum conversion.',
    content: `Freebie: Lead Magnet (Email capture)
$7 - $27: Impulse Buy (Low risk, quick win)
$47 - $97: Mid-Tier (Deep dive, standard guide)
$197+: Signature Offer (Full system / transformation)`,
    successRate: 'Stable'
  }
];

const CATEGORIES = [
  { id: 'all', label: 'All Resources', icon: Target },
  { id: 'brand-deals', label: 'Brand Deals', icon: DollarSign },
  { id: 'dm-scripts', label: 'DM Scripts', icon: MessageSquare },
  { id: 'funnels', label: 'Funnel Maps', icon: TrendingUp },
  { id: 'offers', label: 'Offer Design', icon: PieChart },
];

export default function Earn() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filtered = TEMPLATES.filter(t => {
    const matchesCat = activeCategory === 'all' || t.category === activeCategory;
    const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase()) || 
                         t.description.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleCopy = (id: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-12 pb-20 max-w-6xl mx-auto text-left">
      {/* Header */}
      <div className="space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold uppercase tracking-widest text-emerald-600">
          <DollarSign className="w-3 h-3" />
          Revenue Accelerator
        </div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-5xl font-display font-bold italic tracking-tighter text-slate-900">The <span className="text-emerald-500">Monetization</span> Lab</h1>
            <p className="text-slate-500 max-w-lg">Turn your attention into income. Use proven pitch templates, conversion scripts, and offer frameworks.</p>
          </div>
          <div className="flex bg-slate-100 p-1 rounded-2xl">
             <div className="flex items-center gap-2 px-4 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <Target className="w-3 h-3" />
                Live Revenue Stats: <span className="text-slate-900">$0.00</span>
             </div>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search scripts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-12 pl-12 pr-4 bg-white border border-slate-100 rounded-xl outline-none focus:border-emerald-500 transition-all text-sm font-light"
            />
          </div>
          <div className="space-y-1">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left border transition-all",
                  activeCategory === cat.id 
                    ? "bg-slate-900 border-slate-900 text-white" 
                    : "bg-white border-transparent text-slate-500 hover:bg-slate-50"
                )}
              >
                <cat.icon className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-widest">{cat.label}</span>
              </button>
            ))}
          </div>
          
          <div className="p-6 bg-slate-900 rounded-[2rem] relative overflow-hidden group">
            <Zap className="absolute -bottom-4 -right-4 w-24 h-24 text-emerald-500 opacity-20" />
            <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-2">Growth Tip</p>
            <p className="text-sm font-light italic text-slate-300 leading-relaxed">"Consistency in outreach is more important than the scale of your following. Pitch 3 brands today."</p>
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filtered.map((template, idx) => (
              <motion.div 
                key={template.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="hypr-card p-6 flex flex-col h-full group"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center border",
                    template.category === 'brand-deals' ? "bg-emerald-50 border-emerald-100 text-emerald-500" :
                    template.category === 'dm-scripts' ? "bg-blue-50 border-blue-100 text-blue-500" :
                    template.category === 'funnels' ? "bg-purple-50 border-purple-100 text-purple-500" :
                    "bg-orange-50 border-orange-100 text-orange-500"
                  )}>
                    {template.category === 'brand-deals' ? <DollarSign className="w-5 h-5" /> :
                     template.category === 'dm-scripts' ? <MessageSquare className="w-5 h-5" /> :
                     template.category === 'funnels' ? <TrendingUp className="w-5 h-5" /> :
                     <Target className="w-5 h-5" />}
                  </div>
                  {template.successRate && (
                    <div className="text-[8px] font-bold uppercase tracking-widest px-2 py-1 bg-slate-50 border border-slate-100 rounded-lg text-slate-400">
                      Success: <span className="text-emerald-500">{template.successRate}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2 mb-6 flex-grow">
                  <h3 className="font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">{template.title}</h3>
                  <p className="text-xs text-slate-500 font-light leading-relaxed">{template.description}</p>
                </div>

                <div className="space-y-4">
                  <div className="relative">
                    <pre className="p-4 bg-slate-50 border border-slate-100 rounded-xl text-[10px] text-slate-600 font-mono overflow-x-hidden whitespace-pre-wrap max-h-40 overflow-y-auto">
                      {template.content}
                    </pre>
                  </div>
                  <button 
                    onClick={() => handleCopy(template.id, template.content)}
                    className="w-full flex items-center justify-center gap-2 h-12 bg-white border border-slate-100 rounded-xl text-[10px] font-bold uppercase tracking-widest text-slate-600 hover:border-emerald-500 hover:text-emerald-500 transition-all"
                  >
                    {copiedId === template.id ? (
                      <><Check className="w-4 h-4" /> Copied</>
                    ) : (
                      <><Copy className="w-4 h-4" /> Copy Template</>
                    )}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="h-96 flex flex-col items-center justify-center border border-dashed border-slate-200 rounded-[3rem]">
               <Filter className="w-12 h-12 text-slate-200 mb-4" />
               <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">No scripts matching your search</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
