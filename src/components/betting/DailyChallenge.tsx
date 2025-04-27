import React, { useState, useEffect } from 'react';
import { Target, Clock } from 'lucide-react';
import { usePoints } from '../../contexts/PointsContext';
import { useTasks } from '../../contexts/TaskContext';

const DailyChallenge: React.FC = () => {
  const { dailyChallenge, createDailyChallenge, points } = usePoints();
  const { tasks } = useTasks();
  const [taskTarget, setTaskTarget] = useState(3);
  const [pointsBet, setPointsBet] = useState(10);
  const [timeLeft, setTimeLeft] = useState('');
  
  const maxBet = Math.max(Math.floor(points * 0.1), 10); // 10% of current points or minimum 10 points

  // Calculate time left for active challenge
  useEffect(() => {
    if (!dailyChallenge) return;
    
    const endTime = new Date(dailyChallenge.endTime).getTime();
    
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = endTime - now;
      
      if (distance < 0) {
        clearInterval(timer);
        setTimeLeft('Expired');
        return;
      }
      
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);
      
      setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
    }, 1000);
    
    return () => clearInterval(timer);
  }, [dailyChallenge]);

  // Calculate completed tasks for the challenge
  const completedTasksCount = dailyChallenge 
    ? tasks.filter(task => 
        task.completed && 
        new Date(task.completedAt!) >= new Date(dailyChallenge.startTime) &&
        new Date(task.completedAt!) <= new Date(dailyChallenge.endTime)
      ).length
    : 0;

  const handleCreateChallenge = () => {
    createDailyChallenge(taskTarget, pointsBet);
  };

  // Calculate potential winnings
  const potentialWinnings = dailyChallenge
    ? Math.round(dailyChallenge.pointsBet * dailyChallenge.multiplier)
    : Math.round(pointsBet * (1 + taskTarget * 0.1));

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 flex items-center mb-4">
        <Target className="mr-2 h-5 w-5 text-purple-600" />
        Daily Challenge
      </h2>
      
      {dailyChallenge ? (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-4 border border-purple-100">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-medium text-purple-800">Active Challenge</h3>
                <p className="text-sm text-purple-700">
                  Complete {dailyChallenge.targetTasks} tasks to win {potentialWinnings} points!
                </p>
              </div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                {dailyChallenge.pointsBet} pts bet
              </span>
            </div>
            
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-purple-600 h-2.5 rounded-full transition-all duration-500" 
                  style={{ width: `${Math.min(100, (completedTasksCount / dailyChallenge.targetTasks) * 100)}%` }}
                ></div>
              </div>
              <div className="flex justify-between mt-1 text-xs text-gray-600">
                <span>{completedTasksCount} completed</span>
                <span>{dailyChallenge.targetTasks} goal</span>
              </div>
            </div>
            
            <div className="mt-3 flex items-center justify-between text-sm">
              <div className="flex items-center text-amber-700">
                <Clock className="h-4 w-4 mr-1" />
                <span>{timeLeft} remaining</span>
              </div>
              
              <div className="text-purple-700 font-medium">
                Multiplier: {dailyChallenge.multiplier.toFixed(1)}x
              </div>
            </div>
          </div>
          
          <p className="text-sm text-gray-600 italic">
            Complete tasks before the challenge expires to claim your reward!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-gray-600">
            Create a daily challenge to earn bonus points! Bet up to {maxBet} points (10% of your balance) on completing tasks within 24 hours.
          </p>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="taskTarget" className="block text-sm font-medium text-gray-700">
                Number of tasks to complete (1-10)
              </label>
              <input
                id="taskTarget"
                type="number"
                min={1}
                max={10}
                value={taskTarget}
                onChange={(e) => setTaskTarget(Number(e.target.value))}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
            
            <div>
              <label htmlFor="pointsBet" className="block text-sm font-medium text-gray-700">
                Points to bet (max {maxBet})
              </label>
              <input
                id="pointsBet"
                type="number"
                min={10}
                max={maxBet}
                value={pointsBet}
                onChange={(e) => setPointsBet(Number(e.target.value))}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
            
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-4 rounded-md">
              <p className="text-sm text-purple-700">
                Potential winnings: <span className="font-bold">{potentialWinnings} points</span> 
                <span className="ml-1 text-xs">({(1 + taskTarget * 0.1).toFixed(1)}x multiplier)</span>
              </p>
            </div>
            
            <button
              onClick={handleCreateChallenge}
              disabled={points < pointsBet || pointsBet > maxBet}
              className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Create Challenge
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DailyChallenge;