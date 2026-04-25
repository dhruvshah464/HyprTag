import React from 'react';
import { motion } from 'motion/react';
import { 
  Zap, 
  TrendingUp, 
  ArrowRight,
  Sparkles,
  CheckCircle2,
  PlayCircle,
  Users,
  Eye,
  Rocket,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div className="min-h-screen bg-white text-slate-950 font-sans selection:bg-brand-accent selection:text-white overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-xl border-b border-slate-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-brand-accent rounded-xl flex items-center justify-center shadow-lg shadow-brand-accent/20">
              <Rocket className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-display font-bold tracking-tighter italic">Viral<span className="text-brand-accent">Flow</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <Link to="/login" className="text-sm font-bold text-slate-600 hover:text-slate-950 transition-colors uppercase tracking-widest">Sign In</Link>
            <Link to="/login" className="px-6 py-3 bg-brand-accent text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-brand-accent/20">
               Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-48 pb-32 px-6">
        <div className="absolute top-0 right-0 -z-10 w-[600px] h-[600px] bg-brand-accent/10 rounded-full blur-[120px]" />
        
        <div className="max-w-4xl mx-auto text-center space-y-10">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-50 border border-slate-100 text-[10px] font-bold uppercase tracking-[0.2em] text-brand-accent"
          >
            <Sparkles className="w-3 h-3" />
            For Instagram, YouTube & TikTok Creators
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-6xl md:text-8xl font-display font-bold italic tracking-tighter leading-tight"
          >
            Go Viral on <span className="text-brand-accent">Autopilot.</span>
          </motion.h1>

          <p className="max-w-xl mx-auto text-lg text-slate-500 font-light leading-relaxed">
            Stop guessing the algorithm. We tell you exactly what to post to get more reach, followers, and views in seconds.
          </p>

          <div className="flex flex-col md:flex-row justify-center gap-6 pt-4">
            <Link to="/login" className="group h-16 px-12 bg-brand-accent text-white rounded-2xl flex items-center justify-center gap-4 text-sm font-bold uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-brand-accent/30">
               Start Growing Now <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="pt-12 flex flex-wrap justify-center gap-8 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-brand-accent" /> No AI Headaches</span>
            <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-brand-accent" /> 10x Faster Growth</span>
            <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-brand-accent" /> Real Results Only</span>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-32 px-6 bg-slate-950 text-white rounded-[4rem] mx-4 mb-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-brand-accent/5 opacity-50" />
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative z-10">
          <div className="space-y-8">
            <h2 className="text-5xl font-display font-bold italic tracking-tight">Tired of being <span className="text-brand-accent">ignored?</span></h2>
            <div className="space-y-6">
              <p className="text-xl text-slate-400 font-light leading-relaxed italic">
                "I spend 4 hours on a Reel and it gets stuck at 300 views. Others post garbage and go viral. What am I doing wrong?"
              </p>
              <div className="space-y-4">
                <div className="p-6 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-6">
                   <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center">
                      <Eye className="w-6 h-6 text-red-500" />
                   </div>
                   <div className="text-left">
                      <p className="text-sm font-bold">The Low-View Trap</p>
                      <p className="text-xs text-slate-500">Stuck at the same reach for months.</p>
                   </div>
                </div>
                <div className="p-6 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-6">
                   <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center">
                      <ShieldCheck className="w-6 h-6 text-red-500" />
                   </div>
                   <div className="text-left">
                      <p className="text-sm font-bold">Algorithm Anxiety</p>
                      <p className="text-xs text-slate-500">Feeling like the platform is working against you.</p>
                   </div>
                </div>
              </div>
            </div>
          </div>
          <div className="relative">
             <div className="aspect-square bg-brand-accent/20 rounded-[3rem] blur-3xl absolute -inset-10" />
             <div className="relative bg-white/5 border border-white/10 p-10 rounded-[3rem] space-y-8">
                <div className="space-y-2">
                   <p className="text-[10px] font-bold text-brand-accent uppercase tracking-widest">Growth Forecast</p>
                   <p className="text-2xl font-display italic">95% of creators fail because they use the wrong keywords.</p>
                </div>
                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                   <motion.div initial={{ width: 0 }} whileInView={{ width: '95%' }} className="h-full bg-red-500" />
                </div>
                <button className="w-full h-14 bg-white text-slate-950 rounded-2xl font-bold uppercase tracking-widest text-[10px]">Fix My Reach Now</button>
             </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto space-y-24 text-center">
          <div className="space-y-4">
            <h2 className="text-6xl font-display font-bold italic tracking-tight text-slate-900">Reach Rocket <span className="text-brand-accent">Formula.</span></h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">We've deconstructed virality into 3 simple steps. No jargon, just reach.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <StepCard 
              number="01"
              title="Give an Idea"
              desc="Just tell us what you want to post about. One sentence is enough."
            />
            <StepCard 
              number="02"
              title="Get Viral DNA"
              desc="We generate the viral hook, the caption, and the exact hashtags to trigger the algorithm."
            />
            <StepCard 
              number="03"
              title="Schedule & Win"
              desc="Plan your content weeks in advance and watch the views roll in while you sleep."
            />
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-32 px-6 bg-slate-50 rounded-[4rem] mx-4 mb-20">
         <div className="max-w-7xl mx-auto space-y-20">
            <div className="text-center space-y-4">
               <h2 className="text-6xl font-display font-bold italic tracking-tighter">Small Price. <span className="text-brand-accent">Big Reach.</span></h2>
               <p className="text-slate-500">Unlock your viral potential today.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               <PriceCard 
                 title="Trial"
                 price="₹199"
                 period="7 days"
                 features={["10 Viral Captions", "Exact Hashtag Packs", "Basic Planner"]}
                 cta="Try it out"
               />
               <PriceCard 
                 title="Starter"
                 price="₹499"
                 period="month"
                 features={["Unlimited Viral Hooks", "Smart Posting Times", "Content Idea Generator"]}
                 cta="Get Started"
                 featured
               />
               <PriceCard 
                 title="Creator Pro"
                 price="₹749"
                 period="month"
                 features={["Auto-Post to Multi-Platforms", "Competitor Stealing", "High-Priority Support"]}
                 cta="Go Pro"
               />
            </div>
         </div>
      </section>

      {/* Testimonials */}
      <section className="py-32 px-6">
         <div className="max-w-7xl mx-auto space-y-20 text-center">
            <h2 className="text-4xl font-display font-bold italic">Why <span className="text-brand-accent">Creators</span> Love Us.</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
               <Testimonial 
                 text="Went from 400 views to 12k in my first week. The hooks are actually insane."
                 author="Sahil K."
                 handle="@sahilcreations"
               />
               <Testimonial 
                 text="I don't have to think about captions anymore. Best 500 bucks I've ever spent."
                 author="Ananya R."
                 handle="@travelwithananya"
               />
               <Testimonial 
                 text="The trend detection is magic. I posted exactly when it told me to and it hit the explore page."
                 author="Rohit M."
                 handle="@fitnessnode"
               />
            </div>
         </div>
      </section>

      {/* Final CTA */}
      <footer className="py-40 px-6 text-center space-y-12 bg-white relative">
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-slate-100" />
         <div className="max-w-2xl mx-auto space-y-10">
            <h2 className="text-7xl md:text-9xl font-display font-bold italic tracking-tighter leading-none">Ready to <span className="text-brand-accent">Grow?</span></h2>
            <p className="text-xl text-slate-500 font-light italic">Don't let another idea die with 300 views. Start your viral journey now.</p>
            <Link to="/login" className="h-20 px-16 bg-brand-accent text-white inline-flex items-center justify-center gap-4 text-sm font-bold uppercase tracking-[0.3em] rounded-2xl hover:scale-105 transition-all shadow-2xl shadow-brand-accent/40">
               Claim Your Reach <ArrowRight className="w-5 h-5" />
            </Link>
         </div>
         <div className="pt-32 border-t border-slate-100 opacity-20 text-[10px] font-bold uppercase tracking-[0.5em]">
            ViralFlow © 2026 // Outcome Over Output
         </div>
      </footer>
    </div>
  );
}

