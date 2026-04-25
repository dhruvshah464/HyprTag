import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Hash, 
  ArrowRight, 
  ArrowLeft, 
  User, 
  Target, 
  Globe, 
  Sparkles, 
  CheckCircle2,
  Instagram,
  Twitter,
  Linkedin,
  MessageCircle,
  Zap,
  Rocket,
  Loader2,
  Lock
} from 'lucide-react';
import { useAuth } from '../lib/auth';
import { cn } from '../lib/utils';

export default function Onboarding() {
  const { completeOnboarding, requestVerificationCode, activeVerificationCode, user, profile } = useAuth();
  const [step, setStep] = useState(1);
  const [scanning, setScanning] = useState(false);
  const [discoveredPlatforms, setDiscoveredPlatforms] = useState<string[]>([]);
  
  const [details, setDetails] = useState({
    displayName: '',
    niche: '',
    goals: [] as string[]
  });
  const [socialHandles, setSocialHandles] = useState({
    instagram: '',
    tiktok: '',
    twitter: '',
    linkedin: ''
  });
  const [verificationCode, setVerificationCode] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const [sendingCode, setSendingCode] = useState(false);

  React.useEffect(() => {
    if (step === 2) {
      handleDiscovery();
    }
    if (step === 4) {
      requestVerificationCode();
    }
  }, [step]);

  const handleDiscovery = async () => {
    setScanning(true);
    await new Promise(r => setTimeout(r, 4000));
    setDiscoveredPlatforms([]); // Empty discovery to reflect reality for new users
    setScanning(false);
  };

  const handleResend = async () => {
    setSendingCode(true);
    await requestVerificationCode();
    setSendingCode(false);
  };

  const hasSocials = Object.values(socialHandles).some(v => typeof v === 'string' && v.length > 0);

  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => setStep(s => s - 1);

  const handleVerify = async () => {
    setVerifying(true);
    await new Promise(r => setTimeout(r, 2000));
    if (verificationCode === 'HYPR-777' || verificationCode === activeVerificationCode) {
      setVerified(true);
      setStep(4);
    } else {
      alert("Strategic hand-shake failed. Verify the code dispatched to your authenticated endpoint.");
    }
    setVerifying(false);
  };

  const finish = async () => {
    // Generate connections object based on which handles were filled
    const connections: Record<string, boolean> = {};
    Object.entries(socialHandles).forEach(([key, val]) => {
      if (val) connections[key] = true;
    });

    await completeOnboarding({
      ...details,
      socialHandles,
      connections
    });
  };

  const toggleNiche = (n: string) => {
     setDetails(prev => ({
       ...prev,
       niche: prev.niche === n ? '' : n
     }));
  };

  return (
    <div className="min-h-screen bg-bg-main text-slate-900 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Ambience */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-brand-accent/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-slate-100 rounded-full blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="hypr-card max-w-2xl w-full p-12 space-y-12 relative z-10 border-slate-200 bg-white shadow-2xl"
      >
        {/* Progress Rail */}
        <div className="flex gap-2">
           {[1, 2, 3, 4, 5].map(i => (
             <div key={i} className={cn("h-1 flex-grow rounded-full transition-all duration-500", i <= step ? "bg-brand-accent" : "bg-slate-100")} />
           ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-10"
            >
              <div className="space-y-4 text-left">
                 <h2 className="text-4xl font-display font-bold italic tracking-tighter text-slate-900">Initialize <span className="text-brand-accent">Identity.</span></h2>
                 <p className="text-slate-500 font-light italic">Establish your digital presence within the HyprTags neural network.</p>
              </div>

              <div className="space-y-8">
                 <div className="space-y-3 text-left">
                    <label className="hypr-label flex items-center gap-2 text-slate-400">
                       <User className="w-3 h-3" /> Creator Pseudonym / Name
                    </label>
                    <input 
                      type="text" 
                      placeholder="e.g., Alex Rivers"
                      className="hypr-input w-full text-xl py-4 bg-slate-50 border-slate-200 focus:bg-white text-slate-900"
                      value={details.displayName}
                      onChange={(e) => setDetails(d => ({ ...d, displayName: e.target.value }))}
                    />
                 </div>

                 <div className="space-y-4 text-left">
                    <label className="hypr-label flex items-center gap-2 text-slate-400">
                       <Target className="w-3 h-3" /> Strategic Niche
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                       {['Lifestyle', 'Tech', 'Fitness', 'Art', 'Business', 'Travel'].map(n => (
                         <button 
                           key={n}
                           onClick={() => toggleNiche(n)}
                           className={cn(
                             "px-4 py-3 rounded-xl border text-xs font-bold uppercase tracking-widest transition-all",
                             details.niche === n 
                               ? "bg-slate-900 border-slate-900 text-white shadow-xl shadow-slate-900/10" 
                               : "bg-slate-50 border-slate-100 text-slate-400 hover:border-slate-200 hover:bg-white"
                           )}
                         >
                           {n}
                         </button>
                       ))}
                    </div>
                 </div>
              </div>

              <button 
                disabled={!details.displayName || !details.niche}
                onClick={handleNext}
                className="btn-hypr-primary w-full h-16 flex items-center justify-center gap-3 text-sm tracking-widest uppercase disabled:opacity-50 shadow-xl shadow-brand-accent/20"
              >
                Simulate Identity Matrix Scan <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div 
               key="step2"
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="space-y-12 text-center"
            >
               <div className="space-y-4">
                  <h2 className="text-3xl font-display font-bold italic tracking-tighter text-slate-900">Neural <span className="text-brand-accent">Discovery.</span></h2>
                  <p className="text-slate-400 text-sm italic">Scanning global social clusters for endpoints linked to <span className="text-slate-900 font-bold">{user?.email}</span></p>
               </div>

               <div className="relative py-20">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className={cn("w-48 h-48 border-2 border-brand-accent/20 rounded-full animate-ping", scanning ? "opacity-100" : "opacity-0")} />
                  </div>
                  <div className="relative z-10 space-y-6">
                    {scanning ? (
                      <div className="space-y-4">
                        <Loader2 className="w-12 h-12 text-brand-accent animate-spin mx-auto" />
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.4em] animate-pulse">Extracting Linked Nodes...</p>
                      </div>
                    ) : (
                      <div className="space-y-8">
                        <div className="flex justify-center gap-4">
                          {discoveredPlatforms.map(p => (
                            <motion.div 
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              key={p}
                              className="w-16 h-16 bg-brand-accent/10 border border-brand-accent/20 rounded-2xl flex items-center justify-center"
                            >
                               {p === 'instagram' && <Instagram className="w-6 h-6 text-brand-accent" />}
                               {p === 'tiktok' && <MessageCircle className="w-6 h-6 text-brand-accent" />}
                            </motion.div>
                          ))}
                        </div>
                        <p className="text-sm font-bold text-slate-700 uppercase tracking-widest">{discoveredPlatforms.length} Potential Clusters Identified</p>
                      </div>
                    )}
                  </div>
               </div>

               {!scanning && (
                 <button 
                  onClick={handleNext}
                  className="btn-hypr-primary w-full h-16 text-sm tracking-widest uppercase shadow-xl shadow-brand-accent/20"
                >
                   Finalize Tactical Handshake <ArrowRight className="w-4 h-4" />
                 </button>
               )}
            </motion.div>
          )}

          {step === 3 && (
            <motion.div 
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-10"
            >
              <div className="space-y-4 text-left">
                 <h2 className="text-4xl font-display font-bold italic tracking-tighter text-slate-900">Authorize <span className="text-brand-accent">Endpoints.</span></h2>
                 <p className="text-slate-500 font-light italic">Establish secure tunnel connections for optimized strategic signal extraction.</p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                 <SocialInput 
                    icon={Instagram} 
                    label="Instagram" 
                    value={socialHandles.instagram}
                    onChange={(val) => setSocialHandles(h => ({ ...h, instagram: val }))}
                 />
                 <SocialInput 
                    icon={MessageCircle} 
                    label="TikTok" 
                    value={socialHandles.tiktok}
                    onChange={(val) => setSocialHandles(h => ({ ...h, tiktok: val }))}
                 />
                 <SocialInput 
                    icon={Twitter} 
                    label="Twitter / X" 
                    value={socialHandles.twitter}
                    onChange={(val) => setSocialHandles(h => ({ ...h, twitter: val }))}
                 />
              </div>

              <div className="flex gap-4 pt-6">
                 <button onClick={handleBack} className="btn-hypr-secondary w-24 h-16 flex items-center justify-center border border-slate-200 hover:bg-slate-50 shadow-sm"><ArrowLeft className="w-5 h-5 text-slate-400" /></button>
                 <button 
                  disabled={!hasSocials}
                  onClick={handleNext} 
                  className="btn-hypr-primary flex-grow h-16 flex items-center justify-center gap-3 text-sm tracking-widest uppercase shadow-xl shadow-brand-accent/20 disabled:opacity-50"
                >
                    Initialize Security Protocol <ArrowRight className="w-4 h-4" />
                 </button>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div 
              key="step4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-12"
            >
              <div className="space-y-4 text-left">
                 <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 text-white text-[9px] font-bold uppercase tracking-widest">
                    <Lock className="w-3 h-3 text-brand-accent" /> 2FA Neural Bridge
                 </div>
                 <h2 className="text-4xl font-display font-bold italic tracking-tighter text-slate-900">Final <span className="text-brand-accent">Handshake.</span></h2>
                 <p className="text-slate-500 font-light italic leading-relaxed">
                    A strategic verification packet has been dispatched to <span className="text-slate-900 font-bold">{user?.email}</span>. Authorize endpoint linking below.
                 </p>
              </div>

              <div className="space-y-6">
                 <div className="space-y-3 text-left">
                    <label className="hypr-label ml-1 text-slate-400">Strategic Verification Key</label>
                    <input 
                      type="text" 
                      placeholder="HYPR-XXX"
                      className="hypr-input w-full text-3xl font-display font-bold text-center tracking-[0.2em] py-6 bg-slate-50 border-slate-200 focus:bg-white text-slate-900 placeholder:opacity-20"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value.toUpperCase())}
                    />
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest text-center mt-4 italic">
                      Trial sequence code: <span className="text-brand-accent">HYPR-777</span>
                    </p>
                 </div>

                 <button 
                  disabled={verifying || verificationCode.length < 5}
                  onClick={handleVerify}
                  className="btn-hypr-primary w-full h-18 text-sm flex items-center justify-center gap-4 transition-all shadow-xl shadow-brand-accent/20 disabled:opacity-50"
                 >
                    {verifying ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Complete Authentication <Zap className="w-4 h-4 fill-current" /></>}
                 </button>
              </div>
            </motion.div>
          )}

          {step === 5 && (
            <motion.div 
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-10 text-center"
            >
              <div className="w-24 h-24 bg-brand-accent/10 rounded-[2rem] border border-brand-accent/20 flex items-center justify-center mx-auto mb-10 shadow-inner">
                 <Rocket className="w-10 h-10 text-brand-accent animate-bounce" />
              </div>

              <div className="space-y-4">
                 <h2 className="text-4xl font-display font-bold italic tracking-tighter text-slate-900">System <span className="text-brand-accent">Prime.</span></h2>
                 <p className="text-slate-500 font-light max-w-sm mx-auto">Neural pathways configured. Your strategic growth engine is ready for deployment.</p>
              </div>

              <div className="space-y-6 pt-10">
                 <div className="p-6 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between text-left">
                    <div className="flex items-center gap-4">
                       <Sparkles className="w-5 h-5 text-brand-accent" />
                       <span className="text-xs font-bold uppercase tracking-widest text-slate-600">Elite Intelligence</span>
                    </div>
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                 </div>
                 <div className="p-6 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between text-left">
                    <div className="flex items-center gap-4">
                       <Zap className="w-5 h-5 text-brand-accent" />
                       <span className="text-xs font-bold uppercase tracking-widest text-slate-600">Velocity Scoring</span>
                    </div>
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                 </div>
              </div>

              <button 
                onClick={finish}
                className="btn-hypr-primary w-full h-20 text-lg flex items-center justify-center gap-4 group shadow-2xl shadow-brand-accent/30"
              >
                 Enter Command Center <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Footer Branding */}
      <div className="mt-12 text-[10px] font-mono font-bold tracking-[0.4em] text-slate-300 uppercase">
         HyprTags Systems Onboarding Protocol
      </div>
    </div>
  );
}

