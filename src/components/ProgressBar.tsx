import React from 'react';

interface ProgressBarProps {
  value: number; // 0-100
  label?: string;
  heightClass?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  label,
  heightClass = 'h-2.5',
}) => {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div className="w-full">
      <div
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label ?? 'Progress'}
        className={`w-full ${heightClass} bg-[#DDE5D6] rounded-full overflow-hidden`}
      >
        <div
          className="h-full bg-[#304B37] rounded-full transition-all duration-300 ease-out"
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
};
