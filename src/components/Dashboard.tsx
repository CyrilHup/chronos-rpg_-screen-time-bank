import React from 'react';
import { HelpCircle, Settings } from 'lucide-react';
import AvatarRenderer from './AvatarRenderer';
import { Avatar } from '../types';

interface DashboardProps {
  timeBank: number;
  avatar: Avatar;
  onStartJourney: () => void;
  onOpenFAQ: () => void;
  onOpenSettings: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ timeBank, avatar, onStartJourney, onOpenFAQ, onOpenSettings }) => {
  return (
    <div className="h-full flex flex-col relative overflow-hidden">
      {/* Top Bar */}
      <div className="p-6 flex justify-between items-start z-10">
        <div className="text-center w-full">
            <h2 className="text-gray-400 text-sm mb-1">You have <span className="text-white font-bold text-lg">{timeBank} minutes</span></h2>
            <p className="text-gray-500 text-xs">left on your apps</p>
        </div>
        <div className="absolute right-6 top-6 flex gap-4">
            <button onClick={onOpenSettings} className="text-gray-400 hover:text-white transition-colors">
                <Settings size={20} />
            </button>
            <button onClick={onOpenFAQ} className="text-gray-400 hover:text-white transition-colors">
                <HelpCircle size={20} />
            </button>
        </div>
      </div>

      {/* Avatar Display */}
      <div className="flex-1 relative flex items-center justify-center">
         {/* Background Glow */}
         <div className="absolute w-64 h-64 bg-zen-primary/20 rounded-full blur-[100px] pointer-events-none" />
         
         <div className="w-full h-[400px] relative z-0">
            <AvatarRenderer avatar={avatar} className="w-full h-full" />
         </div>
      </div>

      {/* Bottom Actions */}
      <div className="p-6 pb-24 space-y-4 z-10">


        <button 
            onClick={onStartJourney}
            className="w-full py-4 bg-zen-primary hover:bg-white text-black font-bold rounded-2xl shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all transform hover:scale-[1.02] active:scale-[0.98]"
        >
            Start a Journey
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
