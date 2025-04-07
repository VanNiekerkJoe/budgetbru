
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface TutorialStep {
  title: string;
  description: string;
  image?: string;
  highlight?: string;
}

interface TutorialGuideProps {
  onComplete: () => void;
  onSkip: () => void;
}

const TutorialGuide: React.FC<TutorialGuideProps> = ({ onComplete, onSkip }) => {
  const [currentStep, setCurrentStep] = useState(0);
  
  const tutorialSteps: TutorialStep[] = [
    {
      title: "Welcome to BudgetBru!",
      description: "Your personal finance companion for university life. Let's show you around!",
      highlight: "hero"
    },
    {
      title: "Track Your Expenses",
      description: "Add and categorize your expenses to keep track of your spending habits.",
      highlight: "expenses"
    },
    {
      title: "Campus Map",
      description: "Explore your campus and find the best deals around you.",
      highlight: "map"
    },
    {
      title: "Set Savings Goals",
      description: "Create and track savings goals to achieve your financial targets.",
      highlight: "savings"
    },
    {
      title: "Financial Insights",
      description: "Get personalized insights about your spending habits and tips to save more.",
      highlight: "insights"
    }
  ];
  
  const nextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };
  
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  return (
    <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm flex items-center justify-center">
      <AnimatePresence mode="wait">
        <motion.div 
          key={currentStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6 max-w-md w-full mx-4"
        >
          <div className="flex justify-between items-center mb-4">
            <Badge variant="outline" className="px-3 py-1">
              Step {currentStep + 1} of {tutorialSteps.length}
            </Badge>
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              onClick={onSkip}
            >
              <X size={18} />
            </Button>
          </div>
          
          <h3 className="text-2xl font-bold text-center mb-2 text-theme-pink">
            {tutorialSteps[currentStep].title}
          </h3>
          
          <div className="py-6">
            <div className="w-full h-40 mb-4 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
              <div className="text-4xl">{
                currentStep === 0 ? "💰" :
                currentStep === 1 ? "📊" :
                currentStep === 2 ? "🗺️" :
                currentStep === 3 ? "🎯" : "📈"
              }</div>
            </div>
            <p className="text-center text-gray-700 dark:text-gray-300">
              {tutorialSteps[currentStep].description}
            </p>
          </div>
          
          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 0}
              className="flex items-center"
            >
              <ChevronLeft size={16} className="mr-1" /> Previous
            </Button>
            
            <Button
              onClick={nextStep}
              className="flex items-center"
            >
              {currentStep < tutorialSteps.length - 1 ? (
                <>Next <ChevronRight size={16} className="ml-1" /></>
              ) : (
                "Get Started"
              )}
            </Button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default TutorialGuide;
