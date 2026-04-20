import React, { useState, useRef } from 'react';
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
  CheckCircle2
} from 'lucide-react';
import { cn } from '../lib/utils';
import { generateHashtags, AnalysisResponse } from '../lib/gemini';
import { db, auth, handleFirestoreError } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function Generator() {
  const [content, setContent] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResponse | null>(null);
  const [copying, setCopying] = useState<string | null>(null);
  const [scheduling, setScheduling] = useState(false);
  const [scheduleDate, setScheduleDate] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      const data = await generateHashtags(content, image || undefined);
      setResult(data);
      
      if (auth.currentUser) {
        try {
          await addDoc(collection(db, "generations"), {
            userId: auth.currentUser.uid,
            content: content || "Image Analysis",
            result: data,
            createdAt: serverTimestamp(),
            reach: Math.floor(Math.random() * 5000) + 1000,
            likes: Math.floor(Math.random() * 200) + 20,
            comments: Math.floor(Math.random() * 30) + 5
          });
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
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-[0.2em] text-white/50"
        >
          <Sparkles className="w-3 h-3 text-brand-accent" />
          Neural Growth Engine
        </motion.div>
        
        <div className="space-y-4">
          <h1 className="text-6xl md:text-8xl font-display font-bold leading-[0.85] tracking-tighter hypr-gradient-text px-4">
            Strategic <br /> Intelligence.
          </h1>
          <p className="text-lg md:text-xl text-white/50 max-w-xl mx-auto font-light leading-relaxed font-sans italic">
            "HyprTags uses proprietary neural models to predict hashtag velocity and audience resonance in real-time."
          </p>
        </div>
      </div>

      {/* Input Area */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="hypr-card max-w-4xl mx-auto border-white/5 shadow-2xl relative overflow-hidden group"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-accent/5 rounded-full blur-[100px] -z-10 transition-all group-hover:bg-brand-accent/10" />
        
        <div className="space-y-10">
          <div className="relative">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Describe your content vibes..."
              className="w-full bg-transparent border-b border-white/5 px-0 py-4 text-2xl md:text-3xl font-medium outline-none focus:border-white/20 transition-all placeholder:text-white/10 min-h-[120px] resize-none font-display italic tracking-tighter"
            />
            {content && (
              <button 
                onClick={() => setContent('')}
                className="absolute right-0 top-6 p-2 text-white/20 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          <div className="flex flex-col md:flex-row gap-6 items-center">
            {/* Visual Context Area */}
            <div className="flex-grow w-full">
               <label className="flex items-center justify-center gap-4 w-full h-32 border-2 border-dashed border-white/5 rounded-3xl hover:border-white/10 hover:bg-white/[0.01] cursor-pointer transition-all group/upload relative overflow-hidden">
                  <input 
                    type="file" 
                    className="hidden" 
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                  />
                  {image ? (
                    <>
                      <img src={image} alt="Context" className="absolute inset-0 w-full h-full object-cover opacity-50 blur-[2px] grayscale" />
                      <div className="relative z-10 flex items-center gap-3 bg-black/40 px-4 py-2 rounded-xl backdrop-blur-md border border-white/10">
                         <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                         <span className="font-bold text-xs uppercase tracking-widest text-emerald-400">Context Acquired</span>
                      </div>
                      <button 
                        onClick={(e) => { e.preventDefault(); setImage(null); }}
                        className="absolute top-4 right-4 z-20 p-2 bg-black/40 rounded-full border border-white/10 hover:bg-brand-accent/20 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <div className="flex flex-col items-center gap-3">
                       <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover/upload:scale-110 transition-transform">
                          <ImagePlus className="w-5 h-5 text-white/30" />
                       </div>
                       <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/20">Analyze Visuals</span>
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
                  <div className="w-10 h-10 rounded-full bg-black/10 flex items-center justify-center group-hover:scale-110 transition-transform">
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
             <div className="flex flex-col md:flex-row items-center justify-between gap-6 px-4">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10">
                      <BarChart3 className="w-6 h-6 text-brand-accent" />
                   </div>
                   <p className="text-lg text-white/60 font-light italic leading-relaxed max-w-xl">
                      {result.summary}
                   </p>
                </div>
                <button 
                  onClick={() => setScheduling(true)}
                  className="btn-hypr-secondary h-12 px-8 text-xs font-bold uppercase tracking-widest flex items-center gap-3"
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
                   className="hypr-card hypr-card-hover group border-white/10"
                 >
                   <div className="flex justify-between items-center mb-8">
                     <div className="space-y-1">
                       <h3 className="text-xl font-bold tracking-tight">{res.category}</h3>
                       <p className="hypr-label">Probabilistic Reach</p>
                     </div>
                     <div className="flex flex-col items-end">
                       <span className="text-3xl font-display font-bold text-white/80">{res.trendingScore}%</span>
                       <div className="w-20 h-1 bg-white/5 rounded-full mt-2 overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${res.trendingScore}%` }}
                            className="h-full bg-brand-accent/50 transition-all duration-1000" 
                          />
                       </div>
                     </div>
                   </div>
                   <div className="flex flex-wrap gap-2.5 mb-10 min-h-[80px]">
                     {res.hashtags.map((tag, j) => (
                       <span key={j} className="text-xs font-semibold text-white/70 hover:text-white cursor-pointer transition-colors bg-white/[0.03] px-3 py-1.5 rounded-lg border border-white/5 hover:border-white/10">
                         #{tag.replace('#','')}
                       </span>
                     ))}
                   </div>
                   <button 
                     onClick={() => copyTags(res.hashtags)}
                     className="w-full h-11 rounded-xl border border-white/5 bg-white/[0.02] font-bold text-[10px] uppercase tracking-[0.2em] text-white/20 hover:text-white hover:bg-white/5 transition-all flex items-center justify-center gap-2 group/copy"
                   >
                      {copying === res.hashtags.join(' ') ? (
                        <>Copied <Check className="w-3 h-3 text-emerald-400" /></>
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
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.9, y: 20 }} 
              className="hypr-card max-w-md w-full border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)]"
            >
              <div className="flex justify-between items-center mb-10">
                 <h3 className="font-display font-bold text-3xl tracking-tighter">Schedule <span className="text-brand-accent">Deploy</span></h3>
                 <button onClick={() => setScheduling(false)} className="p-2 text-white/20 hover:text-white transition-colors">
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
