import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  Bell, 
  Shield, 
  Zap, 
  CreditCard, 
  Mail, 
  Globe,
  Settings as SettingsIcon,
  ChevronRight,
  Save,
  X
} from 'lucide-react';
import { useAuth } from '../lib/auth';
import { db, auth, handleFirestoreError } from '../lib/firebase';
import { collection, query, where, getDocs, deleteDoc, doc, updateDoc, writeBatch } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Trash2, Loader2, CheckCircle } from 'lucide-react';

const SettingRow = ({ icon: Icon, label, description, status, onClick, danger }: { icon: any, label: string, description: string, status?: string, onClick?: () => void, danger?: boolean }) => (
  <div 
    onClick={onClick}
    className={cn(
      "flex items-center justify-between p-6 hover:bg-slate-50 transition-colors cursor-pointer group rounded-2xl border border-transparent hover:border-slate-100",
      danger && "hover:bg-red-50/50"
    )}
  >
    <div className="flex items-center gap-5 text-left">
      <div className={cn(
        "w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:border-brand-accent/20 transition-all",
        danger && "group-hover:border-red-200"
      )}>
        <Icon className={cn("w-5 h-5 text-slate-400 group-hover:text-brand-accent transition-colors", danger && "group-hover:text-red-500")} />
      </div>
      <div>
        <h4 className="font-bold text-lg tracking-tight text-slate-900">{label}</h4>
        <p className="text-sm text-slate-500 font-light">{description}</p>
      </div>
    </div>
    <div className="flex items-center gap-4">
      {status && <span className={cn("text-[10px] font-bold uppercase tracking-[0.2em]", danger ? "text-red-500" : "text-brand-accent")}>{status}</span>}
      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-900 transition-all transform group-hover:translate-x-1" />
    </div>
  </div>
);

import { cn } from '../lib/utils';

