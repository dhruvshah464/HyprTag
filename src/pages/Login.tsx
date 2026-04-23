import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Hash, 
  Sparkles, 
  Zap, 
  ArrowRight, 
  ShieldCheck, 
  Loader2, 
  AlertCircle, 
  Lock,
  Smartphone,
  ChevronRight,
  Shield,
  Key,
  Instagram,
  Twitter
} from 'lucide-react';
import { useAuth } from '../lib/auth';
import { cn } from '../lib/utils';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const { 
    login, 
    isLoggingIn, 
    authError, 
    user 
  } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-bg-main flex flex-col items-center justify-center relative overflow-hidden text-slate-900 font-sans p-6">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-brand-accent/5 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-white rounded-full blur-[140px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-20 space-y-12"
      >
        <div className="flex flex-col items-center gap-6">
          <div 
            onClick={() => navigate('/')}
            className="w-20 h-20 bg-slate-900 rounded-[28px] flex items-center justify-center shadow-2xl shadow-slate-900/20 cursor-pointer transition-transform hover:scale-110 active:scale-95 overflow-hidden"
          >
            <img src="/logo.png" alt="Logo" className="w-full h-full object-cover scale-150" />
          </div>
          <div className="text-center space-y-2">
            <h1 className="font-display font-bold text-4xl tracking-tighter lowercase">hypr<span className="text-brand-accent">tags</span></h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.4em] font-mono">Neural Access Point v4.2</p>
          </div>
        </div>

        <div className="hypr-card p-10 bg-white border-slate-200 shadow-2xl relative overflow-hidden group">
          <div className="space-y-8">
            <div className="space-y-3">
              <h2 className="text-2xl font-display font-bold italic text-slate-900">Initialize <span className="text-brand-accent">Session</span></h2>
              <p className="text-sm text-slate-500 font-light leading-relaxed italic">"Authorize your identity via social handshake to enter the command interface."</p>
            </div>

            <div className="space-y-4">
              <button 
                onClick={login}
                disabled={isLoggingIn}
                className="w-full h-16 bg-white border border-slate-100 rounded-2xl flex items-center justify-between px-6 hover:border-brand-accent/20 hover:bg-slate-50 transition-all group shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 flex items-center justify-center">
                    <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5 opacity-40 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-700 uppercase tracking-widest">Connect Identity</span>
                </div>
                {isLoggingIn ? <Loader2 className="w-4 h-4 animate-spin text-brand-accent" /> : <ChevronRight className="w-4 h-4 text-slate-300 group-hover:translate-x-1 transition-transform" />}
              </button>

              <div className="flex gap-4">
                <button className="flex-grow h-14 bg-white border border-slate-100 rounded-2xl flex items-center justify-center gap-3 hover:border-brand-accent/20 transition-all opacity-60 hover:opacity-100">
                  <Instagram className="w-4 h-4 text-slate-400" />
                  <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">Instagram</span>
                </button>
                <button className="flex-grow h-14 bg-white border border-slate-100 rounded-2xl flex items-center justify-center gap-3 hover:border-brand-accent/20 transition-all opacity-60 hover:opacity-100">
                  <Twitter className="w-4 h-4 text-slate-400" />
                  <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">Twitter / X</span>
                </button>
              </div>

              <div className="h-px bg-slate-50 relative">
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-4 text-[8px] font-bold text-slate-300 uppercase tracking-[0.3em]">Secure Socket</span>
              </div>

              <p className="text-[9px] text-slate-400 font-bold uppercase text-center tracking-[0.2em] pt-2">
                Guest Mode Deactivated. Strategic Access Only.
              </p>
            </div>

            {authError && (
               <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-500 text-[10px] font-bold uppercase tracking-wider">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {authError}
               </div>
            )}
          </div>
        </div>

        <div className="flex justify-center gap-8 text-[9px] font-bold text-slate-300 uppercase tracking-[0.3em] font-mono">
           <div className="flex items-center gap-2">
              <Shield className="w-3 h-3" /> AES-256 SYNC
           </div>
           <div className="flex items-center gap-2 text-brand-accent">
              <Zap className="w-3 h-3 fill-current" /> ELITE READY
           </div>
        </div>
      </motion.div>
    </div>
  );
}
