import React, { useState } from 'react';
import { CheckCircle, Edit, Trash2, Calendar, Tag, Undo } from 'lucide-react';
import { Task } from '../../types';
import { useTasks } from '../../contexts/TaskContext';

interface TaskItemProps {
  task: Task;
}

const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { completeTask, uncompleteTask, deleteTask } = useTasks();

  const formatDate = (date: Date | undefined) => {
    if (!date) return '';
    return new Date(date).toLocaleString();
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'text-red-600 bg-red-100';
      case 'Medium':
        return 'text-amber-600 bg-amber-100';
      case 'Low':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const handleComplete = () => {
    if (!task.completed) {
      completeTask(task.id);
    }
  };

  const handleUncomplete = () => {
    if (task.completed) {
      uncompleteTask(task.id);
    }
  };

  return (
    <div 
      className={`bg-white rounded-lg shadow-sm border-l-4 mb-3 transition-all duration-200 ${
        task.completed 
          ? 'border-green-500 bg-green-50' 
          : task.priority === 'High' 
            ? 'border-red-500' 
            : task.priority === 'Medium' 
              ? 'border-amber-500' 
              : 'border-blue-500'
      }`}
    >
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {task.completed ? (
              <button
                onClick={handleUncomplete}
                className="flex-shrink-0 text-green-500 hover:text-amber-500 transition-colors duration-150"
                title="Mark as incomplete"
              >
                <Undo size={20} />
              </button>
            ) : (
              <button
                onClick={handleComplete}
                className="flex-shrink-0 text-gray-400 hover:text-green-500 transition-colors duration-150"
                title="Mark as complete"
              >
                <CheckCircle size={20} />
              </button>
            )}
            <h3 
              className={`text-lg font-medium ${
                task.completed ? 'line-through text-gray-500' : 'text-gray-900'
              }`}
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {task.title}
            </h3>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
              {task.points} pts
            </span>
            
            {!task.completed && (
              <button 
                onClick={() => deleteTask(task.id)}
                className="text-gray-400 hover:text-red-500 transition-colors duration-150"
              >
                <Trash2 size={18} />
              </button>
            )}
          </div>
        </div>
        
        {isExpanded && (
          <div className="mt-3 pl-8 text-sm text-gray-600 space-y-2 animate-fadeIn">
            {task.description && (
              <p>{task.description}</p>
            )}
            
            <div className="flex flex-wrap gap-2 items-center text-xs">
              {task.dueDate && (
                <div className="flex items-center">
                  <Calendar size={14} className="mr-1 text-gray-500" />
                  <span>{formatDate(task.dueDate)}</span>
                </div>
              )}
              
              <div className="flex items-center">
                <Tag size={14} className="mr-1 text-gray-500" />
                <div className="flex flex-wrap gap-1">
                  {task.categories.map((category, index) => (
                    <span 
                      key={index}
                      className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800"
                    >
                      {category}
                    </span>
                  ))}
                </div>
              </div>
              
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                {task.priority}
              </span>
            </div>
            
            {task.completed && task.completedAt && (
              <div className="text-xs text-gray-500">
                Completed on {formatDate(task.completedAt)}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskItem;