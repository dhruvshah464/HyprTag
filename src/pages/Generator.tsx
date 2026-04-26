import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Upload, 
  BarChart3, 
  Check, 
  Copy, 
  Zap,
  Loader2,
  X,
  Calendar,
  AlertCircle,
  ImagePlus,
  ArrowRight,
  CheckCircle2,
  ShieldAlert,
  Rocket
} from 'lucide-react';
import { cn } from '../lib/utils';
import { generateHashtags, AnalysisResponse } from '../lib/gemini';
import { db, auth, handleFirestoreError } from '../lib/firebase';
import { collection, addDoc, serverTimestamp, query, where, getCountFromServer } from 'firebase/firestore';
import { useAuth } from '../lib/auth';
import { useNavigate, useLocation } from 'react-router-dom';
import { EliteUpgradeModal } from '../components/EliteUpgradeModal';
import { geminiService } from '../services/geminiService';
import { contentService } from '../services/contentService';

export default function Generator() {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [scheduling, setScheduling] = useState(false);
  const [scheduleDate, setScheduleDate] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.initialIdea) {
      setContent(location.state.initialIdea);
    }
  }, [location.state]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!content && !image) return;
    setLoading(true);
    try {
      const data = await geminiService.analyzeViralPotential(content);
      setResult({
        summary: data.analysis,
        score: data.score,
        hashtags: data.hashtags || []
      });
      
      if (user) {
        await contentService.generateAndSave(user.uid, content);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSchedule = async () => {
    if (!user || !scheduleDate) return;
    try {
      await addDoc(collection(db, "posts"), {
        userId: user.uid,
        content: content,
        hashtags: result?.hashtags || [],
        platforms: ["Instagram", "TikTok"],
        scheduledTime: new Date(scheduleDate).toISOString(),
        status: "scheduled",
        createdAt: serverTimestamp(),
      });
      setScheduling(false);
      navigate('/planner');
    } catch (e) {
      handleFirestoreError(e, 'create', 'posts');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <div className="space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-neon/10 border border-brand-neon/30 text-[9px] font-mono uppercase tracking-[0.3em] text-brand-neon">
          Nexus-Forge // Script Generation
        </div>
        <div className="space-y-2">
           <h1 className="text-6xl md:text-8xl font-display uppercase italic leading-none tracking-tighter text-white">
             Script <span className="text-brand-neon">Forge</span>
           </h1>
           <p className="text-white/40 text-sm font-mono lowercase tracking-[0.2em] italic">convert vision into viral structure</p>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="hypr-card p-10 space-y-10 group bg-brand-surface border-white/5"
      >
        <div className="space-y-12 relative z-10">
          <div className="relative text-left">
            <textarea
              autoFocus
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's the core realization or hook idea?"
              className="w-full bg-transparent border-b border-white/10 px-0 py-6 text-3xl font-display uppercase italic leading-tight outline-none focus:border-brand-neon/50 transition-all placeholder:text-white/10 text-white"
              rows={3}
            />
          </div>

          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="flex-grow w-full">
               <label className="flex items-center justify-center gap-4 w-full h-32 border border-dashed border-white/10 hover:border-brand-neon/30 hover:bg-white/[0.02] cursor-pointer transition-all group/upload relative overflow-hidden">
                  <input type="file" className="hidden" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" />
                  {image ? (
                    <>
                      <img src={image} alt="Context" className="absolute inset-0 w-full h-full object-cover opacity-20" />
                      <div className="relative z-10 flex items-center gap-3 bg-brand-surface/80 px-4 py-2 border border-brand-neon/20 backdrop-blur-md">
                         <Check className="w-4 h-4 text-brand-neon" />
                         <span className="font-mono text-[9px] uppercase tracking-widest text-brand-neon">Asset Synced</span>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                       <Upload className="w-6 h-6 text-white/20 group-hover/upload:text-brand-neon transition-all" />
                       <span className="text-[9px] font-mono uppercase tracking-[0.4em] text-white/20 group-hover/upload:text-white transition-all">Upload Visual Matrix</span>
                    </div>
                  )}
               </label>
            </div>
            
            <button
              onClick={() => handleAnalyze()}
              disabled={loading || (!content && !image)}
              className="w-full md:w-32 h-32 hypr-btn hypr-btn-primary flex flex-col items-center justify-center gap-3 p-0"
            >
              {loading ? (
                <Loader2 className="w-8 h-8 animate-spin" />
              ) : (
                <>
                  <Rocket className="w-8 h-8" />
                  <span className="text-[8px] font-mono uppercase tracking-[0.2em] font-bold">Initiate</span>
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {result && (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-12"
          >
             <div className="hypr-card border-brand-neon/20 p-10 relative group">
                <div className="scanline opacity-10" />
                <div className="flex flex-col md:flex-row justify-between gap-10 relative z-10">
                   <div className="space-y-4 max-w-xl">
                      <p className="text-[9px] font-mono text-brand-neon uppercase tracking-widest">Forged Strategy</p>
                      <p className="text-xl font-light italic text-white/80 leading-relaxed italic">"{result.summary}"</p>
                   </div>
                   <div className="flex flex-col items-center md:items-end justify-center gap-4">
                      <div className="text-center md:text-right">
                        <p className="text-[9px] font-mono text-white/30 uppercase">Yield Score</p>
                        <p className="text-5xl font-display italic text-brand-neon">{result.score}%</p>
                      </div>
                      <button 
                        onClick={() => setScheduling(true)}
                        className="hypr-btn hypr-btn-primary bg-white text-brand-void hover:bg-brand-neon hover:text-brand-void"
                      >
                         Sync to Matrix
                      </button>
                   </div>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {result.hashtags.map((tag: string, i: number) => (
                  <div key={i} className="px-6 py-4 bg-brand-surface border border-white/5 text-sm font-mono text-white/40 italic flex justify-between items-center group hover:border-brand-neon/30 transition-all">
                     <span>#{tag.replace('#', '')}</span>
                     <Sparkles className="w-3 h-3 text-white/10 group-hover:text-brand-neon transition-colors" />
                  </div>
                ))}
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {scheduling && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-brand-void/90 backdrop-blur-md">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="bg-brand-surface border border-white/10 max-w-md w-full p-12 relative overflow-hidden"
            >
              <div className="scanline opacity-10" />
              <div className="flex justify-between items-center mb-10 relative z-10">
                 <h3 className="text-4xl font-display font-bold italic uppercase text-white">Sync <span className="text-brand-neon">Time</span></h3>
                 <button onClick={() => setScheduling(false)} className="text-white/20 hover:text-white transition-colors"><X className="w-6 h-6" /></button>
              </div>
              <div className="space-y-8 relative z-10">
                <div className="space-y-2 text-left">
                   <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest pl-1">Execution Window</label>
                   <input type="datetime-local" className="w-full p-6 bg-white/5 border border-white/5 text-white italic outline-none focus:border-brand-neon transition-all"
                     value={scheduleDate} onChange={(e) => setScheduleDate(e.target.value)}
                   />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <button onClick={() => setScheduling(false)} className="hypr-btn hypr-btn-outline">Hold</button>
                  <button onClick={handleSchedule} disabled={!scheduleDate} className="hypr-btn hypr-btn-primary">Finalize</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
