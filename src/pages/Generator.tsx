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
  ShieldAlert
} from 'lucide-react';
import { cn } from '../lib/utils';
import { generateHashtags, AnalysisResponse } from '../lib/gemini';
import { db, auth, handleFirestoreError } from '../lib/firebase';
import { collection, addDoc, serverTimestamp, query, where, getCountFromServer } from 'firebase/firestore';
import { useAuth } from '../lib/auth';

export default function Generator() {
  const { isElite, user } = useAuth();
  const [content, setContent] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResponse | null>(null);
  const [copying, setCopying] = useState<string | null>(null);
  const [scheduling, setScheduling] = useState(false);
  const [scheduleDate, setScheduleDate] = useState('');
  const [usageCount, setUsageCount] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function checkUsage() {
      if (!user || isElite) return;
      try {
        const q = query(collection(db, "generations"), where("userId", "==", user.uid));
        const snapshot = await getCountFromServer(q);
        setUsageCount(snapshot.data().count);
      } catch (e) {
        console.error("Error checking usage:", e);
      }
    }
    checkUsage();
  }, [user, isElite]);

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
    
    if (!isElite && usageCount !== null && usageCount >= 5) {
      alert("Neural limit reached. Upgrade to Elite for unlimited strategic extraction.");
      return;
    }

    setLoading(true);
    try {
      const data = await generateHashtags(content, image || undefined);
      setResult(data);
      
      if (auth.currentUser) {
        try {
          await addDoc(collection(db, "generations"), {
            userId: auth.currentUser.uid,
            content: content || "Image Analysis",
            result: data,
            createdAt: serverTimestamp(),
            reach: 0,
            likes: 0,
            comments: 0
          });
          // Update local count
          if (usageCount !== null) setUsageCount(prev => (prev || 0) + 1);
        } catch (e) {
          handleFirestoreError(e, 'create', 'generations');
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSchedule = async () => {
    if (!auth.currentUser || !result || !scheduleDate) return;
    try {
      await addDoc(collection(db, "scheduledPosts"), {
        userId: auth.currentUser.uid,
        content,
        hashtags: result.results.flatMap(r => r.hashtags),
        platforms: ["Instagram", "Twitter"],
        scheduledTime: new Date(scheduleDate).toISOString(),
        status: "pending",
        createdAt: serverTimestamp()
      });
      setScheduling(false);
      alert("Post scheduled successfully!");
    } catch (e) {
      handleFirestoreError(e, 'create', 'scheduledPosts');
    }
  };

  const copyTags = (tags: string[]) => {
    const text = tags.join(' ');
    navigator.clipboard.writeText(text);
    setCopying(text);
    setTimeout(() => setCopying(null), 2000);
  };

  return (
    <div className="space-y-16 py-10 max-w-6xl mx-auto">
      {/* Hero Section */}
      <div className="max-w-3xl mx-auto text-center space-y-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-[10px] font-bold uppercase tracking-[0.2em]",
            isElite ? "bg-emerald-50 border-emerald-100 text-emerald-500 shadow-sm" : "bg-slate-50 border-slate-100 text-slate-400 shadow-sm"
          )}
        >
          {isElite ? <ShieldAlert className="w-3 h-3 text-emerald-500" /> : <Sparkles className="w-3 h-3 text-brand-accent" />}
          {isElite ? 'Elite Core Protocol Active' : 'Neural Growth Engine'}
        </motion.div>
        
        <div className="space-y-4">
          <h1 className="text-6xl md:text-8xl font-display font-bold leading-[0.85] tracking-tighter hypr-gradient-text px-4">
            Strategic <br /> Intelligence.
          </h1>
          <p className="text-lg md:text-xl text-slate-500 max-w-xl mx-auto font-light leading-relaxed font-sans italic">
            "HyprTags uses proprietary neural models to predict hashtag velocity and audience resonance in real-time."
          </p>

          {!isElite && usageCount !== null && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="pt-4"
            >
              <div className="inline-flex flex-col items-center gap-2">
                 <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-300">
                    Neural Capacity: <span className={cn(usageCount >= 5 ? "text-red-500" : "text-brand-accent")}>{usageCount}/5</span>
                 </div>
                 <div className="w-32 h-1 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={cn("h-full transition-all duration-500", usageCount >= 5 ? "bg-red-500" : "bg-brand-accent")}
                      style={{ width: `${Math.min((usageCount / 5) * 100, 100)}%` }}
                    />
                 </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Input Area */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="hypr-card max-w-4xl mx-auto border-slate-200 shadow-2xl relative overflow-hidden group bg-white"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-accent/5 rounded-full blur-[100px] -z-10 transition-all group-hover:bg-brand-accent/10" />
        
        <div className="space-y-10">
          <div className="relative text-left">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Describe your content vibes..."
              className="w-full bg-transparent border-b border-slate-200 px-0 py-4 text-2xl md:text-3xl font-medium outline-none focus:border-brand-accent/30 transition-all placeholder:text-slate-300 min-h-[120px] resize-none font-display italic tracking-tighter text-slate-800"
            />
            {content && (
              <button 
                onClick={() => setContent('')}
                className="absolute right-0 top-6 p-2 text-slate-300 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          <div className="flex flex-col md:flex-row gap-6 items-center">
            {/* Visual Context Area */}
            <div className="flex-grow w-full">
               <label className="flex items-center justify-center gap-4 w-full h-32 border-2 border-dashed border-slate-200 rounded-3xl hover:border-brand-accent/20 hover:bg-slate-50/50 cursor-pointer transition-all group/upload relative overflow-hidden">
                  <input 
                    type="file" 
                    className="hidden" 
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                  />
                  {image ? (
                    <>
                      <img src={image} alt="Context" className="absolute inset-0 w-full h-full object-cover grayscale opacity-40 mix-blend-multiply" />
                      <div className="relative z-10 flex items-center gap-3 bg-white/90 px-4 py-2 rounded-xl backdrop-blur-md border border-brand-accent/20 shadow-lg">
                         <CheckCircle2 className="w-5 h-5 text-brand-accent" />
                         <span className="font-bold text-xs uppercase tracking-widest text-brand-accent">Context Acquired</span>
                      </div>
                      <button 
                        onClick={(e) => { e.preventDefault(); setImage(null); }}
                        className="absolute top-4 right-4 z-20 p-2 bg-white/90 rounded-full border border-slate-200 hover:bg-red-50 text-slate-500 hover:text-red-500 transition-colors shadow-sm"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <div className="flex flex-col items-center gap-3">
                       <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center group-hover/upload:scale-110 transition-transform">
                          <ImagePlus className="w-5 h-5 text-slate-400" />
                       </div>
                       <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Analyze Visuals</span>
                    </div>
                  )}
               </label>
            </div>
            
            <button
              onClick={handleAnalyze}
              disabled={loading || (!content && !image)}
              className="btn-hypr-primary w-full md:w-auto h-32 md:w-32 rounded-3xl group relative overflow-hidden flex flex-col items-center justify-center gap-3"
            >
              {loading ? (
                <Loader2 className="w-8 h-8 animate-spin" />
              ) : (
                <>
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <ArrowRight className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest">Execute</span>
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Results Section */}
      <AnimatePresence>
        {result && (
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-12 max-w-6xl mx-auto"
          >
             <div className="flex flex-col md:flex-row items-center justify-between gap-6 px-4 text-left">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center border border-slate-200 shadow-sm">
                      <BarChart3 className="w-6 h-6 text-brand-accent" />
                   </div>
                   <p className="text-lg text-slate-600 font-light italic leading-relaxed max-w-xl">
                      {result.summary}
                   </p>
                </div>
                <button 
                  onClick={() => setScheduling(true)}
                  className="btn-hypr-secondary h-12 px-8 text-xs font-bold uppercase tracking-widest flex items-center gap-3 shadow-sm"
                >
                   <Calendar className="w-4 h-4" /> Schedule Deployment
                </button>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {result.results.map((res, i) => (
                 <motion.div 
                   key={i} 
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: i * 0.1 }}
                   className="hypr-card hypr-card-hover group border-slate-200 bg-white"
                 >
                   <div className="flex justify-between items-center mb-8">
                     <div className="space-y-1">
                       <h3 className="text-xl font-bold tracking-tight text-slate-900">{res.category}</h3>
                       <p className="hypr-label">Probabilistic Reach</p>
                     </div>
                     <div className="flex flex-col items-end">
                       <span className="text-3xl font-display font-bold text-slate-800">{res.trendingScore}%</span>
                       <div className="w-20 h-1 bg-slate-100 rounded-full mt-2 overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${res.trendingScore}%` }}
                            className="h-full bg-brand-accent transition-all duration-1000" 
                          />
                       </div>
                     </div>
                   </div>
                   <div className="flex flex-wrap gap-2.5 mb-10 min-h-[80px]">
                     {res.hashtags.map((tag, j) => (
                       <span key={j} className="text-xs font-semibold text-slate-600 hover:text-brand-accent cursor-pointer transition-colors bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-brand-accent/20">
                         #{tag.replace('#','')}
                       </span>
                     ))}
                   </div>
                   <button 
                     onClick={() => copyTags(res.hashtags)}
                     className="w-full h-11 rounded-xl border border-slate-100 bg-slate-50 font-bold text-[10px] uppercase tracking-[0.2em] text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-all flex items-center justify-center gap-2 group/copy"
                   >
                      {copying === res.hashtags.join(' ') ? (
                        <>Copied <Check className="w-3 h-3 text-emerald-500" /></>
                      ) : (
                        <>Transfer Cluster <Copy className="w-3 h-3 opacity-0 group-hover/copy:opacity-100 transition-all" /></>
                      )}
                   </button>
                 </motion.div>
               ))}
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scheduling Modal */}
      <AnimatePresence>
        {scheduling && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xl">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.9, y: 20 }} 
              className="hypr-card max-w-md w-full border-slate-200 shadow-2xl bg-white p-12"
            >
              <div className="flex justify-between items-center mb-10">
                 <h3 className="font-display font-bold text-3xl tracking-tighter text-slate-900 text-left">Schedule <span className="text-brand-accent">Deploy</span></h3>
                 <button onClick={() => setScheduling(false)} className="p-2 text-slate-300 hover:text-slate-600 transition-colors">
                    <X className="w-6 h-6" />
                 </button>
              </div>
              <div className="space-y-8">
                <div className="space-y-4">
                   <label className="hypr-label">Target Timestamp</label>
                   <input 
                     type="datetime-local" 
                     className="hypr-input w-full"
                     value={scheduleDate}
                     onChange={(e) => setScheduleDate(e.target.value)}
                   />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <button onClick={() => setScheduling(false)} className="btn-hypr-secondary h-14 font-bold uppercase tracking-[0.25em] text-[10px]">Cancel</button>
                  <button onClick={handleSchedule} disabled={!scheduleDate} className="btn-hypr-primary h-14 font-bold uppercase tracking-[0.25em] text-[10px]">Schedule</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
