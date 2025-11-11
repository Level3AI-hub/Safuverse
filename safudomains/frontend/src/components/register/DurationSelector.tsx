/**
 * Duration Selector Component
 * Allows users to select registration duration (1-5 years or lifetime)
 */
import { useState } from 'react';
import { calculateDurationInSeconds } from '@/lib/utils';

interface DurationSelectorProps {
  duration: number; // in seconds
  onDurationChange: (duration: number) => void;
  isLifetime: boolean;
  onLifetimeChange: (isLifetime: boolean) => void;
  disabled?: boolean;
  className?: string;
}

const DURATION_OPTIONS = [
  { years: 1, label: '1 Year' },
  { years: 2, label: '2 Years' },
  { years: 3, label: '3 Years' },
  { years: 5, label: '5 Years' },
];

export const DurationSelector: React.FC<DurationSelectorProps> = ({
  duration,
  onDurationChange,
  isLifetime,
  onLifetimeChange,
  disabled = false,
  className = '',
}) => {
  const currentYears = duration / (365 * 24 * 60 * 60);

  const handleYearSelect = (years: number) => {
    onLifetimeChange(false);
    onDurationChange(calculateDurationInSeconds(years));
  };

  const handleLifetimeToggle = () => {
    if (!isLifetime) {
      onLifetimeChange(true);
      // Set to a large duration for lifetime (e.g., 1000 years)
      onDurationChange(calculateDurationInSeconds(1000));
    } else {
      onLifetimeChange(false);
      onDurationChange(calculateDurationInSeconds(1));
    }
  };

  return (
    <div className={`duration-selector ${className}`}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Registration Duration
      </label>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        {DURATION_OPTIONS.map((option) => (
          <button
            key={option.years}
            type="button"
            onClick={() => handleYearSelect(option.years)}
            disabled={disabled || isLifetime}
            className={`
              px-4 py-3 rounded-lg border-2 transition-all duration-200
              ${
                !isLifetime && Math.abs(currentYears - option.years) < 0.1
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-300 bg-white text-gray-700 hover:border-blue-300'
              }
              ${disabled || isLifetime ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            <div className="text-center">
              <div className="font-bold text-lg">{option.years}</div>
              <div className="text-xs text-gray-500">
                {option.years === 1 ? 'Year' : 'Years'}
              </div>
            </div>
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={handleLifetimeToggle}
        disabled={disabled}
        className={`
          w-full px-4 py-4 rounded-lg border-2 transition-all duration-200
          flex items-center justify-between
          ${
            isLifetime
              ? 'border-purple-500 bg-purple-50 text-purple-700'
              : 'border-gray-300 bg-white text-gray-700 hover:border-purple-300'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">♾️</span>
          <div className="text-left">
            <div className="font-bold">Lifetime Registration</div>
            <div className="text-sm opacity-75">Own your domain forever</div>
          </div>
        </div>
        {isLifetime && (
          <svg
            className="w-6 h-6 text-purple-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        )}
      </button>
    </div>
  );
};

export default DurationSelector;
