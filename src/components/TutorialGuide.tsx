
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Lightbulb, Book, Map, Target, BarChart3, Wallet, CreditCard, Bell, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface TutorialStep {
  title: string;
  description: string;
  image?: string;
  icon: React.ReactNode;
  tip?: string;
  highlight?: string;
  detailedSteps?: string[];
}

interface TutorialGuideProps {
  onComplete: () => void;
  onSkip: () => void;
}

const TutorialGuide: React.FC<TutorialGuideProps> = ({ onComplete, onSkip }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  
  const tutorialSteps: TutorialStep[] = [
    {
      title: "Welcome to BudgetBru!",
      description: "Your personal finance companion for university life. Let's show you around and discover how BudgetBru can help you manage your finances like a pro!",
      icon: <Lightbulb size={36} className="text-theme-pink" />,
      tip: "Pro Tip: You can restart this tutorial anytime from the settings menu.",
      highlight: "hero",
      detailedSteps: [
        "Create a budget that works for your student lifestyle",
        "Track all your expenses in one place",
        "Discover student deals and discounts around campus",
        "Set meaningful savings goals to achieve your dreams",
        "Gain insights into your spending patterns"
      ]
    },
    {
      title: "Track Your Expenses",
      description: "Easily add and categorize your expenses to monitor your spending habits. Set budgets for different categories and get alerts when you're close to your limit.",
      icon: <Book size={36} className="text-theme-indigo" />,
      tip: "Pro Tip: Take photos of receipts to automatically track expenses.",
      highlight: "expenses",
      detailedSteps: [
        "Add expenses with just a few taps",
        "Categorize your spending to understand where your money goes",
        "Set category budgets and receive notifications when you're approaching limits",
        "View your spending trends over time",
        "Upload receipt photos to maintain digital records"
      ]
    },
    {
      title: "Campus Map",
      description: "Explore your campus and find the best deals around you. Discover student discounts, affordable eats, and budget-friendly activities nearby.",
      icon: <Map size={36} className="text-theme-teal" />,
      tip: "Pro Tip: Check the map weekly as new student deals are constantly added.",
      highlight: "map",
      detailedSteps: [
        "Find student discounts near your current location",
        "Filter deals by categories like food, entertainment, or study resources",
        "Save your favorite spots for quick access",
        "Share great deals with friends",
        "Submit new student discounts you discover"
      ]
    },
    {
      title: "Set Savings Goals",
      description: "Create and track savings goals to achieve your financial targets. Whether it's for a spring break trip or a new laptop, BudgetBru helps you save smarter.",
      icon: <Target size={36} className="text-green-500" />,
      tip: "Pro Tip: Start small with achievable goals to build saving habits.",
      highlight: "savings",
      detailedSteps: [
        "Create custom savings goals with target amounts and deadlines",
        "Track your progress with visual indicators",
        "Set up automatic contributions from your income",
        "Celebrate when you reach milestones",
        "Adjust your goals as your priorities change"
      ]
    },
    {
      title: "Financial Insights",
      description: "Get personalized insights about your spending habits and tips to save more. Understand your money flow with beautiful charts and actionable recommendations.",
      icon: <BarChart3 size={36} className="text-purple-500" />,
      tip: "Pro Tip: Review your insights weekly to stay on top of your financial health.",
      highlight: "insights",
      detailedSteps: [
        "View your spending breakdown by category",
        "Identify trends in your financial behavior",
        "Receive personalized recommendations to improve your finances",
        "Compare your spending to previous months",
        "Export financial reports for your records"
      ]
    },
    {
      title: "Managing Income",
      description: "Keep track of all your income sources, from part-time jobs to bursaries and allowances. Set up recurring income entries to streamline your budget management.",
      icon: <Wallet size={36} className="text-green-500" />,
      tip: "Pro Tip: Record your income immediately when you receive it for accurate budgeting.",
      highlight: "income",
      detailedSteps: [
        "Add multiple income sources for a complete financial picture",
        "Set up recurring income for regular payments",
        "Track income history and patterns",
        "Categorize income types for better organization",
        "Plan your budget based on expected income"
      ]
    },
    {
      title: "Budget Planning",
      description: "Create a realistic budget that works for your student lifestyle. Allocate funds to different categories and adjust as needed to stay on track.",
      icon: <CreditCard size={36} className="text-blue-500" />,
      tip: "Pro Tip: The 50/30/20 rule suggests spending 50% on needs, 30% on wants, and 20% on savings.",
      highlight: "budget",
      detailedSteps: [
        "Set up a personalized budget plan",
        "Allocate funds to different spending categories",
        "Receive notifications when you exceed category limits",
        "Adjust your budget easily as circumstances change",
        "Learn budgeting principles tailored to student life"
      ]
    },
    {
      title: "Bill Reminders",
      description: "Never miss a payment deadline again. Set up reminders for recurring bills and expenses to avoid late fees and maintain a good payment history.",
      icon: <Bell size={36} className="text-amber-500" />,
      tip: "Pro Tip: Schedule reminders 2-3 days before the actual due date for a buffer.",
      highlight: "bills",
      detailedSteps: [
        "Create reminders for all your recurring bills",
        "Set custom notification schedules",
        "Mark bills as paid to track your payment history",
        "Prioritize bills based on urgency and amount",
        "Link bill payments to your expense tracking system"
      ]
    },
    {
      title: "Financial Security",
      description: "Protect your financial information and learn best practices for secure money management. Set up an emergency fund for unexpected expenses.",
      icon: <Shield size={36} className="text-red-500" />,
      tip: "Pro Tip: Aim to save enough to cover 3-6 months of basic expenses in your emergency fund.",
      highlight: "security",
      detailedSteps: [
        "Set up two-factor authentication for your account",
        "Learn to identify and avoid financial scams targeting students",
        "Create and build your emergency fund",
        "Understand privacy settings to protect your financial data",
        "Develop strategies for handling unexpected expenses"
      ]
    }
  ];
  
  const nextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setIsExiting(true);
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
        setIsExiting(false);
      }, 300);
    } else {
      onComplete();
    }
  };
  
  const prevStep = () => {
    if (currentStep > 0) {
      setIsExiting(true);
      setTimeout(() => {
        setCurrentStep(currentStep - 1);
        setIsExiting(false);
      }, 300);
    }
  };
  
  const progressPercentage = ((currentStep + 1) / tutorialSteps.length) * 100;
  
  return (
    <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm flex items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6 max-w-md w-full mx-4 relative overflow-hidden"
      >
        {/* Progress bar at the top */}
        <div className="absolute top-0 left-0 right-0">
          <Progress value={progressPercentage} className="h-1 rounded-none" />
        </div>
        
        <div className="flex justify-between items-center mb-5 pt-2">
          <Badge variant="outline" className="px-3 py-1 bg-theme-pink/10 text-theme-pink border-theme-pink/20">
            Step {currentStep + 1} of {tutorialSteps.length}
          </Badge>
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-full"
            onClick={onSkip}
          >
            <X size={18} />
          </Button>
        </div>
        
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: isExiting ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: isExiting ? 20 : -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-gray-100 dark:bg-gray-800">
                {tutorialSteps[currentStep].icon}
              </div>
              <h3 className="text-2xl font-bold text-theme-pink">
                {tutorialSteps[currentStep].title}
              </h3>
            </div>
            
            <div className="py-4">
              <div className="w-full h-44 mb-5 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-lg flex items-center justify-center overflow-hidden">
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-6xl"
                >
                  {currentStep === 0 ? "💰" :
                   currentStep === 1 ? "📊" :
                   currentStep === 2 ? "🗺️" :
                   currentStep === 3 ? "🎯" :
                   currentStep === 4 ? "📈" :
                   currentStep === 5 ? "💸" :
                   currentStep === 6 ? "📝" :
                   currentStep === 7 ? "⏰" : "🔒"}
                </motion.div>
              </div>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {tutorialSteps[currentStep].description}
              </p>
              
              {/* Detailed steps for each tutorial item */}
              {tutorialSteps[currentStep].detailedSteps && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mt-4 space-y-1"
                >
                  <p className="font-medium text-sm text-gray-600 dark:text-gray-400 mb-1">What you'll learn:</p>
                  <ul className="space-y-2">
                    {tutorialSteps[currentStep].detailedSteps.map((step, index) => (
                      <motion.li 
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + (index * 0.1) }}
                        className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"
                      >
                        <span className="h-1.5 w-1.5 bg-theme-pink rounded-full"></span>
                        {step}
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              )}
              
              {tutorialSteps[currentStep].tip && (
                <motion.div 
                  className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/30 rounded-lg"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <p className="text-sm text-amber-800 dark:text-amber-300 flex items-center gap-2">
                    <Lightbulb size={16} className="inline-block" />
                    {tutorialSteps[currentStep].tip}
                  </p>
                </motion.div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
        
        <div className="flex justify-between mt-6 pt-4 border-t dark:border-gray-700">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 0}
            className="flex items-center gap-1"
          >
            <ChevronLeft size={16} /> Previous
          </Button>
          
          <Button
            variant="default"
            onClick={nextStep}
            className="flex items-center gap-1 bg-theme-pink hover:bg-theme-pink/90"
          >
            {currentStep < tutorialSteps.length - 1 ? (
              <>Next <ChevronRight size={16} /></>
            ) : (
              "Get Started"
            )}
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default TutorialGuide;
