import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Shield, Calendar, Award, Save } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTasks } from '../../contexts/TaskContext';

const Profile: React.FC = () => {
  const { currentUser, updateProfile } = useAuth();
  const { tasks, completeTask } = useTasks();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: currentUser?.username || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    recoveryEmail: currentUser?.recoveryEmail || '',
    avatar: ''
  });

  // Check if profile task should be completed
  useEffect(() => {
    if (!currentUser || !tasks) return;

    const profileTask = tasks.find(task => 
      task.isProfileTask && 
      !task.completed && 
      currentUser.phone && 
      currentUser.recoveryEmail
    );

    if (profileTask) {
      completeTask(profileTask.id);
    }
  }, [currentUser, tasks]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile({
        ...currentUser,
        ...formData
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center">
          <User className="mr-2 h-5 w-5 text-purple-600" />
          Profile Settings
        </h2>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="text-sm text-purple-600 hover:text-purple-800 font-medium"
        >
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>

      <div className="space-y-6">
        {/* Profile Picture */}
        <div className="flex items-center space-x-4">
          <div className="h-20 w-20 rounded-full bg-gradient-to-r from-purple-400 to-indigo-500 flex items-center justify-center">
            <User className="h-12 w-12 text-white" />
          </div>
          {isEditing && (
            <button className="text-sm text-purple-600 hover:text-purple-800 font-medium">
              Change Avatar
            </button>
          )}
        </div>

        {/* Profile Info */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Username</label>
              {isEditing ? (
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="pl-10 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
              ) : (
                <p className="mt-1 text-gray-900 flex items-center">
                  <User className="h-4 w-4 mr-2 text-gray-400" />
                  {currentUser?.username}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              {isEditing ? (
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="pl-10 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
              ) : (
                <p className="mt-1 text-gray-900 flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-gray-400" />
                  {currentUser?.email}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Phone Number</label>
              {isEditing ? (
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="pl-10 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                    placeholder="For account recovery"
                  />
                </div>
              ) : (
                <p className="mt-1 text-gray-900 flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-gray-400" />
                  {currentUser?.phone || 'Not set'}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Recovery Email</label>
              {isEditing ? (
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Shield className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    value={formData.recoveryEmail}
                    onChange={(e) => setFormData({ ...formData, recoveryEmail: e.target.value })}
                    className="pl-10 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Backup email address"
                  />
                </div>
              ) : (
                <p className="mt-1 text-gray-900 flex items-center">
                  <Shield className="h-4 w-4 mr-2 text-gray-400" />
                  {currentUser?.recoveryEmail || 'Not set'}
                </p>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-4 rounded-lg">
              <p className="text-sm text-purple-600">Level</p>
              <p className="text-2xl font-bold text-purple-700">{currentUser?.level}</p>
            </div>
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-4 rounded-lg">
              <p className="text-sm text-purple-600">Points</p>
              <p className="text-2xl font-bold text-purple-700">{currentUser?.points}</p>
            </div>
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-4 rounded-lg">
              <p className="text-sm text-purple-600">Streak</p>
              <p className="text-2xl font-bold text-purple-700">{currentUser?.streakDays} days</p>
            </div>
          </div>

          {/* Account Info */}
          <div className="pt-4 border-t border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Account Information</h3>
            <div className="space-y-3">
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="h-4 w-4 mr-2" />
                Joined: {new Date(currentUser?.joined || '').toLocaleDateString()}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Award className="h-4 w-4 mr-2" />
                Achievements: {currentUser?.achievements?.length || 0}
              </div>
            </div>
          </div>

          {isEditing && (
            <div className="pt-4">
              <button
                type="submit"
                className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Profile;