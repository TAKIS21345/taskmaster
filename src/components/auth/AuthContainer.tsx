import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';

const AuthContainer: React.FC = () => {
  const [isLoginView, setIsLoginView] = useState(true);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-indigo-100 px-4 py-12">
      <div className="max-w-md w-full space-y-8">
        {isLoginView ? <Login /> : <Register />}
        
        <div className="text-center mt-4">
          <button
            onClick={() => setIsLoginView(!isLoginView)}
            className="text-purple-600 hover:text-purple-800 text-sm font-medium transition-colors"
          >
            {isLoginView 
              ? "Don't have an account? Sign up" 
              : "Already have an account? Log in"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthContainer;