
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Button from '../Button';

interface StepNavigationProps {
  prevStep: () => void;
  nextStep: () => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  currentStepIndex: number;
  totalSteps: number;
  isSubmitting: boolean;
}

const StepNavigation = ({ 
  prevStep, 
  nextStep, 
  handleSubmit,
  currentStepIndex,
  totalSteps,
  isSubmitting
}: StepNavigationProps) => {
  return (
    <div className="flex justify-between pt-6 border-t border-constalib-light-gray">
      <Button
        type="button"
        variant="outline"
        onClick={prevStep}
        disabled={currentStepIndex === 0 || isSubmitting}
      >
        <ChevronLeft className="w-5 h-5 mr-2" />
        Précédent
      </Button>
      
      {currentStepIndex < totalSteps - 1 ? (
        <Button type="button" onClick={nextStep} disabled={isSubmitting}>
          Suivant
          <ChevronRight className="w-5 h-5 ml-2" />
        </Button>
      ) : (
        <Button 
          type="button" 
          onClick={handleSubmit} 
          isLoading={isSubmitting}
          disabled={isSubmitting}
        >
          Soumettre
        </Button>
      )}
    </div>
  );
};

export default StepNavigation;
