import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Zap, X, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface EliteUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
}

export const EliteUpgradeModal = ({ 
  isOpen, 
  onClose, 
  title = "Neural Limit Reached",
  description = "Base protocols have hit maximum capacity. Upgrade to Elite for unlimited strategic extraction and proprietary growth signals."
}: EliteUpgradeModalProps) => {
  const navigate = useNavigate();
  
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xl">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }} 
            animate={{ opacity: 1, scale: 1, y: 0 }} 
            exit={{ opacity: 0, scale: 0.9, y: 20 }} 
            className="hypr-card max-w-lg w-full border-brand-accent/20 shadow-3xl bg-white p-12 text-center space-y-8 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-accent/5 rounded-full blur-[100px] -z-10" />
            <button onClick={onClose} className="absolute top-8 right-8 p-2 text-slate-300 hover:text-slate-600 transition-colors">
              <X className="w-6 h-6" />
            </button>
            <div className="w-24 h-24 rounded-full bg-brand-accent/10 flex items-center justify-center mx-auto shadow-xl shadow-brand-accent/10">
               <Zap className="w-12 h-12 text-brand-accent animate-pulse fill-current" />
            </div>
            <div className="space-y-4">
               <h3 className="text-4xl font-display font-bold italic tracking-tighter text-slate-900">{title}</h3>
               <p className="text-slate-500 font-light italic leading-relaxed">
                 "{description}"
               </p>
            </div>
            <div className="space-y-4 pt-4">
              <button 
                onClick={() => navigate('/upgrade')}
                className="w-full h-18 bg-brand-accent text-white rounded-[2rem] font-bold uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:scale-[1.02] transition-all shadow-xl shadow-brand-accent/20 text-xs"
              >
                Access Elite Protocols <ArrowRight className="w-5 h-5" />
              </button>
              <button 
                onClick={onClose}
                className="w-full text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] hover:text-slate-900 transition-colors"
              >
                Continue with limited access
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
