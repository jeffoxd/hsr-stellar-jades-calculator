import { useState, useRef } from "react";

export function useMultiStepForm(steps: number) {
  const [currentStep, setCurrentStep] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const previousStep = useRef<number>(0);

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps - 1;

  const back = () => {
    if (currentStep > 0) {
      previousStep.current = currentStep;
      setCurrentStep((i) => i - 1);
    }
  };

  const next = () => {
    if (currentStep < steps - 1) {
      previousStep.current = currentStep;
      setCurrentStep((i) => i + 1);
    } else if (isLastStep) {
      setShowResults(true);
    }
  };

  const goTo = (index: number) => {
    previousStep.current = currentStep;
    setCurrentStep(index);
  };

  return {
    currentStep,
    steps,
    isFirstStep,
    isLastStep,
    showResults,
    goTo,
    next,
    back,
    previousStep: previousStep.current,
  };
}