export default function Settings() {
  const { user, profile } = useAuth();
  const [resetting, setResetting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    trends: true
  });
  const navigate = useNavigate();

  const handleReset = async (global: boolean) => {
    if (!user) return;
    const confirmed = window.confirm(global ? 
      "CRITICAL OVERRIDE: This will erase ALL data for the ENTIRE system. Are you absolutely certain?" : 
      "Are you sure you want to clear your strategic data? This action is irreversible."
    );
    if (!confirmed) return;

    setResetting(true);
    try {
      if (global && isAdmin) {
        // Global reset logic
        const collections = ['scheduledPosts', 'generatedHashtags', 'generatedVideos', 'automationFlows', 'competitors'];
        for (const collName of collections) {
          const q = query(collection(db, collName));
          const snapshot = await getDocs(q);
          const batch = writeBatch(db);
          snapshot.docs.forEach((d) => batch.delete(d.ref));
          await batch.commit();
        }
      } else {
        // User-specific reset
        const collections = ['scheduledPosts', 'generatedHashtags', 'generatedVideos', 'automationFlows'];
        for (const collName of collections) {
          const q = query(collection(db, collName), where("userId", "==", user.uid));
          const snapshot = await getDocs(q);
          const batch = writeBatch(db);
          snapshot.docs.forEach((d) => batch.delete(d.ref));
          await batch.commit();
        }
      }
      alert("System re-initialized successfully.");
      window.location.reload();
    } catch (e) {
      console.error(e);
      alert("Reset protocol failed. Check logs.");
    } finally {
      setResetting(false);
    }
  };

  const handleUpdateProfile = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await updateDoc(doc(db, "users", user.uid), {
        displayName: displayName
      });
      setActiveModal(null);
    } catch (e) {
      handleFirestoreError(e, 'write', 'users');
    } finally {
      setSaving(false);
    }
  };

  const currentEmail = user?.email;

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
            onClick={() => setActiveModal('profile')}
            icon={User} 
            label="Profile Identity" 
            description={displayName || 'Set your public persona'} 
          />
          <SettingRow 
            onClick={() => setActiveModal('notifications')}
            icon={Mail} 
            label="Neural Alerts" 
            description="Manage notifications and growth reports" 
          />
          <SettingRow 
            onClick={() => setActiveModal('security')}
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
                danger
              />
           </div>
        )}

        <div className="hypr-card p-0 overflow-hidden divide-y divide-slate-100 border-slate-200 bg-white shadow-sm">
          <SettingRow 
            icon={Zap} 
            label="Elite Subscription" 
            description="Manage your Pro Tier features and limits" 
            status={profile?.isElite ? "Elite Active" : "Free Tier"}
            onClick={() => navigate('/upgrade')}
          />
          <SettingRow 
            icon={CreditCard} 
            label="Payment Methods" 
            description={profile?.isElite ? "Visa ending in 4242" : "No payment method attached"} 
            onClick={() => navigate('/upgrade')}
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
            danger
          />
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div 
               initial={{ opacity: 0, scale: 0.95, y: 10 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.95, y: 10 }}
               className="w-full max-w-md bg-white rounded-[2.5rem] p-10 border border-slate-200 shadow-2xl relative"
            >
              <button 
                onClick={() => setActiveModal(null)}
                className="absolute top-8 right-8 p-2 text-slate-400 hover:text-slate-900"
              >
                <X className="w-6 h-6" />
              </button>

              {activeModal === 'profile' && (
                <div className="space-y-8">
                  <div className="space-y-2">
                    <h3 className="text-2xl font-display font-bold italic tracking-tight">Identity <span className="text-brand-accent">Override</span></h3>
                    <p className="text-sm text-slate-500 font-light italic">"Re-calibrate your public creator persona."</p>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Creator Name</label>
                      <input 
                        type="text" 
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        className="w-full h-14 px-6 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:border-brand-accent/30 outline-none transition-all"
                        placeholder="Enter name..."
                      />
                    </div>
                    <button 
                      onClick={handleUpdateProfile}
                      disabled={saving}
                      className="w-full h-14 bg-brand-accent text-white rounded-2xl font-bold uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 shadow-lg shadow-brand-accent/20"
                    >
                      {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      Execute Configuration
                    </button>
                  </div>
                </div>
              )}

              {activeModal === 'notifications' && (
                <div className="space-y-8">
                  <div className="space-y-2">
                    <h3 className="text-2xl font-display font-bold italic tracking-tight">Neural <span className="text-brand-accent">Alerts</span></h3>
                    <p className="text-sm text-slate-500 font-light italic">"Manage the velocity of intelligence inbound."</p>
                  </div>
                  <div className="space-y-6">
                    {[
                      { id: 'trends', label: 'Velocity Threshold Spikes', desc: 'Alert when hashtag trends exceed 85% growth.' },
                      { id: 'reports', label: 'Strategic Reports', desc: 'Weekly deep-dives into your performance nodes.' },
                      { id: 'security', label: 'Security Protocols', desc: 'Critical alerts regarding your neural guard.' }
                    ].map(item => (
                      <div key={item.id} className="flex items-center justify-between group">
                        <div className="space-y-1">
                          <p className="text-xs font-bold text-slate-900 group-hover:text-brand-accent transition-colors">{item.label}</p>
                          <p className="text-[10px] text-slate-400">{item.desc}</p>
                        </div>
                        <button className="w-10 h-5 rounded-full bg-brand-accent/20 border border-brand-accent/30 flex items-center px-1">
                          <div className="w-3.5 h-3.5 rounded-full bg-brand-accent translate-x-4.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeModal === 'security' && (
                <div className="space-y-8 text-center">
                  <div className="w-20 h-20 rounded-3xl bg-brand-accent/10 flex items-center justify-center mx-auto mb-6">
                    <Shield className="w-10 h-10 text-brand-accent" />
                  </div>
                  <div className="space-y-2">
                     <h3 className="text-2xl font-display font-bold italic tracking-tight">Sentinel <span className="text-brand-accent">Active</span></h3>
                     <p className="text-sm text-slate-500 font-light italic">"Your account is protected by military-grade neural encryption."</p>
                  </div>
                  <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-4">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400 uppercase font-bold tracking-widest">Auth Protocol</span>
                      <span className="text-emerald-500 font-bold uppercase tracking-widest group flex items-center gap-2">
                        <CheckCircle className="w-3 h-3" /> Encrypted
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="pt-10 flex flex-col items-center gap-6 border-t border-slate-100 mx-4">
         <p className="text-[10px] font-mono text-slate-300 uppercase tracking-[0.4em]">Node Cluster: AS-SE1-42-X</p>
         <button className="text-brand-accent text-xs font-bold uppercase tracking-[0.2em] hover:underline transition-all">Deactivate Account</button>
      </div>
    </div>
  );
}
