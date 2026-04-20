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
  <div className="flex items-center justify-between p-6 hover:bg-white/[0.02] transition-colors cursor-pointer group rounded-2xl border border-transparent hover:border-white/5">
    <div className="flex items-center gap-5 text-left">
      <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/5 group-hover:border-white/10 transition-all">
        <Icon className="w-5 h-5 text-white/40 group-hover:text-white transition-colors" />
      </div>
      <div>
        <h4 className="font-bold text-lg tracking-tight">{label}</h4>
        <p className="text-sm text-white/30 font-light">{description}</p>
      </div>
    </div>
    <div className="flex items-center gap-4">
      {status && <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-accent">{status}</span>}
      <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-white transition-all transform group-hover:translate-x-1" />
    </div>
  </div>
);

export default function Settings() {
  const { user } = useAuth();

  return (
    <div className="max-w-4xl mx-auto space-y-12 py-10">
      <div className="text-left space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-white/40">
           <SettingsIcon className="w-3 h-3 text-brand-accent" />
           System Preferences
        </div>
        <h1 className="font-display font-bold text-4xl italic lowercase tracking-tighter">Account<span className="text-brand-accent">Settings</span></h1>
        <p className="text-white/40 max-w-sm">Manage your profile, billing, and neural configuration.</p>
      </div>

      <div className="space-y-4">
        <div className="hypr-card p-0 overflow-hidden divide-y divide-white/5 border-white/5">
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

        <div className="hypr-card p-0 overflow-hidden divide-y divide-white/5 border-white/5">
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

        <div className="hypr-card p-0 overflow-hidden divide-y divide-white/5 border-white/5">
           <SettingRow 
            icon={Globe} 
            label="Localization" 
            description="English (US) • UTC-8" 
          />
        </div>
      </div>

      <div className="pt-10 flex flex-col items-center gap-6 border-t border-white/5">
         <p className="text-[10px] font-mono text-white/20 uppercase tracking-[0.4em]">Node Cluster: AS-SE1-42-X</p>
         <button className="text-brand-accent text-xs font-bold uppercase tracking-[0.2em] hover:underline transition-all">Deactivate Account</button>
      </div>
    </div>
  );
}
