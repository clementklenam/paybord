import {cn} from '@/lib/utils';
import {Check} from 'lucide-react';

interface StepIndicatorProps {
  currentStep: number;
  steps: Array<{
    title: string;
    description: string;
  }>;
}

const StepIndicator = ({
  currentStep, steps
}: StepIndicatorProps) => {
  return (
    <nav aria-label="Progress" className="mb-12">
      <ol role="list" className="space-y-4 md:flex md:space-x-8 md:space-y-0">
        {steps.map((step, index) => (
          <li key={step.title} className="md:flex-1">
            <div
              className={cn(
                "group flex flex-col border-l-4 py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4",
                index < currentStep
                  ? "border-[#6C2BFB]"
                  : index === currentStep
                    ? "border-[#6C2BFB]"
                    : "border-gray-200"
              )}
            >
              <span className="flex items-center text-sm font-medium">
                <span
                  className={cn(
                    "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full shadow-md transition-all duration-200",
                    index < currentStep
                      ? "bg-[#6C2BFB] text-white shadow-purple-200"
                      : index === currentStep
                        ? "border-2 border-[#6C2BFB] bg-white text-[#6C2BFB] ring-2 ring-purple-100"
                        : "border-2 border-gray-300 bg-white text-gray-500"
                  )}
                >
                  {index < currentStep ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </span>
                <span
                  className={cn(
                    "ml-3 text-base font-semibold",
                    index < currentStep
                      ? "text-[#6C2BFB]"
                      : index === currentStep
                        ? "text-[#6C2BFB]"
                        : "text-gray-500"
                  )}
                >
                  {step.title}
                </span>
              </span>
              <span
                className={cn(
                  "mt-1 ml-11 text-sm",
                  index <= currentStep ? "text-gray-600" : "text-gray-400"
                )}
              >
                {step.description}
              </span>
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
}

export default StepIndicator;
