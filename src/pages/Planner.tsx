import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Calendar as CalendarIcon, 
  Layout,
  CheckCircle2,
  Clock,
  Instagram,
  Twitter,
  Linkedin,
  ArrowRight,
  X,
  Trash2,
  Zap,
  Sparkles,
  Loader2,
  Rocket,
  Search,
  Youtube,
  Send,
  MoreHorizontal
} from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { cn } from '../lib/utils';
import { db, handleFirestoreError } from '../lib/firebase';
import { useAuth } from '../lib/auth';
import { collection, query, where, onSnapshot, updateDoc, doc, addDoc, serverTimestamp, deleteDoc } from 'firebase/firestore';
import { EliteUpgradeModal } from '../components/EliteUpgradeModal';

interface Task {
  id: string;
  content: string;
  status: 'idea' | 'draft' | 'scheduled' | 'published';
  platforms: string[];
  createdAt: any;
  notes?: string;
}

const COLUMNS: { id: Task['status']; label: string; color: string }[] = [
  { id: 'idea', label: 'Ideas', color: 'bg-slate-50' },
  { id: 'draft', label: 'Drafts', color: 'bg-slate-50/80' },
  { id: 'scheduled', label: 'Scheduled', color: 'bg-slate-50/60' },
  { id: 'published', label: 'Posted', color: 'bg-brand-accent/[0.05]' }
];

const PLANNER_PLATFORMS = [
  { id: 'Instagram', icon: Instagram, color: 'text-pink-500', bg: 'bg-pink-500/10' },
  { id: 'TikTok', icon: Send, color: 'text-slate-900', bg: 'bg-slate-900/10' },
  { id: 'YouTube', icon: Youtube, color: 'text-red-600', bg: 'bg-red-600/10' },
  { id: 'Twitter', icon: Twitter, color: 'text-sky-400', bg: 'bg-sky-400/10' }
];

