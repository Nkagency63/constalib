
import { Check } from 'lucide-react';

interface Step {
  id: string;
  title: string;
  description?: string;
}

interface ProgressBarProps {
  steps: Step[];
  currentStepIndex: number;
}

const ProgressBar = ({ steps, currentStepIndex }: ProgressBarProps) => {
  return (
    <>
      {/* Progress bar */}
      <div className="mb-6 md:mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs md:text-sm font-medium text-constalib-blue">
            Étape {currentStepIndex + 1} sur {steps.length}
          </span>
          <span className="text-xs md:text-sm text-constalib-dark-gray">
            {Math.round(((currentStepIndex + 1) / steps.length) * 100)}%
          </span>
        </div>
        <div className="w-full bg-constalib-light-gray rounded-full h-2">
          <div 
            className="bg-constalib-blue h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
          ></div>
        </div>
      </div>
      
      {/* Step indicators - visible on tablet and desktop */}
      <div className="hidden md:flex justify-between mb-8 relative">
        {/* Connecting line */}
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-constalib-light-gray -translate-y-1/2 z-0"></div>
        
        {steps.map((step, index) => (
          <div 
            key={step.id} 
            className="flex flex-col items-center relative z-10"
          >
            <div 
              className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center mb-2 transition-colors ${
                index < currentStepIndex 
                  ? 'bg-constalib-blue text-white' 
                  : index === currentStepIndex 
                    ? 'bg-white border-2 border-constalib-blue text-constalib-blue'
                    : 'bg-white border border-constalib-light-gray text-constalib-dark-gray'
              }`}
            >
              {index < currentStepIndex ? (
                <Check className="w-4 h-4 md:w-5 md:h-5" />
              ) : (
                index + 1
              )}
            </div>
            <span 
              className={`text-[10px] md:text-xs font-medium whitespace-nowrap ${
                index <= currentStepIndex ? 'text-constalib-dark' : 'text-constalib-dark-gray'
              }`}
            >
              {step.title}
            </span>
          </div>
        ))}
      </div>
      
      {/* Mobile step title */}
      <div className="block md:hidden mb-6">
        <h3 className="text-lg font-medium text-constalib-dark">
          {steps[currentStepIndex]?.title}
        </h3>
        {steps[currentStepIndex]?.description && (
          <p className="text-sm text-constalib-dark-gray mt-1">
            {steps[currentStepIndex].description}
          </p>
        )}
      </div>
    </>
  );
};

export default ProgressBar;
