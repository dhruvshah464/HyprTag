import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Calendar as CalendarIcon, 
  Trash2,
  Zap,
  Sparkles,
  Loader2,
  Rocket,
  X,
  Instagram,
  Youtube,
  Send,
  Twitter,
  ChevronRight,
  MoreVertical,
  Check
} from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { cn } from '../lib/utils';
import { db, handleFirestoreError } from '../lib/firebase';
import { useAuth } from '../lib/auth';
import { collection, query, where, onSnapshot, updateDoc, doc, addDoc, serverTimestamp, deleteDoc } from 'firebase/firestore';

interface Task {
  id: string;
  content: string;
  status: 'idea' | 'draft' | 'scheduled' | 'published';
  platforms: string[];
  createdAt: any;
  notes?: string;
}

const COLUMNS: { id: Task['status']; label: string }[] = [
  { id: 'idea', label: 'Idea Forge' },
  { id: 'draft', label: 'Strategy Lab' },
  { id: 'scheduled', label: 'Matrix Ready' },
  { id: 'published', label: 'Archive' }
];

const PLATFORMS = [
  { id: 'Instagram', icon: Instagram, color: 'text-brand-neon' },
  { id: 'TikTok', icon: Send, color: 'text-brand-cyan' },
  { id: 'YouTube', icon: Youtube, color: 'text-red-500' },
  { id: 'Twitter', icon: Twitter, color: 'text-blue-400' }
];

