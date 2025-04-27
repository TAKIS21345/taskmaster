import React, { createContext, useState, useContext, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from './AuthContext';
import { PointsContextType, RewardItem, DailyChallenge, PlayerChallenge } from '../types';

const PointsContext = createContext<PointsContextType | undefined>(undefined);

export const usePoints = () => {
  const context = useContext(PointsContext);
  if (context === undefined) {
    throw new Error('usePoints must be used within a PointsProvider');
  }
  return context;
};

interface PointsProviderProps {
  children: React.ReactNode;
}

export const PointsProvider: React.FC<PointsProviderProps> = ({ children }) => {
  const { currentUser, isAuthenticated } = useAuth();
  const [points, setPoints] = useState<number>(currentUser?.points || 0);
  const [rewardItems, setRewardItems] = useState<RewardItem[]>([]);
  const [dailyChallenge, setDailyChallenge] = useState<DailyChallenge | null>(null);
  const [playerChallenges, setPlayerChallenges] = useState<PlayerChallenge[]>([]);

  // Initialize reward items
  useEffect(() => {
    const defaultRewards: RewardItem[] = [
      {
        id: '1',
        name: 'Dark Theme',
        description: 'A sleek dark theme for your dashboard with custom accent colors.',
        pointCost: 100,
        type: 'theme',
        imageSrc: 'https://images.pexels.com/photos/3075993/pexels-photo-3075993.jpeg?auto=compress&cs=tinysrgb&w=800'
      },
      {
        id: '2',
        name: 'Project Template Bundle',
        description: 'A collection of professional project management templates.',
        pointCost: 150,
        type: 'template'
      },
      {
        id: '3',
        name: 'Time Management Guide',
        description: 'Expert tips and techniques for better time management.',
        pointCost: 75,
        type: 'tip'
      },
      {
        id: '4',
        name: 'Premium Analytics',
        description: 'Detailed insights and statistics about your productivity.',
        pointCost: 200,
        type: 'premium'
      },
      {
        id: '5',
        name: 'Custom Avatars Pack',
        description: 'Exclusive avatar collection to personalize your profile.',
        pointCost: 120,
        type: 'theme',
        imageSrc: 'https://images.pexels.com/photos/2815150/pexels-photo-2815150.jpeg?auto=compress&cs=tinysrgb&w=800'
      },
      {
        id: '6',
        name: 'Focus Timer Pro',
        description: 'Advanced Pomodoro timer with customizable intervals.',
        pointCost: 180,
        type: 'premium'
      }
    ];
    
    setRewardItems(defaultRewards);
  }, []);

  // Update points in localStorage when they change
  useEffect(() => {
    if (isAuthenticated && currentUser) {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const updatedUsers = users.map((user: any) => {
        if (user.id === currentUser.id) {
          return { ...user, points };
        }
        return user;
      });
      
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      
      // Also update currentUser in localStorage
      const updatedCurrentUser = { ...currentUser, points };
      localStorage.setItem('currentUser', JSON.stringify(updatedCurrentUser));
    }
  }, [points, currentUser, isAuthenticated]);

  // Load challenges from localStorage
  useEffect(() => {
    if (currentUser) {
      const storedDailyChallenge = localStorage.getItem(`dailyChallenge_${currentUser.id}`);
      if (storedDailyChallenge) {
        setDailyChallenge(JSON.parse(storedDailyChallenge));
      }
      
      const storedPlayerChallenges = localStorage.getItem(`playerChallenges_${currentUser.id}`);
      if (storedPlayerChallenges) {
        setPlayerChallenges(JSON.parse(storedPlayerChallenges));
      }
    }
  }, [currentUser]);

  // Save challenges to localStorage when they change
  useEffect(() => {
    if (currentUser) {
      if (dailyChallenge) {
        localStorage.setItem(`dailyChallenge_${currentUser.id}`, JSON.stringify(dailyChallenge));
      }
      
      if (playerChallenges.length > 0) {
        localStorage.setItem(`playerChallenges_${currentUser.id}`, JSON.stringify(playerChallenges));
      }
    }
  }, [dailyChallenge, playerChallenges, currentUser]);

  const addPoints = (amount: number) => {
    setPoints(prev => prev + amount);
  };

  const spendPoints = (amount: number): boolean => {
    if (points >= amount) {
      setPoints(prev => prev - amount);
      return true;
    }
    return false;
  };

  const purchaseReward = (id: string): boolean => {
    const reward = rewardItems.find(item => item.id === id);
    if (!reward) return false;
    
    return spendPoints(reward.pointCost);
  };

  const createDailyChallenge = (targetTasks: number, pointsBet: number) => {
    if (!currentUser) return;
    
    if (!spendPoints(pointsBet)) return;
    
    // Calculate multiplier based on difficulty
    const multiplier = 1 + (targetTasks * 0.1);
    
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const newChallenge: DailyChallenge = {
      id: uuidv4(),
      userId: currentUser.id,
      targetTasks,
      pointsBet,
      multiplier,
      startTime: now,
      endTime: tomorrow,
      completed: false,
      tasksCompleted: 0
    };
    
    setDailyChallenge(newChallenge);
    return newChallenge.id;
  };

  const createPlayerChallenge = (challengedId: string, pointsBet: number) => {
    if (!currentUser) return;
    
    if (!spendPoints(pointsBet)) return;
    
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const newChallenge: PlayerChallenge = {
      id: uuidv4(),
      challengerId: currentUser.id,
      challengedId,
      pointsBet,
      startTime: now,
      endTime: tomorrow,
      challengerCompleted: false,
      challengedCompleted: false
    };
    
    setPlayerChallenges(prev => [...prev, newChallenge]);
    return newChallenge.id;
  };

  const respondToChallenge = (challengeId: string, accept: boolean) => {
    if (!currentUser) return;
    
    if (accept) {
      const challenge = playerChallenges.find(c => c.id === challengeId && c.challengedId === currentUser.id);
      if (!challenge) return;
      
      if (!spendPoints(challenge.pointsBet)) return;
    }
    
    setPlayerChallenges(prev => 
      prev.filter(c => !(c.id === challengeId && c.challengedId === currentUser.id))
    );
  };

  return (
    <PointsContext.Provider value={{
      points,
      addPoints,
      spendPoints,
      rewardItems,
      purchaseReward,
      dailyChallenge,
      createDailyChallenge,
      playerChallenges,
      createPlayerChallenge,
      respondToChallenge
    }}>
      {children}
    </PointsContext.Provider>
  );
};