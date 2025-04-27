export type User = {
  id: string;
  username: string;
  email: string;
  phone?: string;
  recoveryEmail?: string;
  points: number;
  level: number;
  streakDays: number;
  lastLogin: Date;
  joined: Date;
  achievements: Achievement[];
};

export type Task = {
  id: string;
  userId: string;
  title: string;
  description?: string;
  dueDate?: Date;
  points: number;
  priority: 'Low' | 'Medium' | 'High';
  categories: string[];
  completed: boolean;
  completedAt?: Date;
  createdAt: Date;
  isProfileTask?: boolean;
  autoCompleteOnNewTask?: boolean;
};

export type Category = {
  id: string;
  name: string;
  color: string;
};

export type Achievement = {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: Date;
};

export type RewardItem = {
  id: string;
  name: string;
  description: string;
  pointCost: number;
  type: 'template' | 'tip' | 'theme' | 'premium';
  imageSrc?: string;
};

export type DailyChallenge = {
  id: string;
  userId: string;
  targetTasks: number;
  pointsBet: number;
  multiplier: number;
  startTime: Date;
  endTime: Date;
  completed: boolean;
  tasksCompleted: number;
};

export type PlayerChallenge = {
  id: string;
  challengerId: string;
  challengedId: string;
  pointsBet: number;
  startTime: Date;
  endTime: Date;
  challengerCompleted: boolean;
  challengedCompleted: boolean;
  winnerId?: string;
};

export type AuthContextType = {
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (profileData: Partial<User>) => Promise<void>;
};

export type TaskContextType = {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'userId' | 'completed' | 'createdAt'>) => void;
  updateTask: (id: string, task: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  completeTask: (id: string) => void;
  uncompleteTask: (id: string) => void;
  getTasksByCategory: (category: string) => Task[];
  getTasksByPriority: (priority: 'Low' | 'Medium' | 'High') => Task[];
};

export type PointsContextType = {
  points: number;
  addPoints: (amount: number) => void;
  spendPoints: (amount: number) => boolean;
  rewardItems: RewardItem[];
  purchaseReward: (id: string) => boolean;
  dailyChallenge: DailyChallenge | null;
  createDailyChallenge: (targetTasks: number, pointsBet: number) => void;
  playerChallenges: PlayerChallenge[];
  createPlayerChallenge: (challengedId: string, pointsBet: number) => void;
  respondToChallenge: (challengeId: string, accept: boolean) => void;
};