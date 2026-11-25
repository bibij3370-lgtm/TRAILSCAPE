import React from 'react';

interface StatisticsCardProps {
  label: string;
  value: string;
  subtext?: string;
  icon?: React.ReactNode;
}

export const StatisticsCard: React.FC<StatisticsCardProps> = ({
  label,
  value,
  subtext,
  icon,
}) => {
  return (
    <div className="bg-[#FAFAF5] border border-[#DDE5D6] rounded-[18px] p-4 flex flex-col justify-between gap-1.5 shadow-xs">
      <div className="flex items-center justify-between gap-2 text-[#858B80]">
        <span className="text-xs font-medium tracking-wide">{label}</span>
        {icon && <span className="text-[#304B37] shrink-0">{icon}</span>}
      </div>
      <div className="font-display text-lg sm:text-xl font-bold text-[#242923] tabular-nums leading-tight">
        {value}
      </div>
      {subtext && <div className="text-xs text-[#858B80] tabular-nums">{subtext}</div>}
    </div>
  );
};
