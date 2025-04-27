import React from 'react';
import PointsDisplay from '../rewards/PointsDisplay';
import TaskList from '../tasks/TaskList';
import RewardsShop from '../rewards/RewardsShop';
import DailyChallenge from '../betting/DailyChallenge';
import PlayerChallenge from '../betting/PlayerChallenge';
import Achievements from './Achievements';
import Leaderboard from './Leaderboard';
import Navigation from './Navigation';
import Profile from './Profile';
import Stats from './Stats';
import { useAuth } from '../../contexts/AuthContext';

const Dashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const [currentPage, setCurrentPage] = React.useState('tasks');

  const renderContent = () => {
    switch (currentPage) {
      case 'rewards':
        return <RewardsShop />;
      case 'stats':
        return <Stats />;
      case 'profile':
        return <Profile />;
      default:
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <PointsDisplay />
              <div className="col-span-2">
                <Achievements />
              </div>
            </div>
            
            <TaskList />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <DailyChallenge />
              <PlayerChallenge />
            </div>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation onPageChange={setCurrentPage} />
      
      <main className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome, {currentUser?.username || 'User'}!</h1>
          <p className="text-gray-600">Track your progress and earn rewards by completing tasks.</p>
        </header>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main content area */}
          <div className="lg:col-span-8 space-y-6">
            {renderContent()}
          </div>
          
          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-6">
            <RewardsShop />
            <Leaderboard />
          </aside>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;