function StepCard({ number, title, desc }: any) {
  return (
    <div className="space-y-6 text-left p-10 bg-white border border-slate-100 rounded-[2.5rem] hover:border-brand-accent/30 transition-all group">
       <span className="text-5xl font-display font-bold text-slate-100 group-hover:text-brand-accent/20 transition-colors">{number}</span>
       <div className="space-y-3">
          <h3 className="text-2xl font-bold italic tracking-tight">{title}</h3>
          <p className="text-slate-500 font-light leading-relaxed">{desc}</p>
       </div>
    </div>
  );
}

function PriceCard({ title, price, period, features, cta, featured }: any) {
  return (
    <div className={cn(
      "p-12 rounded-[3.5rem] flex flex-col justify-between transition-all",
      featured ? "bg-slate-900 text-white scale-105 shadow-2xl shadow-brand-accent/20 border-2 border-brand-accent" : "bg-white border border-slate-100 text-slate-950"
    )}>
       <div className="space-y-8">
          <div className="space-y-1">
             <h3 className={cn("text-2xl font-bold italic tracking-tight", featured ? "text-brand-accent" : "text-slate-800")}>{title}</h3>
             <p className="text-[10px] font-bold uppercase tracking-widest opacity-40">Monthly Protocol</p>
          </div>
          <div className="text-5xl font-display font-bold italic">{price} <span className="text-sm font-sans font-light opacity-40">/ {period}</span></div>
          <ul className="space-y-4">
             {features.map((f: string, i: number) => (
                <li key={i} className="flex items-center gap-3 text-sm font-light">
                   <CheckCircle2 className={cn("w-4 h-4", featured ? "text-brand-accent" : "text-emerald-500")} /> {f}
                </li>
             ))}
          </ul>
       </div>
       <Link to="/login" className={cn(
         "w-full h-14 mt-12 rounded-2xl flex items-center justify-center text-[10px] font-bold uppercase tracking-widest transition-all",
         featured ? "bg-brand-accent text-white shadow-xl shadow-brand-accent/20" : "bg-slate-50 text-slate-900 border border-slate-100 hover:bg-slate-100"
       )}>
          {cta}
       </Link>
    </div>
  );
}

function Testimonial({ text, author, handle }: any) {
  return (
    <div className="p-10 bg-slate-50/50 border border-slate-100 rounded-[2.5rem] text-left space-y-6 italic">
       <p className="text-lg text-slate-700 italic leading-relaxed">"{text}"</p>
       <div className="space-y-1">
          <p className="text-sm font-bold text-slate-900">{author}</p>
          <p className="text-[10px] font-bold text-brand-accent uppercase tracking-widest">{handle}</p>
       </div>
    </div>
  );
}
