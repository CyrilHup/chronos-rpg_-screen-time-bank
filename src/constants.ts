import { SimulatedApp, Task, Avatar, CosmeticItem } from './types';

export const INITIAL_APPS: SimulatedApp[] = [
  { id: '1', name: 'Instagram', icon: 'Camera', color: 'bg-pink-600', isBlocked: true },
  { id: '2', name: 'TikTok', icon: 'Music2', color: 'bg-black', isBlocked: true },
  { id: '3', name: 'Twitter', icon: 'Twitter', color: 'bg-blue-400', isBlocked: true },
  { id: '4', name: 'YouTube', icon: 'Video', color: 'bg-red-600', isBlocked: true },
  { id: '5', name: 'Reddit', icon: 'MessageCircle', color: 'bg-orange-500', isBlocked: false },
  { id: '6', name: 'Facebook', icon: 'Facebook', color: 'bg-blue-600', isBlocked: true },
  { id: '7', name: 'Snapchat', icon: 'Ghost', color: 'bg-yellow-400', isBlocked: true },
  { id: '8', name: 'Games', icon: 'Gamepad2', color: 'bg-purple-600', isBlocked: true },
];

export const INITIAL_TASKS: Task[] = [
  { id: 't1', title: 'Deep Stretching', description: 'Full body stretch routine.', durationMinutes: 15, rewardMinutes: 15, category: 'fitness' },
  { id: 't2', title: 'Quick Walk', description: 'Walk around the block without phone.', durationMinutes: 10, rewardMinutes: 12, category: 'fitness' },
  { id: 't3', title: 'Read a Book', description: 'Read physical pages.', durationMinutes: 30, rewardMinutes: 40, category: 'focus' },
];

export const INITIAL_AVATAR: Avatar = {
  level: 1,
  experience: 0,
  evolutionStage: 1,
  name: 'Digital Novice',
  avatarUrl: undefined,
  flavorText: 'Just starting to disconnect to reconnect.',
  ownedCosmetics: [],
  equippedCosmetics: {},
};

export const COSMETIC_SHOP_ITEMS: CosmeticItem[] = [
  { id: 'c1', name: 'Neon Halo', description: 'A glowing ring of pure energy.', cost: 150, minLevel: 3, icon: 'Circle', type: 'hat' },
  { id: 'c2', name: 'Cyber Visor', description: 'Enhanced optical interface.', cost: 300, minLevel: 5, icon: 'Glasses', type: 'hat' },
  { id: 'c3', name: 'Matrix Aura', description: 'Digital rain surrounds you.', cost: 500, minLevel: 8, icon: 'Code', type: 'aura' },
  { id: 'c4', name: 'Golden Wings', description: 'Symbol of ultimate freedom.', cost: 1000, minLevel: 10, icon: 'Feather', type: 'cape' },
  { id: 'c5', name: 'Zen Garden', description: 'Peaceful background theme.', cost: 200, minLevel: 2, icon: 'Flower', type: 'background' },
  { id: 'c6', name: 'Neural Robes', description: 'Standard issue for high-level operatives.', cost: 400, minLevel: 4, icon: 'Shirt', type: 'clothes' },
  { id: 'c7', name: 'Void Cape', description: 'Absorbs digital noise.', cost: 600, minLevel: 6, icon: 'Moon', type: 'cape' },
  { id: 'c8', name: 'Cosmic Void', description: 'Stare into the abyss.', cost: 800, minLevel: 12, icon: 'Stars', type: 'background' },
  { id: 'c9', name: 'Glitch Effect', description: 'Unstable reality field.', cost: 450, minLevel: 7, icon: 'Zap', type: 'aura' },
  { id: 'c10', name: 'Samurai Helm', description: 'Ancient warrior plating.', cost: 550, minLevel: 9, icon: 'Shield', type: 'hat' },
  { id: 'c11', name: 'Solar Robes', description: 'Woven from starlight.', cost: 600, minLevel: 6, icon: 'Sun', type: 'clothes' },
  { id: 'c12', name: 'Void Robes', description: 'Darkness incarnate.', cost: 700, minLevel: 8, icon: 'Moon', type: 'clothes' },
  { id: 'c13', name: 'Cyber Tunic', description: 'High-tech fabric.', cost: 350, minLevel: 3, icon: 'Cpu', type: 'clothes' },
];

export const FAQ_ITEMS = [
    {
      question: 'What is a Journey?',
      answer: 'A Journey is a guided path within the ZenScreen app designed to help you build healthier digital habits through a series of mindful tasks and reflections.'
    },
    {
      question: 'How to Earn Time?',
      answer: 'Complete daily quests, participate in clan challenges, and maintain your streaks to earn "Minutes". These minutes can be used to unlock access to your restricted apps.'
    },
    {
      question: 'How do I manage my profile?',
      answer: 'Visit the Avatar Station to view your neural link status. As you level up, your avatar evolves. You can customize its appearance and attributes using earned credits.'
    },
    {
      question: 'What are Leagues?',
      answer: 'Leagues (Factions) are groups of operatives working together. Join a faction to compete in weekly protocols. High-performing factions earn exclusive rewards and bonuses.'
    },
    {
      question: 'Privacy Policy',
      answer: 'Your data is encrypted locally. We do not sell your usage data. The neural link simulation is purely for gamification purposes.'
    }
];

export const MOCK_CLANS = [
  { id: 'c_warriors', name: 'Digital Warriors', members: 12, isOpen: true, desc: 'Focus and discipline.', inviteCode: 'WARRIOR' },
  { id: 'c_zen', name: 'Zen Masters', members: 8, isOpen: true, desc: 'Peaceful productivity.', inviteCode: 'ZEN' },
  { id: 'c_night', name: 'Night Owls', members: 24, isOpen: false, desc: 'Late night grinding.', inviteCode: 'NIGHT' },
];
