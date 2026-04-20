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
  ShieldCheck
} from 'lucide-react';
import { cn } from './lib/utils';
import { useAuth } from './lib/auth';
import Dashboard from './pages/Dashboard';
import Generator from './pages/Generator';
import Competitors from './pages/Competitors';
import Schedule from './pages/Schedule';
import Analytics from './pages/Analytics';
import Login from './pages/Login';
import Planner from './pages/Planner';
import Connections from './pages/Connections';
import Automations from './pages/Automations';
import SettingsPage from './pages/Settings';

import Upgrade from './pages/Upgrade';
import NeuralGuard from './pages/NeuralGuard';

const NavItem = ({ to, icon: Icon, label, onClick }: { to: string, icon: any, label: string, onClick?: () => void }) => (
  <NavLink 
    to={to} 
    onClick={onClick}
    className={({ isActive }) => cn(
      "flex items-center gap-3 px-4 py-3 rounded-xl transition-all group",
      isActive ? "bg-white text-black shadow-lg shadow-white/5" : "text-white/50 hover:bg-white/[0.03] hover:text-white"
    )}
  >
    <Icon className="w-5 h-5 transition-transform group-hover:scale-110" />
    <span className="font-medium text-sm">{label}</span>
    <ChevronRight className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-40 transition-opacity" />
  </NavLink>
);

