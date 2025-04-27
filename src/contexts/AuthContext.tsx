import React, { createContext, useState, useContext, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { User, AuthContextType } from '../types';
import { supabase } from '../lib/supabase';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Check for stored session on initial load
  useEffect(() => {
    const session = supabase.auth.getSession();
    if (session) {
      checkUser();
    }
  }, []);

  // Listen for auth changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        checkUser();
      } else {
        setCurrentUser(null);
        setIsAuthenticated(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profile) {
        setCurrentUser(profile);
        setIsAuthenticated(true);
      }
    }
  };

  // Generate starter tasks for new users
  const generateStarterTasks = async (userId: string) => {
    const starterTasks = [
      {
        id: uuidv4(),
        userId,
        title: "Complete your profile",
        description: "Add your profile information including phone number and recovery email for account security.",
        points: 50,
        priority: "High" as const,
        categories: ["Getting Started"],
        completed: false,
        createdAt: new Date(),
        isProfileTask: true
      },
      {
        id: uuidv4(),
        userId,
        title: "Do 10 push-ups",
        description: "Complete a set of 10 push-ups for your daily exercise.",
        points: 30,
        priority: "Medium" as const,
        categories: ["Health"],
        completed: false,
        createdAt: new Date()
      },
      {
        id: uuidv4(),
        userId,
        title: "Create your first task",
        description: "Add a personal task to get started with task management.",
        points: 20,
        priority: "Low" as const,
        categories: ["Getting Started"],
        completed: false,
        createdAt: new Date(),
        autoCompleteOnNewTask: true
      }
    ];

    // Insert tasks into Supabase
    const { error } = await supabase
      .from('tasks')
      .insert(starterTasks);

    if (error) {
      console.error('Error creating starter tasks:', error);
    }
  };

  const login = async (email: string, password: string): Promise<void> => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      throw new Error(error.message);
    }

    if (data.user) {
      const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (profile) {
        setCurrentUser(profile);
        setIsAuthenticated(true);
      }
    }
  };

  const register = async (username: string, email: string, password: string): Promise<void> => {
    // Check if username is taken
    const { data: existingUser } = await supabase
      .from('users')
      .select('username')
      .eq('username', username)
      .single();

    if (existingUser) {
      throw new Error('Username already taken');
    }

    // Create auth user
    const { data, error } = await supabase.auth.signUp({
      email,
      password
    });

    if (error) {
      throw new Error(error.message);
    }

    if (data.user) {
      // Create user profile
      const { error: profileError } = await supabase
        .from('users')
        .insert({
          id: data.user.id,
          username,
          email,
          points: 100, // Starting with 100 points
          level: 1,
          streak_days: 0,
          last_login: new Date(),
          joined: new Date()
        });

      if (profileError) {
        throw new Error(profileError.message);
      }

      // Generate starter tasks
      await generateStarterTasks(data.user.id);

      const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (profile) {
        setCurrentUser(profile);
        setIsAuthenticated(true);
      }
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  const updateProfile = async (profileData: Partial<User>) => {
    if (!currentUser) return;

    const { error } = await supabase
      .from('users')
      .update(profileData)
      .eq('id', currentUser.id);

    if (error) {
      throw new Error(error.message);
    }

    setCurrentUser(prev => prev ? { ...prev, ...profileData } : null);
  };

  return (
    <AuthContext.Provider value={{ 
      currentUser, 
      isAuthenticated, 
      login, 
      register, 
      logout,
      updateProfile 
    }}>
      {children}
    </AuthContext.Provider>
  );
};