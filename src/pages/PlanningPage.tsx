
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Plus, Trash2, Users } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

import NavBar from '@/components/NavBar';
import { Button } from '@/components/ui/button';
import ParticleBackground from '@/components/ParticleBackground';
import { Card, CardContent } from '@/components/ui/card';

type Event = {
  id: string;
  title: string;
  date: string;
  participants: string[];
  location: string;
};

const PlanningPage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([
    {
      id: '1',
      title: 'Study Group - Economics',
      date: '2025-04-10T15:00',
      participants: ['Me', 'John', 'Sarah'],
      location: 'Library, 2nd Floor'
    },
    {
      id: '2',
      title: 'Campus Run',
      date: '2025-04-12T08:00',
      participants: ['Me', 'Running Club'],
      location: 'Sports Field'
    }
  ]);
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEvent, setNewEvent] = useState<Omit<Event, 'id'>>({
    title: '',
    date: '',
    participants: ['Me'],
    location: ''
  });

  const handleAddEvent = () => {
    if (!newEvent.title || !newEvent.date || !newEvent.location) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    const event: Event = {
      ...newEvent,
      id: Date.now().toString()
    };
    
    setEvents([...events, event]);
    setNewEvent({
      title: '',
      date: '',
      participants: ['Me'],
      location: ''
    });
    setShowAddModal(false);
    toast.success('Event added successfully');
  };
  
  const handleDeleteEvent = (id: string) => {
    setEvents(events.filter(event => event.id !== id));
    toast.success('Event removed');
  };
  
  const handleAddParticipant = () => {
    const name = prompt('Enter participant name:');
    if (name?.trim()) {
      setNewEvent({
        ...newEvent,
        participants: [...newEvent.participants, name]
      });
      toast.success(`${name} added to event`);
    }
  };
  
  return (
    <div className="min-h-screen pb-28 bg-gradient-to-br from-blue-100 to-blue-50 dark:from-theme-navy dark:to-theme-indigo/80">
      <ParticleBackground count={20} theme="finances" className="opacity-30" />
      
      <header className="bg-white bg-opacity-80 dark:bg-gray-900 dark:bg-opacity-80 backdrop-blur-lg shadow-md py-4 px-4">
        <div className="container mx-auto max-w-md">
          <h1 className="text-2xl font-bold flex items-center justify-center">
            <Calendar size={24} className="mr-2 text-theme-pink" />
            Group Planning
          </h1>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-6 max-w-md">
        <div className="mb-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-theme-pink text-white py-3 px-4 w-full rounded-lg shadow-md flex items-center justify-center"
            onClick={() => setShowAddModal(true)}
          >
            <Plus size={20} className="mr-2" />
            Create New Event
          </motion.button>
        </div>
        
        <div className="space-y-4">
          {events.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No events planned yet. Create your first event!
            </div>
          ) : (
            events.map((event) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
              >
                <div className="p-4 border-b dark:border-gray-700">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium text-lg">{event.title}</h3>
                    <button 
                      onClick={() => handleDeleteEvent(event.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    {format(new Date(event.date), 'EEEE, MMMM d, yyyy • h:mm a')}
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="flex items-start mb-3">
                    <div className="mr-2 mt-1 text-gray-600 dark:text-gray-400">📍</div>
                    <div>{event.location}</div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="mr-2 mt-1 text-gray-600 dark:text-gray-400">
                      <Users size={16} />
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        Participants ({event.participants.length})
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {event.participants.map((person, i) => (
                          <span 
                            key={i} 
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                          >
                            {person}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </main>
      
      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md"
          >
            <div className="p-4 border-b dark:border-gray-700">
              <h2 className="text-xl font-semibold">Create New Event</h2>
            </div>
            
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Event Title *</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                  placeholder="Study Group, Party, etc."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Date & Time *</label>
                <input
                  type="datetime-local"
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                  value={newEvent.date}
                  onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Location *</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                  value={newEvent.location}
                  onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
                  placeholder="Library, Dorm, etc."
                />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium">Participants</label>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleAddParticipant}
                    className="text-xs"
                  >
                    <Plus size={14} className="mr-1" />
                    Add
                  </Button>
                </div>
                
                <div className="flex flex-wrap gap-2 bg-gray-50 dark:bg-gray-700 p-2 rounded-md min-h-[60px]">
                  {newEvent.participants.map((person, i) => (
                    <span 
                      key={i} 
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                    >
                      {person}
                      {person !== 'Me' && (
                        <button 
                          className="ml-1 text-blue-800 dark:text-blue-300 hover:text-blue-900"
                          onClick={() => {
                            setNewEvent({
                              ...newEvent, 
                              participants: newEvent.participants.filter(p => p !== person)
                            });
                          }}
                        >
                          ×
                        </button>
                      )}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="p-4 flex space-x-2 justify-end border-t dark:border-gray-700">
              <Button variant="outline" onClick={() => setShowAddModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddEvent}>
                Create Event
              </Button>
            </div>
          </motion.div>
        </div>
      )}
      
      <NavBar />
    </div>
  );
};

export default PlanningPage;
