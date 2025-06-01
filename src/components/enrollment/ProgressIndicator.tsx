interface ProgressIndicatorProps {
  currentStep: number;
  steps: string[];
}

export default function ProgressIndicator({
  currentStep,
  steps,
}: ProgressIndicatorProps) {
  return (
    <div className="mb-8">
      <div className="flex justify-center items-center space-x-8">
        {steps.map((stepLabel, index) => {
          const stepNumber = index + 1;
          const isActive = currentStep >= stepNumber;

          return (
            <div key={stepNumber} className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                  isActive
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {stepNumber}
              </div>
              <span className="text-xs mt-2 text-center text-gray-600">
                {stepLabel}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
