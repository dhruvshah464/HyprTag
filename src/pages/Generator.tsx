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
import { useNavigate } from 'react-router-dom';
import { EliteUpgradeModal } from '../components/EliteUpgradeModal';

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
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const [selectedHashtags, setSelectedHashtags] = useState<string[]>([]);
  const [showTooltip, setShowTooltip] = useState(false);

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
    
    if (!isElite && usageCount !== null && usageCount >= 3) {
      setUpgradeModalOpen(true);
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
    if (!auth.currentUser || !scheduleDate) return;
    const tagsToSchedule = selectedHashtags.length > 0 
      ? selectedHashtags 
      : (result?.results.flatMap(r => r.hashtags) || []);

    try {
      await addDoc(collection(db, "scheduledPosts"), {
        userId: auth.currentUser.uid,
        content,
        hashtags: tagsToSchedule,
        platforms: ["Instagram", "Twitter"],
        scheduledTime: new Date(scheduleDate).toISOString(),
        status: "pending",
        createdAt: serverTimestamp()
      });
      setScheduling(false);
      setSelectedHashtags([]);
      alert("Post scheduled successfully!");
    } catch (e) {
      handleFirestoreError(e, 'create', 'scheduledPosts');
    }
  };

  const toggleHashtag = (tag: string) => {
    const formattedTag = tag.startsWith('#') ? tag : `#${tag}`;
    setSelectedHashtags(prev => {
      if (prev.includes(formattedTag)) {
        return prev.filter(t => t !== formattedTag);
      }
      if (prev.length >= 5) {
        return prev;
      }
      return [...prev, formattedTag];
    });
  };

  const copyAllTags = () => {
    if (!result) return;
    const allTags = result.results.flatMap(r => r.hashtags).map(t => t.startsWith('#') ? t : `#${t}`).join(' ');
    navigator.clipboard.writeText(allTags);
    setCopying('all');
    setTimeout(() => setCopying(null), 2000);
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
            "inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-[10px] font-bold uppercase tracking-widest",
            isElite ? "bg-emerald-50 border-emerald-100 text-emerald-500" : "bg-brand-accent/10 border-brand-accent/20 text-brand-accent"
          )}
        >
          {isElite ? <CheckCircle2 className="w-3 h-3 text-emerald-500" /> : <Sparkles className="w-3 h-3 text-brand-accent" />}
          {isElite ? 'Elite Mode Active' : 'Viral Generator'}
        </motion.div>
        
        <div className="space-y-4">
          <h1 className="text-6xl md:text-8xl font-display font-bold leading-[0.85] tracking-tighter text-slate-900 px-4">
            Get more <br /> <span className="text-brand-accent italic">Reach.</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-500 max-w-xl mx-auto font-light leading-relaxed font-sans italic">
            "ViralFlow tells you exactly what hashtags and captions will get your content in front of more people."
          </p>

          {!isElite && usageCount !== null && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="pt-4"
            >
              <div className="inline-flex flex-col items-center gap-2">
                 <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-300">
                    Daily Usage: <span className={cn(usageCount >= 3 ? "text-red-500" : "text-brand-accent")}>{usageCount}/3</span>
                 </div>
                 <div className="w-48 h-1.5 bg-slate-100 rounded-full overflow-hidden">
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

      {/* Input Area */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="max-w-4xl mx-auto border border-slate-100 rounded-[3rem] shadow-sm relative overflow-hidden group bg-white p-12"
      >
        <div className="space-y-10">
          <div className="relative text-left">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What is your content about?"
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
            <div className="flex-grow w-full relative">
               <label 
                 className="flex items-center justify-center gap-4 w-full h-32 border-2 border-dashed border-slate-100 rounded-[2rem] hover:border-brand-accent/20 hover:bg-slate-50/50 cursor-pointer transition-all group/upload relative overflow-hidden"
               >
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
                         <span className="font-bold text-xs uppercase tracking-widest text-brand-accent">Image Ready</span>
                      </div>
                      <button 
                        onClick={(e) => { e.preventDefault(); setImage(null); }}
                        className="absolute top-4 right-4 z-20 p-2 bg-white/90 rounded-full border border-slate-200 hover:bg-red-50 text-slate-500 hover:text-red-500 transition-colors shadow-sm"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <div className="flex flex-col items-center gap-3 text-left">
                       <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center group-hover/upload:scale-110 transition-transform">
                          <ImagePlus className="w-5 h-5 text-slate-400" />
                       </div>
                       <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Add Image for Better Results</span>
                    </div>
                  )}
               </label>
            </div>
            
            <button
              onClick={() => handleAnalyze()}
              disabled={loading || (!content && !image)}
              className="w-full md:w-32 h-32 bg-brand-accent text-white rounded-[2rem] group relative overflow-hidden flex flex-col items-center justify-center gap-3 shadow-xl shadow-brand-accent/20 hover:scale-105 transition-all disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-8 h-8 animate-spin" />
              ) : (
                <>
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <ArrowRight className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest">Go Viral</span>
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
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center border border-slate-200 shadow-sm">
                         <BarChart3 className="w-6 h-6 text-brand-accent" />
                      </div>
                      <p className="text-lg text-slate-600 font-light italic leading-relaxed max-w-xl">
                         {result.summary}
                      </p>
                   </div>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                  <button 
                    onClick={copyAllTags}
                    className="h-12 px-6 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all whitespace-nowrap shadow-sm"
                  >
                     {copying === 'all' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-slate-400" />}
                     {copying === 'all' ? 'Copied' : 'Copy All'}
                  </button>
                  <button 
                    onClick={() => setScheduling(true)}
                    className="h-12 px-8 bg-brand-accent text-white text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 shadow-xl shadow-brand-accent/10 whitespace-nowrap rounded-2xl hover:scale-105 transition-all"
                  >
                     <Calendar className="w-4 h-4" /> 
                     {selectedHashtags.length > 0 ? `Schedule Selection (${selectedHashtags.length})` : 'Schedule All'}
                  </button>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {result.results.map((res, i) => (
                 <motion.div 
                   key={i} 
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: i * 0.1 }}
                   className="p-8 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all group"
                 >
                   <div className="flex justify-between items-center mb-8">
                     <div className="space-y-1">
                       <h3 className="text-xl font-bold tracking-tight text-slate-900 text-left">{res.category}</h3>
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-left">Viral Score</p>
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
                     {res.hashtags.map((tag, j) => {
                       const formattedTag = tag.startsWith('#') ? tag : `#${tag}`;
                       const isSelected = selectedHashtags.includes(formattedTag);
                       return (
                        <span 
                          key={j} 
                          onClick={() => toggleHashtag(tag)}
                          className={cn(
                            "text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all cursor-pointer",
                            isSelected 
                              ? "bg-brand-accent text-white border-brand-accent shadow-md shadow-brand-accent/20" 
                              : "text-slate-600 hover:text-brand-accent bg-slate-50 border-slate-200 hover:border-brand-accent/20"
                          )}
                        >
                          {formattedTag}
                        </span>
                       );
                     })}
                   </div>
                   <button 
                     onClick={() => copyTags(res.hashtags)}
                     className="w-full h-11 rounded-xl border border-slate-100 bg-slate-50 font-bold text-[10px] uppercase tracking-widest text-slate-400 hover:text-brand-accent hover:bg-white hover:border-brand-accent/20 transition-all flex items-center justify-center gap-2 group/copy"
                   >
                      {copying === res.hashtags.join(' ') ? (
                        <>Copied <Check className="w-3 h-3 text-emerald-500" /></>
                      ) : (
                        <>Copy Group <Copy className="w-3 h-3 opacity-0 group-hover/copy:opacity-100 transition-all" /></>
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
              className="bg-white rounded-[3rem] max-w-md w-full border border-slate-100 shadow-2xl p-12"
            >
              <div className="flex justify-between items-center mb-10">
                 <h3 className="font-display font-bold text-3xl tracking-tighter text-slate-900 text-left">Schedule Post</h3>
                 <button onClick={() => setScheduling(false)} className="p-2 text-slate-300 hover:text-slate-600 transition-colors">
                    <X className="w-6 h-6" />
                 </button>
              </div>
              <div className="space-y-8">
                <div className="space-y-4 text-left">
                   <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Schedule Time</label>
                   <input 
                     type="datetime-local" 
                     className="w-full p-6 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-brand-accent"
                     value={scheduleDate}
                     onChange={(e) => setScheduleDate(e.target.value)}
                   />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <button onClick={() => setScheduling(false)} className="h-14 font-bold border border-slate-100 rounded-2xl text-[10px] uppercase tracking-widest text-slate-400">Cancel</button>
                  <button onClick={() => handleSchedule()} disabled={!scheduleDate} className="h-14 bg-brand-accent text-white rounded-2xl font-bold uppercase tracking-widest text-[10px] shadow-xl shadow-brand-accent/20">Schedule</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <EliteUpgradeModal isOpen={upgradeModalOpen} onClose={() => setUpgradeModalOpen(false)} />
    </div>
  );
}
