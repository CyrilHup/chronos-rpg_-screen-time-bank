import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { Session } from '@supabase/supabase-js';
import Auth from './components/Auth';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import TaskCenter from './components/TaskCenter';
import AvatarStation from './components/AvatarStation';
import Profile from './components/Profile';
import ClanHub from './components/ClanHub';
import TimeBankModal from './components/TimeBankModal';
import ActiveSession from './components/ActiveSession';

import { AppView, UserState, Task, Clan, Avatar, SimulatedApp, QuestHistoryItem, ClanQuest, ClanFeedItem, ClanMember } from './types';
import { INITIAL_APPS, INITIAL_TASKS, INITIAL_AVATAR, MOCK_CLANS, INITIAL_QUESTS } from './constants';
import InfoFAQ from './components/InfoFAQ';
import Notification from './components/Notification';
import Settings from './components/Settings';
import { AnimatePresence } from 'framer-motion';

const App = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loadingSession, setLoadingSession] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoadingSession(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session?.user) {
      const fetchProfile = async () => {
        const { data, error } = await supabase
          .from('profiles')
          .select('game_state')
          .eq('id', session.user.id)
          .single();

        if (error) {
          console.error('Error fetching profile:', error);
        } else if (data && data.game_state && Object.keys(data.game_state).length > 0) {
          // Merge with default state to ensure new fields are present
          setState(prev => ({ ...prev, ...data.game_state }));
        }
      };
      fetchProfile();
    }
  }, [session]);

  // Save state to Supabase when it changes (debounced 2s)
  useEffect(() => {
    if (!session?.user) return;

    const saveState = setTimeout(async () => {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          game_state: state,
          updated_at: new Date().toISOString()
        })
        .eq('id', session.user.id);

      if (error) {
        console.error('Error saving state:', error);
      }
    }, 2000);

    return () => clearTimeout(saveState);
  }, [state, session]);

  const [view, setView] = useState<AppView>(AppView.DASHBOARD);
  const [showProfile, setShowProfile] = useState(false);
  const [state, setState] = useState<UserState>({
    timeBank: 120, // Initial balance
    apps: INITIAL_APPS,
    activeTasks: INITIAL_TASKS,
    avatar: INITIAL_AVATAR,
    clan: null, // Start with no clan
    lifetimeEarned: 450,
    activeSession: null,
    selectedApp: null,
    quests: INITIAL_QUESTS,
    history: [],
    activeQuest: null,
    activeQuestTaskIndex: 0
  });

  const [notificationQueue, setNotificationQueue] = useState<string[]>([]);
  const [currentNotification, setCurrentNotification] = useState<{ message: string; visible: boolean }>({ message: '', visible: false });
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    }
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const showNotification = (message: string) => {
    setNotificationQueue(prev => [...prev, message]);
  };

  const handleCloseNotification = () => {
    setCurrentNotification(prev => ({ ...prev, visible: false }));
    // Small delay to allow animation to finish before showing next
    setTimeout(() => {
        setNotificationQueue(prev => prev.slice(1));
    }, 300); 
  };

  useEffect(() => {
      if (notificationQueue.length > 0 && !currentNotification.visible) {
          setCurrentNotification({ message: notificationQueue[0], visible: true });
      }
  }, [notificationQueue]); // Removed currentNotification.visible to prevent double-fire loop

  // handleAppClick removed as it is unused in Dashboard

  const handleSpendMinutes = (minutes: number) => {
    const cost = minutes;
    if (state.timeBank >= cost && state.selectedApp) {
      setState(prev => ({
        ...prev,
        timeBank: prev.timeBank - cost,
        selectedApp: null,
        activeSession: {
          appId: state.selectedApp!.id,
          startTime: Date.now(),
          durationMinutes: minutes
        }
      }));
    }
  };

  const handleQuickTask = (task: Task) => {
    setState(prev => ({
        ...prev,
        activeTasks: [...prev.activeTasks, task],
        selectedApp: null
    }));
    setView(AppView.TASKS);
  };

  const handleCompleteTask = (task: Task) => {
    let clanRewardMessage = '';
    
    // Cap reward at 1,000,000 minutes to prevent bugs
    const actualReward = Math.min(task.rewardMinutes, 1000000);
    if (task.rewardMinutes > 1000000) {
        showNotification(`Reward capped at 1,000,000 minutes.`);
    }

    // 1. Calculate Clan Updates based on current state
    let newClan = state.clan;
    let additionalXp = 0;

    if (newClan) {
        const updatedQuests = newClan.quests.map(quest => {
            if (quest.status === 'active') {
                const newProgress = quest.progress + actualReward;
                const isJustCompleted = newProgress >= quest.target && quest.progress < quest.target;
                
                if (isJustCompleted) {
                    clanRewardMessage = `Clan Quest "${quest.title}" Completed! +${quest.rewardMinutes} Minutes`;
                    additionalXp += quest.rewardMinutes;
                }

                return {
                    ...quest,
                    progress: newProgress,
                    status: (isJustCompleted ? 'completed' : quest.status) as 'active' | 'completed'
                };
            }
            return quest;
        });
        
        // Add to feed
        const newFeedItem: ClanFeedItem = {
            id: `f-${Date.now()}`,
            memberId: 'user-1',
            memberName: state.avatar.name,
            action: `earned ${actualReward}m`,
            timestamp: 'Just now',
            avatarUrl: state.avatar.avatarUrl
        };

        newClan = {
            ...newClan,
            quests: updatedQuests,
            feed: [newFeedItem, ...(newClan.feed || [])].slice(0, 20)
        };
    }

    // 2. Calculate Level Up Logic
    let currentLevel = state.avatar.level;
    let currentExperience = state.avatar.experience + actualReward + additionalXp;
    let levelsGained = 0;

    while (true) {
        const threshold = currentLevel * 100;
        if (currentExperience >= threshold) {
            currentExperience -= threshold;
            currentLevel++;
            levelsGained++;
        } else {
            break;
        }
    }

    let newEvolutionStage = state.avatar.evolutionStage;
    if (currentLevel >= 20) newEvolutionStage = 5;
    else if (currentLevel >= 15) newEvolutionStage = 4;
    else if (currentLevel >= 10) newEvolutionStage = 3;
    else if (currentLevel >= 5) newEvolutionStage = 2;

    // 3. Notifications
    showNotification(`Congrats! You finished a quest and won ${actualReward} minutes.`);
    if (clanRewardMessage) {
        showNotification(clanRewardMessage);
    }
    
    if (levelsGained === 1) {
        showNotification("Level Up! Evolution Progressed.");
    } else if (levelsGained > 1) {
        showNotification(`Level Up! You gained ${levelsGained} levels!`);
    }

    // 4. Update State
    const historyItem: QuestHistoryItem = {
        id: `h-${Date.now()}`,
        taskId: task.id,
        taskTitle: task.title,
        completedAt: Date.now(),
        rewardMinutes: actualReward
    };

    setState(prev => ({
        ...prev,
        timeBank: prev.timeBank + actualReward + additionalXp,
        lifetimeEarned: prev.lifetimeEarned + actualReward + additionalXp,
        // Keep tasks active so they can be repeated
        activeTasks: prev.activeTasks,
        history: [...prev.history, historyItem],
        avatar: {
            ...prev.avatar,
            level: currentLevel,
            experience: currentExperience,
            evolutionStage: newEvolutionStage
        },
        clan: newClan
    }));
    
    setView(AppView.DASHBOARD);
  };

  const handlePurchaseCosmetic = (item: any) => {
      if (state.timeBank >= item.cost && state.avatar.level >= item.minLevel) {
          setState(prev => ({
              ...prev,
              timeBank: prev.timeBank - item.cost,
              avatar: {
                  ...prev.avatar,
                  ownedCosmetics: [...prev.avatar.ownedCosmetics, item.id]
              }
          }));
          showNotification(`Purchased ${item.name}!`);
      } else {
          showNotification(`Cannot purchase ${item.name}. Check funds or level.`);
      }
  };

  const handleEquipCosmetic = (item: { type: string; id: string | null }) => {
      setState(prev => {
          const newEquipped = { ...prev.avatar.equippedCosmetics };
          if (item.id === null) {
              delete newEquipped[item.type];
          } else {
              newEquipped[item.type] = item.id;
          }
          
          return {
              ...prev,
              avatar: {
                  ...prev.avatar,
                  equippedCosmetics: newEquipped
              }
          };
      });
  };

  const handleCheatXP = () => {
      setState(prev => {
          const nextLevelThreshold = prev.avatar.level * 100;
          const xpNeeded = nextLevelThreshold - prev.avatar.experience;
          
          // Grant exactly enough to level up
          const newExperience = prev.avatar.experience + xpNeeded;
          
          let newLevel = prev.avatar.level + 1;
          let finalExperience = 0; // Reset to 0 for the new level
          let newEvolutionStage = prev.avatar.evolutionStage;

          // Evolution Logic
          if (newLevel >= 20) newEvolutionStage = 5;
          else if (newLevel >= 15) newEvolutionStage = 4;
          else if (newLevel >= 10) newEvolutionStage = 3;
          else if (newLevel >= 5) newEvolutionStage = 2;

          return {
              ...prev,
              timeBank: prev.timeBank + xpNeeded,
              lifetimeEarned: prev.lifetimeEarned + xpNeeded,
              avatar: {
                  ...prev.avatar,
                  level: newLevel,
                  experience: finalExperience,
                  evolutionStage: newEvolutionStage
              }
          };
      });
      showNotification("Level Up! Evolution Progressed.");
  };

  const handleUpdateAvatar = (newAvatar: Avatar) => {
      setState(prev => ({ ...prev, avatar: newAvatar }));
  };

  const handleUpdateApp = (appId: string, updates: Partial<SimulatedApp>) => {
      setState(prev => ({
          ...prev,
          apps: prev.apps.map(app => app.id === appId ? { ...app, ...updates } : app)
      }));
  };

  const handleCreateClan = (name: string) => {
      const newClan: Clan = {
          id: `c-${Date.now()}`,
          name,
          ownerId: 'user-1', // Assuming current user is user-1
          members: 1,
          memberList: [{
              id: 'user-1',
              name: state.avatar.name,
              avatarUrl: state.avatar.avatarUrl,
              status: 'online',
              role: 'owner'
          }],
          feed: [],
          quests: [{
              id: `q-${Date.now()}`,
              title: 'Initiation Protocol',
              description: 'Collectively earn 500 minutes.',
              target: 500,
              progress: 0,
              rewardMinutes: 100,
              status: 'active'
          }],
          userContribution: 0,
          isOpen: false,
          inviteCode: `INV-${Math.floor(Math.random() * 10000)}`
      };
      setState(prev => ({ ...prev, clan: newClan }));
  };

  const handleJoinClan = (clanId: string) => {
      const selectedClan = MOCK_CLANS.find(c => c.id === clanId);
      
      let clanName = selectedClan ? selectedClan.name : 'Public Clan';
      let clanDesc = selectedClan ? selectedClan.desc : 'Community Challenge';
      let memberCount = selectedClan ? selectedClan.members : 42;
      
      const mockOwner: ClanMember = {
          id: 'owner-bot',
          name: 'Clan Leader',
          status: 'online',
          role: 'owner',
          avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=owner'
      };

      const newMember: ClanMember = {
          id: 'user-1',
          name: state.avatar.name,
          status: 'online',
          role: 'member',
          avatarUrl: state.avatar.avatarUrl
      };

      // Generate mock members to fill the list
      const mockMembers: ClanMember[] = Array.from({ length: memberCount }).map((_, i) => ({
          id: `member-bot-${i}`,
          name: `Member ${i + 1}`,
          status: Math.random() > 0.5 ? 'online' : 'offline',
          role: 'member',
          avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=member-${i}`
      }));

      // Replace first mock member with owner if needed, or just prepend
      const fullMemberList = [mockOwner, ...mockMembers.slice(1), newMember];

      const newClan: Clan = {
          id: clanId,
          name: clanName,
          ownerId: 'owner-bot',
          members: memberCount + 1, // Add current user
          memberList: fullMemberList,
          feed: [],
          quests: [{
              id: 'q-weekly',
              title: 'Weekly Challenge',
              description: clanDesc,
              target: 5000,
              progress: 1250,
              rewardMinutes: 500,
              status: 'active'
          }],
          userContribution: 0,
          isOpen: true,
          inviteCode: selectedClan ? selectedClan.inviteCode : 'PUBLIC'
      };
      setState(prev => ({ ...prev, clan: newClan }));
  };

  const handleUpdateClan = (updates: Partial<Clan>) => {
      if (!state.clan) return;
      setState(prev => ({
          ...prev,
          clan: { ...prev.clan!, ...updates }
      }));
  };

  const handleUnlockApp = (appId: string, minutes: number) => {
    if (state.timeBank >= minutes) {
      setState(prev => ({
        ...prev,
        timeBank: prev.timeBank - minutes,
        activeSession: {
          appId: appId,
          startTime: Date.now(),
          durationMinutes: minutes
        }
      }));
    }
  };

  const handleStartQuest = (quest: any) => {
      // For now, just add tasks to active tasks and switch view
      setState(prev => ({
          ...prev,
          activeTasks: [...prev.activeTasks, ...quest.tasks]
      }));
      setView(AppView.TASKS);
  };

  const handleLeaveClan = () => {
      if (state.clan && state.clan.ownerId === 'user-1') {
          // Logic for ownership transfer if user is owner
          const remainingMembers = (state.clan.memberList || []).filter(m => m.id !== 'user-1');
          
          if (remainingMembers.length > 0) {
              // Find highest ranked member
              const newOwner = remainingMembers.find(m => m.role === 'admin') || remainingMembers[0];
              console.log(`Transferring ownership to ${newOwner.name}`);
              // In a real backend, we would update the clan here.
              // Since this is local state and we are leaving, the clan is removed from our view.
          } else {
              console.log("Clan deleted as no members remain.");
          }
      }
      setState(prev => ({ ...prev, clan: null }));
  };
  
  const handleEndSession = () => {
    setState(prev => ({ ...prev, activeSession: null }));
  };

  const handleResetProgress = () => {
      setState({
        timeBank: 120,
        apps: INITIAL_APPS,
        activeTasks: INITIAL_TASKS,
        avatar: INITIAL_AVATAR,
        clan: null,
        lifetimeEarned: 0,
        activeSession: null,
        selectedApp: null,
        quests: INITIAL_QUESTS,
        history: [],
        activeQuest: null,
        activeQuestTaskIndex: 0
      });
      showNotification("Progress has been reset.");
  };

  const renderView = () => {
    if (state.activeSession) {
      const activeApp = state.apps.find(a => a.id === state.activeSession?.appId);
      if (activeApp) {
        return (
          <ActiveSession 
            app={activeApp} 
            durationMinutes={state.activeSession.durationMinutes}
            onEndSession={handleEndSession} 
          />
        );
      }
    }

    switch (view) {
      case AppView.DASHBOARD:
        return (
            <Dashboard 
                timeBank={state.timeBank} 
                avatar={state.avatar}
                onStartQuest={() => setView(AppView.TASKS)}
            />
        );
      case AppView.TASKS:
        return (
            <TaskCenter 
                tasks={state.activeTasks} 
                history={state.history}
                onCompleteTask={handleCompleteTask} 
                setTasks={(tasks) => setState(prev => ({...prev, activeTasks: tasks}))} 
            />
        );
      case AppView.AVATAR:
        return (
            <AvatarStation 
                avatar={state.avatar} 
                timeBank={state.timeBank}
                onPurchaseCosmetic={handlePurchaseCosmetic}
                onEquipCosmetic={handleEquipCosmetic}
                onCheatXP={handleCheatXP}
            />
        );
      case AppView.CLAN:
        return (
            <ClanHub 
                clan={state.clan} 
                onCreateClan={handleCreateClan}
                onJoinClan={handleJoinClan}
                onLeaveClan={handleLeaveClan}
                onUpdateClan={handleUpdateClan}
                currentUserId="user-1"
            />
        );
      case AppView.SETTINGS:
        return (
            <Settings 
                apps={state.apps}
                onUpdateApp={handleUpdateApp}
                timeBank={state.timeBank}
                tasks={state.activeTasks}
                onUnlockApp={handleUnlockApp}
                onStartTask={handleQuickTask}
                onManageQuests={() => setView(AppView.TASKS)}
                theme={theme}
                toggleTheme={toggleTheme}
            />
        );

      case AppView.FAQ:
        return <InfoFAQ onBack={() => setView(AppView.DASHBOARD)} />;
      default:

        return (
            <Dashboard 
                timeBank={state.timeBank} 
                avatar={state.avatar}
                onStartQuest={() => setView(AppView.TASKS)}
            />
        );
    }
  };

  if (loadingSession) {
    return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">Loading Realm...</div>;
  }

  if (!session) {
    return <Auth />;
  }

  return (
    <Layout 
      currentView={view} 
      onChangeView={setView}
      onOpenProfile={() => setShowProfile(true)}
      avatar={state.avatar}
    >
      {renderView()}
      
      <AnimatePresence>
        {showProfile && (
            <Profile 
                avatar={state.avatar}
                lifetimeEarned={state.lifetimeEarned}
                questsCompleted={state.history.length}
                onUpdateAvatar={handleUpdateAvatar}
                onClose={() => setShowProfile(false)}
                onResetProgress={handleResetProgress}
                onOpenSettings={() => {
                    setShowProfile(false);
                    setView(AppView.SETTINGS);
                }}
                onOpenInfo={() => {
                    setShowProfile(false);
                    setView(AppView.FAQ);
                }}
            />
        )}
      </AnimatePresence>

      {state.selectedApp && (
        <TimeBankModal 
            app={state.selectedApp}
            balance={state.timeBank}
            onClose={() => setState(prev => ({ ...prev, selectedApp: null }))}
            onSpend={handleSpendMinutes}
            onQuickTask={handleQuickTask}
        />
      )}
      <Notification 
        message={currentNotification.message} 
        isVisible={currentNotification.visible} 
        onClose={handleCloseNotification} 
      />
    </Layout>
  );
};

export default App;