import React, { useState } from 'react';
import { Plus, Filter } from 'lucide-react';
import { useTasks } from '../../contexts/TaskContext';
import TaskItem from './TaskItem';
import TaskForm from './TaskForm';

const TaskList: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [filterCompleted, setFilterCompleted] = useState<boolean | null>(null);
  const [filterPriority, setFilterPriority] = useState<'Low' | 'Medium' | 'High' | null>(null);
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  
  const { tasks } = useTasks();

  // Get unique categories from all tasks
  const allCategories = Array.from(
    new Set(tasks.flatMap(task => task.categories))
  );

  // Apply filters
  const filteredTasks = tasks.filter(task => {
    // Filter by completion status
    if (filterCompleted !== null && task.completed !== filterCompleted) {
      return false;
    }
    
    // Filter by priority
    if (filterPriority !== null && task.priority !== filterPriority) {
      return false;
    }
    
    // Filter by category
    if (filterCategory !== null && !task.categories.includes(filterCategory)) {
      return false;
    }
    
    return true;
  });

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">My Tasks</h2>
        
        <div className="flex space-x-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm leading-5 font-medium rounded-md text-gray-700 bg-white hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:text-gray-800 active:bg-gray-50 transition ease-in-out duration-150"
          >
            <Filter size={16} className="mr-1" />
            Filters
          </button>
          
          <button
            onClick={() => setShowForm(!showForm)}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-teal-600 hover:bg-teal-500 focus:outline-none focus:border-teal-700 focus:shadow-outline-teal active:bg-teal-700 transition ease-in-out duration-150"
          >
            <Plus size={16} className="mr-1" />
            New Task
          </button>
        </div>
      </div>
      
      {showFilters && (
        <div className="mb-4 p-4 bg-gray-50 rounded-md border border-gray-200 animate-fadeIn">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                id="status-filter"
                value={filterCompleted === null ? '' : filterCompleted ? 'completed' : 'active'}
                onChange={(e) => {
                  if (e.target.value === '') setFilterCompleted(null);
                  else setFilterCompleted(e.target.value === 'completed');
                }}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="">All</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="priority-filter" className="block text-sm font-medium text-gray-700">
                Priority
              </label>
              <select
                id="priority-filter"
                value={filterPriority || ''}
                onChange={(e) => {
                  if (e.target.value === '') setFilterPriority(null);
                  else setFilterPriority(e.target.value as 'Low' | 'Medium' | 'High');
                }}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="">All</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="category-filter" className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <select
                id="category-filter"
                value={filterCategory || ''}
                onChange={(e) => {
                  if (e.target.value === '') setFilterCategory(null);
                  else setFilterCategory(e.target.value);
                }}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="">All</option>
                {allCategories.map((category, index) => (
                  <option key={index} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="mt-3 flex justify-end">
            <button
              onClick={() => {
                setFilterCompleted(null);
                setFilterPriority(null);
                setFilterCategory(null);
              }}
              className="text-sm text-indigo-600 hover:text-indigo-900"
            >
              Reset Filters
            </button>
          </div>
        </div>
      )}
      
      {showForm && (
        <div className="mb-6 border-b pb-6 animate-slideDown">
          <TaskForm onClose={() => setShowForm(false)} />
        </div>
      )}
      
      <div className="space-y-2">
        {filteredTasks.length > 0 ? (
          filteredTasks.map(task => (
            <TaskItem key={task.id} task={task} />
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No tasks match your criteria.</p>
            <button
              onClick={() => setShowForm(true)}
              className="mt-2 text-teal-600 hover:text-teal-800 font-medium"
            >
              Create a new task
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskList;