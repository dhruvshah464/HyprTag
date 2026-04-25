import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  MoreVertical,
  Trash2,
  ExternalLink,
  Instagram,
  Twitter,
  Facebook,
  Plus,
  ArrowUpRight
} from 'lucide-react';
import { cn } from '../lib/utils';
import { db, auth, handleFirestoreError } from '../lib/firebase';
import { useAuth } from '../lib/auth';
import { collection, query, where, orderBy, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { format } from 'date-fns';
import { NavLink } from 'react-router-dom';

export default function Schedule() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    try {
      const q = query(
        collection(db, "scheduledPosts"),
        where("userId", "==", user.uid),
        orderBy("scheduledTime", "desc") // Latest first for calendar view
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPosts(data);
        setLoading(false);
      }, (err) => {
        handleFirestoreError(err, 'list', 'scheduledPosts');
      });

      return () => unsubscribe();
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  }, []);

  const deletePost = async (id: string) => {
    try {
      await deleteDoc(doc(db, "scheduledPosts", id));
    } catch (e) {
      handleFirestoreError(e, 'delete', 'scheduledPosts');
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-16 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 text-left">
        <div className="space-y-4 text-left">
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-100 text-[10px] font-bold uppercase tracking-widest text-slate-400 shadow-sm">
              <CalendarIcon className="w-3 h-3 text-brand-accent" />
              Your Schedule
           </div>
           <h1 className="font-display font-bold text-4xl italic lowercase tracking-tighter text-slate-900">Content<span className="text-brand-accent">Calendar</span></h1>
           <p className="text-slate-500 max-w-sm">Keep track of your upcoming posts and viral hooks.</p>
        </div>
        <NavLink to="/generator" className="btn-hypr-primary h-12 px-8 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
           <Plus className="w-4 h-4" /> Create New Post
        </NavLink>
      </div>

      <div className="space-y-8">
        <AnimatePresence mode="popLayout">
          {posts.length === 0 && !loading ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-24 text-center flex flex-col items-center bg-white border border-slate-100 rounded-[3rem] shadow-sm"
            >
              <div className="w-20 h-20 rounded-[2rem] bg-slate-50 border border-slate-100 flex items-center justify-center mb-8">
                <CalendarIcon className="w-8 h-8 text-slate-300" />
              </div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">No Upcoming Posts</p>
              <NavLink to="/generator" className="text-brand-accent text-xs font-bold uppercase tracking-widest hover:underline">Generate Viral Content</NavLink>
            </motion.div>
          ) : (
            posts.map((post, idx) => {
              const date = post.scheduledTime ? new Date(post.scheduledTime) : null;
              return (
                <motion.div 
                  key={post.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="p-8 flex flex-col md:flex-row items-center gap-10 bg-white border border-slate-100 rounded-[3rem] group hover:border-brand-accent/20 transition-all relative overflow-hidden text-left"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-brand-accent/[0.02] rounded-full blur-3xl -z-10" />
                  
                  {date ? (
                    <div className="w-full md:w-44 h-44 bg-slate-50 rounded-[2rem] border border-slate-100 flex flex-col items-center justify-center p-6 text-center shrink-0 group-hover:bg-slate-100 transition-colors">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 font-mono">
                        {format(date, 'EEEE')}
                      </p>
                      <p className="text-4xl font-display font-bold tracking-tighter text-slate-900">
                        {format(date, 'MMM d')}
                      </p>
                      <div className="mt-4 px-3 py-1 bg-brand-accent/10 border border-brand-accent/20 rounded-full">
                        <p className="text-[10px] font-bold text-brand-accent uppercase tracking-widest">
                          {format(date, 'h:mm a')}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full md:w-44 h-44 bg-slate-50 rounded-[2rem] border border-slate-100 flex flex-col items-center justify-center p-6 text-center shrink-0 grayscale opacity-40">
                       <Clock className="w-8 h-8 text-slate-300 mb-4" />
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Awaiting Date</p>
                    </div>
                  )}

                  <div className="flex-grow space-y-6 w-full">
                    <div className="flex justify-between items-start">
                      <div className="flex gap-2.5">
                         {(post.platforms || []).map((p: string) => (
                           <div key={p} className="p-2 bg-slate-50 rounded-lg border border-slate-100 transition-all">
                             {p === 'Instagram' && <Instagram className="w-4 h-4 text-pink-500" />}
                             {p === 'Twitter' && <Twitter className="w-4 h-4 text-sky-400" />}
                             {p === 'Facebook' && <Facebook className="w-4 h-4 text-blue-600" />}
                           </div>
                         ))}
                      </div>
                      <button 
                        onClick={() => deletePost(post.id)} 
                        className="opacity-0 group-hover:opacity-100 p-2.5 bg-red-50 hover:bg-red-100 text-red-500/40 hover:text-red-500 rounded-[1rem] border border-transparent hover:border-red-500/20 transition-all transform hover:scale-110"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="space-y-2">
                       <h4 className="text-xl font-bold tracking-tight text-slate-900 line-clamp-2">{post.content || "Awesome Viral Content"}</h4>
                       <div className="flex flex-wrap gap-2 pt-2 text-left">
                         {(post.hashtags || []).slice(0, 6).map((tag: string, i: number) => (
                           <span key={i} className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100 hover:text-brand-accent hover:border-brand-accent/20 transition-colors cursor-default">#{tag.replace('#','')}</span>
                         ))}
                         {(post.hashtags || []).length > 6 && <span className="text-[10px] text-slate-300 font-bold uppercase py-1">+{post.hashtags.length - 6} more tags</span>}
                       </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-10 shrink-0">
                    <div className={cn(
                      "flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border shadow-sm bg-white",
                      post.status === "pending" || post.status === "scheduled" ? "border-amber-200 text-amber-600" : "border-emerald-200 text-emerald-600"
                    )}>
                      {post.status === "pending" || post.status === "scheduled" ? <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                      {post.status || 'Active'}
                    </div>
                    <button className="flex items-center gap-2 text-[10px] font-bold text-slate-400 hover:text-slate-900 uppercase tracking-widest transition-all group/btn">
                      Preview Post <ArrowUpRight className="w-3 h-3 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                    </button>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
