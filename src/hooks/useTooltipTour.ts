import { useState } from 'react';

export type TooltipStep = {
  id: string;
  text: string;
  element: string;
};

export const useTooltipTour = (steps: TooltipStep[]) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [isActive, setIsActive] = useState(false);

  const start = () => {
    setCurrentStepIndex(0);
    setIsActive(true);
  };

  const next = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      setIsActive(false);
      setCurrentStepIndex(-1);
    }
  };

  const skip = () => {
    setIsActive(false);
    setCurrentStepIndex(-1);
  };

  const isStepActive = (id: string) => {
    return isActive && steps[currentStepIndex]?.id === id;
  };

  return {
    isActive,
    currentStep: steps[currentStepIndex],
    start,
    next,
    skip,
    isStepActive,
  };
}; 