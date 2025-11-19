export enum AppView {
  DASHBOARD = 'DASHBOARD',
  TASKS = 'TASKS',
  AVATAR = 'AVATAR',
  CLAN = 'CLAN',
  SETTINGS = 'SETTINGS',
  ACTIVE_SESSION = 'ACTIVE_SESSION',
  JOURNEY_TIMER = 'JOURNEY_TIMER',
  FAQ = 'FAQ'
}

export interface SimulatedApp {
  id: string;
  name: string;
  icon: string; // Icon name from Lucide or URL
  color: string;
  isBlocked: boolean;
}

export enum TaskStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED'
}

export interface Task {
  id: string;
  title: string;
  description: string;
  durationMinutes: number;
  rewardMinutes: number;
  isCustom?: boolean;
  isAiGenerated?: boolean;
  status?: TaskStatus;
  category?: 'wind-down' | 'focus' | 'fitness' | 'general';
}

export interface Journey {
  id: string;
  title: string;
  description: string;
  totalDuration: number;
  tasks: Task[];
}

export interface JourneyHistoryItem {
  id: string;
  taskId: string;
  taskTitle: string;
  rewardMinutes: number;
  completedAt: number; // Timestamp
}

export interface Avatar {
  level: number;
  experience: number;
  evolutionStage: number; // 1, 2, 3
  name: string;
  avatarUrl?: string; // URL for the profile photo
  flavorText: string;
  ownedCosmetics: string[];
  equippedCosmetics: Record<string, string>;
}

export interface ClanMember {
  id: string;
  name: string;
  avatarUrl?: string;
  status: 'online' | 'offline' | 'in-journey' | 'done-today';
  lastActivity?: string;
  role: 'owner' | 'admin' | 'member';
}

export interface ClanFeedItem {
  id: string;
  memberId: string;
  memberName: string;
  action: string;
  timestamp: string;
  avatarUrl?: string;
}

export interface Clan {
  id: string;
  name: string;
  ownerId: string;
  members: number;
  memberList?: ClanMember[];
  feed?: ClanFeedItem[];
  quests: ClanQuest[];
  userContribution: number;
  isOpen: boolean;
  inviteCode?: string;
}

export interface ClanQuest {
  id: string;
  title: string;
  description: string;
  target: number;
  progress: number;
  rewardMinutes: number;
  rewardBadge?: string;
  status: 'active' | 'completed';
}

export interface UserState {
  timeBank: number; // In minutes
  lifetimeEarned: number;
  apps: SimulatedApp[];
  activeTasks: Task[];
  avatar: Avatar;
  clan: Clan | null;
  journeys: Journey[];
  history: JourneyHistoryItem[]; // Added history
  activeJourney: Journey | null;
  activeJourneyTaskIndex: number;
  activeSession: { appId: string; startTime: number; durationMinutes: number } | null;
  selectedApp: SimulatedApp | null;
}

export interface QuestGenerationRequest {
  userInterests: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface CosmeticItem {
  id: string;
  name: string;
  description: string;
  cost: number;
  minLevel: number;
  icon: string; // Lucide icon name
  type: 'hat' | 'cape' | 'clothes' | 'background' | 'accessory' | 'aura';
}

// Duplicate Avatar interface removed (it was at the bottom of the file)