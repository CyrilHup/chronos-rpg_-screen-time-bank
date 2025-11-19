import React, { useMemo } from 'react';
import { X, Clock, Play, Settings as SettingsIcon, Lock, Calendar } from 'lucide-react';
import { SimulatedApp, Task } from '../types';
import * as LucideIcons from 'lucide-react';

interface AppBlockOverlayProps {
  app: SimulatedApp;
  timeBank: number;
  tasks: Task[];
  onClose: () => void;
  onUnlock: (minutes: number) => void;
  onStartTask: (task: Task) => void;
  onManageQuests: () => void;
}

const AppBlockOverlay: React.FC<AppBlockOverlayProps> = ({
  app,
  timeBank,
  tasks,
  onClose,
  onUnlock,
  onStartTask,
  onManageQuests
}) => {
  const IconComponent = (LucideIcons as any)[app.icon] || LucideIcons.Smartphone;

  const unlockOptions = [5, 15, 30, 60];

  const proposedTasks = useMemo(() => {
    const shuffled = [...tasks].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  }, [tasks]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zen-background/90 dark:bg-black/90 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-zen-paper dark:bg-gray-900 w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-zen-text-muted/10 dark:border-white/10 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-b from-zen-primary/20 to-transparent flex flex-col items-center relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-zen-text-muted/10 dark:bg-white/10 text-zen-text-muted dark:text-white hover:bg-zen-text-muted/20 dark:hover:bg-white/20 transition-colors"
          >
            <X size={20} />
          </button>
          
          <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg ${app.color}`}>
            <IconComponent size={40} />
          </div>
          <h2 className="text-2xl font-bold text-zen-text-main dark:text-white">{app.name}</h2>
          <div className="flex items-center gap-2 text-red-500 dark:text-red-400 mt-1">
            <Lock size={14} />
            <span className="text-sm font-medium">App Blocked</span>
          </div>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto">
          
          {/* Section 1: Time Bank Info */}
          <div className="bg-zen-text-muted/5 dark:bg-white/5 rounded-2xl p-4 flex items-center justify-between border border-zen-text-muted/5 dark:border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-zen-primary/20 flex items-center justify-center text-zen-primary">
                <Clock size={20} />
              </div>
              <div>
                <div className="text-xs text-zen-text-muted dark:text-gray-400 uppercase tracking-wider">Time Bank</div>
                <div className="text-xl font-bold text-zen-text-main dark:text-white">{timeBank}m Available</div>
              </div>
            </div>
          </div>

          {/* Section 2: Unlock Options */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-zen-text-muted dark:text-gray-400 uppercase tracking-wider">Unlock for...</h3>
            <div className="grid grid-cols-2 gap-3">
              {unlockOptions.map(minutes => {
                const canAfford = timeBank >= minutes;
                return (
                  <button
                    key={minutes}
                    onClick={() => canAfford && onUnlock(minutes)}
                    disabled={!canAfford}
                    className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${
                      canAfford 
                        ? 'bg-zen-text-muted/5 dark:bg-white/5 border-zen-text-muted/10 dark:border-white/10 hover:bg-zen-text-muted/10 dark:hover:bg-white/10 hover:border-zen-primary/50 text-zen-text-main dark:text-white' 
                        : 'bg-zen-text-muted/5 dark:bg-white/5 border-transparent text-zen-text-muted dark:text-gray-600 cursor-not-allowed opacity-50'
                    }`}
                  >
                    <span className="text-lg font-bold">{minutes}m</span>
                    <span className="text-xs opacity-60">-{minutes} credits</span>
                  </button>
                );
              })}
            </div>
            {timeBank < 5 && (
                <p className="text-xs text-red-500 dark:text-red-400 text-center">Not enough time in bank. Complete tasks to earn more.</p>
            )}
          </div>

          {/* Section 3: Quest Options */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-zen-text-muted dark:text-gray-400 uppercase tracking-wider">Start a Quest</h3>
            </div>
            
            <div className="space-y-2">
                {proposedTasks.map(task => (
                    <button
                        key={task.id}
                        onClick={() => onStartTask(task)}
                        className="w-full p-3 bg-zen-paper/40 dark:bg-gray-800/40 border border-zen-text-muted/10 dark:border-white/5 rounded-xl hover:bg-zen-paper/60 dark:hover:bg-gray-800/60 transition-colors flex items-center justify-between group"
                    >
                        <div className="text-left">
                            <div className="flex items-center gap-2">
                                <div className="font-bold text-zen-text-main dark:text-white text-sm">{task.title}</div>
                            </div>
                            <div className="text-xs text-zen-text-muted dark:text-gray-400">{task.durationMinutes}m • +{task.rewardMinutes}m reward</div>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-zen-text-muted/5 dark:bg-white/5 flex items-center justify-center text-zen-text-muted dark:text-gray-400 group-hover:bg-zen-primary/20 group-hover:text-zen-primary transition-colors">
                            <Play size={14} />
                        </div>
                    </button>
                ))}
                
                {tasks.length === 0 && (
                    <div className="text-center p-4 border border-dashed border-zen-text-muted/10 dark:border-white/10 rounded-xl text-zen-text-muted dark:text-gray-500 text-sm">
                        No quests created yet.
                    </div>
                )}

                <button
                    onClick={onManageQuests}
                    className="w-full p-3 border border-dashed border-zen-text-muted/20 dark:border-white/20 rounded-xl text-zen-text-muted dark:text-gray-400 hover:text-zen-text-main dark:hover:text-white hover:border-zen-text-muted/40 dark:hover:border-white/40 transition-colors text-sm flex items-center justify-center gap-2"
                >
                    <span>+ Create / Manage Quests</span>
                </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AppBlockOverlay;