function SocialInput({ icon: Icon, label, value, onChange }: { icon: any, label: string, value: string, onChange: (v: string) => void }) {
  const [active, setActive] = useState(!!value);
  return (
    <div className={cn(
      "p-6 rounded-[2.5rem] border flex flex-col gap-4 transition-all group",
      active ? "bg-brand-accent/[0.04] border-brand-accent/40 shadow-sm" : "bg-slate-50 border-slate-100 hover:bg-white hover:border-slate-200"
    )}>
       <div className="flex items-center gap-4">
          <div className={cn(
            "w-12 h-12 rounded-2xl flex items-center justify-center transition-all",
            active ? "bg-slate-900 text-white" : "bg-white border border-slate-100 text-slate-300"
          )}>
             <Icon className="w-5 h-5" />
          </div>
          <div className="flex-grow text-left">
             <p className={cn("text-xs font-bold uppercase tracking-widest", active ? "text-slate-900" : "text-slate-400")}>{label}</p>
             <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest mt-0.5">{active ? "Authorization Active" : "Awaiting Strategy"}</p>
          </div>
          <button 
            type="button"
            onClick={() => setActive(!active)}
            className={cn(
              "px-4 h-9 rounded-xl text-[9px] font-bold uppercase tracking-widest transition-all",
              active ? "bg-red-50 text-red-500 border border-red-100" : "bg-slate-100 text-slate-600 border border-slate-200 hover:bg-white"
            )}
          >
            {active ? 'Revoke' : 'Authorize'}
          </button>
       </div>
       
       <AnimatePresence>
         {active && (
           <motion.div 
             initial={{ height: 0, opacity: 0 }}
             animate={{ height: 'auto', opacity: 1 }}
             exit={{ height: 0, opacity: 0 }}
             className="overflow-hidden"
           >
             <div className="pt-2 text-left">
               <input 
                 type="text"
                 placeholder={`Enter @${label.toLowerCase().replace(' ', '')} handle`}
                 className="hypr-input w-full py-4 text-sm bg-white border-slate-200 text-slate-900"
                 value={value}
                 onChange={(e) => onChange(e.target.value)}
               />
             </div>
           </motion.div>
         )}
       </AnimatePresence>
    </div>
  );
}
