import React, { useEffect, useState } from 'react';
import { BarChart2, TrendingUp, CheckSquare, Clock, Calendar, Award } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTasks } from '../../contexts/TaskContext';
import { supabase } from '../../lib/supabase';

const Stats: React.FC = () => {
  const { currentUser } = useAuth();
  const { tasks } = useTasks();
  const [topUsers, setTopUsers] = useState<any[]>([]);

  useEffect(() => {
    const fetchTopUsers = async () => {
      const { data } = await supabase
        .from('users')
        .select('username, points, level')
        .order('points', { ascending: false })
        .limit(5);

      if (data) {
        setTopUsers(data);
      }
    };

    fetchTopUsers();
  }, []);

  // Calculate task statistics
  const completedTasks = tasks.filter(task => task.completed);
  const completionRate = tasks.length > 0 
    ? Math.round((completedTasks.length / tasks.length) * 100) 
    : 0;

  // Calculate points per day
  const daysSinceJoined = Math.max(1, Math.floor(
    (new Date().getTime() - new Date(currentUser?.joined || '').getTime()) / (1000 * 60 * 60 * 24)
  ));
  const pointsPerDay = Math.round(currentUser?.points || 0 / daysSinceJoined);

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Points</p>
              <p className="text-2xl font-bold text-purple-600">{currentUser?.points}</p>
            </div>
            <Award className="h-8 w-8 text-purple-400" />
          </div>
          <p className="mt-2 text-sm text-gray-500">{pointsPerDay} points/day average</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Tasks Completed</p>
              <p className="text-2xl font-bold text-green-600">{completedTasks.length}</p>
            </div>
            <CheckSquare className="h-8 w-8 text-green-400" />
          </div>
          <p className="mt-2 text-sm text-gray-500">{completionRate}% completion rate</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Current Level</p>
              <p className="text-2xl font-bold text-blue-600">{currentUser?.level}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-blue-400" />
          </div>
          <p className="mt-2 text-sm text-gray-500">{currentUser?.streakDays} day streak</p>
        </div>
      </div>

      {/* Detailed Stats */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <BarChart2 className="mr-2 h-5 w-5 text-purple-600" />
          Detailed Statistics
        </h2>

        <div className="space-y-6">
          {/* Task Categories */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Task Categories</h3>
            <div className="space-y-2">
              {Array.from(new Set(tasks.map(task => task.categories).flat())).map(category => {
                const categoryTasks = tasks.filter(task => task.categories.includes(category));
                const completed = categoryTasks.filter(task => task.completed).length;
                const total = categoryTasks.length;
                const percentage = Math.round((completed / total) * 100) || 0;

                return (
                  <div key={category} className="flex items-center">
                    <span className="w-32 text-sm text-gray-600">{category}</span>
                    <div className="flex-1 mx-4">
                      <div className="h-2 bg-gray-200 rounded-full">
                        <div
                          className="h-2 bg-purple-600 rounded-full"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                    <span className="text-sm text-gray-600">{completed}/{total}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Top Users */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Top Performers</h3>
            <div className="space-y-2">
              {topUsers.map((user, index) => (
                <div key={user.username} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div className="flex items-center">
                    <span className="w-6 text-sm font-medium text-gray-600">#{index + 1}</span>
                    <span className="text-gray-900">{user.username}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-purple-600">{user.points} pts</span>
                    <span className="text-sm text-blue-600">Level {user.level}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stats;