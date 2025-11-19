import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle, Clock, Shield, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const InfoScreen: React.FC = () => {
  const [openSection, setOpenSection] = useState<string | null>('quest');

  const sections = [
    {
      id: 'quest',
      title: 'What is a Quest?',
      content: 'A Quest is a guided path within the ZenScreen app designed to help you build healthier digital habits through a series of mindful tasks and reflections.'
    },
    {
      id: 'earn',
      title: 'How to Earn Time?',
      content: 'Complete daily quests, participate in clan challenges, and maintain your streaks to earn "Time Credits". These credits can be used to unlock access to your restricted apps.'
    },
    {
      id: 'profile',
      title: 'How do I manage my profile?',
      content: 'Visit the Avatar Station to view your neural link status. As you level up, your avatar evolves. You can customize its appearance and attributes using earned credits.'
    },
    {
      id: 'leagues',
      title: 'What are Leagues?',
      content: 'Leagues (Factions) are groups of operatives working together. Join a faction to compete in weekly protocols. High-performing factions earn exclusive rewards and bonuses.'
    },
    {
      id: 'privacy',
      title: 'Privacy Policy',
      content: 'Your data is encrypted locally. We do not sell your usage data. The neural link simulation is purely for gamification purposes.'
    }
  ];

  return (
    <div className="p-6 pb-24 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-zen-primary/10 rounded-xl border border-zen-primary/30">
            <HelpCircle size={24} className="text-zen-primary" />
        </div>
        <div>
            <h2 className="text-2xl font-bold text-zen-text-main dark:text-white">Info & FAQ</h2>
            <p className="text-xs text-zen-text-muted dark:text-gray-400 uppercase tracking-wider">System Documentation</p>
        </div>
      </div>

      <div className="relative">
        <div className="absolute inset-0 bg-zen-paper/40 dark:bg-gray-800/40 rounded-3xl border border-zen-text-muted/10 dark:border-white/5" />
        <div className="relative space-y-2 p-4">
            {sections.map((section) => (
                <div key={section.id} className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden border border-zen-text-muted/10 dark:border-white/5 hover:border-zen-primary/30 transition-colors shadow-sm">
                    <button 
                        onClick={() => setOpenSection(openSection === section.id ? null : section.id)}
                        className="w-full flex items-center justify-between p-4 text-left"
                    >
                        <span className="font-bold text-zen-text-main dark:text-gray-200 text-sm">{section.title}</span>
                        {openSection === section.id ? <ChevronUp size={16} className="text-zen-primary" /> : <ChevronDown size={16} className="text-zen-text-muted dark:text-gray-400" />}
                    </button>
                    <AnimatePresence>
                        {openSection === section.id && (
                            <motion.div 
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="px-4 pb-4"
                            >
                                <p className="text-xs text-zen-text-muted dark:text-gray-400 leading-relaxed border-t border-zen-text-muted/10 dark:border-white/5 pt-3">
                                    {section.content}
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mt-8">
          <div className="bg-zen-paper/40 dark:bg-gray-800/40 p-4 rounded-xl border border-zen-text-muted/10 dark:border-white/5 text-center space-y-2">
              <Clock className="mx-auto text-zen-primary" size={20} />
              <div className="text-[10px] text-zen-text-muted dark:text-gray-400 uppercase">Version</div>
              <div className="text-xs font-bold text-zen-text-main dark:text-white">2.4.0</div>
          </div>
          <div className="bg-zen-paper/40 dark:bg-gray-800/40 p-4 rounded-xl border border-zen-text-muted/10 dark:border-white/5 text-center space-y-2">
              <Shield className="mx-auto text-zen-secondary" size={20} />
              <div className="text-[10px] text-zen-text-muted dark:text-gray-400 uppercase">Security</div>
              <div className="text-xs font-bold text-green-500 dark:text-green-400">Secure</div>
          </div>
          <div className="bg-zen-paper/40 dark:bg-gray-800/40 p-4 rounded-xl border border-zen-text-muted/10 dark:border-white/5 text-center space-y-2">
              <Zap className="mx-auto text-yellow-500 dark:text-yellow-400" size={20} />
              <div className="text-[10px] text-zen-text-muted dark:text-gray-400 uppercase">Status</div>
              <div className="text-xs font-bold text-zen-text-main dark:text-white">Online</div>
          </div>
      </div>
    </div>
  );
};

export default InfoScreen;

