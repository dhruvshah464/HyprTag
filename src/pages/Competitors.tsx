import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  Search, 
  Loader2, 
  TrendingUp, 
  ArrowRight,
  ExternalLink,
  Target,
  Zap,
  Globe,
  CheckCircle2,
  Cpu,
  BarChart3,
  AlertCircle,
  Layers,
  Share2,
  Copy,
  X
} from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";
import { db, auth, handleFirestoreError } from '../lib/firebase';
import { collection, addDoc, serverTimestamp, query, where, getCountFromServer } from 'firebase/firestore';
import { useAuth } from '../lib/auth';
import { cn } from '../lib/utils';
import { useNavigate } from 'react-router-dom';
import { EliteUpgradeModal } from '../components/EliteUpgradeModal';

function getAI() {
  const apiKey = process.env.GEMINI_API_KEY!;
  return new GoogleGenAI({ apiKey });
}

const ai = getAI();

const Skeleton = ({ className, ...props }: { className?: string } & React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("animate-pulse bg-slate-100 rounded-xl", className)} {...props} />
);

const AnalysisSkeleton = () => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
    <div className="hypr-card p-10 lg:col-span-2 space-y-12 bg-white border-slate-200">
       <div className="flex justify-between items-start">
          <div className="space-y-4 w-full">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-12 w-3/4" />
          </div>
          <div className="text-right space-y-2">
             <Skeleton className="h-4 w-24 ml-auto" />
             <Skeleton className="h-10 w-16 ml-auto" />
          </div>
       </div>
      
       <div className="space-y-6">
         <div className="flex items-center gap-3">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-40" />
         </div>
         <div className="flex flex-wrap gap-2.5">
           {[1, 2, 3, 4, 5].map((i) => (
             <Skeleton key={i} className="h-10 w-24" />
           ))}
         </div>
         <Skeleton className="h-4 w-48" />
       </div>

       <div className="p-8 bg-slate-50 border border-slate-100 rounded-[2rem] space-y-4">
         <div className="flex items-center gap-3">
            <Skeleton className="h-5 w-5" />
            <Skeleton className="h-6 w-32" />
         </div>
         <Skeleton className="h-4 w-full" />
         <Skeleton className="h-4 w-5/6" />
       </div>
    </div>

    <div className="hypr-card p-10 bg-white border-slate-200 border shadow-sm flex flex-col justify-between space-y-8">
       <div className="space-y-8">
          <Skeleton className="w-16 h-16 rounded-[1.5rem]" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
       </div>
       <Skeleton className="h-16 w-full rounded-2xl" />
    </div>
  </div>
);