export default function Planner() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [targetStatus, setTargetStatus] = useState<Task['status']>('idea');
  const [newContent, setNewContent] = useState('');
  const [newNotes, setNewNotes] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['Instagram']);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, "posts"), where("userId", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setTasks(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Task[]);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [user?.uid]);

  const onDragEnd = async (result: any) => {
    const { destination, source, draggableId } = result;
    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) return;

    try {
      await updateDoc(doc(db, "posts", draggableId), { status: destination.droppableId });
    } catch (e) {
      handleFirestoreError(e, 'update', 'posts');
    }
  };

  const createTask = async () => {
    if (!user || !newContent) return;
    try {
      await addDoc(collection(db, "posts"), {
        userId: user.uid,
        content: newContent,
        notes: newNotes,
        status: targetStatus,
        platforms: selectedPlatforms,
        createdAt: serverTimestamp(),
      });
      setIsAdding(false);
      setNewContent('');
      setNewNotes('');
    } catch (e) {
      handleFirestoreError(e, 'create', 'posts');
    }
  };

  if (loading) return null;

  return (
    <div className="h-full flex flex-col space-y-10">
      <div className="flex justify-between items-end">
        <div className="space-y-2">
           <h1 className="font-display text-6xl uppercase italic tracking-tighter text-white">Post <span className="text-brand-neon">Matrix</span></h1>
           <p className="text-white/30 text-sm font-mono tracking-widest lowercase italic">organize reach // distribute impact // execute viral loop</p>
        </div>
        <button 
          onClick={() => { setTargetStatus('idea'); setIsAdding(true); }}
          className="hypr-btn hypr-btn-primary flex items-center gap-3 pr-10"
        >
          <Plus className="w-5 h-5" /> New Tactical
        </button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-6 overflow-x-auto pb-10 flex-grow hide-scrollbar">
          {COLUMNS.map((col) => (
            <div key={col.id} className="min-w-[320px] w-[320px] flex flex-col gap-6">
              <div className="flex justify-between items-center px-4">
                 <div className="flex items-center gap-3">
                    <h3 className="text-[10px] font-mono text-white/40 uppercase tracking-[0.3em] font-bold">{col.label}</h3>
                    <span className="text-[10px] font-mono text-brand-neon">[{tasks.filter(t => t.status === col.id).length}]</span>
                 </div>
              </div>

              <Droppable droppableId={col.id}>
                {(provided, snapshot) => (
                  <div 
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={cn(
                      "flex-grow bg-brand-surface/40 border border-white/5 p-4 transition-all min-h-[400px] relative overflow-hidden",
                      snapshot.isDraggingOver && "bg-brand-neon/5 border-brand-neon/20 shadow-[inset_0_0_20px_rgba(0,255,0,0.1)]"
                    )}
                  >
                    <div className="scanline opacity-[0.05]" />
                    <div className="space-y-4 relative z-10">
                      {tasks.filter(t => t.status === col.id).map((task, index) => (
                        /* @ts-ignore - key is used by React for list reconciliation but not part of DraggableProps */
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={cn(
                                "p-6 bg-brand-surface border border-white/5 transition-all group relative",
                                snapshot.isDragging && "shadow-[0_0_30px_rgba(0,255,0,0.2)] border-brand-neon border-opacity-50"
                              )}
                            >
                               <div className="flex justify-between items-start mb-4">
                                  <div className="flex gap-2">
                                     {task.platforms?.map(p => {
                                       const plat = PLATFORMS.find(cp => cp.id === p);
                                       if (!plat) return null;
                                       return <plat.icon key={p} className={cn("w-3.5 h-3.5 opacity-40 group-hover:opacity-100 transition-opacity", plat.color)} />;
                                     })}
                                  </div>
                               </div>
                               
                               <div className="space-y-1">
                                  <p className="text-sm text-white/80 font-light italic leading-relaxed line-clamp-3">
                                    "{task.content}"
                                  </p>
                                  {task.notes && (
                                    <p className="text-[9px] font-mono text-white/20 italic group-hover:text-white/40 transition-colors uppercase tracking-tighter">
                                      {task.notes}
                                    </p>
                                  )}
                               </div>

                               <div className="mt-8 flex items-center justify-between opacity-20 group-hover:opacity-100 transition-opacity">
                                  <div className="w-2 h-2 bg-brand-neon" />
                                  <MoreVertical className="w-3.5 h-3.5 text-white/40" />
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

      {/* Add Modal */}
      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-brand-void/90 backdrop-blur-md">
             <motion.div 
               initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
               className="bg-brand-surface border border-white/10 max-w-xl w-full p-10 relative overflow-hidden"
             >
                <div className="scanline opacity-10" />
                <div className="flex justify-between items-center mb-10 relative z-10">
                   <h3 className="text-4xl font-display font-bold italic uppercase tracking-tighter text-white">Add <span className="text-brand-neon">Tactical</span></h3>
                   <button onClick={() => setIsAdding(false)} className="text-white/20 hover:text-white transition-colors"><X className="w-6 h-6" /></button>
                </div>
                
                <div className="space-y-8 relative z-10">
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest pl-1 font-bold">Protocol Instructions / Caption</label>
                    <textarea 
                      autoFocus value={newContent} onChange={(e) => setNewContent(e.target.value)}
                      placeholder="Input viral script or caption..."
                      className="w-full min-h-[160px] p-6 bg-white/5 border border-white/5 text-white italic outline-none focus:border-brand-neon transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-4 gap-4">
                     {PLATFORMS.map(p => (
                       <button 
                         key={p.id}
                         onClick={() => setSelectedPlatforms(prev => prev.includes(p.id) ? prev.filter(id => id !== p.id) : [...prev, p.id])}
                         className={cn(
                           "flex flex-col items-center justify-center p-4 aspect-square border transition-all gap-2",
                           selectedPlatforms.includes(p.id) ? "bg-brand-neon/10 border-brand-neon" : "bg-white/5 border-white/5 opacity-40"
                         )}
                       >
                          <p.icon className={cn("w-5 h-5", selectedPlatforms.includes(p.id) ? p.color : "text-white/40")} />
                          <span className="text-[8px] font-mono uppercase tracking-widest leading-none">{p.id}</span>
                       </button>
                     ))}
                  </div>

                  <div className="flex gap-4 pt-10">
                    <button onClick={() => setIsAdding(false)} className="flex-grow hypr-btn hypr-btn-outline">Abort</button>
                    <button onClick={createTask} className="flex-grow hypr-btn hypr-btn-primary">Link to Matrix</button>
                  </div>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
