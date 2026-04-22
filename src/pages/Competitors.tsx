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
  Layers
} from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";
import { db, auth, handleFirestoreError } from '../lib/firebase';
import { collection, addDoc, serverTimestamp, query, where, getCountFromServer } from 'firebase/firestore';
import { useAuth } from '../lib/auth';
import { cn } from '../lib/utils';

function getAI() {
  const apiKey = process.env.GEMINI_API_KEY || "dummy-key";
  if (!process.env.GEMINI_API_KEY) {
    console.warn("GEMINI_API_KEY is missing. AI features will be limited.");
  }
  return new (GoogleGenAI as any)({ apiKey });
}

const ai = getAI();

export default function Competitors() {
  const { isElite, user } = useAuth();
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [insight, setInsight] = useState<any | null>(null);
  const [usageCount, setUsageCount] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

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

  const handleAnalyze = async () => {
    if (!url) return;
    setError(null);

    if (!validateUrl(url)) {
      setError("Strategic protocol error: Invalid URL format. Please provide a valid social profile link.");
      return;
    }
    
    if (!isElite && usageCount !== null && usageCount >= 3) {
      setError("Intelligence threshold reached. Upgrade to Elite for unlimited competitor infiltration.");
      return;
    }

    setLoading(true);
    try {
      const model = (ai as any).getGenerativeModel({
        model: "gemini-1.5-flash",
        systemInstruction: "You are an elite competitive intelligence agent. Your job is to extract high-velocity patterns from social media profile URLs. Always return data in strict JSON format. IMPORTANT: For growthTip, provide a SPECIFIC, ACTIONABLE example that can be implemented immediately (e.g., 'Instead of X, try using Y in your next post')."
      });

      const response = await model.generateContent({
        contents: [{ text: `Exhaustively analyze this competitor profile: ${url}. Provide a breakdown of their effective hashtags, their content theme (in 3-5 words), and a growth tip for us with a specific executable example.` }],
        generationConfig: {
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

      const text = response.response.text();
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
            <img src="/logo.svg" alt="L" className="w-full h-full object-cover scale-150" />
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
                    Intelligence Slots: <span className={cn(usageCount >= 3 ? "text-red-500" : "text-brand-accent")}>{usageCount}/3</span>
                 </div>
                 <div className="w-32 h-1 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={cn("h-full transition-all duration-500", usageCount >= 3 ? "bg-red-500" : "bg-brand-accent")}
                      style={{ width: `${Math.min((usageCount / 3) * 100, 100)}%` }}
                    />
                 </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="hypr-card p-6 bg-white border-slate-200 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-accent/5 rounded-full blur-[100px] -z-10 group-hover:bg-brand-accent/10 transition-all" />
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-grow relative">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5 group-focus-within:text-brand-accent transition-colors" />
              <input 
                type="text" 
                placeholder="Profile URL (e.g., instagram.com/nike)"
                className={cn(
                  "w-full bg-transparent border-b py-4 pl-14 pr-4 text-2xl font-medium outline-none transition-all placeholder:text-slate-200 text-slate-800 font-display italic tracking-tight",
                  error ? "border-red-500/50" : "border-slate-100 focus:border-brand-accent/30"
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
              onClick={handleAnalyze} 
              className="btn-hypr-primary h-20 md:w-56 rounded-2xl flex items-center justify-center gap-3 text-sm tracking-widest uppercase shadow-xl shadow-brand-accent/20"
            >
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <TrendingUp className="w-6 h-6" />}
              Extract Strategy
            </button>
          </div>
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-6 p-4 rounded-xl bg-red-50 border border-red-100 flex items-center gap-3 text-red-600 text-[10px] font-bold uppercase tracking-widest"
            >
              <AlertCircle className="w-4 h-4" />
              {error}
            </motion.div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {insight && (
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="hypr-card p-10 lg:col-span-2 space-y-12 bg-white border-slate-200">
               <div className="flex justify-between items-start">
                  <div className="space-y-4">
                    <h3 className="hypr-label text-slate-400">Primary Signal Cluster</h3>
                    <p className="text-4xl md:text-5xl font-display font-bold italic tracking-tighter text-slate-900">"{insight.theme}"</p>
                  </div>
                  <div className="text-right">
                     <p className="hypr-label mb-2 text-slate-400">Strategy Match</p>
                     <span className="text-4xl font-display font-bold text-brand-accent">{insight.matchScore}%</span>
                  </div>
               </div>
              
               <div className="space-y-6">
                 <h3 className="hypr-label flex items-center gap-3 text-slate-400">
                   <Target className="w-4 h-4 text-brand-accent" /> High-Velocity Assets
                 </h3>
                 <div className="flex flex-wrap gap-2.5">
                   {insight.effectiveHashtags.map((tag: string, i: number) => (
                     <span key={i} className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold text-slate-600 hover:text-brand-accent transition-colors cursor-default">#{tag.replace('#','')}</span>
                   ))}
                 </div>
                 <button 
                  onClick={handleCopy}
                  className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-brand-accent hover:text-brand-accent/80 transition-colors"
                >
                  {copied ? (
                    <><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Assets Copied to Clipboard</>
                  ) : (
                    <><Layers className="w-4 h-4" /> Copy High-Velocity Assets</>
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
        )}
      </AnimatePresence>
    </div>
  );
}
