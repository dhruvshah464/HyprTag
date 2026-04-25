import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Instagram, 
  Twitter, 
  Linkedin, 
  Facebook, 
  Globe, 
  CheckCircle2, 
  AlertCircle, 
  Plus, 
  ArrowRight as ArrowRightIcon,
  Zap,
  MessageCircle,
  Share2,
  X,
  Loader2,
  Send,
  Youtube
} from 'lucide-react';
import { cn } from '../lib/utils';

import { useAuth } from '../lib/auth';
import { db, handleFirestoreError } from '../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

export default function Connections() {
  const { user, profile } = useAuth();
  
  const connections = profile?.connections || {};

  const [verifyingPlatform, setVerifyingPlatform] = React.useState<any>(null);
  const [handle, setHandle] = React.useState('');
  const [step, setStep] = React.useState<'input' | 'auth' | 'scanning' | 'success'>('input');

  const [verificationError, setVerificationError] = React.useState<string | null>(null);

  const handleToggle = (platform: any) => {
    if (platform.connected) {
      if (window.confirm(`Disconnect ${platform.name}? You won't be able to auto-post until you reconnect.`)) {
        executeConnection(platform.id, false);
      }
    } else {
      setVerifyingPlatform(platform);
      setHandle('');
      setStep('auth');
      setVerificationError(null);
    }
  };

  const executeConnection = async (platformId: string, isConnected: boolean, socialHandle?: string) => {
    if (!user) return;
    const userRef = doc(db, 'users', user.uid);
    
    const updateData: any = {
      connections: {
        ...(profile?.connections || {}),
        [platformId]: isConnected
      }
    };

    if (isConnected && socialHandle) {
      updateData.socialHandles = {
        ...(profile?.socialHandles || {}),
        [platformId]: socialHandle
      };
    }

    try {
      await setDoc(userRef, updateData, { merge: true });
    } catch (e) {
      handleFirestoreError(e, 'write', 'users');
    }
  };

  const [scanStatus, setScanStatus] = React.useState('Initializing...');

  const startVerification = async () => {
    if (!handle) return;
    if (handle.length < 3) {
      setVerificationError('Handle is too short.');
      return;
    }
    
    setStep('scanning');
    setVerificationError(null);
    
    const statuses = [
      'Finding your profile...',
      'Verifying handle...',
      'Confirming account active...',
      'Linking to ViralFlow...'
    ];

    for (const status of statuses) {
      setScanStatus(status);
      await new Promise(r => setTimeout(r, 800));
    }

    const formattedHandle = handle.startsWith('@') ? handle : `@${handle}`;
    await executeConnection(verifyingPlatform.id, true, formattedHandle);
    setStep('success');
    
    setTimeout(() => {
      setVerifyingPlatform(null);
    }, 2000);
  };

  const PLATFORMS = [
    { 
      id: 'instagram', 
      name: 'Instagram', 
      icon: Instagram, 
      color: 'text-pink-500', 
      bg: 'bg-pink-500/10', 
      connected: !!connections.instagram,
      handle: profile?.socialHandles?.instagram || (!!connections.instagram ? '@linked' : null)
    },
    { 
      id: 'tiktok', 
      name: 'TikTok', 
      icon: Send, 
      color: 'text-slate-900', 
      bg: 'bg-slate-900/10', 
      connected: !!connections.tiktok,
      handle: profile?.socialHandles?.tiktok || (!!connections.tiktok ? '@linked' : null)
    },
    { 
      id: 'youtube', 
      name: 'YouTube', 
      icon: Youtube, 
      color: 'text-red-600', 
      bg: 'bg-red-600/10', 
      connected: !!connections.youtube,
      handle: profile?.socialHandles?.youtube || (!!connections.youtube ? '@linked' : null)
    },
    { 
      id: 'twitter', 
      name: 'Twitter / X', 
      icon: Twitter, 
      color: 'text-sky-400', 
      bg: 'bg-sky-400/10', 
      connected: !!connections.twitter,
      handle: profile?.socialHandles?.twitter || (!!connections.twitter ? '@linked' : null)
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-16 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 text-left">
        <div className="space-y-4">
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-accent/10 border border-brand-accent/20 text-[10px] font-bold uppercase tracking-widest text-brand-accent">
              <Globe className="w-3 h-3" />
              Social Connections
           </div>
           <h1 className="font-display font-bold text-4xl italic tracking-tighter text-slate-900">Connections</h1>
           <p className="text-slate-500 max-w-sm">Connect your social accounts to enable auto-posting and viral tracking.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {PLATFORMS.map((platform) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={platform.id} 
            className="p-8 flex items-center justify-between group bg-white border border-slate-100 rounded-[2.5rem] shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all"
          >
            <div className="flex items-center gap-5">
               <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110", platform.bg)}>
                  <platform.icon className={cn("w-8 h-8", platform.color)} />
               </div>
               <div className="space-y-1">
                  <h3 className="font-bold text-lg tracking-tight text-slate-800 text-left">{platform.name}</h3>
                  <div className="flex items-center gap-1.5 pt-0.5 text-left">
                     {platform.connected ? (
                       <div className="flex flex-col items-start">
                         <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest flex items-center gap-1.5">
                            <CheckCircle2 className="w-3 h-3" /> 
                            Connected
                         </span>
                         <span className="text-[10px] text-slate-400 mt-0.5">
                           {platform.handle}
                         </span>
                       </div>
                     ) : (
                       <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest flex items-center gap-1.5">
                          <AlertCircle className="w-3 h-3" /> Action Required
                       </span>
                     )}
                  </div>
               </div>
            </div>
            
            <button 
              onClick={() => handleToggle(platform)}
              className={cn(
                "px-6 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 transition-all border",
                platform.connected 
                  ? "text-slate-300 hover:text-red-500 hover:bg-red-50 border-transparent" 
                  : "bg-brand-accent text-white border-transparent shadow-lg shadow-brand-accent/20 hover:scale-105"
              )}
            >
               {platform.connected ? "Revoke" : "Connect"}
               {!platform.connected && <ArrowRightIcon className="w-3 h-3" />}
            </button>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {verifyingPlatform && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/60 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-[3rem] max-w-md w-full p-10 space-y-8 relative overflow-hidden border border-slate-100"
            >
              <button 
                onClick={() => setVerifyingPlatform(null)}
                className="absolute top-8 right-8 text-slate-300 hover:text-slate-900 transition-colors"
                disabled={step === 'scanning'}
              >
                <X className="w-6 h-6" />
              </button>

              <div className="text-center space-y-6">
                <div className={cn("w-20 h-20 rounded-3xl flex items-center justify-center mx-auto shadow-xl", verifyingPlatform.bg)}>
                  <verifyingPlatform.icon className={cn("w-10 h-10", verifyingPlatform.color)} />
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-3xl font-display font-bold italic text-slate-900">Connect <span className="text-brand-accent">{verifyingPlatform.name}</span></h3>
                  <p className="text-slate-500 text-sm">Securely link your account to ViralFlow.</p>
                </div>

                <AnimatePresence mode="wait">
                  {step === 'auth' && (
                    <motion.div 
                      key="auth"
                      className="space-y-6"
                    >
                      <p className="text-sm text-slate-500 italic px-4">
                        "ViralFlow needs permission to view your reach metrics to help you grow faster."
                      </p>
                      <button 
                        onClick={() => setStep('input')}
                        className="w-full h-16 bg-brand-accent text-white rounded-2xl text-[10px] font-bold tracking-widest uppercase shadow-xl shadow-brand-accent/20"
                      >
                         Authorize Account
                      </button>
                    </motion.div>
                  )}

                  {step === 'input' && (
                    <motion.div 
                      key="input"
                      className="space-y-6"
                    >
                      <div className="space-y-2 text-left">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Your Handle</label>
                        <input 
                          type="text" 
                          placeholder="@username"
                          className="w-full p-6 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-brand-accent shadow-inner text-slate-900 outline-none"
                          value={handle}
                          onChange={(e) => setHandle(e.target.value)}
                        />
                      </div>
                      <button 
                        disabled={!handle}
                        onClick={startVerification}
                        className="w-full h-16 bg-brand-accent text-white rounded-2xl text-[10px] font-bold tracking-widest uppercase flex items-center justify-center gap-3 shadow-xl shadow-brand-accent/20 disabled:opacity-50"
                      >
                         Link Account <ArrowRightIcon className="w-4 h-4" />
                      </button>
                    </motion.div>
                  )}

                  {step === 'scanning' && (
                    <motion.div 
                      key="scanning"
                      className="py-10 space-y-6"
                    >
                      <Loader2 className="w-12 h-12 text-brand-accent animate-spin mx-auto" />
                      <p className="text-[10px] font-bold text-brand-accent uppercase tracking-[0.4em] animate-pulse">{scanStatus}</p>
                    </motion.div>
                  )}

                  {step === 'success' && (
                    <motion.div 
                      key="success"
                      className="py-10 space-y-6"
                    >
                      <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
                        <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                      </div>
                      <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-[0.4em]">Account Connected Successfully</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
