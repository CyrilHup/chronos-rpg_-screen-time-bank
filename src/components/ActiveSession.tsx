import React, { useEffect, useState } from 'react';
import { SimulatedApp } from '../types';
import { XCircle, Wifi, Battery } from 'lucide-react';
import { motion } from 'framer-motion';

interface ActiveSessionProps {
  app: SimulatedApp;
  durationMinutes: number;
  onEndSession: () => void;
}

const ActiveSession: React.FC<ActiveSessionProps> = ({ app, durationMinutes, onEndSession }) => {
  const [timeLeft, setTimeLeft] = useState(durationMinutes * 60);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onEndSession();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [onEndSession]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const progress = (timeLeft / (durationMinutes * 60)) * 100;

  return (
    <div className="fixed inset-0 z-50 bg-zen-background dark:bg-gray-950 flex flex-col items-center justify-center overflow-hidden">
        {/* Background Animation */}
        <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(transparent_2px,black_2px),linear-gradient(90deg,transparent_2px,black_2px)] dark:bg-[linear-gradient(transparent_2px,white_2px),linear-gradient(90deg,transparent_2px,white_2px)] bg-[size:40px_40px] [mask-image:radial-gradient(circle_at_center,black,transparent)]" />
            <motion.div 
                animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" 
            />
        </div>

        {/* Top Bar HUD */}
        <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-start text-zen-text-muted dark:text-gray-500 font-mono text-xs z-10">
            <div className="flex gap-4">
                <div className="flex items-center gap-1"><Wifi size={14} /> Connected</div>
                <div className="flex items-center gap-1"><Battery size={14} /> Optimal</div>
            </div>
            <div>Session ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</div>
        </div>

        <div className="relative z-10 w-full max-w-md p-8 text-center space-y-12">
            <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="relative w-32 h-32 mx-auto"
            >
                <div className={`absolute inset-0 rounded-3xl ${app.color} opacity-20 blur-xl animate-pulse`} />
                <div className={`relative w-full h-full rounded-3xl ${app.color} flex items-center justify-center shadow-2xl border border-white/20`}>
                    {/* Icon placeholder if needed, or just app name */}
                    <span className="text-4xl font-bold text-white">{app.name[0]}</span>
                </div>
            </motion.div>

            <div className="space-y-2">
                <h2 className="text-3xl font-bold text-zen-text-main dark:text-white tracking-tight">{app.name}</h2>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 text-xs font-bold uppercase tracking-widest">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    Access Granted
                </div>
            </div>

            <div className="relative">
                <div className="text-8xl font-mono font-bold text-zen-text-main dark:text-white tracking-tighter drop-shadow-[0_0_15px_rgba(22,163,74,0.3)] dark:drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                    {formatTime(timeLeft)}
                </div>
                
                {/* Progress Ring */}
                <svg className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 -rotate-90 pointer-events-none opacity-30">
                    <circle cx="160" cy="160" r="158" stroke="currentColor" strokeWidth="2" fill="none" className="text-zen-text-muted/20 dark:text-gray-800" />
                    <circle 
                        cx="160" cy="160" r="158" 
                        stroke="currentColor" strokeWidth="2" fill="none" 
                        strokeDasharray={992}
                        strokeDashoffset={992 - (992 * progress) / 100}
                        className="text-zen-primary transition-all duration-1000 ease-linear" 
                    />
                </svg>
            </div>

            <button 
                onClick={onEndSession}
                className="group flex items-center justify-center gap-2 mx-auto text-red-500 hover:text-red-400 transition-colors"
            >
                <div className="p-2 rounded-full border border-red-500/30 group-hover:bg-red-500/10 transition-colors">
                    <XCircle size={24} />
                </div>
                <span className="text-sm font-bold uppercase tracking-widest">Terminate Session</span>
            </button>
        </div>
    </div>
  );
};

export default ActiveSession;
