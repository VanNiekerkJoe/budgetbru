import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { School, Heart, Flag, Star, Calendar } from 'lucide-react';
import { toast } from 'sonner';

import NavBar from '@/components/NavBar';
import ParticleBackground from '@/components/ParticleBackground';

type Event = {
  id: string;
  title: string;
  date: string;
  location: string;
  image: string;
  likes: number;
  category: 'social' | 'academic' | 'sports' | 'arts';
};

type VibePost = {
  id: string;
  author: string;
  content: string;
  likes: number;
  comments: number;
  date: string;
  isLiked: boolean;
};

const VibesHubPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'events' | 'vibes'>('events');
  const [events] = useState<Event[]>([
    {
      id: '1',
      title: 'Campus Night Market',
      date: 'Apr 8, 2025',
      location: 'Student Center',
      image: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=300&q=80',
      likes: 45,
      category: 'social'
    },
    {
      id: '2',
      title: 'End of Semester Party',
      date: 'May 15, 2025',
      location: 'Club XYZ',
      image: 'https://images.unsplash.com/photo-1615729947596-a598e5de0ab3?auto=format&fit=crop&w=300&q=80',
      likes: 112,
      category: 'social'
    },
    {
      id: '3',
      title: 'Exam Prep Workshop',
      date: 'Apr 20, 2025',
      location: 'Library Hall',
      image: 'https://images.unsplash.com/photo-1721322800607-8c38375eef04?auto=format&fit=crop&w=300&q=80',
      likes: 28,
      category: 'academic'
    }
  ]);
  
  const [vibePosts] = useState<VibePost[]>([
    {
      id: '1',
      author: 'JohannesBRU',
      content: 'Just aced my Economics final! Celebrating at Aandklas tonight if anyone wants to join! 🎉',
      likes: 24,
      comments: 5,
      date: '2 hours ago',
      isLiked: false
    },
    {
      id: '2',
      author: 'MphoVibes',
      content: "The campus food court is serving free coffee today until 2pm. Get it while it's hot! ☕",
      likes: 42,
      comments: 8,
      date: '4 hours ago',
      isLiked: true
    },
    {
      id: '3',
      author: 'LekkerLeigh',
      content: 'Has anyone seen my blue notebook? Left it in the physics lab yesterday afternoon.',
      likes: 3,
      comments: 12,
      date: '1 day ago',
      isLiked: false
    }
  ]);
  
  const [likedEvents, setLikedEvents] = useState<Record<string, boolean>>({});
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({
    '2': true
  });

  const handleLikeEvent = (id: string) => {
    setLikedEvents(prev => {
      const isCurrentlyLiked = prev[id];
      if (isCurrentlyLiked) {
        toast.info('Removed from favorites');
      } else {
        toast.success('Added to favorites');
      }
      return { ...prev, [id]: !isCurrentlyLiked };
    });
  };
  
  const handleLikePost = (id: string) => {
    setLikedPosts(prev => {
      const isCurrentlyLiked = prev[id];
      return { ...prev, [id]: !isCurrentlyLiked };
    });
  };
  
  return (
    <div className="min-h-screen pb-28 bg-gradient-to-br from-pink-100 to-purple-100 dark:from-theme-pink/30 dark:to-theme-indigo/50">
      <ParticleBackground count={20} theme="jols" className="opacity-30" />
      
      <header className="bg-white bg-opacity-80 dark:bg-gray-900 dark:bg-opacity-80 backdrop-blur-lg shadow-md py-4 px-4">
        <div className="container mx-auto max-w-md">
          <h1 className="text-2xl font-bold flex items-center justify-center">
            <School size={24} className="mr-2 text-theme-pink" />
            Varsity Vibes Hub
          </h1>
        </div>
      </header>
      
      <div className="container mx-auto px-4 py-6 max-w-md">
        <div className="flex bg-white dark:bg-gray-800 rounded-lg shadow-md mb-6 p-1">
          <button
            className={`flex-1 py-2 px-4 rounded-md ${
              activeTab === 'events' 
                ? 'bg-theme-pink text-white' 
                : 'text-gray-700 dark:text-gray-300'
            }`}
            onClick={() => setActiveTab('events')}
          >
            <div className="flex items-center justify-center">
              <Calendar size={16} className="mr-2" />
              Events
            </div>
          </button>
          <button
            className={`flex-1 py-2 px-4 rounded-md ${
              activeTab === 'vibes' 
                ? 'bg-theme-pink text-white' 
                : 'text-gray-700 dark:text-gray-300'
            }`}
            onClick={() => setActiveTab('vibes')}
          >
            <div className="flex items-center justify-center">
              <Star size={16} className="mr-2" />
              Vibes
            </div>
          </button>
        </div>
        
        {activeTab === 'events' ? (
          <div className="space-y-4">
            <div className="flex justify-between mb-3">
              <h2 className="text-lg font-semibold">Upcoming Events</h2>
            </div>
            
            {events.map((event) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
              >
                <div className="relative h-36 overflow-hidden">
                  <img 
                    src={event.image} 
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent">
                    <div className="text-white font-medium">{event.title}</div>
                    <div className="text-white/90 text-sm">{event.date}</div>
                  </div>
                  <div className="absolute top-2 right-2">
                    <button 
                      className={`rounded-full p-1 ${likedEvents[event.id] ? 'bg-pink-100 text-pink-600' : 'bg-gray-200/80 text-gray-600'}`}
                      onClick={() => handleLikeEvent(event.id)}
                    >
                      <Heart size={18} fill={likedEvents[event.id] ? "#ec4899" : "none"} />
                    </button>
                  </div>
                  <div className="absolute top-2 left-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      event.category === 'social' ? 'bg-purple-100 text-purple-700' :
                      event.category === 'academic' ? 'bg-blue-100 text-blue-700' :
                      event.category === 'sports' ? 'bg-green-100 text-green-700' :
                      'bg-orange-100 text-orange-700'
                    }`}>
                      {event.category}
                    </span>
                  </div>
                </div>
                
                <div className="p-3 flex items-center justify-between">
                  <div className="flex items-center text-gray-600 dark:text-gray-300 text-sm">
                    <Flag size={14} className="mr-1" />
                    {event.location}
                  </div>
                  
                  <div className="flex items-center text-gray-600 dark:text-gray-300 text-sm">
                    <Heart size={14} className="mr-1 text-pink-500" />
                    {event.likes + (likedEvents[event.id] ? 1 : 0)}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between mb-3">
              <h2 className="text-lg font-semibold">Campus Vibes</h2>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-4">
              <div className="relative">
                <textarea 
                  className="w-full p-3 pr-20 border rounded-lg dark:bg-gray-700 dark:border-gray-600 resize-none" 
                  rows={2}
                  placeholder="Share your campus vibes..."
                />
                <button 
                  className="absolute right-2 bottom-2 bg-theme-pink text-white rounded-full p-2"
                  onClick={() => toast.info('Post feature coming soon!')}
                >
                  <Flag size={18} />
                </button>
              </div>
            </div>
            
            {vibePosts.map((post) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4"
              >
                <div className="flex items-center mb-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-theme-pink to-purple-500 flex items-center justify-center text-white font-bold">
                    {post.author.charAt(0)}
                  </div>
                  <div className="ml-3">
                    <div className="font-medium dark:text-white">{post.author}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{post.date}</div>
                  </div>
                </div>
                
                <p className="text-gray-800 dark:text-gray-200 mb-4">{post.content}</p>
                
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                  <button 
                    className="flex items-center hover:text-theme-pink transition-colors"
                    onClick={() => handleLikePost(post.id)}
                  >
                    <Heart 
                      size={16} 
                      className="mr-1" 
                      fill={likedPosts[post.id] ? "#ec4899" : "none"} 
                      stroke={likedPosts[post.id] ? "#ec4899" : "currentColor"}
                    />
                    {post.likes + (likedPosts[post.id] ? 1 : 0)}
                  </button>
                  
                  <button 
                    className="flex items-center hover:text-theme-pink transition-colors"
                    onClick={() => toast.info('Comments feature coming soon!')}
                  >
                    <span className="mr-1">💬</span>
                    {post.comments}
                  </button>
                  
                  <button 
                    className="flex items-center hover:text-theme-pink transition-colors"
                    onClick={() => toast.info('Share feature coming soon!')}
                  >
                    <span className="mr-1">↗️</span>
                    Share
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
      
      <NavBar />
    </div>
  );
};

export default VibesHubPage;
