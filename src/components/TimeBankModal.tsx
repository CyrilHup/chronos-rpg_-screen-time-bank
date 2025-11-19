import React, { useState } from 'react';
import { SimulatedApp, Task } from '../types';
import { Zap, Activity, Wind } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

interface TimeBankModalProps {
  app: SimulatedApp;
  balance: number;
  onClose: () => void;
  onSpend: (minutes: number) => void;
  onQuickTask: (task: Task) => void;
}

const QUICK_TASKS: Task[] = [
    { id: 'qt1', title: '3 min Meditation', description: '+5 min bonus', durationMinutes: 3, rewardMinutes: 5 },
    { id: 'qt2', title: '5 min Gentle Stretch', description: '+10 min bonus', durationMinutes: 5, rewardMinutes: 10 },
    { id: 'qt3', title: '2 min Deep Breathing', description: '+3 min bonus', durationMinutes: 2, rewardMinutes: 3 },
];

const TimeBankModal: React.FC<TimeBankModalProps> = ({ app, balance, onClose, onSpend, onQuickTask }) => {
  const [selectedDuration, setSelectedDuration] = useState(2);
  const durations = [1, 2, 5, 10];

  return (
    <AnimatePresence>
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-zen-background/90 dark:bg-black/90 backdrop-blur-sm sm:p-4"
        >
            <motion.div 
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                className="w-full max-w-md bg-zen-paper dark:bg-gray-900 border-t sm:border border-zen-primary/30 dark:border-zen-primary/20 rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-[0_-10px_50px_rgba(0,0,0,0.5)]"
            >
                <div className="p-6 space-y-6">
                    {/* Handle bar for mobile feel */}
                    <div className="w-12 h-1 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto mb-2 sm:hidden" />

                    <div className="text-center space-y-2">
                        <h2 className="text-xl font-bold text-zen-text-main dark:text-white leading-tight">
                            you have <span className="text-zen-primary">{balance} minutes</span> left on<br/>
                            {app.name.toLowerCase()}, how much time<br/>
                            do you want to use?
                        </h2>
                    </div>

                    {/* Duration Selector */}
                    <div className="flex justify-center gap-2 bg-zen-text-muted/5 dark:bg-white/5 p-1 rounded-xl">
                        {durations.map(d => (
                            <button
                                key={d}
                                onClick={() => setSelectedDuration(d)}
                                className={clsx(
                                    "flex-1 py-2 rounded-lg text-sm font-bold transition-all",
                                    selectedDuration === d 
                                        ? "bg-zen-primary/20 text-zen-primary border border-zen-primary/50" 
                                        : "text-zen-text-muted dark:text-gray-400 hover:text-zen-text-main dark:hover:text-white"
                                )}
                            >
                                {d} min
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={() => onSpend(selectedDuration)}
                        disabled={balance < selectedDuration}
                        className={clsx(
                            "w-full py-4 rounded-xl font-bold text-lg uppercase tracking-widest shadow-lg transition-all",
                            balance >= selectedDuration
                                ? "bg-zen-primary text-white hover:bg-zen-primary/90 hover:shadow-[0_0_20px_rgba(74,222,128,0.4)]" 
                                : "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                        )}
                    >
                        Launch app for {selectedDuration} minutes
                    </button>

                    <div className="relative py-2">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-zen-text-muted/10 dark:border-white/10"></div>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-zen-paper dark:bg-gray-900 px-2 text-zen-text-muted dark:text-gray-400">do you want to do something else to earn more time?</span>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {QUICK_TASKS.map((task, i) => (
                            <button
                                key={task.id}
                                onClick={() => onQuickTask(task)}
                                className="w-full flex items-center gap-4 p-3 bg-zen-paper/40 dark:bg-gray-800/40 border border-zen-text-muted/10 dark:border-white/10 hover:border-zen-primary/30 rounded-xl group transition-all text-left"
                            >
                                <div className="w-10 h-10 rounded-full bg-zen-primary/10 flex items-center justify-center text-zen-primary group-hover:scale-110 transition-transform">
                                    {i === 0 ? <Zap size={20} /> : i === 1 ? <Activity size={20} /> : <Wind size={20} />}
                                </div>
                                <div>
                                    <h3 className="font-bold text-zen-text-main dark:text-white text-sm">{task.title}</h3>
                                    <p className="text-xs text-zen-primary">{task.description}</p>
                                </div>
                            </button>
                        ))}
                    </div>

                    <button 
                        onClick={onClose}
                        className="w-full py-3 text-zen-text-muted dark:text-gray-400 hover:text-zen-text-main dark:hover:text-white text-sm font-bold transition-colors"
                    >
                        Not now/skip
                    </button>
                </div>
            </motion.div>
        </motion.div>
    </AnimatePresence>
  );
};

export default TimeBankModal;
