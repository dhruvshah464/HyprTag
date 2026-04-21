import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Zap, 
  ShieldCheck, 
  Cpu, 
  Layers, 
  TrendingUp, 
  ArrowRight,
  Check,
  CreditCard,
  Loader2,
  Lock,
  X,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../lib/auth';
import { cn } from '../lib/utils';
import { useNavigate } from 'react-router-dom';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function Upgrade() {
  const { upgradeToElite, isElite, user } = useAuth();
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handlePayment = async () => {
    if (!user) {
      setError("Please initialize session first.");
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      const orderResponse = await fetch('/api/razorpay/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: 749, currency: "INR" }),
      });

      if (!orderResponse.ok) throw new Error("Failed to initialize tactical order.");
      const { orderId, amount, currency } = await orderResponse.json();

      const options = {
        key: (import.meta as any).env.VITE_RAZORPAY_KEY_ID || "rzp_test_Sg6fYCNTFZtjgp",
        amount,
        currency,
        name: "HyprTags Elite",
        description: "Neural Protocol License (Monthly)",
        order_id: orderId,
        handler: async (response: any) => {
          try {
            setProcessing(true);
            const verifyResponse = await fetch('/api/razorpay/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verificationResult = await verifyResponse.json();
            if (verificationResult.status === 'success') {
              await upgradeToElite();
              setSuccess(true);
              setTimeout(() => navigate('/elite-onboarding'), 3000);
            } else {
              throw new Error("Signature verification failed.");
            }
          } catch (err: any) {
            setError(err.message || "Strategic verification failure.");
          } finally {
            setProcessing(false);
          }
        },
        prefill: {
          name: user.displayName || "",
          email: user.email || "",
        },
        theme: {
          color: "#3b82f6",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (response: any) => {
        setError(response.error.description || "Transmission failed.");
      });
      rzp.open();
    } catch (err: any) {
      setError(err.message || "Failed to initialize payment bridge.");
    } finally {
      setProcessing(false);
    }
  };

  if (isElite && !success) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-6">
         <div className="w-20 h-20 rounded-full bg-brand-accent/10 flex items-center justify-center border border-brand-accent/20 shadow-xl shadow-brand-accent/20 transition-all hover:scale-110">
            <Sparkles className="w-10 h-10 text-brand-accent" />
         </div>
         <h2 className="text-4xl font-display font-bold italic tracking-tighter text-slate-900">You are already <span className="text-brand-accent">Elite</span></h2>
         <p className="text-slate-500 max-w-sm">All strategic assets and neural protocols have been initialized for your account.</p>
         <button onClick={() => navigate('/')} className="btn-hypr-primary px-8 h-12 shadow-lg shadow-brand-accent/20">Return to Command Center</button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-10 space-y-16">
      <div className="text-center space-y-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-accent/10 border border-brand-accent/20 text-[10px] font-bold uppercase tracking-[0.2em] text-brand-accent shadow-sm"
        >
          <Zap className="w-3 h-3 animate-pulse" />
          Neural Capacity Expansion
        </motion.div>
        <h1 className="text-6xl md:text-8xl font-display font-bold italic tracking-tighter leading-none text-slate-900">
          HyprTags <span className="text-brand-accent">Elite</span>
        </h1>
        <p className="text-xl text-slate-500 max-w-xl mx-auto font-light leading-relaxed">
          Unlock proprietary growth protocols used by the top 0.1% of digital creators.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Value Proposition */}
        <div className="space-y-8">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <PremiumFeature 
                icon={ShieldCheck} 
                title="Ghost-Ban Guard" 
                desc="Real-time neural scanning of your hashtag clusters to prevent shadowban suppression."
              />
              <PremiumFeature 
                icon={TrendingUp} 
                title="Viral Predicter" 
                desc="Predict signal velocity across platforms before trends hit the general awareness curve."
              />
              <PremiumFeature 
                icon={Cpu} 
                title="Neural Auto-Pilot" 
                desc="Automated post synchronization at peak connectivity windows, optimized by your audience data."
              />
              <PremiumFeature 
                icon={Layers} 
                title="Multi-Org Sync" 
                desc="Manage multiple brand identities and neural clusters from a single command interface."
              />
           </div>

           <div className="hypr-card p-10 bg-white border-slate-200 space-y-6 shadow-sm text-left">
              <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-slate-400">Included Benchmarks</h3>
              <ul className="space-y-4">
                 {[
                   "Unlimited Neural Iterations",
                   "Proprietary Platform Extraction",
                   "Advanced Competitor Deconstruction",
                   "Global Reach Optimization",
                   "Priority API Access (v3.2)"
                 ].map((item, i) => (
                   <li key={i} className="flex items-center gap-4 text-sm font-light text-slate-600 italic">
                      <div className="w-5 h-5 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
                         <Check className="w-3 h-3 text-emerald-500" />
                      </div>
                      {item}
                   </li>
                 ))}
              </ul>
           </div>
        </div>

        {/* Checkout UI */}
        <div className="sticky top-32">
           <AnimatePresence mode="wait">
             {!success ? (
               <motion.div 
                 key="checkout"
                 initial={{ opacity: 0, scale: 0.95 }}
                 animate={{ opacity: 1, scale: 1 }}
                 exit={{ opacity: 0, scale: 0.95 }}
                 className="hypr-card p-12 border-brand-accent/20 bg-brand-accent/[0.02] shadow-2xl shadow-brand-accent/10 space-y-10 text-left"
               >
                  <div className="flex justify-between items-end">
                     <div className="space-y-1">
                        <p className="text-[10px] font-bold text-brand-accent uppercase tracking-widest">Selected Tier</p>
                        <h3 className="text-4xl font-display font-bold italic tracking-tight text-slate-900">Elite Monthly</h3>
                     </div>
                     <div className="text-right">
                        <p className="text-4xl font-display font-medium text-slate-900">₹749<span className="text-lg text-slate-400">/mo</span></p>
                     </div>
                  </div>

                  <div className="space-y-6">
                     <div className="space-y-3">
                        <label className="hypr-label ml-1 text-slate-400">Secure Transaction</label>
                        <div className="flex items-center gap-4 p-5 bg-white border border-slate-100 rounded-2xl shadow-sm hover:border-brand-accent/20 transition-all group">
                           <CreditCard className="w-6 h-6 text-slate-300 group-hover:text-brand-accent transition-colors" />
                           <div className="flex-grow">
                              <p className="text-sm font-bold text-slate-800">Razorpay Strategic Bridge</p>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-1">PCI-DSS Compliant Connection</p>
                           </div>
                           <div className="w-2 h-2 rounded-full bg-brand-accent shadow-[0_0_8px_rgba(96,165,250,0.5)]" />
                        </div>
                     </div>

                     {error && (
                        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-500 text-[10px] font-bold uppercase tracking-wider">
                           <AlertCircle className="w-4 h-4 shrink-0" />
                           {error}
                        </div>
                      )}

                     <button 
                       onClick={handlePayment}
                       disabled={processing}
                       className="w-full h-20 bg-brand-accent text-white rounded-[2rem] font-bold uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-brand-accent/20 text-xs disabled:opacity-50"
                     >
                        {processing ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                           <>Initialize Neural Bridge <ArrowRight className="w-5 h-5" /></>
                        )}
                     </button>
                     
                     <p className="text-[9px] text-slate-400 font-bold uppercase text-center tracking-widest flex items-center justify-center gap-2">
                        <ShieldCheck className="w-3 h-3 text-emerald-500" /> AES-256 Bit Encryption Active
                     </p>
                  </div>
               </motion.div>
             ) : (
               <motion.div 
                 key="success"
                 initial={{ opacity: 0, scale: 0.9 }}
                 animate={{ opacity: 1, scale: 1 }}
                 className="hypr-card p-12 border-emerald-200 bg-emerald-50 text-center space-y-8 shadow-xl shadow-emerald-500/10"
               >
                  <div className="w-24 h-24 rounded-full bg-white border border-emerald-100 flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/10 transition-all hover:scale-110">
                     <Check className="w-12 h-12 text-emerald-500" />
                  </div>
                  <div className="space-y-4">
                     <h3 className="text-4xl font-display font-bold italic tracking-tighter text-slate-900">Payment <span className="text-emerald-500">Verified</span></h3>
                     <p className="text-slate-500 font-light italic leading-relaxed">"Neural bridge established. All elite sub-routines are now visible."</p>
                  </div>
                  <div className="p-4 bg-white border border-emerald-100 rounded-2xl shadow-sm">
                     <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Redirecting to Intelligence Hub...</p>
                  </div>
               </motion.div>
             )}
           </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function PremiumFeature({ icon: Icon, title, desc }: any) {
  return (
    <div className="p-8 bg-white border border-slate-100 rounded-[2.5rem] space-y-6 hover:bg-slate-50 transition-all group shadow-sm text-left">
       <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:scale-110 group-hover:bg-brand-accent/10 transition-all">
          <Icon className="w-7 h-7 text-slate-300 group-hover:text-brand-accent transition-colors" />
       </div>
       <div className="space-y-2">
          <h4 className="text-xl font-bold tracking-tight italic group-hover:text-brand-accent transition-colors text-slate-900">{title}</h4>
          <p className="text-xs text-slate-500 leading-relaxed font-light">{desc}</p>
       </div>
    </div>
  );
}
