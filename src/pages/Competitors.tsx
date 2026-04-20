import React, { useState } from 'react';
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
  BarChart3
} from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";
import { db, auth, handleFirestoreError } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export default function Competitors() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [insight, setInsight] = useState<any | null>(null);

  const handleAnalyze = async () => {
    if (!url) return;
    setLoading(true);
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [{ text: `Analyze this competitor profile: ${url}. Provide a breakdown of their effective hashtags, their content theme (in 3-5 words), and a growth tip for us.` }],
        config: {
          systemInstruction: "You are an elite competitive intelligence agent. Your job is to extract high-velocity patterns from social media profile URLs. Always return data in strict JSON format.",
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

      const data = JSON.parse(response.text || "{}");
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
        } catch (e) {
          handleFirestoreError(e, 'create', 'competitorInsights');
        }
      }
    } catch (e) {
      console.error(e);
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
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-[0.2em] text-white/40"
        >
          <Cpu className="w-3 h-3 text-brand-accent" />
          Neural Pattern Extraction
        </motion.div>
        
        <div className="space-y-4">
          <h1 className="text-6xl md:text-8xl font-display font-bold leading-[0.85] tracking-tighter hypr-gradient-text px-4">
             Competitor <br /> Intelligence.
          </h1>
          <p className="text-lg md:text-xl text-white/40 max-w-xl mx-auto font-light leading-relaxed">
            Deconstruct competitor growth algorithms. Input any profile URL to visualize their proprietary hashtag strategy.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="hypr-card p-6 bg-white/[0.01] border-white/5 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-accent/5 rounded-full blur-[100px] -z-10 group-hover:bg-brand-accent/10 transition-all" />
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-grow relative">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 w-5 h-5 group-focus-within:text-brand-accent transition-colors" />
              <input 
                type="text" 
                placeholder="Profile URL (e.g., instagram.com/nike)"
                className="w-full bg-transparent border-b border-white/5 py-4 pl-14 pr-4 text-2xl font-medium outline-none focus:border-white/20 transition-all placeholder:text-white/10"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>
            <button 
              disabled={loading || !url} 
              onClick={handleAnalyze} 
              className="btn-hypr-primary h-20 md:w-56 rounded-2xl flex items-center justify-center gap-3 text-sm tracking-widest uppercase"
            >
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <TrendingUp className="w-6 h-6" />}
              Extract Strategy
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {insight && (
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="hypr-card p-10 lg:col-span-2 space-y-12">
               <div className="flex justify-between items-start">
                  <div className="space-y-4">
                    <h3 className="hypr-label">Primary Signal Cluster</h3>
                    <p className="text-4xl md:text-5xl font-display font-bold italic tracking-tighter text-white">"{insight.theme}"</p>
                  </div>
                  <div className="text-right">
                     <p className="hypr-label mb-2">Strategy Match</p>
                     <span className="text-4xl font-display font-bold text-brand-accent">{insight.matchScore}%</span>
                  </div>
               </div>
              
               <div className="space-y-6">
                 <h3 className="hypr-label flex items-center gap-3">
                   <Target className="w-4 h-4" /> High-Velocity Assets
                 </h3>
                 <div className="flex flex-wrap gap-2.5">
                   {insight.effectiveHashtags.map((tag: string, i: number) => (
                     <span key={i} className="px-4 py-2 bg-white/[0.03] border border-white/5 rounded-xl text-xs font-semibold text-white/60 hover:text-white transition-colors cursor-default">#{tag.replace('#','')}</span>
                   ))}
                 </div>
               </div>

               <div className="p-8 bg-brand-accent/[0.02] border border-brand-accent/10 rounded-[2rem] relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-8 opacity-5">
                    <Zap className="w-20 h-20 text-brand-accent" />
                 </div>
                 <h4 className="font-display font-bold text-xl flex items-center gap-3 mb-4 italic">
                   <BarChart3 className="w-5 h-5 text-brand-accent" />
                   Neural Insight
                 </h4>
                 <p className="text-white/50 text-base leading-relaxed font-light">{insight.strategyInsight}</p>
               </div>
            </div>

            <div className="hypr-card p-10 bg-white/[0.01] border-white/10 flex flex-col justify-between">
               <div className="space-y-8">
                  <div className="w-16 h-16 bg-brand-accent/10 rounded-[1.5rem] flex items-center justify-center border border-brand-accent/20">
                     <Zap className="w-8 h-8 text-brand-accent fill-current" />
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold tracking-tight italic">Velocity <span className="text-brand-accent">Injection</span></h3>
                    <p className="text-white/40 leading-relaxed font-light mb-8 italic text-lg">
                      "{insight.growthTip}"
                    </p>
                  </div>
               </div>
               
               <button className="w-full h-16 bg-white/[0.03] hover:bg-white/[0.05] border border-white/5 hover:border-brand-accent/30 text-white/40 hover:text-white rounded-2xl text-[10px] uppercase font-bold tracking-[0.3em] transition-all flex items-center justify-center gap-3 group">
                 Integrate Assets <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
               </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
