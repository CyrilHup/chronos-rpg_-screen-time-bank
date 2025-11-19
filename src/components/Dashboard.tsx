import React from 'react';
import { Settings } from 'lucide-react';
import AvatarRenderer from './AvatarRenderer';
import { Avatar } from '../types';

interface DashboardProps {
  timeBank: number;
  avatar: Avatar;
  onStartQuest: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ timeBank, avatar, onStartQuest }) => {
  return (
    <div className="h-full flex flex-col relative overflow-hidden">
      {/* Top Bar */}
      <div className="p-6 flex justify-between items-start z-10">
        <div className="text-center w-full">
            <h2 className="text-zen-text-muted dark:text-gray-400 text-sm mb-1">You have <span className="text-zen-text-main dark:text-white font-bold text-lg">{timeBank} minutes</span></h2>
            <p className="text-zen-text-muted dark:text-gray-400 text-xs">left on your apps</p>
        </div>
      </div>

      {/* Avatar Display */}
      <div className="flex-1 relative flex items-center justify-center">
         {/* Background Glow */}
         <div className="absolute w-64 h-64 bg-zen-primary/20 dark:bg-zen-primary/10 rounded-full blur-[100px] pointer-events-none" />
         
         <div className="w-full h-[400px] relative z-0">
            <AvatarRenderer avatar={avatar} className="w-full h-full" />
         </div>
      </div>

      {/* Bottom Actions */}
      <div className="p-6 pb-24 space-y-4 z-10">


        <button 
            onClick={onStartQuest}
            className="w-full py-4 bg-zen-primary hover:bg-zen-primary/90 text-white font-bold rounded-2xl shadow-[0_0_20px_rgba(22,163,74,0.3)] dark:shadow-[0_0_30px_rgba(22,163,74,0.2)] transition-all transform hover:scale-[1.02] active:scale-[0.98]"
        >
            Start a Quest
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
