import React from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { TaskProvider } from './contexts/TaskContext';
import { PointsProvider } from './contexts/PointsContext';
import AuthContainer from './components/auth/AuthContainer';
import Dashboard from './components/ui/Dashboard';

// Add some global animations to index.css
import './index.css';

const AppContent: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? <Dashboard /> : <AuthContainer />;
};

function App() {
  return (
    <AuthProvider>
      <PointsProvider>
        <TaskProvider>
          <AppContent />
        </TaskProvider>
      </PointsProvider>
    </AuthProvider>
  );
}

export default App;