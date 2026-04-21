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

const SettingRow = ({ icon: Icon, label, description, status }: { icon: any, label: string, description: string, status?: string }) => (
  <div className="flex items-center justify-between p-6 hover:bg-slate-50 transition-colors cursor-pointer group rounded-2xl border border-transparent hover:border-slate-100">
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
  const { user } = useAuth();

  return (
    <div className="max-w-4xl mx-auto space-y-12 py-10">
      <div className="text-left space-y-4 px-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-100 text-[10px] font-bold uppercase tracking-widest text-slate-400 shadow-sm">
           <SettingsIcon className="w-3 h-3 text-brand-accent" />
           System Preferences
        </div>
        <h1 className="font-display font-bold text-4xl italic lowercase tracking-tighter text-slate-900">Account<span className="text-brand-accent">Settings</span></h1>
        <p className="text-slate-500 max-w-sm">Manage your profile, billing, and neural configuration.</p>
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
        </div>
      </div>

      <div className="pt-10 flex flex-col items-center gap-6 border-t border-slate-100 mx-4">
         <p className="text-[10px] font-mono text-slate-300 uppercase tracking-[0.4em]">Node Cluster: AS-SE1-42-X</p>
         <button className="text-brand-accent text-xs font-bold uppercase tracking-[0.2em] hover:underline transition-all">Deactivate Account</button>
      </div>
    </div>
  );
}
