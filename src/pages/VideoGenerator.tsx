import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Video, 
  Layers, 
  Zap, 
  Play, 
  Download, 
  Loader2, 
  Music, 
  Type, 
  Image as ImageIcon,
  ChevronRight,
  TrendingUp,
  Cpu,
  Monitor,
  Smartphone,
  Save,
  Volume2,
  CheckCircle,
  ArrowUpRight
} from 'lucide-react';
import { useAuth } from '../lib/auth';
import { Link } from 'react-router-dom';
import { GoogleGenAI } from "@google/genai";
import { db } from '../lib/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { cn } from '../lib/utils';

const VEO_MODEL = "veo-3.1-lite-generate-preview";

export default function VideoGenerator() {
  const { user, isElite } = useAuth();
  const [prompt, setPrompt] = useState("");
  const [resolution, setResolution] = useState<'720p' | '1080p'>('720p');
  
  if (!isElite) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 text-center space-y-10 relative overflow-hidden">
         <div className="absolute inset-0 bg-brand-accent/[0.02] rounded-full blur-[160px] -z-10" />
         
         <div className="w-24 h-24 rounded-3xl bg-white border border-slate-100 flex items-center justify-center relative group shadow-sm">
            <Video className="w-12 h-12 text-slate-200 group-hover:text-brand-accent transition-colors" />
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 p-2 bg-slate-900 border border-slate-800 rounded-xl">
               <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest px-2">Elite Locked</span>
            </div>
         </div>

         <div className="space-y-4 max-w-xl">
            <h2 className="text-5xl font-display font-bold italic tracking-tighter text-slate-900">Neural <span className="text-brand-accent">Reels</span></h2>
            <p className="text-xl text-slate-500 font-light italic leading-relaxed">
              "Deploy high-fidelity video assets synthesized through the Google Veo engine. Advanced social scripts and cinematic visual clusters available exclusively for Elite creators."
            </p>
         </div>

         <Link to="/upgrade" className="btn-hypr-primary h-16 px-12 text-xs font-bold uppercase tracking-[0.25em] flex items-center gap-3 shadow-xl shadow-brand-accent/20">
            Initialize Upgrade Sequence <ArrowUpRight className="w-4 h-4" />
         </Link>

         <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-12 text-left">
            <div className="space-y-1">
               <p className="text-[10px] font-bold text-brand-accent uppercase tracking-widest">Veo 3.1</p>
               <p className="text-[9px] text-slate-400 uppercase font-bold tracking-tighter">Render Engine</p>
            </div>
            <div className="space-y-1">
               <p className="text-[10px] font-bold text-brand-accent uppercase tracking-widest">1080P</p>
               <p className="text-[9px] text-slate-400 uppercase font-bold tracking-tighter">HD Mastering</p>
            </div>
            <div className="space-y-1">
               <p className="text-[10px] font-bold text-brand-accent uppercase tracking-widest">Multi-Ratio</p>
               <p className="text-[9px] text-slate-400 uppercase font-bold tracking-tighter">Omni-Platform</p>
            </div>
            <div className="space-y-1">
               <p className="text-[10px] font-bold text-brand-accent uppercase tracking-widest">AI Scripts</p>
               <p className="text-[9px] text-slate-400 uppercase font-bold tracking-tighter">Strategic Hooks</p>
            </div>
         </div>
      </div>
    );
  }

  const [aspectRatio, setAspectRatio] = useState<'9:16' | '16:9'>('9:16');
  const [isGenerating, setIsGenerating] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoData, setVideoData] = useState<any>(null);
  const [selectedAudio, setSelectedAudio] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const NEURAL_TRACKS = [
    { id: 'lofi', label: 'Cinematic Lofi', mood: 'Aesthetic' },
    { id: 'synth', label: 'Neon Synthwave', mood: 'Energy' },
    { id: 'bass', label: 'Aggressive Bass', mood: 'Viral' },
    { id: 'minimal', label: 'Minimal Tech', mood: 'Focus' }
  ];
  const [activeTab, setActiveTab] = useState<'prompt' | 'render'>('prompt');
  const [renderProgress, setRenderProgress] = useState(0);
  const [renderStatus, setRenderStatus] = useState("");

  const handleGenerate = async (customPrompt?: string) => {
    const finalPrompt = customPrompt || prompt;
    if (!finalPrompt) return;
    setIsGenerating(true);
    setVideoUrl(null);
    setVideoData(null);
    setRenderProgress(0);
    setRenderStatus("Initializing Neural Sequence...");
    
    try {
      const ai = new GoogleGenAI({ apiKey: (process.env as any).GEMINI_API_KEY || "" });

      // Phase 1: Strategic Scripting
      setRenderStatus("Analyzing Creative Directives...");
      const scriptResponse = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `
          Generate a 15-second social media reel storyboard based on: ${finalPrompt}.
          Focus on high-engagement visual hooks for creators.
          Return ONLY JSON: {
            "title": "...",
            "mood": "...",
            "recommendedAudio": "...",
            "scenes": [{ "time": "0s", "text": "...", "visual": "..." }]
          }
        `,
        config: { responseMimeType: "application/json" }
      });
      
      const data = JSON.parse(scriptResponse.text);
      setVideoData(data);

      // Phase 2: Neural Rendering
      setRenderStatus("Synthesizing Visual Clusters...");
      let operation = await ai.models.generateVideos({
        model: VEO_MODEL,
        prompt: finalPrompt,
        config: {
          numberOfVideos: 1,
          resolution: resolution,
          aspectRatio: aspectRatio
        }
      });

      // Polling for completion
      let progress = 0;
      while (!operation.done) {
        progress += (100 - progress) * 0.1; // Simulated progress based on polling
        setRenderProgress(Math.round(progress));
        setRenderStatus(getTacticalStatus(progress));
        await new Promise(resolve => setTimeout(resolve, 5000));
        operation = await ai.operations.getVideosOperation({ operation });
      }

      if (operation.response?.generatedVideos?.[0]?.video?.videoBytes) {
        const base64 = operation.response.generatedVideos[0].video.videoBytes;
        const url = `data:video/mp4;base64,${base64}`;
        setVideoUrl(url);
        setRenderProgress(100);
        setRenderStatus("Neural Reconstruction Complete.");
        
        // Auto-select recommended audio
        if (data.recommendedAudio) {
          setSelectedAudio(data.recommendedAudio);
        }

        // Auto-save to Firestore
        await saveToFirestore(finalPrompt, url, data);
      } else {
        throw new Error("Neural output matrix was empty.");
      }

      setActiveTab('render');
    } catch (error: any) {
      console.error("Neural Video Failure:", error);
      setRenderStatus(`Handshake Failure: ${error.message || 'Unknown protocol error'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const saveToFirestore = async (p: string, url: string, metadata: any) => {
    if (!user) return;
    setIsSaving(true);
    try {
      await addDoc(collection(db, "generations"), {
        userId: user.uid,
        type: 'video',
        content: p,
        videoUrl: url,
        metadata: {
          ...metadata,
          resolution,
          aspectRatio,
          selectedAudio: selectedAudio || metadata.recommendedAudio
        },
        createdAt: Timestamp.now()
      });
      setIsSaved(true);
    } catch (error) {
      console.error("Firestore Save Failure:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const getTacticalStatus = (progress: number) => {
    if (progress < 20) return "Calibrating Neural Pulse...";
    if (progress < 50) return "Reconstituting Visual Fragments...";
    if (progress < 80) return "Synthesizing High-Velocity Motion...";
    return "Finalizing Strategic Render...";
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      <div className="text-left space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-accent/10 border border-brand-accent/20 text-[10px] font-bold uppercase tracking-widest text-brand-accent shadow-sm">
           <Video className="w-3 h-3" />
           Neural Reel Engine v2.0
        </div>
        <h1 className="font-display font-bold text-5xl italic lowercase tracking-tighter text-slate-900 group">
          Neural <span className="text-brand-accent">Reels</span>
        </h1>
        <p className="text-slate-500 max-w-sm">Generate high-velocity social video assets from a single prompt matrix.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        {/* Control Node */}
        <div className="lg:col-span-1 space-y-8">
           <div className="hypr-card p-8 bg-white border-slate-200 shadow-sm space-y-8">
              <div className="space-y-4">
                 <label className="hypr-label ml-1">Prompt Matrix</label>
                 <textarea 
                    placeholder="E.g. A high-energy tech review of a futuristic workspace..."
                    className="w-full h-40 bg-slate-50 border border-slate-100 rounded-2xl p-5 text-sm font-light focus:border-brand-accent/30 focus:bg-white outline-none transition-all resize-none italic"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                 />
              </div>

               <div className="space-y-4">
                  <label className="hypr-label ml-1">Render Parameters</label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Resolution</span>
                      <div className="flex bg-slate-50 rounded-xl p-1 border border-slate-100">
                        <button 
                          onClick={() => setResolution('720p')}
                          className={cn("flex-1 py-2 text-[10px] font-bold rounded-lg transition-all", resolution === '720p' ? "bg-white text-brand-accent shadow-sm" : "text-slate-400")}
                        >
                          720P
                        </button>
                        <button 
                          onClick={() => setResolution('1080p')}
                          className={cn("flex-1 py-2 text-[10px] font-bold rounded-lg transition-all", resolution === '1080p' ? "bg-white text-brand-accent shadow-sm" : "text-slate-400")}
                        >
                          1080P
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Ratio</span>
                      <div className="flex bg-slate-50 rounded-xl p-1 border border-slate-100">
                        <button 
                          onClick={() => setAspectRatio('9:16')}
                          className={cn("flex-1 py-2 rounded-lg transition-all flex items-center justify-center", aspectRatio === '9:16' ? "bg-white text-brand-accent shadow-sm" : "text-slate-400")}
                        >
                          <Smartphone className="w-3 h-3" />
                        </button>
                        <button 
                          onClick={() => setAspectRatio('16:9')}
                          className={cn("flex-1 py-2 rounded-lg transition-all flex items-center justify-center", aspectRatio === '16:9' ? "bg-white text-brand-accent shadow-sm" : "text-slate-400")}
                        >
                          <Monitor className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
               </div>

               <div className="space-y-4">
                  <label className="hypr-label ml-1 flex items-center justify-between">
                    Audio Signature
                    <span className="text-[8px] font-bold text-brand-accent uppercase tracking-widest bg-brand-accent/10 px-2 py-0.5 rounded-full">Neural Sync Active</span>
                  </label>
                  
                  {videoData?.recommendedAudio && (
                     <button 
                        onClick={() => setSelectedAudio(videoData.recommendedAudio)}
                        className={cn(
                          "w-full p-4 rounded-xl border flex items-center justify-between group transition-all mb-3",
                          selectedAudio === videoData.recommendedAudio 
                            ? "bg-brand-accent/5 border-brand-accent/30" 
                            : "bg-slate-50 border-slate-100 hover:border-brand-accent/20"
                        )}
                     >
                        <div className="flex items-center gap-3">
                           <div className="p-2 rounded-lg bg-brand-accent/10">
                              <Sparkles className="w-3.5 h-3.5 text-brand-accent" />
                           </div>
                           <div className="text-left">
                              <p className="text-[10px] font-bold text-slate-900 uppercase tracking-widest">AI Recommended</p>
                              <p className="text-[11px] text-slate-500 font-light italic truncate max-w-[140px]">{videoData.recommendedAudio}</p>
                           </div>
                        </div>
                        <CheckCircle className={cn("w-4 h-4 transition-all", selectedAudio === videoData.recommendedAudio ? "text-brand-accent scale-100" : "text-slate-200 scale-0")} />
                     </button>
                  )}

                  <div className="grid grid-cols-2 gap-3">
                    {NEURAL_TRACKS.map((track) => (
                      <button
                        key={track.id}
                        onClick={() => setSelectedAudio(track.label)}
                        className={cn(
                          "p-4 rounded-xl border flex flex-col gap-2 transition-all text-left group",
                          selectedAudio === track.label 
                            ? "bg-brand-accent/5 border-brand-accent/30" 
                            : "bg-slate-50 border-slate-100 hover:border-brand-accent/20"
                        )}
                      >
                         <div className="flex justify-between items-start">
                            <Music className={cn("w-4 h-4 transition-colors", selectedAudio === track.label ? "text-brand-accent" : "text-slate-300 group-hover:text-brand-accent")} />
                            <div className="text-[8px] font-bold text-slate-300 uppercase tracking-tighter">{track.mood}</div>
                         </div>
                         <span className={cn("text-[10px] font-bold uppercase tracking-widest", selectedAudio === track.label ? "text-brand-accent" : "text-slate-600")}>
                           {track.label}
                         </span>
                      </button>
                    ))}
                  </div>

                  <div className="relative mt-4">
                    <Volume2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    <input 
                      type="text"
                      placeholder="Custom signature..."
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 pl-12 pr-4 text-xs font-medium focus:border-brand-accent/30 outline-none transition-all"
                      value={selectedAudio}
                      onChange={(e) => setSelectedAudio(e.target.value)}
                    />
                  </div>
               </div>

              <div className="space-y-4">
                <button 
                  onClick={handleGenerate}
                  disabled={isGenerating || !prompt}
                  className="w-full h-16 bg-slate-900 text-white rounded-2xl font-bold uppercase tracking-[0.3em] text-xs flex items-center justify-center gap-3 hover:bg-brand-accent transition-all shadow-xl shadow-slate-900/10 disabled:opacity-50"
                >
                  {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Initiate Rendering <Zap className="w-4 h-4" /></>}
                </button>

                <button 
                  onClick={() => handleGenerate("A cinematic, high-velocity cinematic sequence of a creator's day: morning aesthetic coffee, strategic content filming, neural tag analysis, and late-night editing with neon ambient lighting.")}
                  disabled={isGenerating}
                  className="w-full h-14 bg-white border border-slate-200 text-slate-800 rounded-2xl font-bold uppercase tracking-[0.15em] text-[10px] flex items-center justify-center gap-2 hover:bg-slate-50 transition-all shadow-sm disabled:opacity-50 group"
                >
                  Generate Creator Reel <Sparkles className="w-3.5 h-3.5 text-brand-accent group-hover:animate-pulse" />
                </button>
              </div>
           </div>

           <div className="hypr-card p-6 bg-brand-accent/[0.02] border-brand-accent/10 space-y-4">
              <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-lg bg-brand-accent/10 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-brand-accent" />
                 </div>
                 <h4 className="text-[11px] font-bold uppercase tracking-widest text-slate-900">Velocity Status</h4>
              </div>
              <p className="text-[10px] text-slate-500 font-light leading-relaxed">
                 AI video assets have a 4.2x higher engagement rate compared to static imagery in current platform algorithms.
              </p>
           </div>
        </div>

        {/* Viewport Node */}
        <div className="lg:col-span-2 space-y-6">
               <div className={cn(
                 "relative bg-slate-950 rounded-[3rem] border-[12px] border-slate-900 shadow-2xl overflow-hidden mx-auto group transition-all duration-500",
                 aspectRatio === '9:16' ? "aspect-[9/16] max-w-[400px]" : "aspect-[16/9] max-w-full"
               )}>
                  {/* Neural Overlay */}
                  <div className="absolute inset-x-0 top-0 p-10 z-20 flex justify-between items-start pointer-events-none">
                     <div className="flex flex-col gap-1">
                        <div className="h-1 w-12 bg-white/20 rounded-full overflow-hidden">
                           <motion.div 
                              className="h-full bg-brand-accent"
                              animate={{ width: videoData ? '100%' : '0%' }}
                              transition={{ duration: 15, ease: "linear" }}
                           />
                        </div>
                        <span className="text-[8px] font-mono text-white/40 uppercase tracking-widest">Neural Stream active</span>
                     </div>
                     <div className="flex flex-col items-end gap-2">
                        <Cpu className="w-4 h-4 text-white/20 animate-pulse" />
                        {resolution === '1080p' && (
                          <span className="text-[8px] font-bold text-white/20 uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded-full border border-white/5">High Def Mode</span>
                        )}
                     </div>
                  </div>

                  {/* Video Content */}
                  {renderProgress < 100 && isGenerating ? (
                     <div className="absolute inset-0 z-10 bg-slate-950 flex flex-col items-center justify-center gap-6 p-12 text-center text-white">
                        <div className="relative">
                           <Loader2 className="w-16 h-16 text-brand-accent animate-spin" />
                           <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold">{Math.round(renderProgress)}%</span>
                        </div>
                        <div className="space-y-2">
                           <h3 className="text-xl font-display font-bold italic tracking-tighter">Neural Reconstitution</h3>
                           <p className="text-[10px] font-bold text-brand-accent uppercase tracking-[0.3em]">{renderStatus}</p>
                        </div>
                     </div>
                  ) : videoUrl ? (
                     <div className="absolute inset-0 h-full w-full group/player">
                        <video 
                          src={videoUrl}
                          controls
                          autoPlay 
                          loop 
                          muted 
                          playsInline
                          className="w-full h-full object-cover grayscale opacity-80 contrast-125 hover:grayscale-0 transition-all duration-1000"
                        />
                        
                        {/* Dynamic Text Overlay */}
                        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-12 text-center bg-gradient-to-t from-slate-900/40 to-transparent pointer-events-none group-hover/player:opacity-0 transition-opacity">
                           <motion.div 
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="space-y-6"
                           >
                              <h2 className={cn(
                                "font-display font-bold italic tracking-tighter leading-tight text-white drop-shadow-2xl",
                                aspectRatio === '9:16' ? "text-3xl" : "text-5xl"
                              )}>
                                 {videoData?.title || "Strategic Asset Active"}
                              </h2>
                              <div className="h-px w-12 bg-brand-accent mx-auto" />
                              <div className="flex items-center justify-center gap-3">
                                <p className="text-[10px] font-bold text-white/60 uppercase tracking-[0.4em]">
                                   {videoData?.mood || "Tactical"} protocol
                                </p>
                                {selectedAudio && (
                                  <div className="flex items-center gap-2 text-brand-accent px-3 py-1 rounded-full bg-brand-accent/10 border border-brand-accent/20">
                                    <Volume2 className="w-3 h-3" />
                                    <span className="text-[8px] font-bold uppercase tracking-widest">{selectedAudio}</span>
                                  </div>
                                )}
                              </div>
                           </motion.div>
                        </div>
                     </div>
                  ) : (
                     <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 p-12 text-center text-white/20">
                        <div className="w-20 h-20 rounded-full border-2 border-white/5 flex items-center justify-center">
                           <Video className="w-10 h-10" />
                        </div>
                        <p className="text-xs font-light italic">"Awaiting neural initialization packets..."</p>
                     </div>
                  )}

                  {/* Bottom Controls */}
                  <div className="absolute inset-x-0 bottom-0 p-10 z-20 flex justify-between items-end pointer-events-none">
                     <div className="flex gap-4 translate-y-4 group-hover:translate-y-0 transition-all opacity-0 group-hover:opacity-100 duration-500">
                        <button className="h-12 px-6 bg-white/10 backdrop-blur-md rounded-2xl flex items-center gap-3 text-white pointer-events-auto border border-white/10 hover:bg-white/20 transition-all">
                           <Download className="w-4 h-4" />
                           <span className="text-[10px] font-bold uppercase tracking-widest">Export</span>
                        </button>
                        <button 
                          onClick={() => saveToFirestore(prompt, videoUrl!, videoData)}
                          disabled={isSaving || isSaved}
                          className={cn(
                            "h-12 px-6 backdrop-blur-md rounded-2xl flex items-center gap-3 text-white pointer-events-auto border transition-all",
                            isSaved ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400" : "bg-white/10 border-white/10 hover:bg-white/20"
                          )}
                        >
                           {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : isSaved ? <CheckCircle className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                           <span className="text-[10px] font-bold uppercase tracking-widest">{isSaved ? "Saved" : "Save Matrix"}</span>
                        </button>
                     </div>
                  </div>
               </div>

           {/* Storyboard Detail */}
           {videoData && renderProgress === 100 && (
             <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="hypr-card p-10 bg-white border-slate-200 shadow-sm space-y-8"
             >
                <div className="flex justify-between items-center">
                   <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-slate-400">Strategic Storyboard</h3>
                   <span className="text-[10px] font-bold text-brand-accent bg-brand-accent/10 px-3 py-1 rounded-full uppercase tracking-widest">{videoData.recommendedAudio}</span>
                </div>
                
                <div className="space-y-6">
                   {videoData.scenes.map((scene: any, i: number) => (
                     <div key={i} className="flex gap-6 items-start group/scene">
                        <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-[10px] font-bold group-hover/scene:border-brand-accent/20 transition-all shrink-0">
                           {scene.time}
                        </div>
                        <div className="space-y-2 py-2">
                           <p className="text-sm font-bold text-slate-900 group-hover/scene:text-brand-accent transition-colors">"{scene.text}"</p>
                           <p className="text-xs text-slate-400 font-light italic">{scene.visual}</p>
                        </div>
                     </div>
                   ))}
                </div>
             </motion.div>
           )}
        </div>
      </div>
    </div>
  );
}
