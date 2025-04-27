import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { Calendar, DollarSign, Users, PlusCircle } from 'lucide-react';
import AddChildModal from '../components/AddChildModal';

interface Child {
  id: string;
  name: string;
  age: number;
}

interface Event {
  id: string;
  title: string;
  start: Date;
  childName: string;
  fee?: number;
}

export default function Dashboard() {
  const [children, setChildren] = useState<Child[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [totalFees, setTotalFees] = useState(0);
  const [showAddChildModal, setShowAddChildModal] = useState(false);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser) {
      loadDashboardData();
    }
  }, [currentUser]);

  async function loadDashboardData() {
    if (!currentUser) return;

    // Load children
    const childrenRef = collection(db, 'children');
    const childrenQuery = query(childrenRef, where('userId', '==', currentUser.uid));
    const childrenSnapshot = await getDocs(childrenQuery);
    const childrenData = childrenSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Child[];
    setChildren(childrenData);

    // Load upcoming events
    const eventsRef = collection(db, 'events');
    const eventsQuery = query(eventsRef, where('userId', '==', currentUser.uid));
    const eventsSnapshot = await getDocs(eventsQuery);
    const eventsData = eventsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      start: doc.data().start.toDate()
    })) as Event[];
    
    // Sort and filter upcoming events
    const upcoming = eventsData
      .filter(event => event.start > new Date())
      .sort((a, b) => a.start.getTime() - b.start.getTime())
      .slice(0, 5);
    
    setUpcomingEvents(upcoming);

    // Calculate total fees
    const total = eventsData.reduce((sum, event) => sum + (event.fee || 0), 0);
    setTotalFees(total);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Welcome to KidsSchedule</h1>
        <p className="text-gray-600">Manage your children's activities and schedules in one place.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center space-x-4">
            <Users className="h-8 w-8 text-indigo-600" />
            <div>
              <p className="text-gray-600">Children</p>
              <p className="text-2xl font-bold">{children.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center space-x-4">
            <Calendar className="h-8 w-8 text-indigo-600" />
            <div>
              <p className="text-gray-600">Upcoming Events</p>
              <p className="text-2xl font-bold">{upcomingEvents.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center space-x-4">
            <DollarSign className="h-8 w-8 text-indigo-600" />
            <div>
              <p className="text-gray-600">Total Fees</p>
              <p className="text-2xl font-bold">${totalFees.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Children List */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Your Children</h2>
          <button
            onClick={() => setShowAddChildModal(true)}
            className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            <PlusCircle size={20} />
            <span>Add Child</span>
          </button>
        </div>
        <div className="space-y-4">
          {children.map(child => (
            <div key={child.id} className="flex items-center justify-between border-b pb-4">
              <div>
                <h3 className="font-semibold text-gray-800">{child.name}</h3>
                <p className="text-gray-600 text-sm">Age: {child.age}</p>
              </div>
            </div>
          ))}
          {children.length === 0 && (
            <p className="text-gray-600 text-center py-4">No children added yet</p>
          )}
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Upcoming Events</h2>
        <div className="space-y-4">
          {upcomingEvents.map(event => (
            <div key={event.id} className="flex items-center justify-between border-b pb-4">
              <div>
                <h3 className="font-semibold text-gray-800">{event.title}</h3>
                <p className="text-gray-600 text-sm">
                  {event.start.toLocaleDateString()} - {event.childName}
                </p>
              </div>
              {event.fee && (
                <span className="text-indigo-600 font-semibold">${event.fee.toFixed(2)}</span>
              )}
            </div>
          ))}
          {upcomingEvents.length === 0 && (
            <p className="text-gray-600 text-center py-4">No upcoming events</p>
          )}
        </div>
      </div>

      <AddChildModal
        isOpen={showAddChildModal}
        onClose={() => setShowAddChildModal(false)}
        onChildAdded={loadDashboardData}
      />
    </div>
  );
}