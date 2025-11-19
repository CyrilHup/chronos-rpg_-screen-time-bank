import React, { useState, useEffect, useRef } from 'react';
import { Task, JourneyHistoryItem } from '../types';
import { Play, Sparkles, Trophy, Edit2, X, Trash2, Pause, Square, Activity, History, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

interface TaskCenterProps {
  tasks: Task[];
  history: JourneyHistoryItem[];
  onCompleteTask: (task: Task) => void;
  setTasks: (tasks: Task[]) => void;
}

const TaskCenter: React.FC<TaskCenterProps> = ({ tasks, history, onCompleteTask, setTasks }) => {
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [timer, setTimer] = useState<number>(0);
  const [isPaused, setIsPaused] = useState(false);
  const [showEndConfirmation, setShowEndConfirmation] = useState(false);
  const [viewMode, setViewMode] = useState<'active' | 'history'>('active');
  
  // Edit State
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Task>>({});
  
  const editRef = useRef<HTMLDivElement>(null);

  const handleEditClick = (task: Task) => {
      setEditingTaskId(task.id);
      setEditForm(task);
  };

  const handleAddNew = () => {
      const newTask: Task = {
          id: `custom-${Date.now()}`,
          title: '',
          description: '',
          durationMinutes: 5,
          rewardMinutes: 5,
          isCustom: true,
          category: 'general'
      };
      // Add immediately to tasks so it renders
      setTasks([...tasks, newTask]);
      setEditForm(newTask);
      setEditingTaskId(newTask.id);
  };

  const handleSaveEdit = () => {
      if (!editingTaskId) return;
      
      const updatedTasks = tasks.map(t => 
          t.id === editingTaskId ? { ...t, ...editForm } as Task : t
      );
      setTasks(updatedTasks);
      
      setEditingTaskId(null);
      setEditForm({});
  };

  // Auto-save on click outside
  useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
          if (editRef.current && !editRef.current.contains(event.target as Node)) {
              if (editingTaskId) {
                  handleSaveEdit();
              }
          }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => {
          document.removeEventListener('mousedown', handleClickOutside);
      };
  }, [editingTaskId, editForm, tasks]); // Added tasks to dependency to ensure latest state

  const handleDelete = (taskId: string) => {
      setTasks(tasks.filter(t => t.id !== taskId));
      if (editingTaskId === taskId) {
          setEditingTaskId(null);
          setEditForm({});
      }
  };

  const startTask = (task: Task) => {
    setActiveTaskId(task.id);
    setTimer(Math.ceil(task.durationMinutes * 60));
    setIsPaused(false);
  };

  useEffect(() => {
    let interval: any;
    if (activeTaskId && timer > 0 && !isPaused) {
        interval = setInterval(() => {
            setTimer((prev) => prev - 1);
        }, 1000); 
    } else if (activeTaskId && timer <= 0) {
        const task = tasks.find(t => t.id === activeTaskId);
        if (task) onCompleteTask(task);
        setActiveTaskId(null);
    }
    return () => clearInterval(interval);
  }, [activeTaskId, timer, isPaused, tasks, onCompleteTask]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const activeTask = tasks.find(t => t.id === activeTaskId);
  const windDownTasks = tasks.filter(t => t.category === 'wind-down');
  const otherTasks = tasks.filter(t => t.category !== 'wind-down');

  return (
    <div className="p-6 pb-24 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
            <h2 className="text-2xl font-bold text-white">
                Journeys
            </h2>
            <p className="text-zen-primary/60 text-xs tracking-wider uppercase">
                Select your path
            </p>
        </div>
        <div className="flex gap-2 bg-zen-paper/50 p-1 rounded-xl border border-white/10">
            <button 
                onClick={() => setViewMode('active')}
                className={clsx(
                    "px-4 py-2 rounded-lg text-sm font-bold transition-all",
                    viewMode === 'active' ? "bg-zen-primary text-black" : "text-zen-text-muted hover:text-white"
                )}
            >
                Active
            </button>
            <button 
                onClick={() => setViewMode('history')}
                className={clsx(
                    "px-4 py-2 rounded-lg text-sm font-bold transition-all",
                    viewMode === 'history' ? "bg-zen-primary text-black" : "text-zen-text-muted hover:text-white"
                )}
            >
                History
            </button>
        </div>
      </div>

      {viewMode === 'active' ? (
        <>
            <div className="flex justify-end">
                <button 
                    onClick={() => setIsEditMode(!isEditMode)}
                    className={clsx(
                        "p-2 rounded-xl border transition-colors",
                        isEditMode ? "bg-zen-primary text-black border-zen-primary" : "bg-zen-primary/10 border-zen-primary/30 text-zen-primary hover:bg-zen-primary/20"
                    )}
                >
                    <Edit2 size={20} />
                </button>
            </div>

            {/* Active Timer Overlay */}
            <AnimatePresence>
                {activeTaskId && activeTask && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-zen-background"
                    >
                        {/* Background Elements */}
                        <div className="absolute inset-0 opacity-20 pointer-events-none">
                            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zen-primary/10 via-transparent to-transparent" />
                        </div>

                        {showEndConfirmation ? (
                            <motion.div 
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                className="w-full max-w-sm bg-zen-paper border border-white/20 rounded-3xl p-8 text-center space-y-6 shadow-2xl relative z-10"
                            >
                                <h3 className="text-xl font-bold text-white">Abort Mission?</h3>
                                <p className="text-gray-400 text-sm">
                                    Are you sure you want to cancel your journey? You won't receive any minutes.
                                </p>
                                <div className="space-y-3">
                                    <button 
                                        onClick={() => {
                                            setActiveTaskId(null);
                                            setShowEndConfirmation(false);
                                        }}
                                        className="w-full py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition-colors"
                                    >
                                        Yes, Abort
                                    </button>
                                    <button 
                                        onClick={() => setShowEndConfirmation(false)}
                                        className="w-full py-3 bg-gray-700 text-white font-bold rounded-xl hover:bg-gray-600 transition-colors"
                                    >
                                        No, Resume
                                    </button>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="w-full max-w-md flex flex-col items-center justify-center space-y-12 relative z-10">
                                {/* Timer Circle */}
                                <div className="relative w-64 h-64 flex items-center justify-center">
                                    <svg className="absolute inset-0 w-full h-full -rotate-90">
                                        <circle cx="128" cy="128" r="120" stroke="#1f2937" strokeWidth="8" fill="none" />
                                        <motion.circle 
                                            cx="128" cy="128" r="120" 
                                            stroke="#10b981" 
                                            strokeWidth="8" 
                                            fill="none" 
                                            strokeDasharray={754}
                                            strokeDashoffset={754 - (754 * (timer / (activeTask.durationMinutes * 60)))}
                                            strokeLinecap="round"
                                            className="drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]"
                                        />
                                    </svg>
                                    <div className="text-5xl font-mono font-bold text-white tracking-tighter">
                                        {formatTime(timer)}
                                    </div>
                                </div>

                                <div className="text-center space-y-2">
                                    <h3 className="text-xl font-bold text-white">{activeTask.title}</h3>
                                    <p className="text-gray-400">{activeTask.description}</p>
                                </div>

                                <div className="flex gap-6">
                                    <button 
                                        onClick={() => setIsPaused(!isPaused)}
                                        className="flex flex-col items-center gap-2 text-gray-400 hover:text-white transition-colors"
                                    >
                                        <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors">
                                            {isPaused ? <Play size={20} /> : <Pause size={20} />}
                                        </div>
                                        <span className="text-xs uppercase tracking-widest">{isPaused ? "Resume" : "Pause"}</span>
                                    </button>
                                    <button 
                                        onClick={() => setShowEndConfirmation(true)}
                                        className="flex flex-col items-center gap-2 text-red-500 hover:text-red-400 transition-colors"
                                    >
                                        <div className="w-12 h-12 rounded-full border border-red-500/30 flex items-center justify-center hover:bg-red-500/10 transition-colors">
                                            <Square size={20} fill="currentColor" />
                                        </div>
                                        <span className="text-xs uppercase tracking-widest">End Early</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Wind Down Section */}
            {windDownTasks.length > 0 && (
                <div className="space-y-4">
                    <h3 className="text-lg font-bold text-white">Choose Your Wind-Down Journey</h3>
                    <div className="space-y-3">
                        {windDownTasks.map((task) => (
                            <div key={task.id} className="relative group">
                                <button 
                                    onClick={() => startTask(task)}
                                    disabled={isEditMode}
                                    className="w-full text-left p-5 bg-zen-paper/40 border border-white/5 hover:border-zen-primary/50 rounded-2xl transition-all duration-300 hover:bg-zen-paper/60"
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-bold text-white">{task.title}</h4>
                                        <span className="text-xs text-gray-400">{task.durationMinutes} min</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-400">
                                        <Sparkles size={14} className="text-zen-primary" />
                                        <span>{task.description}</span>
                                    </div>
                                </button>
                                {isEditMode && (
                                    <div className="absolute top-2 right-2 flex gap-2">
                                        <button onClick={() => handleDelete(task.id)} className="p-2 bg-red-500/20 text-red-500 rounded-lg hover:bg-red-500/30">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Other Journeys / Tasks */}
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold text-white">Daily Quests</h3>
                </div>
                
                <div className="space-y-3">
                    {otherTasks.map((task) => (
                        <div key={task.id} className="relative group">
                            {editingTaskId === task.id ? (
                                <div ref={editRef} className="p-4 bg-zen-paper/60 border border-zen-primary rounded-2xl space-y-3">
                                    <input 
                                        type="text" 
                                        value={editForm.title || ''}
                                        onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                                        className="w-full bg-black/30 border border-white/10 rounded px-3 py-2 text-white focus:border-zen-primary outline-none"
                                        placeholder="Title"
                                        autoFocus
                                    />
                                    <div className="flex gap-2">
                                        <input 
                                            type="number" 
                                            step="0.1"
                                            min="0"
                                            defaultValue={editForm.durationMinutes}
                                            onChange={(e) => {
                                                const val = parseFloat(e.target.value);
                                                if (!isNaN(val) && val >= 0) {
                                                    setEditForm({...editForm, durationMinutes: val});
                                                }
                                            }}
                                            onKeyDown={(e) => {
                                                if (e.key === '-') e.preventDefault();
                                            }}
                                            className="w-20 bg-black/30 border border-white/10 rounded px-3 py-2 text-white focus:border-zen-primary outline-none"
                                            placeholder="Min"
                                        />
                                        <input 
                                            type="number" 
                                            min="0"
                                            defaultValue={editForm.rewardMinutes}
                                            onChange={(e) => {
                                                const val = parseFloat(e.target.value);
                                                if (!isNaN(val) && val >= 0) {
                                                    setEditForm({...editForm, rewardMinutes: val});
                                                }
                                            }}
                                            onKeyDown={(e) => {
                                                if (e.key === '-') e.preventDefault();
                                            }}
                                            className="w-20 bg-black/30 border border-white/10 rounded px-3 py-2 text-zen-primary focus:border-zen-primary outline-none"
                                            placeholder="Reward"
                                        />
                                    </div>
                                    <div className="text-xs text-gray-500 text-right italic">
                                        Click outside to save
                                    </div>
                                </div>
                            ) : (
                                <button 
                                    onClick={() => isEditMode ? handleEditClick(task) : startTask(task)}
                                    className="w-full flex items-center justify-between p-4 bg-zen-paper/20 border border-white/5 hover:border-zen-primary/30 rounded-2xl transition-all"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-zen-primary/10 flex items-center justify-center text-zen-primary">
                                            {task.category === 'fitness' ? <Activity size={20} /> : <Trophy size={20} />}
                                        </div>
                                        <div className="text-left">
                                            <div className="font-bold text-white text-sm">{task.title}</div>
                                            <div className="text-xs text-gray-500">{task.durationMinutes} min • +{task.rewardMinutes} min</div>
                                        </div>
                                    </div>
                                    {isEditMode ? (
                                        <Edit2 size={16} className="text-gray-500" />
                                    ) : (
                                        <Play size={16} className="text-zen-primary" />
                                    )}
                                </button>
                            )}
                            {isEditMode && !editingTaskId && (
                                <button 
                                    onClick={() => handleDelete(task.id)}
                                    className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X size={12} />
                                </button>
                            )}
                        </div>
                    ))}
                    
                    {isEditMode && !editingTaskId && (
                        <button 
                            onClick={handleAddNew}
                            className="w-full py-4 border-2 border-dashed border-white/10 rounded-2xl text-gray-500 hover:border-zen-primary/50 hover:text-zen-primary transition-all flex items-center justify-center gap-2"
                        >
                            <Edit2 size={16} /> Add New Journey
                        </button>
                    )}
                </div>
            </div>
        </>
      ) : (
        <div className="space-y-4">
            <h3 className="text-lg font-bold text-white">Journey History</h3>
            {history.length === 0 ? (
                <div className="text-center py-12 text-zen-text-muted italic bg-zen-paper/20 rounded-2xl border border-white/5">
                    No journeys completed yet. Start your first mission!
                </div>
            ) : (
                <div className="space-y-3">
                    {history.slice().reverse().map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-4 bg-zen-paper/20 rounded-2xl border border-white/5">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-zen-primary/10 flex items-center justify-center text-zen-primary">
                                    <History size={20} />
                                </div>
                                <div>
                                    <div className="font-bold text-white text-sm">{item.taskTitle}</div>
                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                        <Calendar size={12} />
                                        {new Date(item.completedAt).toLocaleDateString()} • {new Date(item.completedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                    </div>
                                </div>
                            </div>
                            <div className="text-green-400 font-bold text-sm">+{item.rewardMinutes} min</div>
                        </div>
                    ))}
                </div>
            )}
        </div>
      )}
    </div>
  );
};

export default TaskCenter;
