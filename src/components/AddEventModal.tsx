import React, { useState, useEffect } from 'react';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { X } from 'lucide-react';

interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEventAdded: () => void;
  selectedDate: Date | null;
}

interface Child {
  id: string;
  name: string;
}

export default function AddEventModal({ isOpen, onClose, onEventAdded, selectedDate }: AddEventModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [fee, setFee] = useState('');
  const [selectedChild, setSelectedChild] = useState('');
  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser && isOpen) {
      loadChildren();
    }
  }, [currentUser, isOpen]);

  async function loadChildren() {
    if (!currentUser) return;
    
    const childrenRef = collection(db, 'children');
    const q = query(childrenRef, where('userId', '==', currentUser.uid));
    const querySnapshot = await getDocs(q);
    const childrenData = querySnapshot.docs.map(doc => ({
      id: doc.id,
      name: doc.data().name
    }));
    setChildren(childrenData);
    if (childrenData.length > 0) {
      setSelectedChild(childrenData[0].id);
    }
  }

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!currentUser || !selectedDate) return;

    try {
      setLoading(true);
      const endDate = new Date(selectedDate);
      endDate.setHours(endDate.getHours() + 1);

      await addDoc(collection(db, 'events'), {
        title,
        description,
        fee: fee ? parseFloat(fee) : 0,
        start: selectedDate,
        end: endDate,
        childName: children.find(child => child.id === selectedChild)?.name,
        userId: currentUser.uid,
        createdAt: new Date()
      });
      
      onEventAdded();
      onClose();
      setTitle('');
      setDescription('');
      setFee('');
    } catch (error) {
      console.error('Error adding event:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Add Event</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Title
            </label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Child
            </label>
            <select
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={selectedChild}
              onChange={(e) => setSelectedChild(e.target.value)}
            >
              {children.map(child => (
                <option key={child.id} value={child.id}>
                  {child.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Description
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Fee ($)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={fee}
              onChange={(e) => setFee(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
          >
            {loading ? 'Adding...' : 'Add Event'}
          </button>
        </form>
      </div>
    </div>
  );
}