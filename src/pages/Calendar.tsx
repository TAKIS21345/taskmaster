import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { Plus } from 'lucide-react';
import AddEventModal from '../components/AddEventModal';

interface Event {
  id: string;
  title: string;
  start: Date;
  end: Date;
  childName: string;
  fee?: number;
  description?: string;
}

export default function Calendar() {
  const [events, setEvents] = useState<Event[]>([]);
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser) {
      loadEvents();
    }
  }, [currentUser]);

  async function loadEvents() {
    if (!currentUser) return;

    const eventsRef = collection(db, 'events');
    const q = query(eventsRef, where('userId', '==', currentUser.uid));
    const querySnapshot = await getDocs(q);
    
    const loadedEvents = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      start: doc.data().start.toDate(),
      end: doc.data().end.toDate(),
    })) as Event[];
    
    setEvents(loadedEvents);
  }

  function handleDateSelect(selectInfo: any) {
    setSelectedDate(selectInfo.start);
    setShowEventModal(true);
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Family Schedule</h1>
        <button
          onClick={() => {
            setSelectedDate(new Date());
            setShowEventModal(true);
          }}
          className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
        >
          <Plus size={20} />
          <span>Add Event</span>
        </button>
      </div>
      
      <div className="calendar-container">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          }}
          editable={true}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          weekends={true}
          events={events}
          select={handleDateSelect}
          height="auto"
          eventContent={(eventInfo) => (
            <div className="p-1">
              <div className="font-semibold">{eventInfo.event.title}</div>
              <div className="text-xs">{eventInfo.event.extendedProps.childName}</div>
              {eventInfo.event.extendedProps.fee && (
                <div className="text-xs">${eventInfo.event.extendedProps.fee}</div>
              )}
            </div>
          )}
        />
      </div>

      <AddEventModal
        isOpen={showEventModal}
        onClose={() => setShowEventModal(false)}
        onEventAdded={loadEvents}
        selectedDate={selectedDate}
      />
    </div>
  );
}