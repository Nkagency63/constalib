
import { ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';
import { Button } from "../ui/button";

interface StepNavigationProps {
  prevStep: () => void;
  nextStep: () => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  currentStepIndex: number;
  totalSteps: number;
  isSubmitting: boolean;
  onEmergencyRequest?: () => void;
}

const StepNavigation = ({ 
  prevStep, 
  nextStep, 
  handleSubmit,
  currentStepIndex,
  totalSteps,
  isSubmitting,
  onEmergencyRequest
}: StepNavigationProps) => {
  return (
    <div className="flex justify-between pt-6 border-t border-constalib-light-gray">
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={prevStep}
          disabled={currentStepIndex === 0 || isSubmitting}
        >
          <ChevronLeft className="w-5 h-5 mr-2" />
          Précédent
        </Button>
        
        {onEmergencyRequest && (
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="hidden md:flex"
            onClick={onEmergencyRequest}
            title="Appeler les secours"
          >
            <AlertCircle className="w-5 h-5" />
          </Button>
        )}
      </div>
      
      {currentStepIndex < totalSteps - 1 ? (
        <Button type="button" onClick={nextStep} disabled={isSubmitting}>
          Suivant
          <ChevronRight className="w-5 h-5 ml-2" />
        </Button>
      ) : (
        <Button 
          type="button" 
          onClick={handleSubmit} 
          disabled={isSubmitting}
        >
          {isSubmitting ? "Traitement en cours..." : "Soumettre"}
        </Button>
      )}
    </div>
  );
};

export default StepNavigation;
