import React, { useState } from 'react';
import { Clan, ClanMember, ClanQuest } from '../types';
import { MOCK_CLANS } from '../constants';
import { Users, Trophy, MessageSquare, User, Settings, Trash2, Shield, Bot, Search, Link as LinkIcon, ArrowLeft, X, RefreshCw, Copy, Plus, Edit2, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ClanHubProps {
  clan: Clan | null;
  onCreateClan: (name: string) => void;
  onJoinClan: (clanId: string) => void;
  onLeaveClan: () => void;
  onUpdateClan: (updates: Partial<Clan>) => void;
  currentUserId: string;
}

const ClanHub: React.FC<ClanHubProps> = ({ clan, onCreateClan, onJoinClan, onLeaveClan, onUpdateClan, currentUserId }) => {
  const [showSettings, setShowSettings] = useState(false);
  const [showCompletedQuests, setShowCompletedQuests] = useState(false);
  const [viewMode, setViewMode] = useState<'landing' | 'browse' | 'create'>('landing');
  const [joinCode, setJoinCode] = useState('');
  const [editName, setEditName] = useState('');
  const [createName, setCreateName] = useState('');
  const [showQuestForm, setShowQuestForm] = useState(false);
  const [newQuest, setNewQuest] = useState<Partial<ClanQuest>>({ title: '', description: '', target: 500, rewardMinutes: 100 });
  const [editingQuestId, setEditingQuestId] = useState<string | null>(null);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!clan) {
    if (viewMode === 'browse') {
        return (
            <div className="h-full flex flex-col p-6 animate-fade-in">
                <button 
                    onClick={() => setViewMode('landing')}
                    className="flex items-center gap-2 text-zen-text-muted dark:text-gray-400 hover:text-zen-text-main dark:hover:text-white mb-6 transition-colors w-fit"
                >
                    <ArrowLeft size={20} /> Back
                </button>

                <h2 className="text-2xl font-bold text-zen-text-main dark:text-white mb-6">Find a Clan</h2>

                <div className="space-y-6">
                    {/* Join by Code */}
                    <div className="bg-white dark:bg-gray-900 border border-zen-text-muted/10 dark:border-white/10 rounded-xl p-4 shadow-sm">
                        <h3 className="text-lg font-bold text-zen-text-main dark:text-white mb-2 flex items-center gap-2">
                            <LinkIcon size={18} className="text-zen-primary" /> Join by Link / Code
                        </h3>
                        <div className="flex gap-2">
                            <input 
                                type="text" 
                                value={joinCode}
                                onChange={(e) => setJoinCode(e.target.value)}
                                placeholder="Enter Invite Code..."
                                className="flex-1 bg-zen-text-muted/5 dark:bg-white/5 border border-zen-text-muted/10 dark:border-white/10 rounded-lg px-4 py-2 text-zen-text-main dark:text-white outline-none focus:border-zen-primary transition-colors"
                            />
                            <button 
                                onClick={() => {
                                    if (joinCode.trim()) onJoinClan(joinCode);
                                }}
                                disabled={!joinCode.trim()}
                                className="px-6 py-2 bg-zen-primary text-white font-bold rounded-lg hover:bg-zen-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Join
                            </button>
                        </div>
                    </div>

                    {/* Public Clans */}
                    <div>
                        <h3 className="text-lg font-bold text-zen-text-main dark:text-white mb-4 flex items-center gap-2">
                            <Search size={18} className="text-zen-secondary" /> Open Clans
                        </h3>
                        <div className="grid gap-4">
                            {MOCK_CLANS.filter(c => c.isOpen).map((mockClan) => (
                                <div key={mockClan.id} className="bg-white dark:bg-gray-900 border border-zen-text-muted/10 dark:border-white/10 rounded-xl p-4 flex justify-between items-center hover:bg-white/80 dark:hover:bg-gray-800 transition-colors shadow-sm">
                                    <div>
                                        <h4 className="font-bold text-zen-text-main dark:text-white text-lg">{mockClan.name}</h4>
                                        <p className="text-zen-text-muted dark:text-gray-400 text-sm">{mockClan.desc}</p>
                                        <div className="flex items-center gap-3 mt-2 text-xs text-zen-text-muted dark:text-gray-500">
                                            <span className="flex items-center gap-1"><Users size={12} /> {mockClan.members} Members</span>
                                            <span className={`px-2 py-0.5 rounded-full border ${mockClan.isOpen ? 'border-green-500/30 text-green-500' : 'border-red-500/30 text-red-500'}`}>
                                                {mockClan.isOpen ? 'OPEN' : 'INVITE ONLY'}
                                            </span>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => onJoinClan(mockClan.id)}
                                        className="px-4 py-2 bg-zen-text-muted/5 dark:bg-white/5 text-zen-text-main dark:text-white font-bold rounded-lg hover:bg-zen-text-muted/10 dark:hover:bg-white/10 border border-zen-text-muted/10 dark:border-white/10 transition-colors"
                                    >
                                        Join
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (viewMode === 'create') {
        return (
            <div className="h-full flex flex-col p-6 animate-fade-in">
                <button 
                    onClick={() => setViewMode('landing')}
                    className="flex items-center gap-2 text-zen-text-muted dark:text-gray-400 hover:text-zen-text-main dark:hover:text-white mb-6 transition-colors w-fit"
                >
                    <ArrowLeft size={20} /> Back
                </button>

                <div className="flex-1 flex flex-col items-center justify-center max-w-md mx-auto w-full space-y-6">
                    <div className="w-20 h-20 bg-white dark:bg-gray-900 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(22,163,74,0.1)] border border-zen-text-muted/10 dark:border-white/10">
                        <Plus size={40} className="text-zen-primary" />
                    </div>
                    
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-zen-text-main dark:text-white mb-2">Create a Clan</h2>
                        <p className="text-zen-text-muted dark:text-gray-400">Start your own community and lead them to productivity.</p>
                    </div>

                    <div className="w-full space-y-4">
                        <div>
                            <label className="text-sm text-zen-text-muted dark:text-gray-500 mb-1 block">Clan Name</label>
                            <input 
                                type="text" 
                                value={createName}
                                onChange={(e) => setCreateName(e.target.value)}
                                placeholder="e.g. The Focus Group"
                                className="w-full bg-zen-text-muted/5 dark:bg-white/5 border border-zen-text-muted/10 dark:border-white/10 rounded-xl px-4 py-3 text-zen-text-main dark:text-white outline-none focus:border-zen-primary transition-colors"
                                autoFocus
                            />
                        </div>
                        
                        <button 
                            onClick={() => {
                                if (createName.trim()) onCreateClan(createName);
                            }}
                            disabled={!createName.trim()}
                            className="w-full py-3 bg-zen-primary text-white font-bold rounded-xl hover:bg-zen-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg"
                        >
                            Create Clan
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
      <div className="h-full flex flex-col items-center justify-center p-6 text-center space-y-6 animate-fade-in">
        <div className="w-24 h-24 bg-white dark:bg-gray-900 rounded-full flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(22,163,74,0.1)] border border-zen-text-muted/10 dark:border-white/10">
            <Users size={48} className="text-zen-primary" />
        </div>
        <div>
            <h2 className="text-2xl font-bold text-zen-text-main dark:text-white mb-2">Join a Clan</h2>
            <p className="text-zen-text-muted dark:text-gray-400 max-w-xs mx-auto">Collaborate with others to complete quests and earn bonus time.</p>
        </div>
        <div className="w-full max-w-xs space-y-3">
            <button 
                onClick={() => setViewMode('browse')}
                className="w-full py-3 bg-zen-primary text-white font-bold rounded-xl hover:bg-zen-primary/90 transition-colors shadow-lg"
            >
                Find a Clan
            </button>
            <button 
                onClick={() => setViewMode('create')}
                className="w-full py-3 bg-white dark:bg-gray-900 border border-zen-primary/30 text-zen-primary font-bold rounded-xl hover:bg-zen-primary/10 transition-colors"
            >
                Create Clan
            </button>
        </div>
      </div>
    );
  }

  const isOwner = clan.ownerId === currentUserId;
  const isAdmin = (clan.memberList || []).find(m => m.id === currentUserId)?.role === 'admin';
  const canManageQuests = isOwner || isAdmin;

  const handleSaveQuest = () => {
      if (!newQuest.title || !newQuest.target) return;
      
      if (editingQuestId) {
          onUpdateClan({
              quests: clan.quests.map(q => q.id === editingQuestId ? { ...q, ...newQuest, id: q.id } as ClanQuest : q)
          });
          setEditingQuestId(null);
      } else {
          const quest: ClanQuest = {
              id: `q-${Date.now()}`,
              title: newQuest.title!,
              description: newQuest.description || '',
              target: Number(newQuest.target),
              progress: 0,
              rewardMinutes: Number(newQuest.rewardMinutes),
              status: 'active'
          };
          onUpdateClan({ quests: [quest, ...(clan.quests || [])] });
      }
      setShowQuestForm(false);
      setNewQuest({ title: '', description: '', target: 500, rewardMinutes: 100 });
  };

  const handleEditQuest = (quest: ClanQuest) => {
      setEditingQuestId(quest.id);
      setNewQuest(quest);
      setShowQuestForm(true);
  };

  const handleDeleteQuest = (questId: string) => {
      if (confirm('Delete this quest?')) {
          onUpdateClan({ quests: clan.quests.filter(q => q.id !== questId) });
      }
  };

  const handleAddBot = () => {
      const botId = `bot-${Date.now()}`;
      const newMember: ClanMember = {
          id: botId,
          name: `Bot-${Math.floor(Math.random() * 1000)}`,
          status: 'online',
          role: 'member',
          avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${botId}`
      };
      
      const updatedMembers = [...(clan.memberList || []), newMember];
      onUpdateClan({ 
          memberList: updatedMembers,
          members: updatedMembers.length
      });
  };

  const handleRemoveMember = (memberId: string) => {
      const updatedMembers = (clan.memberList || []).filter(m => m.id !== memberId);
      onUpdateClan({ 
          memberList: updatedMembers,
          members: updatedMembers.length
      });
  };

  const handleRoleChange = (memberId: string, newRole: 'owner' | 'admin' | 'member') => {
      let updatedMembers = [...(clan.memberList || [])];
      let updates: Partial<Clan> = {};

      if (newRole === 'owner') {
          // Demote current owner to admin
          updatedMembers = updatedMembers.map(m => 
              m.role === 'owner' ? { ...m, role: 'admin' } : m
          );
          updates.ownerId = memberId;
      }

      updatedMembers = updatedMembers.map(m => 
          m.id === memberId ? { ...m, role: newRole } : m
      );

      onUpdateClan({ ...updates, memberList: updatedMembers });
  };

  const handleSaveName = () => {
      if (editName.trim()) {
          onUpdateClan({ name: editName });
      }
  };

  return (
    <div className="p-6 pb-24 animate-fade-in space-y-6">
        {/* Clan Header */}
        <div className="bg-white dark:bg-gray-900 border border-zen-text-muted/10 dark:border-white/10 rounded-3xl p-6 relative overflow-visible shadow-sm">
            <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                <Trophy size={120} />
            </div>
            <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                        <h2 className="text-2xl font-bold text-zen-text-main dark:text-white flex items-center gap-2">
                            {clan.name}
                            {isOwner && (
                                <button 
                                    onClick={() => {
                                        setShowSettings(!showSettings);
                                        setEditName(clan.name);
                                    }} 
                                    className={`transition-colors ${showSettings ? 'text-zen-primary' : 'text-zen-text-muted dark:text-gray-400 hover:text-zen-text-main dark:hover:text-white'}`}
                                >
                                    <Settings size={16} />
                                </button>
                            )}
                        </h2>
                        <p className="text-zen-primary text-sm font-mono">{clan.members} MEMBERS • {clan.isOpen ? "OPEN" : "INVITE ONLY"}</p>
                    </div>
                    <button 
                        onClick={() => setShowCompletedQuests(true)}
                        className="bg-yellow-500/10 text-yellow-500 px-3 py-1 rounded-full text-xs font-bold border border-yellow-500/20 flex items-center gap-1 hover:bg-yellow-500/20 transition-colors"
                    >
                        <Trophy size={12} /> {clan.quests?.filter(q => q.status === 'completed').length || 0} COMPLETED
                    </button>
                </div>

                {/* Settings Panel */}
                <AnimatePresence>
                    {showSettings && isOwner && (
                        <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="mb-6 bg-zen-text-muted/5 dark:bg-white/5 rounded-xl border border-zen-text-muted/10 dark:border-white/10 overflow-hidden"
                        >
                            <div className="p-4 space-y-4">
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="text-xs font-bold text-zen-text-muted dark:text-gray-500 uppercase tracking-wider">Clan Settings</h3>
                                    <button onClick={() => setShowSettings(false)} className="text-zen-text-muted dark:text-gray-500 hover:text-zen-text-main dark:hover:text-white"><X size={14}/></button>
                                </div>

                                {/* Name Edit */}
                                <div className="space-y-1">
                                    <label className="text-xs text-zen-text-muted dark:text-gray-500">Clan Name</label>
                                    <div className="flex gap-2">
                                        <input 
                                            type="text" 
                                            value={editName} 
                                            onChange={(e) => setEditName(e.target.value)}
                                            className="flex-1 bg-white dark:bg-gray-800 border border-zen-text-muted/10 dark:border-white/10 rounded px-3 py-2 text-zen-text-main dark:text-white text-sm outline-none focus:border-zen-primary"
                                        />
                                        <button onClick={handleSaveName} className="px-3 py-2 bg-zen-primary/10 text-zen-primary rounded text-xs font-bold hover:bg-zen-primary/20">Save</button>
                                    </div>
                                </div>

                                {/* Privacy */}
                                <div className="flex items-center justify-between py-2 border-t border-zen-text-muted/10 dark:border-white/10">
                                    <div>
                                        <p className="text-sm text-zen-text-main dark:text-white font-bold">Public Clan</p>
                                        <p className="text-xs text-zen-text-muted dark:text-gray-500">Allow anyone to find and join this clan</p>
                                    </div>
                                    <button 
                                        onClick={() => onUpdateClan({ isOpen: !clan.isOpen })}
                                        className={`w-10 h-5 rounded-full relative transition-colors ${clan.isOpen ? 'bg-zen-primary' : 'bg-gray-300 dark:bg-gray-600'}`}
                                    >
                                        <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${clan.isOpen ? 'left-6' : 'left-1'}`} />
                                    </button>
                                </div>

                                {/* Invite Code */}
                                <div className="space-y-1 pt-2 border-t border-zen-text-muted/10 dark:border-white/10">
                                    <label className="text-xs text-zen-text-muted dark:text-gray-500">Invite Link</label>
                                    <div className="flex items-center gap-2 bg-white dark:bg-gray-800 p-2 rounded border border-zen-text-muted/10 dark:border-white/10">
                                        <code className="flex-1 text-xs text-zen-primary font-mono">chronos-rpg.app/join/{clan.inviteCode}</code>
                                        <button className="p-1.5 hover:bg-zen-text-muted/10 dark:hover:bg-white/10 rounded text-zen-text-muted dark:text-gray-400 hover:text-zen-text-main dark:hover:text-white"><Copy size={14}/></button>
                                        <button className="p-1.5 hover:bg-zen-text-muted/10 dark:hover:bg-white/10 rounded text-zen-text-muted dark:text-gray-400 hover:text-zen-text-main dark:hover:text-white"><RefreshCw size={14}/></button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
                
                {/* Clan Quests Summary Removed */}
                
                {isOwner && (
                    <div className="flex gap-2 mt-4">
                        <button 
                            onClick={handleAddBot}
                            className="flex items-center gap-2 px-3 py-1.5 bg-purple-500/10 text-purple-400 rounded-lg text-xs font-bold hover:bg-purple-500/20 transition-colors"
                        >
                            <Bot size={14} /> Add Bot
                        </button>
                    </div>
                )}
            </div>
        </div>

        {/* Members List */}
        <div className="bg-white dark:bg-gray-900 border border-zen-text-muted/10 dark:border-white/10 rounded-2xl p-6 overflow-visible shadow-sm">
          <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-zen-text-main dark:text-white flex items-center gap-2">
                <Users size={18} className="text-zen-secondary" /> Members
              </h3>
          </div>
          
          <div className="space-y-4">
            {(clan.memberList || []).map((member) => (
              <div key={member.id} className="flex items-center justify-between p-3 bg-zen-text-muted/5 dark:bg-white/5 rounded-xl border border-zen-text-muted/10 dark:border-white/10 group relative">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden border border-zen-text-muted/10 dark:border-white/10 relative">
                    {member.avatarUrl ? (
                        <img src={member.avatarUrl} alt={member.name} className="w-full h-full object-cover" />
                    ) : (
                        <User size={20} className="text-zen-text-muted dark:text-gray-400" />
                    )}
                    {member.role === 'owner' && (
                        <div className="absolute bottom-0 right-0 bg-yellow-500 rounded-full p-0.5 border border-white dark:border-gray-900">
                            <Shield size={8} className="text-white dark:text-gray-900" fill="currentColor" />
                        </div>
                    )}
                  </div>
                  <div>
                    <div className="font-bold text-zen-text-main dark:text-white text-sm flex items-center gap-2">
                        {member.name}
                        {member.role === 'owner' && <span className="text-[10px] bg-yellow-500/10 text-yellow-500 px-1.5 rounded border border-yellow-500/20">OWNER</span>}
                        {member.role === 'admin' && <span className="text-[10px] bg-blue-500/10 text-blue-500 px-1.5 rounded border border-blue-500/20">MOD</span>}
                        {member.role === 'member' && <span className="text-[10px] bg-gray-500/10 text-zen-text-muted dark:text-gray-400 px-1.5 rounded border border-gray-500/20">MEMBER</span>}
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-zen-text-muted dark:text-gray-500 uppercase tracking-wider">
                        <div className={`w-1.5 h-1.5 rounded-full ${
                            member.status === 'online' ? 'bg-green-500' : 
                            member.status === 'in-quest' ? 'bg-zen-primary animate-pulse' : 
                            'bg-gray-400'
                        }`} />
                        {member.status}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                    {isOwner && member.id !== currentUserId && (
                        <>
                            {/* Role Switcher */}
                            <div className="relative group/role">
                                <button className="p-1.5 text-zen-text-muted dark:text-gray-400 hover:text-zen-text-main dark:hover:text-white rounded hover:bg-zen-text-muted/10 dark:hover:bg-white/10 transition-colors">
                                    <Shield size={14} />
                                </button>
                                <div className="absolute right-0 top-full mt-1 w-32 bg-white dark:bg-gray-800 border border-zen-text-muted/10 dark:border-white/10 rounded-lg shadow-xl p-1 hidden group-hover/role:block z-50">
                                    <button onClick={() => handleRoleChange(member.id, 'member')} className="w-full text-left px-2 py-1 text-xs text-zen-text-muted dark:text-gray-300 hover:bg-zen-text-muted/5 dark:hover:bg-white/5 rounded">Member</button>
                                    <button onClick={() => handleRoleChange(member.id, 'admin')} className="w-full text-left px-2 py-1 text-xs text-blue-500 hover:bg-zen-text-muted/5 dark:hover:bg-white/5 rounded">Admin</button>
                                    <button onClick={() => handleRoleChange(member.id, 'owner')} className="w-full text-left px-2 py-1 text-xs text-yellow-500 hover:bg-zen-text-muted/5 dark:hover:bg-white/5 rounded">Owner</button>
                                </div>
                            </div>

                            <button 
                                onClick={() => handleRemoveMember(member.id)}
                                className="p-1.5 text-zen-text-muted dark:text-gray-400 hover:text-red-500 transition-colors"
                                title="Remove Member"
                            >
                                <Trash2 size={14} />
                            </button>
                        </>
                    )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quests & Feed */}
        <div className="bg-white dark:bg-gray-900 border border-zen-text-muted/10 dark:border-white/10 rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-zen-text-main dark:text-white flex items-center gap-2">
                <Trophy size={18} className="text-zen-secondary" /> Clan Quests
              </h3>
              {canManageQuests && (
                  <button 
                      onClick={() => setShowQuestForm(true)}
                      className="px-3 py-1.5 bg-zen-primary text-white rounded-lg text-xs font-bold hover:bg-zen-primary/90 transition-colors"
                  >
                      <Plus size={14} className="mr-1" /> New Quest
                  </button>
              )}
          </div>

          {/* New Quest Form */}
          <AnimatePresence>
            {showQuestForm && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="mb-4 p-4 bg-zen-text-muted/5 dark:bg-white/5 rounded-xl border border-zen-text-muted/10 dark:border-white/10"
              >
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-sm font-bold text-zen-text-main dark:text-white">Create New Quest</h4>
                  <button onClick={() => setShowQuestForm(false)} className="text-zen-text-muted dark:text-gray-500 hover:text-zen-text-main dark:hover:text-white">
                    <X size={14} />
                  </button>
                </div>
                <div className="space-y-2">
                  <div>
                    <label className="text-xs text-zen-text-muted dark:text-gray-500">Quest Title</label>
                    <input 
                      type="text" 
                      value={newQuest.title} 
                      onChange={(e) => setNewQuest({ ...newQuest, title: e.target.value })}
                      className="w-full bg-white dark:bg-gray-800 border border-zen-text-muted/10 dark:border-white/10 rounded px-3 py-2 text-zen-text-main dark:text-white text-sm outline-none focus:border-zen-primary"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-zen-text-muted dark:text-gray-500">Description</label>
                    <textarea 
                      value={newQuest.description} 
                      onChange={(e) => setNewQuest({ ...newQuest, description: e.target.value })}
                      className="w-full bg-white dark:bg-gray-800 border border-zen-text-muted/10 dark:border-white/10 rounded px-3 py-2 text-zen-text-main dark:text-white text-sm outline-none focus:border-zen-primary resize-none h-20"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs text-zen-text-muted dark:text-gray-500">Target (min)</label>
                      <input 
                        type="number" 
                        value={newQuest.target} 
                        onChange={(e) => setNewQuest({ ...newQuest, target: Number(e.target.value) })}
                        className="w-full bg-white dark:bg-gray-800 border border-zen-text-muted/10 dark:border-white/10 rounded px-3 py-2 text-zen-text-main dark:text-white text-sm outline-none focus:border-zen-primary"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-zen-text-muted dark:text-gray-500">Reward (min)</label>
                      <input 
                        type="number" 
                        value={newQuest.rewardMinutes} 
                        onChange={(e) => setNewQuest({ ...newQuest, rewardMinutes: Number(e.target.value) })}
                        className="w-full bg-white dark:bg-gray-800 border border-zen-text-muted/10 dark:border-white/10 rounded px-3 py-2 text-zen-text-main dark:text-white text-sm outline-none focus:border-zen-primary"
                      />
                    </div>
                  </div>
                  <button 
                    onClick={handleSaveQuest}
                    className="w-full py-2 bg-zen-primary text-white rounded-lg font-bold hover:bg-zen-primary/90 transition-colors"
                  >
                    {editingQuestId ? 'Save Changes' : 'Create Quest'}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Quests List */}
          <div className="space-y-4">
            {(clan.quests || []).filter(q => q.status !== 'completed').map((quest) => (
              <div key={quest.id} className="p-4 bg-zen-text-muted/5 dark:bg-white/5 rounded-xl border border-zen-text-muted/10 dark:border-white/10">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-bold text-zen-text-main dark:text-white text-lg">{quest.title}</h4>
                  {canManageQuests && (
                    <div className="flex gap-2">
                        <button 
                          onClick={() => handleEditQuest(quest)}
                          className="text-zen-text-muted dark:text-gray-400 hover:text-zen-text-main dark:hover:text-white transition-colors"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDeleteQuest(quest.id)}
                          className="text-red-500 hover:text-red-400 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                    </div>
                  )}
                </div>
                <p className="text-zen-text-muted dark:text-gray-400 text-sm mb-2">{quest.description}</p>
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="px-3 py-1 rounded-full bg-white dark:bg-black/30 text-zen-text-main dark:text-white border border-zen-text-muted/10 dark:border-white/10">{quest.status}</span>
                  <span className="px-3 py-1 rounded-full bg-white dark:bg-black/30 text-zen-text-main dark:text-white border border-zen-text-muted/10 dark:border-white/10">Target: {quest.target} min</span>
                  <span className="px-3 py-1 rounded-full bg-white dark:bg-black/30 text-zen-text-main dark:text-white border border-zen-text-muted/10 dark:border-white/10">Reward: {quest.rewardMinutes} min</span>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <div className="flex-1">
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div 
                          className="h-full bg-gradient-to-r from-zen-primary to-zen-secondary" 
                          style={{ width: `${(quest.progress / quest.target) * 100}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-xs text-zen-text-muted dark:text-gray-500">{quest.progress}/{quest.target} min</span>
                </div>
              </div>
            ))}
          </div>

          {/* Feed */}
          <div className="mt-6">
            <h3 className="font-bold text-zen-text-main dark:text-white mb-4 flex items-center gap-2">
              <MessageSquare size={18} className="text-zen-secondary" /> Clan Activity
            </h3>
            <div className="space-y-4 relative">
              <div className="absolute left-2 top-2 bottom-2 w-px bg-zen-text-muted/10 dark:bg-white/5" />
              {(clan.feed || []).map((item) => (
                <div key={item.id} className="relative pl-6">
                    <div className="absolute left-[5px] top-1.5 w-1.5 h-1.5 rounded-full bg-zen-secondary" />
                    <p className="text-sm text-zen-text-muted dark:text-gray-300">
                      <span className="font-bold text-zen-text-main dark:text-white">{item.memberName}</span> {item.action}
                    </p>
                    <span className="text-xs text-zen-text-muted dark:text-gray-600">{item.timestamp}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <button onClick={() => setShowLeaveConfirm(true)} className="w-full py-3 text-red-500 text-sm font-bold hover:bg-red-500/10 rounded-xl transition-colors">
            Leave Clan
        </button>
        
        {isOwner && (
             <button 
                onClick={() => setShowDeleteConfirm(true)}
                className="w-full py-3 text-red-500/50 text-xs font-bold hover:text-red-500 hover:bg-red-500/5 rounded-xl transition-colors"
            >
                Delete Clan
            </button>
        )}

        <AnimatePresence>
            {showLeaveConfirm && (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-zen-background/90 dark:bg-black/90 backdrop-blur-sm p-4"
                >
                    <motion.div 
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="w-full max-w-sm bg-white dark:bg-gray-900 border border-zen-text-muted/10 dark:border-white/10 rounded-3xl overflow-hidden shadow-2xl"
                    >
                        <div className="p-6 text-center space-y-4">
                            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto text-red-500">
                                <AlertTriangle size={32} />
                            </div>
                            
                            <div>
                                <h3 className="text-xl font-bold text-zen-text-main dark:text-white mb-2">Leave Clan?</h3>
                                <p className="text-zen-text-muted dark:text-gray-400 text-sm">
                                    Are you sure you want to leave <span className="text-zen-text-main dark:text-white font-bold">{clan.name}</span>? 
                                    You will lose access to clan quests and rewards.
                                </p>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button 
                                    onClick={() => setShowLeaveConfirm(false)}
                                    className="flex-1 py-3 bg-zen-text-muted/5 dark:bg-white/5 text-zen-text-main dark:text-white font-bold rounded-xl hover:bg-zen-text-muted/10 dark:hover:bg-white/10 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={() => {
                                        onLeaveClan();
                                        setShowLeaveConfirm(false);
                                    }}
                                    className="flex-1 py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-400 transition-colors"
                                >
                                    Leave
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>

        <AnimatePresence>
            {showDeleteConfirm && (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-zen-background/90 dark:bg-black/90 backdrop-blur-sm p-4"
                >
                    <motion.div 
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="w-full max-w-sm bg-white dark:bg-gray-900 border border-zen-text-muted/10 dark:border-white/10 rounded-3xl overflow-hidden shadow-2xl"
                    >
                        <div className="p-6 text-center space-y-4">
                            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto text-red-500">
                                <Trash2 size={32} />
                            </div>
                            
                            <div>
                                <h3 className="text-xl font-bold text-zen-text-main dark:text-white mb-2">Delete Clan?</h3>
                                <p className="text-zen-text-muted dark:text-gray-400 text-sm">
                                    Are you sure you want to delete <span className="text-zen-text-main dark:text-white font-bold">{clan.name}</span>? 
                                    This action cannot be undone and all data will be lost.
                                </p>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button 
                                    onClick={() => setShowDeleteConfirm(false)}
                                    className="flex-1 py-3 bg-zen-text-muted/5 dark:bg-white/5 text-zen-text-main dark:text-white font-bold rounded-xl hover:bg-zen-text-muted/10 dark:hover:bg-white/10 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={() => {
                                        onLeaveClan();
                                        setShowDeleteConfirm(false);
                                    }}
                                    className="flex-1 py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-400 transition-colors"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>

        <AnimatePresence>
            {showCompletedQuests && (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-zen-background/90 dark:bg-black/90 backdrop-blur-sm p-4"
                >
                    <motion.div 
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="w-full max-w-md bg-white dark:bg-gray-900 border border-zen-text-muted/10 dark:border-white/10 rounded-3xl overflow-hidden shadow-2xl max-h-[80vh] flex flex-col"
                    >
                        <div className="p-6 border-b border-zen-text-muted/5 dark:border-white/5 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-zen-text-main dark:text-white flex items-center gap-2">
                                <Trophy size={20} className="text-yellow-500" /> Completed Quests
                            </h3>
                            <button onClick={() => setShowCompletedQuests(false)} className="text-zen-text-muted dark:text-gray-500 hover:text-zen-text-main dark:hover:text-white">
                                <X size={20} />
                            </button>
                        </div>
                        
                        <div className="p-6 overflow-y-auto space-y-4">
                            {(clan.quests || []).filter(q => q.status === 'completed').length === 0 ? (
                                <p className="text-center text-zen-text-muted dark:text-gray-500 py-8">No completed quests yet.</p>
                            ) : (
                                (clan.quests || []).filter(q => q.status === 'completed').map(quest => (
                                    <div key={quest.id} className="p-4 bg-yellow-500/5 rounded-xl border border-yellow-500/10">
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="font-bold text-zen-text-main dark:text-white">{quest.title}</h4>
                                            <span className="text-xs font-bold text-yellow-500 bg-yellow-500/10 px-2 py-1 rounded border border-yellow-500/20">COMPLETED</span>
                                        </div>
                                        <p className="text-zen-text-muted dark:text-gray-400 text-sm mb-3">{quest.description}</p>
                                        <div className="flex gap-3 text-xs text-zen-text-muted dark:text-gray-500">
                                            <span>Target: {quest.target} min</span>
                                            <span className="text-yellow-500">Reward: {quest.rewardMinutes} min</span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    </div>
  );
};

export default ClanHub;
