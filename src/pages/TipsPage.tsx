
import React, { useState, useEffect } from 'react';
import NavBar from '@/components/NavBar';
import { Moon, Sun, BookOpen, Star, Coffee, DollarSign, Briefcase, GraduationCap } from 'lucide-react';
import { motion } from 'framer-motion';
import { Toggle } from '@/components/ui/toggle';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Tip {
  id: string;
  title: string;
  content: string;
  category: 'student' | 'budgeting' | 'saving' | 'earning' | 'investing';
  isFeatured?: boolean;
}

const TipsPage: React.FC = () => {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('darkMode') === 'true';
    }
    return false;
  });
  
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const tips: Tip[] = [
    {
      id: '1',
      title: 'The 50/30/20 Rule',
      content: 'Split your income: 50% for needs, 30% for wants, and 20% for savings. This simple rule can help you balance spending and saving.',
      category: 'budgeting',
      isFeatured: true
    },
    {
      id: '2',
      title: 'Student Meal Prep',
      content: 'Cook meals in bulk on weekends to save money and time during busy weekdays. Freeze portions for later use.',
      category: 'student'
    },
    {
      id: '3',
      title: 'Emergency Fund',
      content: 'Build an emergency fund that covers 3-6 months of basic expenses. Start with small contributions and be consistent.',
      category: 'saving',
      isFeatured: true
    },
    {
      id: '4',
      title: 'Textbook Savings',
      content: 'Look for used textbooks, international editions, or digital versions. Also check if your university library has copies available.',
      category: 'student'
    },
    {
      id: '5',
      title: 'Side Hustle Ideas',
      content: 'Consider tutoring, content creation, or freelance work in your field of study as ways to earn extra money while studying.',
      category: 'earning'
    },
    {
      id: '6',
      title: 'Student Discounts',
      content: 'Always ask if student discounts are available for services and products. Your student ID can save you significant money.',
      category: 'student'
    },
    {
      id: '7',
      title: 'Compound Interest',
      content: 'Start investing early, even small amounts. Compound interest grows your money over time - the earlier you start, the better.',
      category: 'investing'
    },
  ];
  
  const filteredTips = selectedCategory 
    ? tips.filter(tip => tip.category === selectedCategory)
    : tips;
    
  const featuredTip = tips.find(tip => tip.isFeatured);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    if (typeof window !== 'undefined') {
      localStorage.setItem('darkMode', darkMode.toString());
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };
  
  const getCategoryIcon = (category: string) => {
    switch(category) {
      case 'student':
        return <GraduationCap className="mr-1" size={16} />;
      case 'budgeting':
        return <DollarSign className="mr-1" size={16} />;
      case 'saving':
        return <Coffee className="mr-1" size={16} />;
      case 'earning':
        return <Briefcase className="mr-1" size={16} />;
      case 'investing':
        return <Star className="mr-1" size={16} />;
      default:
        return <BookOpen className="mr-1" size={16} />;
    }
  };
  
  const getCategoryColor = (category: string) => {
    switch(category) {
      case 'student':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      case 'budgeting':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'saving':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'earning':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300';
      case 'investing':
        return 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  return (
    <div className={`min-h-screen pb-28 ${darkMode ? 'dark bg-gray-900 text-white' : 'bg-gray-50'}`}>
      <motion.header 
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`relative ${darkMode ? 'bg-theme-navy' : 'bg-gradient-to-r from-theme-indigo to-theme-teal'} text-white py-6 px-4 shadow-lg`}
      >
        <div className="container mx-auto max-w-md">
          <motion.h1 
            className="text-3xl font-bold flex items-center justify-center"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >Financial</motion.span>
            <motion.span 
              className="ml-2 text-theme-pink"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >Tips</motion.span>
          </motion.h1>
          <motion.p 
            className="text-center text-sm opacity-90 mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            Smart money advice for students
          </motion.p>
        </div>
        
        <Toggle 
          className="absolute top-4 right-4 p-2 rounded-full"
          pressed={darkMode}
          onPressedChange={toggleDarkMode}
          aria-label="Toggle dark mode"
        >
          {darkMode ? <Sun size={18} className="animate-pulse-soft" /> : <Moon size={18} />}
        </Toggle>
      </motion.header>
      
      <main className="container mx-auto px-4 py-4 space-y-6 max-w-md">
        {/* Featured Tip */}
        {featuredTip && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="bg-gradient-to-r from-theme-pink/10 to-theme-indigo/10 dark:from-theme-pink/20 dark:to-theme-indigo/20 border border-theme-pink/20">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-xl text-theme-pink">Featured Tip</CardTitle>
                  <Badge className={getCategoryColor(featuredTip.category)}>
                    <div className="flex items-center">
                      {getCategoryIcon(featuredTip.category)}
                      {featuredTip.category.charAt(0).toUpperCase() + featuredTip.category.slice(1)}
                    </div>
                  </Badge>
                </div>
                <CardDescription className="text-lg font-medium mt-2">{featuredTip.title}</CardDescription>
              </CardHeader>
              <CardContent>
                <p>{featuredTip.content}</p>
              </CardContent>
            </Card>
          </motion.div>
        )}
        
        {/* Category Filters */}
        <motion.div 
          className="flex flex-wrap gap-2 pb-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <Badge 
            className={`cursor-pointer ${!selectedCategory ? 'bg-theme-pink hover:bg-theme-pink/90' : 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'}`}
            onClick={() => setSelectedCategory(null)}
          >
            All
          </Badge>
          
          {Array.from(new Set(tips.map(tip => tip.category))).map(category => (
            <Badge 
              key={category}
              className={`cursor-pointer ${selectedCategory === category ? 'bg-theme-pink hover:bg-theme-pink/90' : 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'}`}
              onClick={() => setSelectedCategory(category)}
            >
              <div className="flex items-center">
                {getCategoryIcon(category)}
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </div>
            </Badge>
          ))}
        </motion.div>
        
        {/* Tips List */}
        <div className="space-y-4">
          {filteredTips.map((tip, index) => (
            <motion.div
              key={tip.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <Card className={tip.isFeatured ? 'hidden' : ''}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{tip.title}</CardTitle>
                    <Badge className={getCategoryColor(tip.category)}>
                      <div className="flex items-center">
                        {getCategoryIcon(tip.category)}
                        <span className="hidden sm:inline">{tip.category.charAt(0).toUpperCase() + tip.category.slice(1)}</span>
                      </div>
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{tip.content}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </main>
      
      <NavBar />
    </div>
  );
};

export default TipsPage;
