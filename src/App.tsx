import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Hash, 
  Target, 
  Calendar, 
  BarChart3, 
  Settings,
  LogOut,
  ChevronRight,
  ChevronLeft,
  Menu,
  X,
  Layout as LayoutIcon,
  Globe,
  Loader2,
  Sparkles,
  Zap,
  MoreVertical,
  Layers,
  ShieldCheck,
  Cpu
} from 'lucide-react';
import { cn } from './lib/utils';
import { useAuth } from './lib/auth';
import Dashboard from './pages/Dashboard';
import Generator from './pages/Generator';
import VideoGenerator from './pages/VideoGenerator';
import Competitors from './pages/Competitors';
import Schedule from './pages/Schedule';
import Analytics from './pages/Analytics';
import Login from './pages/Login';
import Planner from './pages/Planner';
import Connections from './pages/Connections';
import Automations from './pages/Automations';
import SettingsPage from './pages/Settings';
import Onboarding from './pages/Onboarding';
import Landing from './pages/Landing';
import HowItWorks from './pages/HowItWorks';

import Upgrade from './pages/Upgrade';
import NeuralGuard from './pages/NeuralGuard';
import EliteOnboarding from './pages/EliteOnboarding';

const NavItem = ({ to, icon: Icon, label, onClick }: { to: string, icon: any, label: string, onClick?: () => void }) => (
  <NavLink 
    to={to} 
    onClick={onClick}
    className={({ isActive }) => cn(
      "flex items-center gap-3 px-4 py-3 rounded-xl transition-all group",
      isActive ? "bg-brand-accent text-white shadow-lg shadow-brand-accent/20" : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
    )}
  >
    <Icon className="w-5 h-5 transition-transform group-hover:scale-110" />
    {!label ? null : <span className="font-medium text-sm">{label}</span>}
    <ChevronRight className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-40 transition-opacity" />
  </NavLink>
);