export default function Competitors() {
  const { isElite, user } = useAuth();
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [insight, setInsight] = useState<any | null>(null);
  const [usageCount, setUsageCount] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [tagToCopy, setTagToCopy] = useState<string | null>(null);
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function checkUsage() {
      if (!user || isElite) return;
      try {
        const q = query(collection(db, "competitorInsights"), where("userId", "==", user.uid));
        const snapshot = await getCountFromServer(q);
        setUsageCount(snapshot.data().count);
      } catch (e) {
        console.error("Error checking usage:", e);
      }
    }
    checkUsage();
  }, [user, isElite]);

  const validateUrl = (u: string) => {
    const pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
      '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return !!pattern.test(u);
  };

  const handleCopy = () => {
    if (!insight?.effectiveHashtags) return;
    const tags = insight.effectiveHashtags.map((t: string) => `#${t.replace('#','')}`).join(' ');
    navigator.clipboard.writeText(tags);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyTag = (tag: string) => {
    navigator.clipboard.writeText(`#${tag.replace('#', '')}`);
    setTagToCopy(tag);
    setTimeout(() => setTagToCopy(null), 1500);
  };

  const handleShare = async () => {
    if (!insight) return;
    const shareText = `Check out this strategic insight I extracted for ${url} via HyprTags: ${insight.strategyInsight}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'HyprTags Strategic Insight',
          text: shareText,
          url: window.location.href,
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      // Fallback
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`, '_blank');
    }
  };

  const handleAnalyze = async () => {
    if (!url) return;
    setError(null);
    setInsight(null); // Clear previous results

    if (!validateUrl(url)) {
      setError("Strategic protocol error: Invalid URL format. Please provide a valid social profile link.");
      return;
    }
    
    if (!isElite && usageCount !== null && usageCount >= 1) {
      setUpgradeModalOpen(true);
      return;
    }

    setLoading(true);
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [{ text: `Exhaustively analyze this competitor profile: ${url}. Provide a breakdown of their effective hashtags, their content theme (in 3-5 words), and a growth tip for us with a specific executable example.` }],
        config: {
          systemInstruction: "You are an elite competitive intelligence agent. Your job is to extract high-velocity patterns from social media profile URLs. Always return data in strict JSON format. IMPORTANT: For growthTip, provide a SPECIFIC, ACTIONABLE example that can be implemented immediately (e.g., 'Instead of X, try using Y in your next post').",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              theme: { type: Type.STRING },
              effectiveHashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
              strategyInsight: { type: Type.STRING },
              growthTip: { type: Type.STRING },
              matchScore: { type: Type.NUMBER }
            },
            required: ["theme", "effectiveHashtags", "strategyInsight", "growthTip", "matchScore"]
          }
        }
      });

      const text = response.text;
      if (!text) throw new Error("Neural signal lost. Intelligence extraction failed.");
      
      const data = JSON.parse(text);
      setInsight(data);

      if (auth.currentUser) {
        try {
          await addDoc(collection(db, "competitorInsights"), {
            userId: auth.currentUser.uid,
            profileUrl: url,
            insight: data.strategyInsight,
            trendingTags: data.effectiveHashtags,
            createdAt: serverTimestamp()
          });
          if (usageCount !== null) setUsageCount(prev => (prev || 0) + 1);
        } catch (e) {
          handleFirestoreError(e, 'create', 'competitorInsights');
        }
      }
    } catch (e: any) {
      console.error(e);
      setError("Tactical error during intelligence extraction. Verify the URL and security clearance.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-20 pb-20">
      <div className="max-w-3xl mx-auto text-center space-y-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-slate-50 border border-slate-100 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 shadow-sm overflow-hidden"
        >
          <div className="w-4 h-4 bg-slate-900 rounded-sm flex items-center justify-center overflow-hidden">
            <img src="/logo.png" alt="L" className="w-full h-full object-cover scale-150" />
          </div>
          Neural Pattern Extraction
        </motion.div>
        
        <div className="space-y-4">
          <h1 className="text-6xl md:text-8xl font-display font-bold leading-[0.85] tracking-tighter hypr-gradient-text px-4">
             Competitor <br /> Intelligence.
          </h1>
          <p className="text-lg md:text-xl text-slate-500 max-w-xl mx-auto font-light leading-relaxed">
            Deconstruct competitor growth algorithms. Input any profile URL to visualize their proprietary hashtag strategy.
          </p>

          {!isElite && usageCount !== null && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="pt-4"
            >
              <div className="inline-flex flex-col items-center gap-2">
                 <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-300">
                    Intelligence Slots: <span className={cn(usageCount >= 1 ? "text-red-500" : "text-brand-accent")}>{usageCount}/1</span>
                 </div>
                 <div className="w-32 h-1 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={cn("h-full transition-all duration-500", usageCount >= 1 ? "bg-red-500" : "bg-brand-accent")}
                      style={{ width: `${Math.min((usageCount / 1) * 100, 100)}%` }}
                    />
                 </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className={cn(
          "hypr-card p-6 bg-white shadow-2xl relative overflow-hidden group transition-all duration-300 border",
          error ? "border-red-500 ring-2 ring-red-500/10" : "border-slate-200 hover:border-brand-accent/40 focus-within:border-brand-accent focus-within:ring-4 focus-within:ring-brand-accent/5"
        )}>
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-accent/5 rounded-full blur-[100px] -z-10 group-hover:bg-brand-accent/10 transition-all" />
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-grow relative">
              <Search className={cn(
                "absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors",
                error ? "text-red-500" : "text-slate-300 group-focus-within/input:text-brand-accent"
              )} />
              <input 
                type="text" 
                placeholder="Profile URL (e.g., instagram.com/nike)"
                className={cn(
                  "w-full bg-transparent py-4 pl-14 pr-4 text-2xl font-medium outline-none transition-all placeholder:text-slate-200 font-display italic tracking-tight rounded-xl",
                  error 
                    ? "text-red-600 placeholder:text-red-300" 
                    : "text-slate-800"
                )}
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  if (error) setError(null);
                }}
              />
            </div>
            <button 
              disabled={loading || !url} 
              onClick={() => handleAnalyze()} 
              className="btn-hypr-primary h-20 md:w-56 rounded-2xl flex items-center justify-center gap-3 text-sm tracking-widest uppercase shadow-xl shadow-brand-accent/20"
            >
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <TrendingUp className="w-6 h-6" />}
              Extract Strategy
            </button>
          </div>
        </div>
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 ml-1 flex items-center gap-2 text-red-500 text-xs font-bold uppercase tracking-widest"
          >
            <AlertCircle className="w-3.5 h-3.5" />
            {error}
          </motion.div>
        )}
      </div>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div 
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <AnalysisSkeleton />
          </motion.div>
        ) : insight ? (
          <motion.div 
            key="results"
            initial={{ opacity: 0, y: 40 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="grid grid-cols-1 lg:grid-cols-3 gap-10"
          >
            <div className="hypr-card p-10 lg:col-span-2 space-y-12 bg-white border-slate-200">
               <div className="flex justify-between items-start">
                  <div className="space-y-4">
                    <h3 className="hypr-label text-slate-400">Primary Signal Cluster</h3>
                    <p className="text-4xl md:text-5xl font-display font-bold italic tracking-tighter text-slate-900">"{insight.theme}"</p>
                  </div>
                  <div className="flex flex-col items-end gap-4">
                    <div className="text-right">
                       <p className="hypr-label mb-2 text-slate-400">Strategy Match</p>
                       <span className="text-4xl font-display font-bold text-brand-accent">{insight.matchScore}%</span>
                    </div>
                    <button 
                      onClick={handleShare}
                      className="p-3 bg-slate-50 border border-slate-100 rounded-xl hover:bg-slate-100 hover:border-brand-accent/20 transition-all group"
                      title="Share Findings"
                    >
                      <Share2 className="w-5 h-5 text-slate-400 group-hover:text-brand-accent" />
                    </button>
                  </div>
               </div>
              
               <div className="space-y-6">
                 <h3 className="hypr-label flex items-center gap-3 text-slate-400">
                   <Target className="w-4 h-4 text-brand-accent" /> High-Velocity Assets
                 </h3>
                 <div className="flex flex-wrap gap-2.5">
                   {insight.effectiveHashtags.map((tag: string, i: number) => (
                     <button 
                        key={i} 
                        onClick={() => handleCopyTag(tag)}
                        className={cn(
                          "px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold transition-all relative overflow-hidden group/tag",
                          tagToCopy === tag ? "text-emerald-600 border-emerald-200 bg-emerald-50" : "text-slate-600 hover:text-brand-accent hover:border-brand-accent/20"
                        )}
                      >
                        <span className="relative z-10">#{tag.replace('#','')}</span>
                        {tagToCopy === tag && (
                          <motion.span 
                            initial={{ scale: 0 }} 
                            animate={{ scale: 1 }} 
                            className="absolute inset-0 bg-emerald-100/50 flex items-center justify-center"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </motion.span>
                        )}
                        <Copy className="w-3 h-3 absolute right-1 top-1 opacity-0 group-hover/tag:opacity-40 transition-opacity" />
                     </button>
                   ))}
                 </div>
                 <button 
                  onClick={handleCopy}
                  className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-brand-accent hover:text-brand-accent/80 transition-colors"
                >
                  {copied ? (
                    <><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Assets Copied to Clipboard</>
                  ) : (
                    <><Layers className="w-4 h-4" /> Copy All Assets</>
                  )}
                </button>
               </div>

               <div className="p-8 bg-slate-50 border border-slate-100 rounded-[2rem] relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-8 opacity-[0.03]">
                    <Zap className="w-20 h-20 text-brand-accent" />
                  </div>
                 <h4 className="font-display font-bold text-xl flex items-center gap-3 mb-4 italic text-slate-800">
                   <BarChart3 className="w-5 h-5 text-brand-accent" />
                   Neural Insight
                 </h4>
                 <p className="text-slate-500 text-base leading-relaxed font-light">{insight.strategyInsight}</p>
               </div>

               <div className="space-y-6 pt-4">
                 <h3 className="hypr-label flex items-center gap-3 text-slate-400">
                   <Layers className="w-4 h-4 text-brand-accent" /> Competitive Alignment
                 </h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-4">
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Your Neural Core</p>
                     <div className="flex flex-wrap gap-2">
                       {['saas', 'growth', 'ai'].map(tag => (
                         <span key={tag} className="px-3 py-1.5 rounded-lg bg-white border border-slate-100 text-xs font-mono text-slate-500">#{tag}</span>
                       ))}
                     </div>
                   </div>
                   <div className="space-y-4">
                     <p className="text-[10px] font-bold text-brand-accent uppercase tracking-widest px-1">Competitor Edge</p>
                     <div className="flex flex-wrap gap-2">
                       {insight.effectiveHashtags.slice(0, 3).map((tag: string) => (
                         <span key={tag} className={cn(
                           "px-3 py-1.5 rounded-lg border text-xs font-mono transition-all",
                           ['saas', 'growth', 'ai'].includes(tag.toLowerCase().replace('#','')) 
                             ? "bg-brand-accent/10 border-brand-accent/30 text-brand-accent font-bold" 
                             : "bg-white border-slate-100 text-slate-500"
                         )}>
                           #{tag.replace('#','')}
                         </span>
                       ))}
                     </div>
                   </div>
                 </div>
                 <p className="text-[10px] text-slate-400 italic font-medium">
                   {insight.effectiveHashtags.some((t: string) => ['saas', 'growth', 'ai'].includes(t.toLowerCase().replace('#','')))
                     ? "Neural link detected: Direct strategic overlap on core growth signals."
                     : "Unique signal detected: Competitor is targeting an orthogonal audience segment."
                   }
                 </p>
               </div>
            </div>

            <div className="hypr-card p-10 bg-white border-slate-200 border shadow-sm flex flex-col justify-between">
               <div className="space-y-8">
                  <div className="w-16 h-16 bg-brand-accent/10 rounded-[1.5rem] flex items-center justify-center border border-brand-accent/20 shadow-inner">
                     <Zap className="w-8 h-8 text-brand-accent fill-current" />
                  </div>
                  <div className="space-y-4 text-left">
                    <h3 className="text-2xl font-bold tracking-tight italic text-slate-900">Velocity <span className="text-brand-accent">Injection</span></h3>
                    <p className="text-slate-500 leading-relaxed font-light mb-8 italic text-lg">
                      "{insight.growthTip}"
                    </p>
                  </div>
               </div>
               
               <button className="w-full h-16 bg-slate-50 hover:bg-slate-100 border border-slate-100 hover:border-brand-accent/30 text-slate-400 hover:text-slate-900 rounded-2xl text-[10px] uppercase font-bold tracking-[0.3em] transition-all flex items-center justify-center gap-3 group">
                 Integrate Assets <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
               </button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
      <EliteUpgradeModal isOpen={upgradeModalOpen} onClose={() => setUpgradeModalOpen(false)} />
    </div>
  );
}