export default function Planner() {
  const { user, isElite } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [targetStatus, setTargetStatus] = useState<Task['status']>('idea');
  const [newContent, setNewContent] = useState('');
  const [newNotes, setNewNotes] = useState('');
  const [selectedTaskPlatforms, setSelectedTaskPlatforms] = useState<string[]>(['Instagram']);
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);

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

  const onDragEnd = async (result: any) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const newStatus = destination.droppableId as Task['status'];
    try {
      await updateDoc(doc(db, "scheduledPosts", draggableId), { status: newStatus });
    } catch (e) {
      handleFirestoreError(e, 'update', 'scheduledPosts');
    }
  };

  const createTask = async () => {
    if (!user || !newContent) return;
    
    try {
      await addDoc(collection(db, "scheduledPosts"), {
        userId: user.uid,
        content: newContent,
        notes: newNotes,
        status: targetStatus,
        platforms: selectedTaskPlatforms,
        scheduledTime: targetStatus === 'scheduled' ? new Date().toISOString() : null,
        createdAt: serverTimestamp()
      });
      setNewContent('');
      setNewNotes('');
      setSelectedTaskPlatforms(['Instagram']);
      setIsAdding(false);
    } catch (e) {
      handleFirestoreError(e, 'create', 'scheduledPosts');
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
    <div className="space-y-8 h-screen flex flex-col pb-10 max-w-[1400px] mx-auto overflow-hidden">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 text-left px-6">
        <div className="space-y-2 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-accent/10 border border-brand-accent/20 text-[10px] font-bold uppercase tracking-widest text-brand-accent">
             <CalendarIcon className="w-3 h-3" />
             Content Planner
          </div>
          <h1 className="font-display font-bold text-4xl italic tracking-tighter text-slate-900">Reach<span className="text-brand-accent">Rocket</span></h1>
          <p className="text-slate-500 max-w-md">Schedule your posts and watch your reach skyrocket.</p>
        </div>
        <button 
          onClick={() => { setTargetStatus('idea'); setIsAdding(true); }}
          className="h-14 px-8 bg-brand-accent text-white rounded-2xl text-xs font-bold uppercase tracking-widest flex items-center gap-2 shadow-xl shadow-brand-accent/20 hover:scale-[1.02] transition-all"
        >
          <Plus className="w-4 h-4" /> New Post
        </button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-6 overflow-x-auto pb-10 px-6 flex-grow scrollbar-hide">
          {COLUMNS.map((col) => (
            <div key={col.id} className="flex flex-col gap-6 min-w-[320px] w-[320px]">
              <div className="flex items-center justify-between px-2">
                  <div className="flex items-center gap-3">
                    <h3 className="font-bold text-xs uppercase tracking-widest text-slate-400">{col.label}</h3>
                    <span className="text-[10px] bg-white border border-slate-100 px-2.5 py-1 rounded-lg text-slate-500 font-bold">
                      {tasks.filter(t => t.status === col.id).length}
                    </span>
                 </div>
              </div>

              <Droppable droppableId={col.id}>
                {(provided, snapshot) => (
                  <div 
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={cn(
                      "flex-grow rounded-[2.5rem] border-2 border-slate-100/50 p-4 transition-all duration-300 min-h-[400px]",
                      col.color,
                      snapshot.isDraggingOver && "border-brand-accent/20 bg-brand-accent/[0.02]"
                    )}
                  >
                    <div className="space-y-4">
                      {tasks.filter(t => t.status === col.id).map((task, index) => (
                        // @ts-expect-error key prop check
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={cn(
                                "p-6 bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all group relative",
                                snapshot.isDragging && "shadow-2xl ring-2 ring-brand-accent"
                              )}
                            >
                               <div className="flex justify-between items-start mb-4">
                                  <div className="flex gap-1.5">
                                     {(task.platforms || []).map(p => {
                                       const platform = PLANNER_PLATFORMS.find(cp => cp.id === p);
                                       if (!platform) return null;
                                       return (
                                         <div key={p} className={cn("p-1.5 rounded-lg", platform.bg)}>
                                           <platform.icon className={cn("w-3.5 h-3.5", platform.color)} />
                                         </div>
                                       );
                                     })}
                                  </div>
                                  <button 
                                     onClick={() => setDeletingTaskId(task.id)}
                                     className="p-1 text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                               </div>
                               
                               <div className="space-y-4">
                                  <p className="text-sm text-slate-800 font-light leading-relaxed">
                                    {task.content}
                                  </p>
                                  {task.notes && (
                                    <div className="p-3 bg-slate-50 rounded-xl">
                                      <p className="text-[10px] text-slate-500 italic line-clamp-2">{task.notes}</p>
                                    </div>
                                  )}
                               </div>

                               <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between">
                                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400">
                                     <Clock className="w-3.5 h-3.5" />
                                     {task.status === 'scheduled' ? 'Today, 6:00 PM' : 'Unscheduled'}
                                  </div>
                                  {task.status === 'scheduled' && (
                                    <div className="flex items-center gap-1 text-[8px] font-bold text-brand-accent uppercase tracking-widest animate-pulse">
                                      <Zap className="w-2 h-2" /> Auto-Post Live
                                    </div>
                                  )}
                               </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>

      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xl">
             <motion.div 
               initial={{ opacity: 0, scale: 0.9, y: 20 }} 
               animate={{ opacity: 1, scale: 1, y: 0 }} 
               exit={{ opacity: 0, scale: 0.9, y: 20 }} 
               className="bg-white rounded-[3rem] max-w-xl w-full p-10 shadow-2xl relative border border-slate-100"
             >
                <div className="flex justify-between items-center mb-10">
                   <div className="space-y-1">
                      <h3 className="text-3xl font-display font-bold italic text-slate-900">New <span className="text-brand-accent">Post</span></h3>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Target Status: {targetStatus}</p>
                   </div>
                   <button onClick={() => setIsAdding(false)} className="p-3 hover:bg-slate-50 rounded-2xl transition-all">
                      <X className="w-6 h-6 text-slate-400" />
                   </button>
                </div>
                
                <div className="space-y-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Caption / Content</label>
                    <textarea 
                      autoFocus
                      value={newContent}
                      onChange={(e) => setNewContent(e.target.value)}
                      placeholder="What's the message?"
                      className="w-full min-h-[120px] p-6 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-brand-accent transition-all text-lg font-light outline-none resize-none"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Private Notes</label>
                    <textarea 
                      value={newNotes}
                      onChange={(e) => setNewNotes(e.target.value)}
                      placeholder="Add research or reminders..."
                      className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-brand-accent transition-all text-sm font-light outline-none h-20 resize-none"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Platforms</label>
                    <div className="grid grid-cols-4 gap-3">
                      {PLANNER_PLATFORMS.map(p => (
                        <button 
                          key={p.id}
                          onClick={() => {
                            setSelectedTaskPlatforms(prev => 
                              prev.includes(p.id) ? prev.filter(id => id !== p.id) : [...prev, p.id]
                            );
                          }}
                          className={cn(
                            "flex flex-col items-center justify-center p-4 rounded-2xl border transition-all gap-2",
                            selectedTaskPlatforms.includes(p.id) 
                              ? "bg-white border-brand-accent shadow-md shadow-brand-accent/5" 
                              : "bg-slate-50 border-slate-100 opacity-60 grayscale hover:grayscale-0"
                          )}
                        >
                           <p.icon className={cn("w-5 h-5", selectedTaskPlatforms.includes(p.id) ? p.color : "text-slate-400")} />
                           <span className={cn("text-[9px] font-bold uppercase tracking-widest", selectedTaskPlatforms.includes(p.id) ? "text-slate-900" : "text-slate-400")}>
                             {p.id}
                           </span>
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <button onClick={() => setIsAdding(false)} className="h-16 rounded-2xl bg-slate-50 text-slate-400 font-bold uppercase tracking-widest text-[10px]">Discard</button>
                    <button 
                      onClick={createTask} 
                      disabled={!newContent} 
                      className="h-16 rounded-2xl bg-brand-accent text-white font-bold uppercase tracking-widest text-[10px] shadow-xl shadow-brand-accent/20"
                    >
                      Save to Planner
                    </button>
                  </div>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deletingTaskId && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xl">
             <motion.div 
               initial={{ opacity: 0, scale: 0.9, y: 20 }} 
               animate={{ opacity: 1, scale: 1, y: 0 }} 
               exit={{ opacity: 0, scale: 0.9, y: 20 }} 
               className="bg-white rounded-[3rem] max-w-sm w-full p-10 text-center space-y-8"
             >
                <div className="w-16 h-16 rounded-3xl bg-red-50 flex items-center justify-center mx-auto text-red-500">
                   <Trash2 className="w-7 h-7" />
                </div>
                <div className="space-y-2">
                   <h3 className="text-2xl font-display font-bold italic tracking-tighter text-slate-900">Delete Post?</h3>
                   <p className="text-slate-500 text-sm font-light">This will permanently remove this post from your planner.</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <button onClick={() => setDeletingTaskId(null)} className="h-14 rounded-2xl bg-slate-50 text-slate-400 font-bold uppercase text-[10px] tracking-widest">Cancel</button>
                   <button 
                     onClick={() => {
                       deleteTask(deletingTaskId);
                       setDeletingTaskId(null);
                     }} 
                     className="h-14 rounded-2xl bg-red-500 text-white font-bold uppercase text-[10px] tracking-widest shadow-lg shadow-red-500/20"
                   >
                     Confirm Delete
                   </button>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      <EliteUpgradeModal isOpen={upgradeModalOpen} onClose={() => setUpgradeModalOpen(false)} />
    </div>
  );
}