const UserLayout = ({ children }: { children: React.ReactNode }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const { logout, user, isElite } = useAuth();

  const closeMobile = () => setMobileMenuOpen(false);

  return (
    <div className="flex min-h-screen bg-bg-main text-slate-900 font-sans overflow-hidden">
      {/* Mobile Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeMobile}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[45] xl:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 bg-bg-card border-r border-slate-200 p-6 flex flex-col transition-all duration-500 ease-in-out xl:translate-x-0 xl:relative shadow-xl overflow-hidden",
        mobileMenuOpen ? "translate-x-0" : "-translate-x-full",
        isCollapsed ? "w-24" : "w-72"
      )}>
        <div className="flex items-center justify-between mb-12 overflow-hidden">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-950 rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-slate-900/10 overflow-hidden">
              <img src="/logo.png" alt="Logo" className="w-full h-full object-cover scale-150" />
            </div>
            {!isCollapsed && <span className="font-display font-bold text-2xl tracking-tighter leading-none whitespace-nowrap">hypr<span className="text-brand-accent">tags</span></span>}
          </div>
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)} 
            className="hidden xl:flex p-1.5 hover:bg-slate-100 rounded-lg text-slate-300 hover:text-slate-600 transition-all transform hover:scale-110"
          >
            {isCollapsed ? <ChevronRight className="w-5 h-5 text-brand-accent" /> : <ChevronLeft className="w-5 h-5" />}
          </button>
          
          {/* Mobile Close Button inside sidebar */}
          <button className="xl:hidden p-2 text-slate-400" onClick={closeMobile}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="space-y-1.5 flex-grow overflow-y-auto overflow-x-hidden">
          {!isElite && !isCollapsed && (
             <div className="mx-2 mb-8 p-6 rounded-3xl bg-brand-accent/[0.03] border border-brand-accent/10 relative overflow-hidden group hover:bg-brand-accent/[0.05] transition-all cursor-pointer" onClick={() => window.location.href='/upgrade'}>
                <div className="absolute -top-12 -right-12 w-24 h-24 bg-brand-accent/5 rounded-full blur-2xl group-hover:bg-brand-accent/10 transition-all" />
                <h4 className="text-[10px] font-bold text-brand-accent uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                   <Zap className="w-3 h-3 fill-current" />
                   Unlock Elite
                </h4>
                <p className="text-[11px] text-slate-400 leading-relaxed font-light italic whitespace-normal">
                   "Deploy proprietary neural growth protocols."
                </p>
                <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-slate-700 group-hover:gap-3 transition-all uppercase tracking-widest">
                   Initialize <ChevronRight className="w-3 h-3" />
                </div>
             </div>
          )}
          <p className={cn("text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4 ml-4 transition-opacity", isCollapsed ? "opacity-0" : "opacity-100")}>
            {!isCollapsed && "Growth Suite"}
          </p>
          <NavItem to="/" icon={LayoutIcon} label={isCollapsed ? "" : "Command Center"} onClick={closeMobile} />
          <NavItem to="/generator" icon={Hash} label={isCollapsed ? "" : "Neural Generator"} onClick={closeMobile} />
          <NavItem to="/video-generator" icon={Layers} label={isCollapsed ? "" : "Neural Reels"} onClick={closeMobile} />
          <NavItem to="/competitors" icon={Target} label={isCollapsed ? "" : "Competitor Intel"} onClick={closeMobile} />
          <NavItem to="/planner" icon={Layers} label={isCollapsed ? "" : "Content Planner"} onClick={closeMobile} />
          <NavItem to="/neural-guard" icon={ShieldCheck} label={isCollapsed ? "" : "Neural Guard"} onClick={closeMobile} />
          
          <div className="mt-8 mb-4 h-px bg-slate-100 mx-4" />
          
          <p className={cn("text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4 ml-4 transition-opacity", isCollapsed ? "opacity-0" : "opacity-100")}>
            {!isCollapsed && "Automation"}
          </p>
          <NavItem to="/schedule" icon={Calendar} label={isCollapsed ? "" : "Post Calendar"} onClick={closeMobile} />
          <NavItem to="/automations" icon={Zap} label={isCollapsed ? "" : "Workflow Automations"} onClick={closeMobile} />
          <NavItem to="/connections" icon={Globe} label={isCollapsed ? "" : "Social Hub"} onClick={closeMobile} />
          <NavItem to="/analytics" icon={BarChart3} label={isCollapsed ? "" : "Performance"} onClick={closeMobile} />

          <div className="mt-8 mb-4 h-px bg-slate-100 mx-4" />
          <NavItem to="/how-it-works" icon={Cpu} label={isCollapsed ? "" : "Protocol Guide"} onClick={closeMobile} />
        </nav>

        <div className="pt-6 border-t border-slate-100 mt-auto overflow-hidden">
          {!isCollapsed && (
            <div className="mb-6 p-4 rounded-2xl bg-slate-50 border border-slate-100 whitespace-nowrap">
               <div className="flex items-center gap-3 mb-3">
                  <div className="w-2 h-2 rounded-full bg-brand-accent animate-pulse" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active System</span>
               </div>
               <p className="text-[11px] text-slate-500 leading-relaxed font-mono">
                  API Version: v3.2.1-f <br />
                  Latency: 24ms
               </p>
            </div>
          )}
          <button 
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-brand-accent transition-colors w-full group shrink-0"
          >
            <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            {!isCollapsed && <span className="font-medium text-sm">Log Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow relative h-screen overflow-y-auto">
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md px-6 md:px-10 py-5 flex items-center justify-between border-b border-slate-100">
          <button className="xl:hidden p-2 text-slate-500" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
          
          <div className="hidden md:flex flex-col ml-4">
             <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Welcome back,</h2>
             <p className="text-sm font-bold flex items-center gap-2 text-slate-900">{user?.displayName || 'Creator'}</p>
          </div>

          <div className="flex items-center gap-6">
             <div className="hidden lg:flex flex-col items-end">
               <div className="flex items-center gap-2 mb-0.5">
                  <span className={cn("text-xs font-bold", isElite ? "text-brand-accent" : "text-slate-400")}>{isElite ? "Elite Access" : "Basic System"}</span>
                  <div className={cn("w-1.5 h-1.5 rounded-full animate-pulse", isElite ? "bg-brand-accent" : "bg-slate-200")} />
               </div>
               <span className="text-[10px] font-mono text-slate-300 uppercase tracking-tighter">{isElite ? "Cluster: AS-SE1-42-ELITE" : "Cluster: PENDING-PROVISIONAL"}</span>
             </div>
             <div className="h-8 w-px bg-slate-100" />
             <div className="flex items-center gap-3">
                <NavLink to="/settings" className={({ isActive }) => cn(
                  "w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center hover:bg-slate-100 transition-all",
                  isActive && "bg-brand-accent text-white border-brand-accent shadow-lg shadow-brand-accent/20"
                )}>
                  <Settings className="w-5 h-5 transition-transform hover:rotate-90 duration-500" />
                </NavLink>
                <div 
                  onClick={logout}
                  className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 p-[1px] shadow-sm cursor-pointer overflow-hidden group hover:border-brand-accent transition-all relative"
                >
                  <img src={user?.photoURL || "https://picsum.photos/seed/face/100/100"} alt="Avatar" className="w-full h-full object-cover rounded-xl filter grayscale group-hover:grayscale-0 transition-all" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-brand-accent/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                     <LogOut className="w-4 h-4 text-white" />
                  </div>
                </div>
             </div>
          </div>
        </header>

        <div className="p-6 md:p-14 relative max-w-7xl mx-auto">
          <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-brand-accent/5 rounded-full blur-[120px] -z-10" />
          <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-emerald-500/5 rounded-full blur-[120px] -z-10" />
          {children}
        </div>
      </main>
    </div>
  );
};

export default function App() {
  const { user, loading, onboarded } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-main flex flex-col items-center justify-center gap-6">
         <div className="relative">
            <div className="w-20 h-20 border-t-2 border-brand-accent rounded-full animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center overflow-hidden p-4">
               <img src="/logo.png" alt="Logo" className="w-8 h-8 animate-pulse" />
            </div>
         </div>
         <div className="space-y-2 text-center">
            <h2 className="text-xl font-display font-bold italic tracking-tighter text-slate-900">Initializing Protocols</h2>
            <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.3em]">Connecting to Neural Node...</p>
         </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={!user ? <Landing /> : <Navigate to="/dashboard" />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/login" element={!user ? <Login /> : (onboarded ? <Navigate to="/dashboard" /> : <Navigate to="/onboarding" />)} />
        <Route path="/onboarding" element={user ? (!onboarded ? <Onboarding /> : <Navigate to="/dashboard" />) : <Navigate to="/login" />} />
        <Route path="/elite-onboarding" element={user ? <EliteOnboarding /> : <Navigate to="/login" />} />
        <Route path="*" element={
          user ? (
            !onboarded ? (
              <Navigate to="/onboarding" />
            ) : (
              <UserLayout>
                <Routes>
                  <Route path="/" element={<Navigate to="/dashboard" />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/generator" element={<Generator />} />
                  <Route path="/video-generator" element={<VideoGenerator />} />
                  <Route path="/competitors" element={<Competitors />} />
                  <Route path="/planner" element={<Planner />} />
                  <Route path="/schedule" element={<Schedule />} />
                  <Route path="/automations" element={<Automations />} />
                  <Route path="/connections" element={<Connections />} />
                  <Route path="/analytics" element={<Analytics />} />
                  <Route path="/settings" element={<SettingsPage />} />
                  <Route path="/upgrade" element={<Upgrade />} />
                  <Route path="/neural-guard" element={<NeuralGuard />} />
                </Routes>
              </UserLayout>
            )
          ) : (
            <Navigate to="/login" />
          )
        } />
      </Routes>
    </Router>
  );
}
