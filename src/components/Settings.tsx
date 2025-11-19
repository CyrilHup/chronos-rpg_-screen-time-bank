import React, { useState } from 'react';
import { Bell, Moon, Shield, Volume2, Smartphone, LogOut, ChevronRight, ToggleLeft, ToggleRight, Lock, Unlock } from 'lucide-react';

import { SimulatedApp } from '../types';
import * as LucideIcons from 'lucide-react';

interface SettingsProps {
    apps?: SimulatedApp[];
    onUpdateApp?: (appId: string, updates: Partial<SimulatedApp>) => void;
}

const Settings: React.FC<SettingsProps> = ({ apps = [], onUpdateApp }) => {
  const [notifications, setNotifications] = useState(true);
  const [sound, setSound] = useState(true);
  const [strictMode, setStrictMode] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  const SettingItem = ({ icon: Icon, title, subtitle, type, value, onChange }: any) => (
    <div className="flex items-center justify-between p-4 bg-zen-paper/40 border border-white/5 rounded-2xl hover:bg-zen-paper/60 transition-colors">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-zen-primary/10 flex items-center justify-center text-zen-primary">
          <Icon size={20} />
        </div>
        <div>
          <div className="font-bold text-white text-sm">{title}</div>
          {subtitle && <div className="text-xs text-gray-400">{subtitle}</div>}
        </div>
      </div>
      
      {type === 'toggle' && (
        <button onClick={() => onChange(!value)} className="text-zen-primary transition-colors">
          {value ? <ToggleRight size={32} /> : <ToggleLeft size={32} className="text-gray-600" />}
        </button>
      )}
      
      {type === 'link' && (
        <ChevronRight size={20} className="text-gray-500" />
      )}
    </div>
  );

  return (
    <div className="p-6 pb-24 space-y-8 animate-fade-in h-full overflow-y-auto">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-zen-primary/10 rounded-xl border border-zen-primary/30">
            <Smartphone size={24} className="text-zen-primary" />
        </div>
        <div>
            <h2 className="text-2xl font-bold text-white">Settings</h2>
            <p className="text-xs text-gray-400 uppercase tracking-wider">System Configuration</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* App Management Section */}
        {apps.length > 0 && onUpdateApp && (
            <div className="space-y-2">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-2">Managed Apps</h3>
                <div className="grid gap-2">
                    {apps.map(app => {
                        // Dynamic Icon Loading
                        const IconComponent = (LucideIcons as any)[app.icon] || LucideIcons.Smartphone;
                        
                        return (
                            <div key={app.id} className="flex items-center justify-between p-3 bg-zen-paper/40 border border-white/5 rounded-xl">
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white ${app.color}`}>
                                        <IconComponent size={16} />
                                    </div>
                                    <span className="font-bold text-white text-sm">{app.name}</span>
                                </div>
                                <button 
                                    onClick={() => onUpdateApp(app.id, { isBlocked: !app.isBlocked })}
                                    className={`p-2 rounded-lg transition-colors ${app.isBlocked ? 'bg-red-500/20 text-red-500' : 'bg-green-500/20 text-green-500'}`}
                                >
                                    {app.isBlocked ? <Lock size={16} /> : <Unlock size={16} />}
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>
        )}

        <div className="space-y-2">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-2">General</h3>
            <SettingItem 
                icon={Bell} 
                title="Notifications" 
                subtitle="Receive daily quest updates" 
                type="toggle" 
                value={notifications} 
                onChange={setNotifications} 
            />
            <SettingItem 
                icon={Volume2} 
                title="Sound Effects" 
                subtitle="UI and timer sounds" 
                type="toggle" 
                value={sound} 
                onChange={setSound} 
            />
        </div>

        <div className="space-y-2">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-2">Focus Mode</h3>
            <SettingItem 
                icon={Shield} 
                title="Strict Mode" 
                subtitle="Prevent cancelling journeys" 
                type="toggle" 
                value={strictMode} 
                onChange={setStrictMode} 
            />
             <SettingItem 
                icon={Moon} 
                title="Dark Theme" 
                subtitle="Always on" 
                type="toggle" 
                value={darkMode} 
                onChange={setDarkMode} 
            />
        </div>
      </div>
      
      <div className="text-center text-xs text-gray-600 pt-8">
          Chronos RPG v2.4.0 • Build 2025.11.19
      </div>
    </div>
  );
};

export default Settings;
