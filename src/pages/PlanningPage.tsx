
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Plus, Trash2, Users, Award, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

import EnhancedNavBar from '@/components/EnhancedNavBar';
import { Button } from '@/components/ui/button';
import ParticleBackground from '@/components/ParticleBackground';
import { Card, CardContent } from '@/components/ui/card';
import CostBreakdown from '@/components/planning/CostBreakdown';
import TaskAssignment from '@/components/planning/TaskAssignment';
import AchievementSystem from '@/components/planning/AchievementSystem';
import EnhancedLogoBadge from '@/components/EnhancedLogoBadge';

type Event = {
  id: string;
  title: string;
  date: string;
  participants: string[];
  location: string;
};

type ActiveTabType = 'details' | 'costs' | 'tasks' | 'achievements';

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
  
  const [activeEvent, setActiveEvent] = useState<Event | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveTabType>('details');
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
    if (activeEvent?.id === id) {
      setActiveEvent(null);
    }
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
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const childVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };
  
  return (
    <div className="min-h-screen pb-28 bg-gradient-to-br from-blue-100 to-blue-50 dark:from-gray-900 dark:to-theme-navy/80">
      <ParticleBackground count={20} theme="finances" className="opacity-30" />
      
      <header className="bg-white bg-opacity-80 dark:bg-gray-900/80 backdrop-blur-lg shadow-md py-4 px-4">
        <div className="container mx-auto max-w-md">
          <div className="flex items-center justify-center">
            <Calendar size={24} className="mr-3 text-theme-pink" />
            <EnhancedLogoBadge size="sm" animated={false} />
            <span className="ml-2 text-2xl font-bold">Planning</span>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-6 max-w-md">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {!activeEvent && (
            <>
              <motion.div variants={childVariants}>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold flex items-center">
                    <Sparkles className="mr-2 text-theme-pink" size={20} />
                    Your Events
                  </h2>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-theme-pink text-white py-2 px-3 rounded-lg shadow-md flex items-center justify-center"
                    onClick={() => setShowAddModal(true)}
                  >
                    <Plus size={18} className="mr-1" />
                    Create Event
                  </motion.button>
                </div>
              </motion.div>
              
              {events.length === 0 ? (
                <motion.div 
                  variants={childVariants}
                  className="text-center py-8 text-gray-500 bg-white dark:bg-gray-800 rounded-lg shadow-md"
                >
                  <Calendar className="mx-auto mb-3 text-gray-400" size={40} />
                  <p>No events planned yet. Create your first event!</p>
                  <Button 
                    className="mt-4"
                    onClick={() => setShowAddModal(true)}
                  >
                    <Plus size={16} className="mr-2" />
                    Create Event
                  </Button>
                </motion.div>
              ) : (
                <div className="space-y-4">
                  {events.map((event) => (
                    <motion.div
                      key={event.id}
                      variants={childVariants}
                      whileHover={{ scale: 1.02 }}
                      className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-100 dark:border-gray-700"
                    >
                      <div className="p-4 border-b dark:border-gray-700">
                        <div className="flex justify-between items-start">
                          <div 
                            className="flex-1 cursor-pointer"
                            onClick={() => setActiveEvent(event)}
                          >
                            <h3 className="font-medium text-lg text-theme-pink">{event.title}</h3>
                            <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                              {format(new Date(event.date), 'EEEE, MMMM d, yyyy • h:mm a')}
                            </div>
                          </div>
                          <button 
                            onClick={() => handleDeleteEvent(event.id)}
                            className="text-red-500 hover:text-red-700 p-1"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                      
                      <div className="p-4">
                        <div className="flex items-start mb-3">
                          <div className="mr-2 mt-1 text-gray-500 dark:text-gray-400">📍</div>
                          <div>{event.location}</div>
                        </div>
                        
                        <div className="flex items-start">
                          <div className="mr-2 mt-1 text-gray-500 dark:text-gray-400">
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
                                  className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300"
                                >
                                  {person}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                        
                        <Button
                          variant="outline"
                          className="w-full mt-4"
                          onClick={() => setActiveEvent(event)}
                        >
                          View Details
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </>
          )}
          
          {activeEvent && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="mb-4 flex items-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setActiveEvent(null);
                    setActiveTab('details');
                  }}
                >
                  ← Back to Events
                </Button>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-4">
                <h2 className="text-xl font-semibold text-theme-pink">{activeEvent.title}</h2>
                <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  {format(new Date(activeEvent.date), 'EEEE, MMMM d, yyyy • h:mm a')}
                </div>
                <div className="mt-3 flex items-center text-sm">
                  <span className="text-gray-500 dark:text-gray-400 mr-2">📍</span>
                  {activeEvent.location}
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md mb-4 overflow-hidden">
                <div className="flex border-b dark:border-gray-700">
                  <button
                    onClick={() => setActiveTab('details')}
                    className={`flex-1 py-3 px-4 text-sm font-medium ${
                      activeTab === 'details' 
                        ? 'bg-theme-pink/10 text-theme-pink border-b-2 border-theme-pink' 
                        : 'text-gray-600 dark:text-gray-300'
                    }`}
                  >
                    Details
                  </button>
                  <button
                    onClick={() => setActiveTab('costs')}
                    className={`flex-1 py-3 px-4 text-sm font-medium ${
                      activeTab === 'costs' 
                        ? 'bg-theme-pink/10 text-theme-pink border-b-2 border-theme-pink' 
                        : 'text-gray-600 dark:text-gray-300'
                    }`}
                  >
                    Costs
                  </button>
                  <button
                    onClick={() => setActiveTab('tasks')}
                    className={`flex-1 py-3 px-4 text-sm font-medium ${
                      activeTab === 'tasks' 
                        ? 'bg-theme-pink/10 text-theme-pink border-b-2 border-theme-pink' 
                        : 'text-gray-600 dark:text-gray-300'
                    }`}
                  >
                    Tasks
                  </button>
                  <button
                    onClick={() => setActiveTab('achievements')}
                    className={`flex-1 py-3 px-4 text-sm font-medium ${
                      activeTab === 'achievements' 
                        ? 'bg-theme-pink/10 text-theme-pink border-b-2 border-theme-pink' 
                        : 'text-gray-600 dark:text-gray-300'
                    }`}
                  >
                    <Award size={14} className="inline mr-1" />
                  </button>
                </div>
                
                <div className="p-4">
                  <AnimatePresence mode="wait">
                    {activeTab === 'details' && (
                      <motion.div
                        key="details"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <div className="space-y-4">
                          <div>
                            <h3 className="text-lg font-medium mb-2">About This Event</h3>
                            <p className="text-gray-600 dark:text-gray-300 text-sm">
                              {activeEvent.title} is scheduled for {format(new Date(activeEvent.date), 'MMMM d, yyyy')} at {activeEvent.location}.
                              This event has {activeEvent.participants.length} participants.
                            </p>
                          </div>
                          
                          <div>
                            <h3 className="text-lg font-medium mb-2">Participants</h3>
                            <div className="flex flex-wrap gap-2">
                              {activeEvent.participants.map((person, i) => (
                                <span 
                                  key={i} 
                                  className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300"
                                >
                                  {person}
                                  {person !== 'Me' && (
                                    <button 
                                      className="ml-1 text-blue-800 dark:text-blue-300 hover:text-blue-900"
                                      onClick={() => {}}
                                    >
                                      ×
                                    </button>
                                  )}
                                </span>
                              ))}
                              <button
                                onClick={() => {}}
                                className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                              >
                                <Plus size={12} className="mr-1" />
                                Add
                              </button>
                            </div>
                          </div>
                          
                          <div>
                            <h3 className="text-lg font-medium mb-2">Event Location</h3>
                            <div className="bg-gray-100 dark:bg-gray-700 h-40 rounded-lg flex items-center justify-center">
                              <p className="text-sm text-gray-500">Map view coming soon</p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                    
                    {activeTab === 'costs' && (
                      <motion.div
                        key="costs"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <CostBreakdown eventId={activeEvent.id} />
                      </motion.div>
                    )}
                    
                    {activeTab === 'tasks' && (
                      <motion.div
                        key="tasks"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <TaskAssignment 
                          eventId={activeEvent.id} 
                          members={activeEvent.participants}
                        />
                      </motion.div>
                    )}
                    
                    {activeTab === 'achievements' && (
                      <motion.div
                        key="achievements"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <AchievementSystem />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </main>
      
      {/* Add event modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md shadow-xl"
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
      
      <EnhancedNavBar />
    </div>
  );
};

export default PlanningPage;
