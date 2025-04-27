import React from 'react';
import { Menu, X, LogOut, Award, ShoppingBag, CheckSquare, BarChart, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface NavigationProps {
  onPageChange: (page: string) => void;
  currentPage: string;
}

const Navigation: React.FC<NavigationProps> = ({ onPageChange, currentPage }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { logout } = useAuth();

  const handlePageChange = (page: string) => {
    onPageChange(page);
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Award className="h-8 w-8 text-purple-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">TaskMaster</span>
            </div>
            
            {/* Desktop menu */}
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <button
                onClick={() => handlePageChange('tasks')}
                className={`${
                  currentPage === 'tasks'
                    ? 'border-purple-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                <CheckSquare className="h-4 w-4 mr-1" />
                Tasks
              </button>
              <button
                onClick={() => handlePageChange('rewards')}
                className={`${
                  currentPage === 'rewards'
                    ? 'border-purple-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                <ShoppingBag className="h-4 w-4 mr-1" />
                Rewards
              </button>
              <button
                onClick={() => handlePageChange('stats')}
                className={`${
                  currentPage === 'stats'
                    ? 'border-purple-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                <BarChart className="h-4 w-4 mr-1" />
                Stats
              </button>
              <button
                onClick={() => handlePageChange('profile')}
                className={`${
                  currentPage === 'profile'
                    ? 'border-purple-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                <User className="h-4 w-4 mr-1" />
                Profile
              </button>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              <button
                onClick={logout}
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm leading-5 font-medium rounded-md text-gray-700 bg-white hover:text-gray-500 focus:outline-none focus:border-purple-300 focus:shadow-outline-purple active:text-gray-800 active:bg-gray-50 transition ease-in-out duration-150"
              >
                <LogOut className="h-4 w-4 mr-1" />
                Logout
              </button>
            </div>
            
            <div className="flex items-center sm:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500 transition duration-150 ease-in-out"
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <button
              onClick={() => handlePageChange('tasks')}
              className={`${
                currentPage === 'tasks'
                  ? 'bg-purple-50 border-purple-500 text-purple-700'
                  : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
              } block pl-3 pr-4 py-2 border-l-4 text-base font-medium w-full text-left`}
            >
              <CheckSquare className="h-5 w-5 mr-1 inline-block" />
              Tasks
            </button>
            <button
              onClick={() => handlePageChange('rewards')}
              className={`${
                currentPage === 'rewards'
                  ? 'bg-purple-50 border-purple-500 text-purple-700'
                  : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
              } block pl-3 pr-4 py-2 border-l-4 text-base font-medium w-full text-left`}
            >
              <ShoppingBag className="h-5 w-5 mr-1 inline-block" />
              Rewards
            </button>
            <button
              onClick={() => handlePageChange('stats')}
              className={`${
                currentPage === 'stats'
                  ? 'bg-purple-50 border-purple-500 text-purple-700'
                  : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
              } block pl-3 pr-4 py-2 border-l-4 text-base font-medium w-full text-left`}
            >
              <BarChart className="h-5 w-5 mr-1 inline-block" />
              Stats
            </button>
            <button
              onClick={() => handlePageChange('profile')}
              className={`${
                currentPage === 'profile'
                  ? 'bg-purple-50 border-purple-500 text-purple-700'
                  : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
              } block pl-3 pr-4 py-2 border-l-4 text-base font-medium w-full text-left`}
            >
              <User className="h-5 w-5 mr-1 inline-block" />
              Profile
            </button>
            <button
              onClick={logout}
              className="border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 block w-full text-left pl-3 pr-4 py-2 border-l-4 text-base font-medium"
            >
              <LogOut className="h-5 w-5 mr-1 inline-block" />
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;