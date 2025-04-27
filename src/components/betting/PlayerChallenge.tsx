import React, { useState, useEffect } from 'react';
import { Users, Award, Share2 } from 'lucide-react';
import { usePoints } from '../../contexts/PointsContext';
import { useAuth } from '../../contexts/AuthContext';
import { PlayerChallenge as PlayerChallengeType } from '../../types';
import { supabase } from '../../lib/supabase';

const PlayerChallenge: React.FC = () => {
  const { playerChallenges, createPlayerChallenge, respondToChallenge, points } = usePoints();
  const { currentUser } = useAuth();
  const [challengedId, setChallengedId] = useState('');
  const [pointsBet, setPointsBet] = useState(10);
  const [users, setUsers] = useState<{ id: string; username: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showShareLink, setShowShareLink] = useState(false);
  const [challengeLink, setChallengeLink] = useState('');
  
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('id, username')
          .neq('id', currentUser?.id) // Exclude current user
          .order('username');
          
        if (error) throw error;
        
        setUsers(data || []);
      } catch (err) {
        setError('Failed to load users');
        console.error('Error fetching users:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (currentUser) {
      fetchUsers();
    }
  }, [currentUser]);
  
  // Filter challenges relevant to current user
  const incomingChallenges = currentUser 
    ? playerChallenges.filter(c => c.challengedId === currentUser.id)
    : [];
    
  const outgoingChallenges = currentUser 
    ? playerChallenges.filter(c => c.challengerId === currentUser.id)
    : [];

  const handleCreateChallenge = () => {
    if (challengedId) {
      const challengeId = createPlayerChallenge(challengedId, pointsBet);
      // Generate shareable link
      const link = `${window.location.origin}/challenge/${challengeId}`;
      setChallengeLink(link);
      setShowShareLink(true);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(challengeLink);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 flex items-center mb-4">
        <Users className="mr-2 h-5 w-5 text-indigo-600" />
        Player Challenges
      </h2>
      
      <div className="space-y-6">
        {/* Create Challenge Form */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <h3 className="font-medium text-gray-900 mb-3">Challenge a Player</h3>
          
          <div className="space-y-3">
            <div>
              <label htmlFor="challengedUser" className="block text-sm font-medium text-gray-700">
                Select Player
              </label>
              {isLoading ? (
                <div className="mt-1 h-10 bg-gray-100 animate-pulse rounded-md"></div>
              ) : error ? (
                <div className="mt-1 text-sm text-red-600">{error}</div>
              ) : (
                <select
                  id="challengedUser"
                  value={challengedId}
                  onChange={(e) => setChallengedId(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Select a player</option>
                  {users.map(user => (
                    <option key={user.id} value={user.id}>
                      {user.username}
                    </option>
                  ))}
                </select>
              )}
            </div>
            
            <div>
              <label htmlFor="challengePoints" className="block text-sm font-medium text-gray-700">
                Points to Bet (max 500)
              </label>
              <input
                id="challengePoints"
                type="number"
                min={5}
                max={Math.min(500, points)}
                value={pointsBet}
                onChange={(e) => setPointsBet(Number(e.target.value))}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            
            <button
              onClick={handleCreateChallenge}
              disabled={!challengedId || points < pointsBet || isLoading}
              className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send Challenge
            </button>

            {showShareLink && (
              <div className="mt-3 p-3 bg-indigo-50 rounded-md">
                <p className="text-sm text-indigo-700 mb-2">Share this challenge link with your friend:</p>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={challengeLink}
                    className="flex-1 p-2 text-sm bg-white border border-indigo-200 rounded"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="p-2 text-indigo-600 hover:text-indigo-800"
                    title="Copy link"
                  >
                    <Share2 size={18} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Incoming Challenges */}
        {incomingChallenges.length > 0 && (
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Incoming Challenges</h3>
            <div className="space-y-3">
              {incomingChallenges.map(challenge => (
                <div key={challenge.id} className="border rounded-md p-3 bg-indigo-50">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium">
                        From: <span className="text-indigo-700">
                          {users.find(u => u.id === challenge.challengerId)?.username || 'Unknown User'}
                        </span>
                      </p>
                      <p className="text-xs text-gray-600">
                        {challenge.pointsBet} points at stake • Complete more tasks to win
                      </p>
                    </div>
                    <div className="space-x-2">
                      <button 
                        onClick={() => respondToChallenge(challenge.id, true)}
                        className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                        Accept
                      </button>
                      <button 
                        onClick={() => respondToChallenge(challenge.id, false)}
                        className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Outgoing Challenges */}
        {outgoingChallenges.length > 0 && (
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Your Active Challenges</h3>
            <div className="space-y-3">
              {outgoingChallenges.map(challenge => (
                <div key={challenge.id} className="border rounded-md p-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium">
                        To: <span className="text-indigo-700">
                          {users.find(u => u.id === challenge.challengedId)?.username || 'Unknown User'}
                        </span>
                      </p>
                      <p className="text-xs text-gray-600">
                        {challenge.pointsBet} points at stake • Waiting for response
                      </p>
                    </div>
                    <div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Pending
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Empty state */}
        {incomingChallenges.length === 0 && outgoingChallenges.length === 0 && (
          <div className="text-center py-4 text-gray-500">
            <Award className="h-8 w-8 mx-auto text-gray-400 mb-2" />
            <p>No active challenges at the moment.</p>
            <p className="text-sm mt-1">Challenge another player to earn bonus points!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayerChallenge;