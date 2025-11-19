import React, { useState, useEffect } from 'react';
import { Task } from '../types';
import { Play, Pause, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface MicroQuestTimerProps {
  task: Task;
  onComplete: () => void;
  onCancel: () => void;
}

const MicroQuestTimer: React.FC<MicroQuestTimerProps> = ({ task, onComplete, onCancel }) => {
  const [timeLeft, setTimeLeft] = useState(task.durationMinutes * 60);
  const [isActive, setIsActive] = useState(true);
  const [showConfirmCancel, setShowConfirmCancel] = useState(false);

  useEffect(() => {
    let interval: any;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      onComplete();
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, onComplete]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const progress = ((task.durationMinutes * 60 - timeLeft) / (task.durationMinutes * 60)) * 100;

  return (
    <div className="fixed inset-0 z-50 bg-zen-background dark:bg-black flex flex-col items-center justify-center p-6">
        {/* Background Elements */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
             <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zen-primary/10 via-transparent to-transparent" />
        </div>

        <AnimatePresence>
        {showConfirmCancel ? (
            <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="w-full max-w-sm bg-zen-paper dark:bg-gray-900 border border-zen-text-muted/20 dark:border-white/20 rounded-3xl p-8 text-center space-y-6 shadow-2xl relative z-10"
            >
                <h3 className="text-xl font-bold text-zen-text-main dark:text-white">Abort Mission?</h3>
                <p className="text-zen-text-muted dark:text-gray-400 text-sm">
                    Are you sure you want to cancel your quest and go back to the main menu?
                </p>
                <div className="space-y-3">
                    <button 
                        onClick={onCancel}
                        className="w-full py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition-colors"
                    >
                        Yes, Abort
                    </button>
                    <button 
                        onClick={() => setShowConfirmCancel(false)}
                        className="w-full py-3 bg-gray-200 dark:bg-gray-700 text-zen-text-main dark:text-white font-bold rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    >
                        No, Resume
                    </button>
                </div>
            </motion.div>
        ) : (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full max-w-md flex flex-col items-center space-y-12 relative z-10"
            >
                <div className="text-center space-y-2">
                    <h2 className="text-2xl font-bold text-zen-text-main dark:text-white">{task.title}</h2>
                    <p className="text-zen-text-muted dark:text-gray-400 text-sm">{task.description}</p>
                </div>

                <div className="relative w-64 h-64 flex items-center justify-center">
                    {/* Timer SVG Ring */}
                    <svg className="absolute inset-0 w-full h-full -rotate-90">
                        <circle 
                            cx="128" cy="128" r="120" 
                            stroke="currentColor" strokeWidth="8" fill="none" 
                            className="text-gray-200 dark:text-gray-800" 
                        />
                        <circle 
                            cx="128" cy="128" r="120" 
                            stroke="currentColor" strokeWidth="8" fill="none" 
                            strokeDasharray={754}
                            strokeDashoffset={754 - (754 * progress) / 100}
                            strokeLinecap="round"
                            className="text-zen-primary transition-all duration-1000 ease-linear shadow-[0_0_15px_rgba(16,185,129,0.5)]" 
                        />
                    </svg>
                    
                    <div className="text-5xl font-mono font-bold text-zen-text-main dark:text-white tracking-tighter drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]">
                        {formatTime(timeLeft)}
                    </div>
                </div>

                <div className="flex items-center gap-8">
                    <button 
                        onClick={toggleTimer}
                        className="w-16 h-16 rounded-full bg-zen-paper dark:bg-gray-900 border border-zen-text-muted/20 dark:border-white/20 flex items-center justify-center text-zen-text-main dark:text-white hover:bg-zen-text-muted/10 dark:hover:bg-white/10 transition-colors shadow-lg"
                    >
                        {isActive ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
                    </button>
                    
                    <button 
                        onClick={() => setShowConfirmCancel(true)}
                        className="w-16 h-16 rounded-full bg-zen-paper dark:bg-gray-900 border border-zen-text-muted/20 dark:border-white/20 flex items-center justify-center text-red-500 hover:bg-red-500/10 transition-colors shadow-lg"
                    >
                        <X size={24} />
                    </button>
                </div>
            </motion.div>
        )}
        </AnimatePresence>
    </div>
  );
};

export default MicroQuestTimer;
