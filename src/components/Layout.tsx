import React from 'react';
import { AppView, Avatar } from '../types';
import { Home, Compass, Trophy, ArrowLeft, Smile, User } from 'lucide-react';
import clsx from 'clsx';

interface LayoutProps {
  children: React.ReactNode;
  currentView: AppView;
  onChangeView: (view: AppView) => void;
  onOpenProfile: () => void;
  avatar?: Avatar;
}

const Layout: React.FC<LayoutProps> = ({ children, currentView, onChangeView, onOpenProfile, avatar }) => {
  
  const navItems = [
    { id: AppView.DASHBOARD, icon: Home, label: 'Main' },
    { id: AppView.TASKS, icon: Compass, label: 'Journeys' },
    { id: AppView.AVATAR, icon: Smile, label: 'Avatar' },
    { id: AppView.CLAN, icon: Trophy, label: 'League' },
  ];

  const showBackArrow = currentView !== AppView.DASHBOARD && currentView !== AppView.JOURNEY_TIMER;

  return (
    <div className="h-screen w-full bg-zen-background text-zen-text-main font-sans overflow-hidden flex flex-col relative">
      {/* Back Arrow */}
      {showBackArrow && (
        <button
            onClick={() => onChangeView(AppView.DASHBOARD)}
            className="absolute top-6 left-6 z-50 p-2 bg-zen-paper/80 backdrop-blur-md border border-white/10 rounded-full text-zen-text-main hover:bg-zen-paper transition-colors shadow-lg"
        >
            <ArrowLeft size={24} />
        </button>
      )}

      {/* Profile Button (Top Right) */}
      <button
          onClick={onOpenProfile}
          className="absolute top-6 right-6 z-50 p-1 bg-zen-paper/80 backdrop-blur-md border border-white/10 rounded-full text-zen-text-main hover:bg-zen-paper transition-colors shadow-lg group"
      >
          <div className="w-8 h-8 rounded-full overflow-hidden bg-black/20 flex items-center justify-center border border-white/10 group-hover:border-zen-primary/50 transition-colors">
             {avatar?.avatarUrl ? (
                 <img src={avatar.avatarUrl} alt="Profile" className="w-full h-full object-cover" />
             ) : (
                 <User size={18} className="text-zen-text-muted group-hover:text-zen-primary transition-colors" />
             )}
          </div>
      </button>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto relative scrollbar-hide pt-16">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="bg-zen-paper/80 backdrop-blur-lg border-t border-white/5 px-6 py-4 pb-8">
        <div className="flex justify-between items-center max-w-md mx-auto">
            {navItems.map((item) => {
                const isActive = currentView === item.id;
                return (
                    <button
                        key={item.id}
                        onClick={() => onChangeView(item.id)}
                        className="flex flex-col items-center gap-1 group"
                    >
                        <div className={clsx(
                            "p-2 rounded-xl transition-all duration-300",
                            isActive ? "bg-zen-primary/20 text-zen-primary" : "text-zen-text-muted group-hover:text-gray-300"
                        )}>
                            <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                        </div>
                        <span className={clsx(
                            "text-[10px] font-medium tracking-wide transition-colors",
                            isActive ? "text-zen-primary" : "text-zen-text-muted"
                        )}>
                            {item.label}
                        </span>
                    </button>
                );
            })}
        </div>
      </nav>
    </div>
  );
};

export default Layout;
