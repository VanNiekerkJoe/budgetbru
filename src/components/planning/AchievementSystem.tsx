
import React from 'react';
import { motion } from 'framer-motion';
import { BadgeGlow } from '../ui/badge-glow';
import { Award, Calendar, CheckCircle2, Flag, Target, Users } from 'lucide-react';

type AchievementProps = {
  title: string;
  description: string;
  progress: number;
  maxProgress: number;
  icon: React.ReactNode;
  unlocked: boolean;
};

const Achievement: React.FC<AchievementProps> = ({
  title,
  description,
  progress,
  maxProgress,
  icon,
  unlocked
}) => {
  const progressPercentage = (progress / maxProgress) * 100;
  
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`relative rounded-lg p-4 border ${
        unlocked 
          ? 'bg-gradient-to-br from-theme-pink/10 to-theme-teal/10 border-theme-pink/30'
          : 'bg-gray-100 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700'
      }`}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-12 h-12 rounded-lg ${
          unlocked 
            ? 'bg-gradient-to-br from-theme-pink to-theme-teal text-white'
            : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
        } flex items-center justify-center`}>
          {icon}
        </div>
        <div>
          <h4 className="font-medium">{title}</h4>
          <p className="text-xs text-gray-600 dark:text-gray-400">{description}</p>
        </div>
      </div>
      
      <div className="mt-2">
        <div className="flex justify-between text-xs mb-1">
          <span>{progress} / {maxProgress}</span>
          <span>{progressPercentage.toFixed(0)}%</span>
        </div>
        <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            className={`h-full ${
              unlocked 
                ? 'bg-gradient-to-r from-theme-pink to-theme-teal'
                : 'bg-gray-400 dark:bg-gray-500'
            }`}
          />
        </div>
      </div>
      
      {unlocked && (
        <BadgeGlow className="absolute top-2 right-2" glowColor="rgba(202, 82, 154, 0.6)">
          <div className="bg-theme-pink text-white text-xs px-2 py-0.5 rounded-full flex items-center">
            <CheckCircle2 size={10} className="mr-0.5" />
            Unlocked
          </div>
        </BadgeGlow>
      )}
    </motion.div>
  );
};

const AchievementSystem: React.FC = () => {
  const achievements = [
    {
      id: '1',
      title: 'Planner Extraordinaire',
      description: 'Create your first 3 events',
      progress: 2,
      maxProgress: 3,
      icon: <Calendar size={24} />,
      unlocked: false
    },
    {
      id: '2',
      title: 'Task Master',
      description: 'Complete 10 tasks across events',
      progress: 10,
      maxProgress: 10,
      icon: <CheckCircle2 size={24} />,
      unlocked: true
    },
    {
      id: '3',
      title: 'Squad Goals',
      description: 'Add 5 friends to your planning groups',
      progress: 3,
      maxProgress: 5,
      icon: <Users size={24} />,
      unlocked: false
    },
    {
      id: '4',
      title: 'Budget Buddy',
      description: 'Track expenses for 3 events',
      progress: 2,
      maxProgress: 3,
      icon: <Flag size={24} />,
      unlocked: false
    }
  ];
  
  const completedAchievements = achievements.filter(a => a.unlocked).length;
  const totalAchievements = achievements.length;
  const completionPercentage = (completedAchievements / totalAchievements) * 100;
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium flex items-center gap-2">
          <Award className="text-theme-pink" size={20} />
          Achievements
        </h3>
        <span className="text-sm text-gray-500">
          {completedAchievements}/{totalAchievements} Unlocked
        </span>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Overall Progress</span>
          <span className="text-sm">{completionPercentage.toFixed(0)}%</span>
        </div>
        <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${completionPercentage}%` }}
            className="h-full bg-gradient-to-r from-theme-pink to-purple-500"
          />
        </div>
        
        <div className="flex justify-center mt-3">
          <div className="relative">
            <svg className="w-20 h-20">
              <circle 
                cx="40" 
                cy="40" 
                r="35"
                stroke="currentColor" 
                strokeWidth="5"
                fill="none"
                className="text-gray-200 dark:text-gray-700"
              />
              <circle 
                cx="40" 
                cy="40" 
                r="35"
                stroke="currentColor" 
                strokeWidth="5"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 35}`}
                strokeDashoffset={`${2 * Math.PI * 35 * (1 - completionPercentage / 100)}`}
                className="text-theme-pink transform -rotate-90 origin-center"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-lg font-bold">
              {completionPercentage.toFixed(0)}%
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        {achievements.map((achievement) => (
          <Achievement 
            key={achievement.id}
            {...achievement}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default AchievementSystem;
