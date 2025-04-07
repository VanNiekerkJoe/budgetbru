
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

const TUTORIAL_COMPLETED_KEY = 'budget-bru-tutorial-completed';
const TUTORIAL_STEPS_COMPLETED_KEY = 'budget-bru-tutorial-steps';

export interface TutorialStep {
  id: string;
  completed: boolean;
  timestamp?: number;
}

export const useTutorial = () => {
  const [isTutorialCompleted, setIsTutorialCompleted] = useState<boolean>(true);
  const [showTutorial, setShowTutorial] = useState<boolean>(false);
  const [tutorialSteps, setTutorialSteps] = useState<TutorialStep[]>([]);
  
  useEffect(() => {
    const tutorialCompleted = localStorage.getItem(TUTORIAL_COMPLETED_KEY);
    const savedSteps = localStorage.getItem(TUTORIAL_STEPS_COMPLETED_KEY);
    
    if (tutorialCompleted === null) {
      setIsTutorialCompleted(false);
      setShowTutorial(true);
      
      // Initialize tutorial steps if not already set
      if (!savedSteps) {
        const initialSteps: TutorialStep[] = [
          { id: 'welcome', completed: false },
          { id: 'expenses', completed: false },
          { id: 'map', completed: false },
          { id: 'savings', completed: false },
          { id: 'insights', completed: false }
        ];
        setTutorialSteps(initialSteps);
        localStorage.setItem(TUTORIAL_STEPS_COMPLETED_KEY, JSON.stringify(initialSteps));
      } else {
        setTutorialSteps(JSON.parse(savedSteps));
      }
    } else {
      setIsTutorialCompleted(true);
      // Even if tutorial is completed, load the steps for reference
      if (savedSteps) {
        setTutorialSteps(JSON.parse(savedSteps));
      }
    }
  }, []);
  
  const completeStep = (stepId: string) => {
    const updatedSteps = tutorialSteps.map(step => 
      step.id === stepId ? { ...step, completed: true, timestamp: Date.now() } : step
    );
    
    setTutorialSteps(updatedSteps);
    localStorage.setItem(TUTORIAL_STEPS_COMPLETED_KEY, JSON.stringify(updatedSteps));
    
    // Check if all steps are completed
    const allCompleted = updatedSteps.every(step => step.completed);
    if (allCompleted) {
      completeTutorial();
    }
    
    return updatedSteps;
  };
  
  const completeTutorial = () => {
    localStorage.setItem(TUTORIAL_COMPLETED_KEY, 'true');
    
    // Mark all steps as completed
    const allCompleted = tutorialSteps.map(step => ({
      ...step,
      completed: true,
      timestamp: step.timestamp || Date.now()
    }));
    
    setTutorialSteps(allCompleted);
    localStorage.setItem(TUTORIAL_STEPS_COMPLETED_KEY, JSON.stringify(allCompleted));
    
    setIsTutorialCompleted(true);
    setShowTutorial(false);
    
    toast.success('Tutorial completed!', {
      description: 'You can always access it again from the settings menu.',
      duration: 5000,
    });
  };
  
  const skipTutorial = () => {
    localStorage.setItem(TUTORIAL_COMPLETED_KEY, 'true');
    setIsTutorialCompleted(true);
    setShowTutorial(false);
    
    toast.info('Tutorial skipped', {
      description: 'You can access it anytime from settings.',
      duration: 3000,
    });
  };
  
  const resetTutorial = () => {
    localStorage.removeItem(TUTORIAL_COMPLETED_KEY);
    
    const resetSteps: TutorialStep[] = [
      { id: 'welcome', completed: false },
      { id: 'expenses', completed: false },
      { id: 'map', completed: false },
      { id: 'savings', completed: false },
      { id: 'insights', completed: false }
    ];
    
    setTutorialSteps(resetSteps);
    localStorage.setItem(TUTORIAL_STEPS_COMPLETED_KEY, JSON.stringify(resetSteps));
    
    setIsTutorialCompleted(false);
    setShowTutorial(true);
    
    toast.success('Tutorial reset!', {
      description: 'Let\'s start the tour again.',
    });
  };

  return {
    isTutorialCompleted,
    showTutorial,
    setShowTutorial,
    tutorialSteps,
    completeTutorial,
    skipTutorial,
    resetTutorial,
    completeStep,
  };
};
