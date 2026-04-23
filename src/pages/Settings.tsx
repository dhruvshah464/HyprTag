import React from 'react';
import { motion } from 'motion/react';
import { 
  User, 
  Bell, 
  Shield, 
  Zap, 
  CreditCard, 
  Mail, 
  Globe,
  Settings as SettingsIcon,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../lib/auth';
import { db, auth, handleFirestoreError } from '../lib/firebase';
import { collection, query, where, getDocs, deleteDoc, doc, updateDoc, writeBatch } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Trash2, Loader2 } from 'lucide-react';

const SettingRow = ({ icon: Icon, label, description, status, onClick }: { icon: any, label: string, description: string, status?: string, onClick?: () => void }) => (
  <div 
    onClick={onClick}
    className="flex items-center justify-between p-6 hover:bg-slate-50 transition-colors cursor-pointer group rounded-2xl border border-transparent hover:border-slate-100"
  >
    <div className="flex items-center gap-5 text-left">
      <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:border-brand-accent/20 transition-all">
        <Icon className="w-5 h-5 text-slate-400 group-hover:text-brand-accent transition-colors" />
      </div>
      <div>
        <h4 className="font-bold text-lg tracking-tight text-slate-900">{label}</h4>
        <p className="text-sm text-slate-500 font-light">{description}</p>
      </div>
    </div>
    <div className="flex items-center gap-4">
      {status && <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-accent">{status}</span>}
      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-900 transition-all transform group-hover:translate-x-1" />
    </div>
  </div>
);

export default function Settings() {
  const { user, profile } = useAuth();
  const [resetting, setResetting] = React.useState(false);
  const navigate = useNavigate();

  const handleReset = async (global: boolean = false) => {
    if (!user) return;
    const isMaster = user.email === '464dhruvshah@gmail.com';
    const confirmMsg = global && isMaster 
      ? "CRITICAL ALERT: You are about to execute a GLOBAL FACTORY RESET. This will permanently erase ALL DATA for ALL USERS across the entire neural network. This action is irreversible. Proceed?" 
      : "FATAL: This will permanently wipe all strategic intel, scheduled posts, and neural configurations. Re-initialization will be required. Continue?";
    
    if (!window.confirm(confirmMsg)) return;

    setResetting(true);
    try {
      const collections = ['generations', 'scheduledPosts', 'competitorInsights', 'users'];
      for (const colName of collections) {
         // If global reset, don't filter by userId (admin privilege required)
         const q = global && isMaster 
           ? collection(db, colName)
           : query(collection(db, colName), where("userId", "==", user.uid));
         
         const snapshot = await getDocs(q);
         const batch = writeBatch(db);
         snapshot.docs.forEach(d => batch.delete(d.ref));
         await batch.commit();
         
         // Special handling for legacy users (non-batch friendly for large sets)
         // but for this dev environment, batch is fine.
      }

      window.location.reload();
    } catch (e) {
      console.error("Master Reset Failure:", e);
      handleFirestoreError(e, 'write', 'global-reset');
    } finally {
      setResetting(false);
    }
  };

  const isAdmin = user?.email === '464dhruvshah@gmail.com';

  return (
    <div className="max-w-4xl mx-auto space-y-12 py-10">
      <div className="text-left space-y-4 px-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-100 text-[10px] font-bold uppercase tracking-widest text-slate-400 shadow-sm">
           <SettingsIcon className="w-3 h-3 text-brand-accent" />
           System Preferences
        </div>
        <h1 className="font-display font-bold text-4xl italic lowercase tracking-tighter text-slate-900">{isAdmin ? "Admin" : "Account"}<span className="text-brand-accent">Settings</span></h1>
        <p className="text-slate-500 max-w-sm">
          {isAdmin ? "Master command console for neural network management." : "Manage your profile, billing, and neural configuration."}
        </p>
      </div>

      <div className="space-y-4 px-4">
        <div className="hypr-card p-0 overflow-hidden divide-y divide-slate-100 border-slate-200 bg-white shadow-sm">
          <SettingRow 
            icon={User} 
            label="Profile Identity" 
            description={user?.displayName || 'Set your public persona'} 
          />
          <SettingRow 
            icon={Mail} 
            label="Email Communications" 
            description={user?.email || 'Manage notifications and reports'} 
          />
          <SettingRow 
            icon={Shield} 
            label="Security & Privacy" 
            description="Two-factor authentication and data isolation" 
            status="Secured"
          />
        </div>

        {isAdmin && (
           <div className="hypr-card p-0 overflow-hidden divide-y divide-slate-100 border-red-200 bg-red-50/10 shadow-sm">
              <div className="p-6 bg-red-500/5 items-center justify-between flex">
                 <div className="flex items-center gap-3 text-red-600">
                    <AlertCircle className="w-5 h-5" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Master Command Node</span>
                 </div>
              </div>
              <SettingRow 
                icon={Trash2} 
                label="Global Factory Reset" 
                description="Erase ALL data across ALL users and reset the entire database." 
                onClick={() => handleReset(true)}
                status="MASTER OVERRIDE"
              />
           </div>
        )}

        <div className="hypr-card p-0 overflow-hidden divide-y divide-slate-100 border-slate-200 bg-white shadow-sm">
          <SettingRow 
            icon={Zap} 
            label="Elite Subscription" 
            description="Manage your Pro Tier features and limits" 
            status="Active"
          />
          <SettingRow 
            icon={CreditCard} 
            label="Payment Methods" 
            description="Visa ending in 4242" 
          />
          <SettingRow 
            icon={Bell} 
            label="Neural Alerts" 
            description="Configure real-time trend notifications" 
          />
        </div>

        <div className="hypr-card p-0 overflow-hidden divide-y divide-slate-100 border-slate-200 bg-white shadow-sm">
           <SettingRow 
            icon={Globe} 
            label="Localization" 
            description="English (US) • UTC-8" 
          />
          <SettingRow 
            icon={Trash2} 
            label="Strategic Reset" 
            description={resetting ? "Executing Data Purge..." : "Wipe all tactical data and re-initialize identity"} 
            onClick={() => handleReset(false)}
            status={resetting ? "PURGING..." : "DANGER ZONE"}
          />
        </div>
      </div>

      <div className="pt-10 flex flex-col items-center gap-6 border-t border-slate-100 mx-4">
         <p className="text-[10px] font-mono text-slate-300 uppercase tracking-[0.4em]">Node Cluster: AS-SE1-42-X</p>
         <button className="text-brand-accent text-xs font-bold uppercase tracking-[0.2em] hover:underline transition-all">Deactivate Account</button>
      </div>
    </div>
  );
}