const UserLayout = ({ children }: { children: React.ReactNode }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const { logout, user, isElite } = useAuth();

  const closeMobile = () => setMobileMenuOpen(false);

  return (
    <div className="flex min-h-screen bg-bg-main text-white font-sans overflow-hidden">
      {/* Mobile Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeMobile}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[45] xl:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 bg-bg-card border-r border-border-card p-6 flex flex-col transition-all duration-500 ease-in-out xl:translate-x-0 xl:relative shadow-2xl overflow-hidden",
        mobileMenuOpen ? "translate-x-0" : "-translate-x-full",
        isCollapsed ? "w-24" : "w-72"
      )}>
        <div className="flex items-center justify-between mb-12 overflow-hidden">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-white/20">
              <Hash className="text-black w-6 h-6" />
            </div>
            {!isCollapsed && <span className="font-display font-bold text-2xl tracking-tighter leading-none whitespace-nowrap">hypr<span className="text-brand-accent">tags</span></span>}
          </div>
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)} 
            className="hidden xl:flex p-1.5 hover:bg-white/5 rounded-lg text-white/20 hover:text-white transition-all transform hover:scale-110"
          >
            {isCollapsed ? <ChevronRight className="w-5 h-5 text-brand-accent" /> : <ChevronLeft className="w-5 h-5" />}
          </button>
          
          {/* Mobile Close Button inside sidebar */}
          <button className="xl:hidden p-2 text-white/40" onClick={closeMobile}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="space-y-1.5 flex-grow overflow-y-auto overflow-x-hidden">
          {!isElite && !isCollapsed && (
             <div className="mx-2 mb-8 p-6 rounded-3xl bg-brand-accent/[0.05] border border-brand-accent/20 relative overflow-hidden group hover:bg-brand-accent/[0.08] transition-all cursor-pointer" onClick={() => window.location.href='/upgrade'}>
                <div className="absolute -top-12 -right-12 w-24 h-24 bg-brand-accent/10 rounded-full blur-2xl group-hover:bg-brand-accent/20 transition-all" />
                <h4 className="text-[10px] font-bold text-brand-accent uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                   <Zap className="w-3 h-3 fill-current" />
                   Unlock Elite
                </h4>
                <p className="text-[11px] text-white/50 leading-relaxed font-light italic whitespace-normal">
                   "Deploy proprietary neural growth protocols."
                </p>
                <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-white group-hover:gap-3 transition-all uppercase tracking-widest">
                   Initialize <ChevronRight className="w-3 h-3" />
                </div>
             </div>
          )}
          <p className={cn("text-[10px] font-bold text-white/50 uppercase tracking-[0.2em] mb-4 ml-4 transition-opacity", isCollapsed ? "opacity-0" : "opacity-100")}>
            {!isCollapsed && "Growth Suite"}
          </p>
          <NavItem to="/" icon={LayoutIcon} label={isCollapsed ? "" : "Command Center"} onClick={closeMobile} />
          <NavItem to="/generator" icon={Hash} label={isCollapsed ? "" : "Neural Generator"} onClick={closeMobile} />
          <NavItem to="/competitors" icon={Target} label={isCollapsed ? "" : "Competitor Intel"} onClick={closeMobile} />
          <NavItem to="/planner" icon={Layers} label={isCollapsed ? "" : "Content Planner"} onClick={closeMobile} />
          <NavItem to="/neural-guard" icon={ShieldCheck} label={isCollapsed ? "" : "Neural Guard"} onClick={closeMobile} />
          
          <div className="mt-8 mb-4 h-px bg-white/5 mx-4" />
          
          <p className={cn("text-[10px] font-bold text-white/50 uppercase tracking-[0.2em] mb-4 ml-4 transition-opacity", isCollapsed ? "opacity-0" : "opacity-100")}>
            {!isCollapsed && "Automation"}
          </p>
          <NavItem to="/schedule" icon={Calendar} label={isCollapsed ? "" : "Post Calendar"} onClick={closeMobile} />
          <NavItem to="/automations" icon={Zap} label={isCollapsed ? "" : "Workflow Automations"} onClick={closeMobile} />
          <NavItem to="/connections" icon={Globe} label={isCollapsed ? "" : "Social Hub"} onClick={closeMobile} />
          <NavItem to="/analytics" icon={BarChart3} label={isCollapsed ? "" : "Performance"} onClick={closeMobile} />
        </nav>

        <div className="pt-6 border-t border-white/5 mt-auto overflow-hidden">
          {!isCollapsed && (
            <div className="mb-6 p-4 rounded-2xl bg-white/[0.02] border border-white/5 whitespace-nowrap">
               <div className="flex items-center gap-3 mb-3">
                  <div className="w-2 h-2 rounded-full bg-brand-primary animate-pulse" />
                  <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Active System</span>
               </div>
               <p className="text-[11px] text-white/40 leading-relaxed font-mono">
                  API Version: v3.2.1-f <br />
                  Latency: 24ms
               </p>
            </div>
          )}
          <button 
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/50 hover:text-brand-accent transition-colors w-full group shrink-0"
          >
            <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            {!isCollapsed && <span className="font-medium text-sm">Log Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow relative h-screen overflow-y-auto">
        <header className="sticky top-0 z-40 bg-bg-main/80 backdrop-blur-md px-6 md:px-10 py-5 flex items-center justify-between border-b border-white/5">
          <button className="xl:hidden p-2 text-white/60" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
          
          <div className="hidden md:flex flex-col ml-4">
             <h2 className="text-xs font-bold text-white/40 uppercase tracking-widest">Welcome back,</h2>
             <p className="text-sm font-bold flex items-center gap-2">{user?.displayName || 'Creator'}</p>
          </div>

          <div className="flex items-center gap-6">
             <div className="hidden lg:flex flex-col items-end">
               <div className="flex items-center gap-2 mb-0.5">
                  <span className={cn("text-xs font-bold", isElite ? "text-brand-accent" : "text-white/40")}>{isElite ? "Elite Access" : "Basic System"}</span>
                  <div className={cn("w-1.5 h-1.5 rounded-full animate-pulse", isElite ? "bg-brand-accent" : "bg-white/20")} />
               </div>
               <span className="text-[10px] font-mono text-white/30 uppercase tracking-tighter">{isElite ? "Cluster: AS-SE1-42-ELITE" : "Cluster: PENDING-PROVISIONAL"}</span>
             </div>
             <div className="h-8 w-px bg-white/10" />
             <div className="flex items-center gap-3">
                <NavLink to="/settings" className={({ isActive }) => cn(
                  "w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center hover:bg-white/10 transition-all",
                  isActive && "bg-white text-black border-white"
                )}>
                  <Settings className="w-5 h-5 transition-transform hover:rotate-90 duration-500" />
                </NavLink>
                <div 
                  onClick={logout}
                  className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 p-[1px] shadow-lg shadow-white/5 cursor-pointer overflow-hidden group hover:border-brand-accent/50 transition-all relative"
                >
                  <img src={user?.photoURL || "https://picsum.photos/seed/face/100/100"} alt="Avatar" className="w-full h-full object-cover rounded-xl filter grayscale group-hover:grayscale-0 transition-all" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                     <LogOut className="w-4 h-4 text-white" />
                  </div>
                </div>
             </div>
          </div>
        </header>

        <div className="p-6 md:p-14 relative max-w-7xl mx-auto">
          <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-brand-primary/5 rounded-full blur-[120px] -z-10" />
          <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-brand-secondary/5 rounded-full blur-[120px] -z-10" />
          {children}
        </div>
      </main>
    </div>
  );
};

export default function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-main flex items-center justify-center">
         <Loader2 className="w-10 h-10 text-brand-primary animate-spin" />
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
        <Route path="*" element={
          user ? (
            <UserLayout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/generator" element={<Generator />} />
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
          ) : (
            <Navigate to="/login" />
          )
        } />
      </Routes>
    </Router>
  );
}
