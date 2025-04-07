
import { useState, useEffect } from 'react';

const TUTORIAL_COMPLETED_KEY = 'budget-bru-tutorial-completed';

export const useTutorial = () => {
  const [isTutorialCompleted, setIsTutorialCompleted] = useState<boolean>(true);
  const [showTutorial, setShowTutorial] = useState<boolean>(false);
  
  useEffect(() => {
    const tutorialCompleted = localStorage.getItem(TUTORIAL_COMPLETED_KEY);
    if (tutorialCompleted === null) {
      setIsTutorialCompleted(false);
      setShowTutorial(true);
    } else {
      setIsTutorialCompleted(true);
    }
  }, []);
  
  const completeTutorial = () => {
    localStorage.setItem(TUTORIAL_COMPLETED_KEY, 'true');
    setIsTutorialCompleted(true);
    setShowTutorial(false);
  };
  
  const skipTutorial = () => {
    localStorage.setItem(TUTORIAL_COMPLETED_KEY, 'true');
    setIsTutorialCompleted(true);
    setShowTutorial(false);
  };
  
  const resetTutorial = () => {
    localStorage.removeItem(TUTORIAL_COMPLETED_KEY);
    setIsTutorialCompleted(false);
    setShowTutorial(true);
  };

  return {
    isTutorialCompleted,
    showTutorial,
    setShowTutorial,
    completeTutorial,
    skipTutorial,
    resetTutorial,
  };
};
