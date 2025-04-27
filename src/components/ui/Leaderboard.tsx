import React, { useState, useEffect } from 'react';
import { Medal, Trophy, Award } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

const Leaderboard: React.FC = () => {
  const [leaderboardData, setLeaderboardData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('id, username, points, level')
          .order('points', { ascending: false })
          .limit(5);

        if (error) throw error;
        
        const rankedData = data.map((user, index) => ({
          ...user,
          position: index + 1
        }));

        setLeaderboardData(rankedData);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboard();

    // Set up real-time subscription
    const subscription = supabase
      .channel('leaderboard_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'users' 
        }, 
        fetchLeaderboard
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const getPositionIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Award className="h-5 w-5 text-amber-700" />;
      default:
        return <span className="text-gray-500 font-bold">{position}</span>;
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <Trophy className="mr-2 h-5 w-5 text-yellow-500" />
          Leaderboard
        </h2>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse flex items-center justify-between p-3 rounded-lg bg-gray-50">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
                <div className="h-4 w-32 bg-gray-200 rounded"></div>
              </div>
              <div className="h-4 w-16 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
        <Trophy className="mr-2 h-5 w-5 text-yellow-500" />
        Leaderboard
      </h2>
      
      <div className="space-y-3">
        {leaderboardData.map((user) => (
          <div 
            key={user.id}
            className={`flex items-center justify-between p-3 rounded-lg ${
              user.id === currentUser?.id
                ? 'bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-100'
                : 'bg-gray-50 border border-gray-100'
            } ${user.position === 1 ? 'animate-pulse' : ''}`}
          >
            <div className="flex items-center">
              <div className="w-6 mr-3 flex justify-center">
                {getPositionIcon(user.position)}
              </div>
              <span className="font-medium">{user.username}</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-500">Level {user.level}</span>
              <span className="font-bold text-purple-700">{user.points} pts</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;