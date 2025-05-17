import React from 'react';
import type { DisabledFormSection } from '../types/disabled-form';

interface FormProgressIndicatorProps {
  currentSection: DisabledFormSection;
  totalSections?: number;
}

const FormProgressIndicator: React.FC<FormProgressIndicatorProps> = ({
  currentSection,
  totalSections = 4,
}) => {
  // Helper function to determine the classes for each indicator
  const indicatorClasses = (num: number) =>
    num <= currentSection
      ? 'bg-purple-600 text-white'
      : 'bg-gray-200 text-gray-500';

  // Generate the indicators based on total sections
  const indicators = [];
  for (let i = 1; i <= totalSections; i++) {
    indicators.push(
      <React.Fragment key={i}>
        {i > 1 && (
          <div className="w-8 sm:w-16 h-1 bg-gray-300">
            <div
              className={`h-full ${currentSection >= i ? 'bg-purple-600' : 'bg-gray-300'}`}
            ></div>
          </div>
        )}
        <div
          className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center ${indicatorClasses(i)}`}
        >
          {i}
        </div>
      </React.Fragment>
    );
  }

  return (
    <div className="flex justify-center mt-4 sm:mt-6 overflow-x-auto">
      <div className="flex items-center space-x-2 sm:space-x-4">
        {indicators}
      </div>
    </div>
  );
};

export default FormProgressIndicator;
