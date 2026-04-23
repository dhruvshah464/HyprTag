import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  MoreVertical, 
  Calendar as CalendarIcon, 
  Hash, 
  MessageCircle,
  Layout,
  GripVertical,
  CheckCircle2,
  Clock,
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  ArrowRight,
  X,
  Trash2,
  Zap
} from 'lucide-react';
import { cn } from '../lib/utils';
import { db, auth, handleFirestoreError } from '../lib/firebase';
import { useAuth } from '../lib/auth';
import { collection, query, where, onSnapshot, updateDoc, doc, addDoc, serverTimestamp, deleteDoc } from 'firebase/firestore';

interface Task {
  id: string;
  content: string;
  status: 'idea' | 'draft' | 'scheduled' | 'published';
  platforms: string[];
  createdAt: any;
}

const COLUMNS = [
  { id: 'idea', label: 'Incubating', color: 'bg-slate-50' },
  { id: 'draft', label: 'Designing', color: 'bg-slate-50/80' },
  { id: 'scheduled', label: 'Pipeline', color: 'bg-slate-50/60' },
  { id: 'published', label: 'Live', color: 'bg-brand-accent/[0.05]' }
];

export default function Planner() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [targetStatus, setTargetStatus] = useState<Task['status']>('idea');
  const [newContent, setNewContent] = useState('');

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, "scheduledPosts"), where("userId", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Task[];
      setTasks(data);
      setLoading(false);
    }, (err) => {
      handleFirestoreError(err, 'list', 'scheduledPosts');
    });
    return () => unsubscribe();
  }, [user?.uid]);

  const createTask = async () => {
    if (!user || !newContent) return;
    try {
      await addDoc(collection(db, "scheduledPosts"), {
        userId: user.uid,
        content: newContent,
        status: targetStatus,
        hashtags: [],
        platforms: ['Instagram'],
        scheduledTime: targetStatus === 'scheduled' ? new Date().toISOString() : null,
        createdAt: serverTimestamp()
      });
      setNewContent('');
      setIsAdding(false);
    } catch (e) {
      handleFirestoreError(e, 'create', 'scheduledPosts');
    }
  };

  const moveTask = async (taskId: string, newStatus: Task['status']) => {
    try {
      await updateDoc(doc(db, "scheduledPosts", taskId), { status: newStatus });
    } catch (e) {
      handleFirestoreError(e, 'update', 'scheduledPosts');
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      await deleteDoc(doc(db, "scheduledPosts", taskId));
    } catch (e) {
      handleFirestoreError(e, 'delete', 'scheduledPosts');
    }
  };

  return (
    <div className="space-y-12 h-screen flex flex-col pb-10 max-w-[1400px] mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 text-left px-4">
        <div className="space-y-4 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-100 text-[10px] font-bold uppercase tracking-widest text-slate-400">
             <Layout className="w-3 h-3 text-brand-accent" />
             Strategic Pipeline
          </div>
          <h1 className="font-display font-bold text-4xl italic lowercase tracking-tighter text-slate-900">Content<span className="text-brand-accent">Engine</span></h1>
          <p className="text-slate-500 max-w-md">Orchestrate your high-velocity creator presence with neural workflow visualization.</p>
        </div>
        <button 
          onClick={() => { setTargetStatus('idea'); setIsAdding(true); }}
          className="btn-hypr-primary h-12 px-8 text-xs font-bold uppercase tracking-widest flex items-center gap-2 shadow-xl shadow-brand-accent/10"
        >
          <Plus className="w-4 h-4" /> New Sequence
        </button>
      </div>

      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xl">
             <motion.div 
               initial={{ opacity: 0, scale: 0.9, y: 20 }} 
               animate={{ opacity: 1, scale: 1, y: 0 }} 
               exit={{ opacity: 0, scale: 0.9, y: 20 }} 
               className="hypr-card max-w-xl w-full border-slate-200 bg-white p-12 shadow-2xl"
             >
                <div className="flex justify-between items-center mb-12">
                   <div className="space-y-1 text-left">
                      <h3 className="font-display font-bold text-4xl tracking-tighter italic text-slate-900">Initiate <span className="text-brand-accent">Concept</span></h3>
                      <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.3em]">Status: {targetStatus}</p>
                   </div>
                   <button onClick={() => setIsAdding(false)} className="p-3 bg-slate-50 rounded-2xl text-slate-300 hover:text-slate-900 hover:bg-slate-100 transition-all">
                      <X className="w-6 h-6" />
                   </button>
                </div>
                
                <div className="space-y-10">
                  <div className="space-y-4 text-left">
                    <label className="hypr-label ml-1 text-slate-400">Context Definition</label>
                    <textarea 
                      autoFocus
                      value={newContent}
                      onChange={(e) => setNewContent(e.target.value)}
                      placeholder="Neural signal or content draft..."
                      className="hypr-input w-full min-h-[160px] text-xl font-light py-6 bg-slate-50 border-slate-200 focus:bg-white text-slate-900"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6 pt-4">
                    <button onClick={() => setIsAdding(false)} className="btn-hypr-secondary h-16 uppercase tracking-[0.2em] text-[10px] font-bold">Discard</button>
                    <button 
                      onClick={createTask} 
                      disabled={!newContent} 
                      className="btn-hypr-primary h-16 uppercase tracking-[0.2em] text-[10px] font-bold"
                    >
                      Establish Link
                    </button>
                  </div>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="flex gap-8 overflow-x-auto pb-10 -mx-4 px-4 flex-grow scrollbar-hide">
        {COLUMNS.map((col) => (
          <div key={col.id} className="flex flex-col gap-8 min-w-[340px] w-[340px]">
            <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-4">
                  <h3 className="font-bold text-xs uppercase tracking-[0.25em] text-slate-400">{col.label}</h3>
                  <span className="text-[10px] bg-white border border-slate-100 px-2.5 py-1 rounded-lg text-slate-500 font-mono font-bold tracking-tighter">
                    {tasks.filter(t => t.status === col.id).length.toString().padStart(2, '0')}
                  </span>
               </div>
               <button 
                 onClick={() => { setTargetStatus(col.id as any); setIsAdding(true); }}
                 className="w-8 h-8 flex items-center justify-center bg-white hover:bg-slate-50 rounded-xl text-slate-300 hover:text-slate-900 transition-all border border-slate-100 shadow-sm"
               >
                 <Plus className="w-4 h-4" />
               </button>
            </div>

            <div className={cn("flex-grow rounded-[2.5rem] border border-slate-100 space-y-6 p-5 transition-all duration-700 hover:bg-white flex flex-col shadow-sm", col.color)}>
               <div className="space-y-5 flex-grow overflow-y-auto pr-1 scrollbar-hide">
                <AnimatePresence mode="popLayout">
                  {tasks.filter(t => t.status === col.id).sort((a,b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)).map((task) => (
                    <motion.div
                      key={task.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="hypr-card p-6 border-white/5 hover:border-white/10 hover:bg-white/[0.02] active:scale-[0.98] transition-all group relative cursor-default"
                    >
                       <div className="flex justify-between items-start mb-6">
                          <div className="flex gap-2">
                             {(task.platforms || ['Instagram']).map(p => (
                               <div key={p} className="p-1.5 bg-white/5 rounded-lg border border-white/5">
                                 {p === 'Instagram' && <Instagram className="w-3.5 h-3.5 text-pink-500/60" />}
                                 {p === 'Twitter' && <Twitter className="w-3.5 h-3.5 text-sky-400/60" />}
                                 {p === 'Linkedin' && <Linkedin className="w-3.5 h-3.5 text-blue-600/60" />}
                               </div>
                             ))}
                          </div>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                             <button 
                               onClick={() => deleteTask(task.id)}
                               className="p-1.5 hover:bg-red-500/10 rounded-lg text-white/10 hover:text-red-500/60 transition-all"
                             >
                               <Trash2 className="w-3.5 h-3.5" />
                             </button>
                          </div>
                       </div>
                       
                       <p className="text-sm text-white/50 line-clamp-4 mb-8 font-light leading-[1.7] italic">
                         {task.content || 'Awaiting Strategic Input...'}
                       </p>
                       
                       <div className="flex items-center justify-between pt-5 border-t border-white/5">
                          <div className="flex -space-x-2">
                             {[1, 2].map(i => (
                               <div key={i} className="w-7 h-7 rounded-full border-2 border-[#09090b] bg-white/5 overflow-hidden">
                                  <img src={`https://picsum.photos/seed/${task.id + i}/30/30`} className="w-full h-full object-cover grayscale opacity-30" alt="Avatar" referrerPolicy="no-referrer" />
                               </div>
                             ))}
                             <div className="w-7 h-7 rounded-full border-2 border-[#09090b] bg-brand-accent/10 flex items-center justify-center">
                                <span className="text-[8px] font-bold text-brand-accent">+1</span>
                             </div>
                          </div>
                          
                          <div className="flex gap-2">
                             {col.id !== 'published' && (
                               <button 
                                 onClick={() => {
                                   const statuses: Task['status'][] = ['idea', 'draft', 'scheduled', 'published'];
                                   const currentIdx = statuses.indexOf(task.status);
                                   if (currentIdx < statuses.length - 1) moveTask(task.id, statuses[currentIdx + 1]);
                                 }}
                                 className="h-9 px-4 rounded-full bg-white/5 border border-white/5 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/20 hover:text-white hover:bg-brand-accent/20 hover:border-brand-accent/30 transition-all group/next"
                               >
                                  <span>Advance</span>
                                  <ArrowRight className="w-3 h-3 group-hover/next:translate-x-0.5 transition-transform" />
                               </button>
                             )}
                          </div>
                       </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                {tasks.filter(t => t.status === col.id).length === 0 && (
                  <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }}
                    onClick={() => { setTargetStatus(col.id as any); setIsAdding(true); }}
                    className="h-44 border-2 border-dashed border-white/[0.02] rounded-[2rem] flex flex-col items-center justify-center gap-3 group cursor-pointer hover:border-brand-accent/20 hover:bg-brand-accent/[0.01] transition-all"
                  >
                     <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 text-white/10 group-hover:text-brand-accent/40 transition-all group-hover:scale-110">
                       <Zap className="w-5 h-5" />
                     </div>
                     <p className="text-[10px] font-bold text-white/10 uppercase tracking-[0.3em] group-hover:text-brand-accent/40 transition-colors">Capture Insight</p>
                  </motion.div>
                )}
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
