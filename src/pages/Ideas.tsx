import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Zap, 
  Share2, 
  Heart, 
  MessageSquare, 
  TrendingUp, 
  Cpu, 
  ArrowRight,
  ShieldCheck,
  Rocket,
  Lock,
  Unlock,
  Sparkles,
  ChevronUp,
  ChevronDown,
  Repeat,
  ArrowDown
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useNavigate } from 'react-router-dom';
import { db, handleFirestoreError } from '../lib/firebase';
import { useAuth } from '../lib/auth';
import { collection, query, orderBy, limit, getDocs, doc, updateDoc, arrayUnion } from 'firebase/firestore';

interface Strategy {
  id: string;
  title: string;
  hook: string;
  creatorName: string;
  creatorPhoto: string;
  videoUrl: string;
  category: string;
  price: number;
  unlockedBy: string[];
}

export default function Ideas() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStrategies() {
      try {
        const q = query(collection(db, "strategies"), orderBy("createdAt", "desc"), limit(10));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Strategy));
        
        // If empty, add mock data for demo
        if (data.length === 0) {
          setStrategies([
            {
              id: 'm1',
              title: 'The Paradox Loop',
              hook: 'Why working less made me 3x more...',
              creatorName: 'Alex Growth',
              creatorPhoto: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
              videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
              category: 'growth',
              price: 99,
              unlockedBy: []
            },
            {
               id: 'm2',
               title: 'Signal Mining',
               hook: 'How to find viral topics in 5 minutes...',
               creatorName: 'Sarah AI',
               creatorPhoto: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
               videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
               category: 'strategy',
               price: 149,
               unlockedBy: []
            },
            {
               id: 'm3',
               title: 'The "Stop Doing X" Hook',
               hook: 'Pattern interrupt by telling them to quit something common.',
               creatorName: 'Growth Op',
               creatorPhoto: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Op',
               videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
               category: 'Hooks',
               price: 199,
               unlockedBy: []
            }
          ]);
        } else {
          setStrategies(data);
        }
      } catch (e) {
        handleFirestoreError(e, 'get', 'strategies');
      } finally {
        setLoading(false);
      }
    }
    fetchStrategies();
  }, []);

  const handleNext = () => {
    if (currentIndex < strategies.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleUnlock = async (strategy: Strategy) => {
    if (!user) return;
    try {
      const strategyRef = doc(db, "strategies", strategy.id);
      await updateDoc(strategyRef, {
        unlockedBy: arrayUnion(user.uid)
      });
      setStrategies(prev => prev.map(s => s.id === strategy.id ? {...s, unlockedBy: [...s.unlockedBy, user.uid]} : s));
    } catch (e) {
      handleFirestoreError(e, 'update', 'strategies');
    }
  };

  if (loading) {
    return (
      <div className="h-[80vh] flex items-center justify-center">
        <Rocket className="w-10 h-10 text-brand-neon animate-bounce" />
      </div>
    );
  }

  const current = strategies[currentIndex];
  const isUnlocked = current?.unlockedBy.includes(user?.uid || '') || current?.id.startsWith('m');

  return (
    <div className="h-[85vh] relative flex flex-col md:flex-row gap-6">
      {/* Left Area: Navigation & Stats */}
      <div className="hidden lg:flex flex-col justify-between w-64 pb-12">
         <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-neon/10 border border-brand-neon/30 text-[9px] font-mono uppercase tracking-[0.3em] text-brand-neon">
              Explore Lab // {current?.category}
            </div>
            <h1 className="text-4xl font-display uppercase italic tracking-tighter text-white leading-none">
              Intelligence <span className="text-brand-neon">Feed</span>
            </h1>
            <p className="text-white/40 text-[10px] font-mono uppercase tracking-widest italic">swipe for next strategy cycle</p>
         </div>

         <div className="space-y-4">
            <div className="p-4 bg-white/5 border border-white/5 space-y-2">
               <p className="text-[9px] font-mono text-white/30 uppercase">Current Capacity</p>
               <div className="flex justify-between items-end">
                  <span className="text-2xl font-display italic text-white">{currentIndex + 1}</span>
                  <span className="text-[10px] font-mono text-white/20">/ {strategies.length} Nodes</span>
               </div>
            </div>
            <div className="flex gap-2">
               <button onClick={handlePrev} className="grow py-4 bg-white/5 hover:bg-brand-neon hover:text-brand-void transition-all flex justify-center"><ChevronUp className="w-5 h-5" /></button>
               <button onClick={handleNext} className="grow py-4 bg-white/5 hover:bg-brand-neon hover:text-brand-void transition-all flex justify-center"><ChevronDown className="w-5 h-5" /></button>
            </div>
         </div>
      </div>

      {/* Main Area: Vertical Video */}
      <div className="grow relative flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div 
            key={current?.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-[400px] aspect-[9/16] bg-brand-surface border border-white/10 relative overflow-hidden group shadow-2xl"
          >
            <div className="scanline opacity-10" />
            
            {/* Video Placeholder/Embed */}
            <div className="absolute inset-0 bg-black">
               <video 
                 src={current?.videoUrl} 
                 className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" 
                 autoPlay 
                 muted 
                 loop 
                 playsInline
               />
            </div>

            {/* Top Overlay */}
            <div className="absolute top-0 inset-x-0 p-8 bg-gradient-to-b from-black/80 to-transparent z-10 flex justify-between items-start">
               <div className="space-y-1">
                  <p className="text-[9px] font-mono text-brand-neon uppercase tracking-widest">{current?.category} Node</p>
                  <h3 className="text-2xl font-display italic uppercase text-white tracking-tighter leading-none">{current?.title}</h3>
               </div>
               <div className="flex gap-2">
                  <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white"><Share2 className="w-4 h-4" /></div>
               </div>
            </div>

            {/* Interaction Column */}
            <div className="absolute right-6 bottom-32 z-20 flex flex-col gap-6 items-center">
               <div className="flex flex-col items-center gap-1 group/act cursor-pointer">
                  <div className="w-12 h-12 rounded-full bg-brand-void/80 border border-white/10 flex items-center justify-center group-hover/act:bg-red-500 group-hover/act:border-red-500 transition-all">
                     <Heart className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-[9px] font-mono text-white/40">1.2k</span>
               </div>
               <div className="flex flex-col items-center gap-1 group/act cursor-pointer">
                  <div className="w-12 h-12 rounded-full bg-brand-void/80 border border-white/10 flex items-center justify-center group-hover/act:bg-brand-cyan group-hover/act:border-brand-cyan transition-all">
                     <Repeat className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-[9px] font-mono text-white/40">482</span>
               </div>
               <div className="flex flex-col items-center gap-1 group/act cursor-pointer" onClick={() => navigate('/generator', { state: { initialIdea: current?.hook } })}>
                  <div className="w-12 h-12 rounded-full bg-brand-neon border border-brand-neon flex items-center justify-center shadow-[0_0_15px_rgba(0,255,0,0.3)] hover:scale-110 transition-transform">
                     <Zap className="w-6 h-6 text-brand-void fill-current" />
                  </div>
                  <span className="text-[9px] font-mono text-brand-neon font-bold">REMIX</span>
               </div>
            </div>

            {/* Bottom Info & CTA */}
            <div className="absolute bottom-0 inset-x-0 p-8 bg-gradient-to-t from-black to-transparent z-10 space-y-6">
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 border border-white/10 overflow-hidden">
                     <img src={current?.creatorPhoto} alt="Creator" className="w-full h-full object-cover grayscale" />
                  </div>
                  <div>
                     <p className="text-[9px] font-mono text-white/30 uppercase">Strategist</p>
                     <p className="text-sm font-display uppercase italic text-white">{current?.creatorName}</p>
                  </div>
               </div>

               <p className="text-lg font-light italic text-white/80 leading-tight">
                  "{current?.hook}"
               </p>

               <div className="pt-4 border-t border-white/10">
                  {isUnlocked ? (
                     <button 
                       onClick={() => navigate('/generator', { state: { initialIdea: current?.hook } })}
                       className="w-full py-4 bg-brand-neon text-brand-void font-display uppercase italic tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-white transition-all"
                    >
                       <Unlock className="w-4 h-4" /> Fully Synchronized // Remix
                    </button>
                  ) : (
                    <div className="flex gap-2">
                       <button onClick={() => navigate('/generator', { state: { initialIdea: current?.hook } })} className="grow py-4 bg-white/10 backdrop-blur-md text-white font-display uppercase italic text-xs tracking-widest hover:bg-white hover:text-brand-void transition-all">
                          Copy Script
                       </button>
                       <button 
                         onClick={() => handleUnlock(current)}
                         className="grow py-4 bg-brand-neon text-brand-void font-display uppercase italic text-xs tracking-widest flex items-center justify-center gap-2 hover:bg-white transition-all shadow-[0_0_20px_rgba(0,255,0,0.2)]"
                       >
                          <Lock className="w-3 h-3" /> Unlock Matrix ₹{current?.price}
                       </button>
                    </div>
                  )}
               </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Global Floating Actions */}
        <div className="absolute top-8 left-8 z-50">
           <button 
             onClick={() => navigate('/')}
             className="w-12 h-12 flex items-center justify-center bg-brand-surface border border-white/10 text-white/50 hover:text-brand-neon hover:border-brand-neon transition-all"
           >
              <Zap className="w-6 h-6 fill-current" />
           </button>
        </div>

        {/* Swipe Guidelines */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 flex flex-col gap-4 text-white/10 md:hidden">
           <ChevronUp className="w-8 h-8" />
           <ChevronDown className="w-8 h-8" />
        </div>
      </div>
    </div>
  );
}
