import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Video, 
  Upload, 
  Zap, 
  Check, 
  X, 
  Rocket, 
  Target, 
  MessageSquare, 
  DollarSign,
  Loader2,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { cn } from '../lib/utils';
import { db, handleFirestoreError } from '../lib/firebase';
import { useAuth } from '../lib/auth';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

export default function CreatorUpload() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [video, setVideo] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  
  const [form, setForm] = useState({
    title: '',
    hook: '',
    strategy: '',
    category: 'growth',
    price: 99,
    replicateTip: ''
  });

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideo(file);
      setPreview(URL.createObjectURL(file));
      setStep(2);
    }
  };

  const handleUpload = async () => {
    if (!user) return;
    setLoading(true);
    try {
      // In a real app we'd upload to Firebase Storage here
      // For now we simulate the data entry in Firestore
      await addDoc(collection(db, "strategies"), {
        userId: user.uid,
        creatorName: user.displayName,
        creatorPhoto: user.photoURL,
        ...form,
        videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", // Mock
        createdAt: serverTimestamp(),
        unlockedBy: []
      });
      navigate('/ideas');
    } catch (e) {
      handleFirestoreError(e, 'create', 'strategies');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <div className="space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-neon/10 border border-brand-neon/30 text-[9px] font-mono uppercase tracking-[0.3em] text-brand-neon">
          Matrix // Strategy Injection
        </div>
        <div className="space-y-2">
           <h1 className="text-6xl md:text-8xl font-display uppercase italic leading-none tracking-tighter text-white">
             Bridge <span className="text-brand-neon">Content</span>
           </h1>
           <p className="text-white/40 text-sm font-mono lowercase tracking-[0.2em] italic">inject successful patterns into the nexus</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Preview/Upload */}
        <div className="lg:col-span-5">
           <div className="hypr-card aspect-[9/16] bg-brand-surface border-white/5 flex flex-col items-center justify-center relative overflow-hidden group">
              <div className="scanline opacity-10" />
              {preview ? (
                <>
                  <video src={preview} className="absolute inset-0 w-full h-full object-cover" muted autoPlay loop />
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                     <button onClick={() => {setPreview(null); setStep(1);}} className="p-4 bg-red-500 text-white rounded-full"><X /></button>
                  </div>
                </>
              ) : (
                <label className="cursor-pointer flex flex-col items-center gap-4 group/btn">
                   <input type="file" className="hidden" accept="video/*" onChange={handleVideoSelect} />
                   <div className="w-20 h-20 bg-brand-neon/10 border border-brand-neon/30 flex items-center justify-center group-hover/btn:scale-110 transition-all">
                      <Upload className="w-8 h-8 text-brand-neon" />
                   </div>
                   <span className="text-[10px] font-mono text-white/40 uppercase tracking-[0.4em]">Select Intelligence Clip</span>
                </label>
              )}
           </div>
        </div>

        {/* Right: Form */}
        <div className="lg:col-span-7 space-y-8">
           <AnimatePresence mode="wait">
             {step === 1 ? (
               <motion.div key="s1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                  <div className="p-8 bg-brand-neon/[0.03] border border-brand-neon/10 italic text-sm text-brand-neon font-light">
                    "Upload a video demonstrating your viral strategy. Explain why it works and how others can replicate it."
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     {['Growth', 'Hooks', 'Sales', 'Systems'].map(c => (
                       <button key={c} onClick={() => setForm({...form, category: c.toLowerCase()})} className={cn(
                         "p-6 border text-left transition-all",
                         form.category === c.toLowerCase() ? "bg-white text-brand-void border-white" : "bg-white/5 border-white/5 text-white/40"
                       )}>
                          <p className="text-[10px] font-mono uppercase tracking-widest">{c}</p>
                       </button>
                     ))}
                  </div>
               </motion.div>
             ) : (
               <motion.div key="s2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest pl-1 font-bold">Strategy Title</label>
                    <input 
                      value={form.title} onChange={(e) => setForm({...form, title: e.target.value})}
                      placeholder="The Paradox Growth Loop..."
                      className="w-full p-5 bg-white/5 border border-white/5 text-white italic outline-none focus:border-brand-neon transition-all"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest pl-1 font-bold">The Hook</label>
                    <input 
                      value={form.hook} onChange={(e) => setForm({...form, hook: e.target.value})}
                      placeholder="Why working less is making you more..."
                      className="w-full p-5 bg-white/5 border border-white/5 text-white italic outline-none focus:border-brand-neon transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest pl-1 font-bold">Strategy Liquidity (Price in ₹)</label>
                    <div className="flex items-center gap-4">
                       <input 
                         type="number" value={form.price} onChange={(e) => setForm({...form, price: parseInt(e.target.value)})}
                         className="w-32 p-5 bg-brand-neon/5 border border-brand-neon/20 text-brand-neon italic outline-none"
                       />
                       <span className="text-[10px] font-mono text-white/20 uppercase tracking-widest italic">Creators earned avg ₹12.4k with this price tier.</span>
                    </div>
                  </div>

                  <div className="pt-10 flex gap-4">
                     <button onClick={() => setStep(1)} className="hypr-btn hypr-btn-outline grow">Regress</button>
                     <button 
                       onClick={handleUpload}
                       disabled={loading || !form.title || !form.hook}
                       className="hypr-btn hypr-btn-primary grow py-6 flex items-center justify-center gap-3"
                     >
                        {loading ? <Loader2 className="animate-spin" /> : <><Sparkles className="w-5 h-5" /> Deploy Intelligence</>}
                     </button>
                  </div>
               </motion.div>
             )}
           </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
