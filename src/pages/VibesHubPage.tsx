
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { School, Heart, Flag, Star, Calendar, MessageCircle, Share2 } from 'lucide-react';
import { toast } from 'sonner';


import ParticleBackground from '@/components/ParticleBackground';
import EnhancedLogoBadge from '@/components/EnhancedLogoBadge';
import { BadgeGlow } from '@/components/ui/badge-glow';

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

  const [newPost, setNewPost] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<Event['category'] | 'all'>('all');

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
      if (isCurrentlyLiked) {
        toast.info('Removed like');
      } else {
        toast.success('Post liked! +2 points');
      }
      return { ...prev, [id]: !isCurrentlyLiked };
    });
  };
  
  const handleSubmitPost = () => {
    if (newPost.trim()) {
      toast.success('Your vibes have been shared! +5 points');
      setNewPost('');
    } else {
      toast.error('Please write something to share');
    }
  };
  
  const filteredEvents = categoryFilter === 'all' 
    ? events 
    : events.filter(event => event.category === categoryFilter);
  
  // Animation variants
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

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };
  
  return (
    <div className="min-h-screen pb-28 bg-gradient-to-br from-pink-100 to-purple-100 dark:from-theme-pink/10 dark:to-theme-indigo/30">
      <ParticleBackground count={30} theme="jols" className="opacity-40" />
      
      <header className="bg-white bg-opacity-80 dark:bg-gray-900/80 backdrop-blur-lg shadow-lg py-4 px-4 sticky top-0 z-10">
        <div className="container mx-auto max-w-md">
          <div className="flex items-center justify-center">
            <BadgeGlow>
              <School size={24} className="mr-3 text-theme-pink" />
            </BadgeGlow>
            <EnhancedLogoBadge size="sm" animated={false} />
            <span className="ml-2 text-2xl font-bold">Vibes</span>
          </div>
        </div>
      </header>
      
      <div className="container mx-auto px-4 py-6 max-w-md">
        <motion.div
          className="flex bg-white dark:bg-gray-800 rounded-lg shadow-md mb-6 p-1.5 glass-panel"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <button
            className={`flex-1 py-2.5 px-4 rounded-md ${
              activeTab === 'events' 
                ? 'bg-theme-pink text-white shadow-md' 
                : 'text-gray-700 dark:text-gray-300'
            } transition-all duration-300`}
            onClick={() => setActiveTab('events')}
          >
            <div className="flex items-center justify-center">
              <Calendar size={18} className="mr-2" />
              Events
            </div>
          </button>
          <button
            className={`flex-1 py-2.5 px-4 rounded-md ${
              activeTab === 'vibes' 
                ? 'bg-theme-pink text-white shadow-md' 
                : 'text-gray-700 dark:text-gray-300'
            } transition-all duration-300`}
            onClick={() => setActiveTab('vibes')}
          >
            <div className="flex items-center justify-center">
              <Star size={18} className="mr-2" />
              Vibes
            </div>
          </button>
        </motion.div>
        
        <AnimatePresence mode="wait">
          {activeTab === 'events' ? (
            <motion.div 
              key="events"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <motion.div variants={itemVariants} className="mb-6">
                <div className="flex justify-between mb-3">
                  <h2 className="text-lg font-semibold flex items-center">
                    <Calendar size={18} className="mr-2 text-theme-pink" />
                    Upcoming Events
                  </h2>
                  
                  <div className="relative">
                    <select
                      className="text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md px-2 py-1"
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value as Event['category'] | 'all')}
                    >
                      <option value="all">All Categories</option>
                      <option value="social">Social</option>
                      <option value="academic">Academic</option>
                      <option value="sports">Sports</option>
                      <option value="arts">Arts</option>
                    </select>
                  </div>
                </div>
                
                <motion.div 
                  className="flex gap-2 flex-nowrap overflow-x-auto pb-2"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                >
                  {['all', 'social', 'academic', 'sports', 'arts'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setCategoryFilter(cat as Event['category'] | 'all')}
                      className={`px-3 py-1.5 rounded-full text-xs whitespace-nowrap ${
                        categoryFilter === cat
                          ? 'bg-theme-pink text-white'
                          : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                      } border border-gray-200 dark:border-gray-700`}
                    >
                      {cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </button>
                  ))}
                </motion.div>
              </motion.div>
              
              {filteredEvents.map((event) => (
                <motion.div
                  key={event.id}
                  variants={itemVariants}
                  whileHover={{ y: -5 }}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-100 dark:border-gray-700"
                >
                  <div className="relative h-40 overflow-hidden">
                    <img 
                      src={event.image} 
                      alt={event.title}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    />
                    <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90 via-black/60 to-transparent">
                      <div className="text-white font-medium text-lg">{event.title}</div>
                      <div className="text-white/90 text-sm flex items-center">
                        <Calendar size={14} className="mr-1 opacity-70" />
                        {event.date}
                      </div>
                    </div>
                    <div className="absolute top-2 right-2">
                      <motion.button 
                        className={`rounded-full p-2 ${likedEvents[event.id] ? 'bg-pink-100 text-pink-600' : 'bg-gray-200/80 text-gray-600'}`}
                        onClick={() => handleLikeEvent(event.id)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Heart size={18} fill={likedEvents[event.id] ? "#ec4899" : "none"} />
                      </motion.button>
                    </div>
                    <div className="absolute top-2 left-2">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                        event.category === 'social' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300' :
                        event.category === 'academic' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' :
                        event.category === 'sports' ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300' :
                        'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300'
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
              
              {filteredEvents.length === 0 && (
                <motion.div 
                  variants={itemVariants}
                  className="text-center py-12 text-gray-500 bg-white dark:bg-gray-800/50 rounded-lg shadow-md"
                >
                  <Calendar className="mx-auto mb-3 text-gray-400" size={40} />
                  <p>No {categoryFilter !== 'all' ? categoryFilter : ''} events found</p>
                </motion.div>
              )}
            </motion.div>
          ) : (
            <motion.div 
              key="vibes"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <motion.div variants={itemVariants}>
                <div className="flex justify-between mb-3">
                  <h2 className="text-lg font-semibold flex items-center">
                    <Star size={18} className="mr-2 text-theme-pink" />
                    Campus Vibes
                  </h2>
                </div>
                
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-4 border border-gray-100 dark:border-gray-700">
                  <div className="relative">
                    <textarea 
                      className="w-full p-3 pr-20 border rounded-lg dark:bg-gray-700/80 dark:border-gray-600 resize-none focus:ring focus:ring-theme-pink/20 focus:border-theme-pink" 
                      rows={3}
                      placeholder="Share your campus vibes..."
                      value={newPost}
                      onChange={(e) => setNewPost(e.target.value)}
                    />
                    <motion.button 
                      className="absolute right-2 bottom-2 bg-theme-pink text-white rounded-full p-2"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={handleSubmitPost}
                    >
                      <Flag size={18} />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
              
              {vibePosts.map((post) => (
                <motion.div
                  key={post.id}
                  variants={itemVariants}
                  whileHover={{ y: -5 }}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border border-gray-100 dark:border-gray-700"
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
                    <motion.button 
                      className="flex items-center hover:text-theme-pink transition-colors"
                      onClick={() => handleLikePost(post.id)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {likedPosts[post.id] ? (
                        <BadgeGlow className="mr-1">
                          <Heart 
                            size={18}
                            fill="#ec4899" 
                            stroke="#ec4899"
                          />
                        </BadgeGlow>
                      ) : (
                        <Heart 
                          size={18}
                          className="mr-1" 
                          fill="none"
                        />
                      )}
                      {post.likes + (likedPosts[post.id] ? 1 : 0)}
                    </motion.button>
                    
                    <motion.button 
                      className="flex items-center hover:text-theme-pink transition-colors"
                      onClick={() => toast.info('Comments feature coming soon!')}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <MessageCircle size={18} className="mr-1" />
                      {post.comments}
                    </motion.button>
                    
                    <motion.button 
                      className="flex items-center hover:text-theme-pink transition-colors"
                      onClick={() => toast.info('Share feature coming soon!')}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Share2 size={18} className="mr-1" />
                      Share
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <EnhancedNavBar />
    </div>
  );
};

export default VibesHubPage;
