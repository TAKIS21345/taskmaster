import React from 'react';
import { Award, TrendingUp, CheckSquare } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTasks } from '../../contexts/TaskContext';

const Achievements: React.FC = () => {
  const { currentUser } = useAuth();
  const { tasks } = useTasks();
  
  // Calculate statistics
  const completedTasks = tasks.filter(task => task.completed).length;
  const totalPoints = currentUser?.points || 0;
  const streak = currentUser?.streakDays || 0;

  return (
    <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg shadow-md p-3 text-white">
      <div className="grid grid-cols-3 gap-2">
        <div className="text-center p-2">
          <CheckSquare className="h-6 w-6 mx-auto mb-1" />
          <div className="text-xl font-bold">{completedTasks}</div>
          <div className="text-xs text-purple-100">Tasks Completed</div>
        </div>
        
        <div className="text-center p-2">
          <Award className="h-6 w-6 mx-auto mb-1" />
          <div className="text-xl font-bold">{totalPoints}</div>
          <div className="text-xs text-purple-100">Total Points</div>
        </div>
        
        <div className="text-center p-2">
          <TrendingUp className="h-6 w-6 mx-auto mb-1" />
          <div className="text-xl font-bold">{streak}</div>
          <div className="text-xs text-purple-100">Day Streak</div>
        </div>
      </div>
    </div>
  );
};

export default Achievements;