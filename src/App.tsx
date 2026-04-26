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
  Cpu,
  Brain,
  Rocket,
  Video
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
import ViralTest from './pages/ViralTest';
import HowItWorks from './pages/HowItWorks';
import Upload from './pages/Upload';

import Upgrade from './pages/Upgrade';
import NeuralGuard from './pages/NeuralGuard';
import EliteOnboarding from './pages/EliteOnboarding';
import Earn from './pages/Earn';
import Ideas from './pages/Ideas';

const NavItem = ({ to, icon: Icon, label, onClick }: { to: string, icon: any, label: string, onClick?: () => void }) => (
  <NavLink 
    to={to} 
    onClick={onClick}
    className={({ isActive }) => cn(
      "flex items-center gap-3 px-4 py-3 border border-transparent transition-all group",
      isActive ? "bg-brand-neon text-brand-void font-bold shadow-[0_0_20px_rgba(0,255,0,0.2)]" : "text-white/40 hover:bg-white/5 hover:text-white"
    )}
  >
    <Icon className="w-5 h-5 transition-transform group-hover:scale-110" />
    {!label ? null : <span className="font-display font-medium uppercase tracking-widest text-[11px] italic">{label}</span>}
  </NavLink>
);

const UserLayout = ({ children }: { children: React.ReactNode }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const { logout, user, isElite, points, level, streak } = useAuth();

  const closeMobile = () => setMobileMenuOpen(false);

  return (
    <div className="flex min-h-screen bg-brand-void text-white font-sans overflow-hidden hypr-grid">
      {/* Mobile Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeMobile}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[45] xl:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 bg-brand-surface border-r border-white/5 p-6 flex flex-col transition-all duration-500 ease-in-out xl:translate-x-0 xl:relative shadow-2xl",
        mobileMenuOpen ? "translate-x-0" : "-translate-x-full",
        isCollapsed ? "w-24" : "w-72"
      )}>
        <div className="scanline opacity-20" />
        
        <div className="flex items-center justify-between mb-12 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-neon rounded-none flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(0,255,0,0.3)]">
               <Zap className="w-6 h-6 text-brand-void fill-current" />
            </div>
            {!isCollapsed && <span className="font-display font-bold text-2xl tracking-tighter leading-none whitespace-nowrap italic">HYPR<span className="text-brand-neon">TAGS</span></span>}
          </div>
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)} 
            className="hidden xl:flex p-1.5 hover:bg-white/5 rounded-none text-white/40 hover:text-brand-neon transition-all"
          >
            {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>
        </div>

        {/* Global Progress Strip */}
        {!isCollapsed && (
          <div className="mb-8 space-y-3 relative z-10">
            <div className="flex justify-between items-end">
              <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Level {level || 1} Identity</span>
              <span className="text-[10px] font-mono text-brand-neon">{points || 0} XP</span>
            </div>
            <div className="h-1 bg-white/5 relative overflow-hidden">
              <motion.div 
                className="absolute inset-y-0 left-0 bg-brand-neon"
                initial={{ width: 0 }}
                animate={{ width: `${((points || 0) % 100)}%` }}
              />
            </div>
            <div className="flex justify-between items-center bg-white/5 p-2 border border-white/5">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-brand-neon animate-pulse" />
                <span className="text-[10px] font-mono uppercase tracking-tighter">Streak: {streak || 0} Days</span>
              </div>
              <Sparkles className="w-3 h-3 text-brand-cyan" />
            </div>
          </div>
        )}

        <nav className="space-y-1 relative z-10 flex-grow overflow-y-auto hide-scrollbar">
          <p className={cn("text-[10px] font-bold text-white/20 uppercase tracking-[0.2em] mb-4 ml-4", isCollapsed ? "opacity-0" : "opacity-100")}>
            {!isCollapsed && "Viral Protocol"}
          </p>
          <NavItem to="/dashboard" icon={LayoutIcon} label={isCollapsed ? "" : "Mission Control"} onClick={closeMobile} />
          <NavItem to="/ideas" icon={Globe} label={isCollapsed ? "" : "Explore Lab"} onClick={closeMobile} />
          <NavItem to="/upload" icon={Video} label={isCollapsed ? "" : "Bridge Center"} onClick={closeMobile} />
          <NavItem to="/viral-test" icon={Brain} label={isCollapsed ? "" : "Viral Sim"} onClick={closeMobile} />
          <NavItem to="/generator" icon={Hash} label={isCollapsed ? "" : "Script Forge"} onClick={closeMobile} />
          <NavItem to="/planner" icon={Calendar} label={isCollapsed ? "" : "Growth Matrix"} onClick={closeMobile} />
          <NavItem to="/earn" icon={Rocket} label={isCollapsed ? "" : "Monetize"} onClick={closeMobile} />
          <NavItem to="/analytics" icon={BarChart3} label={isCollapsed ? "" : "Proof Engine"} onClick={closeMobile} />
          
          <div className="h-px bg-white/5 my-6 mx-4" />
          <NavItem to="/settings" icon={Settings} label={isCollapsed ? "" : "System"} onClick={closeMobile} />
        </nav>

        <div className="pt-6 border-t border-white/5 mt-auto relative z-10">
          <button 
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 text-white/40 hover:text-brand-neon transition-colors w-full group italic font-display uppercase tracking-widest text-xs"
          >
            <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            {!isCollapsed && <span>Eject Session</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow relative h-screen overflow-y-auto">
        <header className="sticky top-0 z-40 bg-brand-void/80 backdrop-blur-md px-6 md:px-10 py-4 flex items-center justify-between border-b border-white/5">
          <button className="xl:hidden p-2 text-white/50" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
          
          <div className="hidden md:flex items-center gap-4">
             <div className="w-1 h-8 bg-brand-neon" />
             <div>
                <h2 className="text-[10px] font-mono text-white/30 uppercase tracking-widest leading-tight">Current Operator</h2>
                <p className="text-sm font-display uppercase tracking-wider text-white">{user?.displayName || 'Unknown'}</p>
             </div>
          </div>

          <div className="flex items-center gap-4">
             <div className="hidden lg:flex flex-col items-end mr-4">
                <span className="text-[10px] font-mono text-brand-neon uppercase tracking-tighter">Status: Optimal</span>
                <span className="text-[10px] font-mono text-white/20 uppercase tracking-tighter">ID: {user?.uid.slice(0, 8)}</span>
             </div>
             
             <NavLink to="/earn" className="hidden sm:flex items-center gap-2 bg-brand-neon/10 border border-brand-neon/20 px-3 py-1.5 group hover:bg-brand-neon transition-all">
                <Sparkles className="w-3 h-3 text-brand-neon group-hover:text-brand-void" />
                <span className="text-[10px] font-bold text-brand-neon group-hover:text-brand-void uppercase tracking-widest">Earn Now</span>
             </NavLink>

             <div className="w-10 h-10 border border-white/10 group cursor-pointer overflow-hidden relative" onClick={() => window.location.href='/profile'}>
                <img src={user?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.uid}`} alt="Avatar" className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 border border-brand-neon opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
             </div>
          </div>
        </header>

        <div className="relative min-h-[calc(100vh-72px)]">
          <AnimatePresence mode="wait">
             <motion.div 
               key={window.location.pathname}
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0, x: -20 }}
               className="p-6 md:p-10 max-w-7xl mx-auto"
             >
                {children}
             </motion.div>
          </AnimatePresence>
          
          {/* Background FX */}
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] bg-brand-neon/5 rounded-full blur-[160px] -z-10 pointer-events-none" />
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
            <h2 className="text-xl font-display font-bold italic tracking-tighter text-slate-900">Welcome to HyprTags</h2>
            <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Your Viral Journey Awaits...</p>
         </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={!user ? <Landing /> : <Navigate to="/dashboard" />} />
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
                  <Route path="/viral-test" element={<ViralTest />} />
                  <Route path="/ideas" element={<Ideas />} />
                  <Route path="/generator" element={<Generator />} />
                  <Route path="/video-generator" element={<VideoGenerator />} />
                  <Route path="/competitors" element={<Competitors />} />
                  <Route path="/planner" element={<Planner />} />
                  <Route path="/schedule" element={<Schedule />} />
                  <Route path="/automations" element={<Automations />} />
                  <Route path="/connections" element={<Connections />} />
                  <Route path="/analytics" element={<Analytics />} />
                  <Route path="/earn" element={<Earn />} />
                  <Route path="/upload" element={<Upload />} />
                  <Route path="/settings" element={<SettingsPage />} />
                  <Route path="/upgrade" element={<Upgrade />} />
                  <Route path="/neural-guard" element={<NeuralGuard />} />
                  <Route path="/how-it-works" element={<HowItWorks />} />
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
