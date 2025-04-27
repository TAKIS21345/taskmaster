import React, { createContext, useState, useContext, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Task, TaskContextType } from '../types';
import { useAuth } from './AuthContext';
import { usePoints } from './PointsContext';
import { supabase } from '../lib/supabase';

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};

interface TaskProviderProps {
  children: React.ReactNode;
}

export const TaskProvider: React.FC<TaskProviderProps> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const { currentUser } = useAuth();
  const { addPoints, spendPoints } = usePoints();

  // Load tasks from Supabase
  useEffect(() => {
    if (!currentUser) return;

    const fetchTasks = async () => {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', currentUser.id);

      if (error) {
        console.error('Error fetching tasks:', error);
        return;
      }

      setTasks(data || []);
    };

    fetchTasks();

    // Subscribe to real-time changes
    const subscription = supabase
      .channel('tasks_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'tasks',
          filter: `user_id=eq.${currentUser.id}`
        }, 
        fetchTasks
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [currentUser]);

  const addTask = async (taskData: Omit<Task, 'id' | 'user_id' | 'completed' | 'created_at'>) => {
    if (!currentUser) return;
    
    const newTask = {
      id: uuidv4(),
      user_id: currentUser.id,
      ...taskData,
      completed: false,
      created_at: new Date()
    };
    
    const { error } = await supabase
      .from('tasks')
      .insert(newTask);

    if (!error) {
      setTasks(prev => [...prev, newTask]);

      // Check for auto-complete task
      const autoCompleteTask = tasks.find(task => 
        task.auto_complete_on_new_task && 
        !task.completed
      );

      if (autoCompleteTask) {
        completeTask(autoCompleteTask.id);
      }
    }
  };

  const updateTask = async (id: string, taskData: Partial<Task>) => {
    const { error } = await supabase
      .from('tasks')
      .update(taskData)
      .eq('id', id);

    if (!error) {
      setTasks(prev => 
        prev.map(task => 
          task.id === id ? { ...task, ...taskData } : task
        )
      );
    }
  };

  const deleteTask = async (id: string) => {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);

    if (!error) {
      setTasks(prev => prev.filter(task => task.id !== id));
    }
  };

  const completeTask = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task || task.completed) return;

    const { error } = await supabase
      .from('tasks')
      .update({ 
        completed: true,
        completed_at: new Date()
      })
      .eq('id', id);

    if (!error) {
      addPoints(task.points);
      setTasks(prev => 
        prev.map(t => 
          t.id === id ? { 
            ...t, 
            completed: true,
            completed_at: new Date()
          } : t
        )
      );
    }
  };

  const uncompleteTask = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task || !task.completed) return;

    const { error } = await supabase
      .from('tasks')
      .update({ 
        completed: false,
        completed_at: null
      })
      .eq('id', id);

    if (!error) {
      spendPoints(task.points);
      setTasks(prev => 
        prev.map(t => 
          t.id === id ? { 
            ...t, 
            completed: false,
            completed_at: null
          } : t
        )
      );
    }
  };

  const getTasksByCategory = (category: string) => {
    return tasks.filter(task => task.categories.includes(category));
  };

  const getTasksByPriority = (priority: 'Low' | 'Medium' | 'High') => {
    return tasks.filter(task => task.priority === priority);
  };

  return (
    <TaskContext.Provider value={{
      tasks,
      addTask,
      updateTask,
      deleteTask,
      completeTask,
      uncompleteTask,
      getTasksByCategory,
      getTasksByPriority
    }}>
      {children}
    </TaskContext.Provider>
  );
};