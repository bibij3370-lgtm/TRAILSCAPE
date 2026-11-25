import React from 'react';
import { Mountain, SignalHigh, SignalLow, SignalMedium } from 'lucide-react';
import { DifficultyLevel } from '../types/trail';

interface DifficultyBadgeProps {
  difficulty: DifficultyLevel;
  variant?: 'inline' | 'block';
}

const CONFIG: Record<
  DifficultyLevel,
  { color: string; bg: string; icon: React.ReactNode; label: string }
> = {
  Easy: {
    color: 'text-[#497B4D]',
    bg: 'bg-[#77A77A]/14',
    icon: <SignalLow className="w-3.5 h-3.5" aria-hidden="true" />,
    label: 'Easy',
  },
  Moderate: {
    color: 'text-[#9F6F22]',
    bg: 'bg-[#D9A85D]/18',
    icon: <SignalMedium className="w-3.5 h-3.5" aria-hidden="true" />,
    label: 'Moderate',
  },
  Hard: {
    color: 'text-[#B15649]',
    bg: 'bg-[#C87568]/15',
    icon: <SignalHigh className="w-3.5 h-3.5" aria-hidden="true" />,
    label: 'Hard',
  },
};

export const DifficultyBadge: React.FC<DifficultyBadgeProps> = ({
  difficulty,
  variant = 'inline',
}) => {
  const cfg = CONFIG[difficulty];

  if (variant === 'inline') {
    return (
      <span className={`inline-flex items-center gap-1 font-medium ${cfg.color}`}>
        {cfg.icon}
        <span>{cfg.label}</span>
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-[12px] text-xs font-semibold ${cfg.bg} ${cfg.color}`}
    >
      <Mountain className="w-3.5 h-3.5" aria-hidden="true" />
      <span>{cfg.label}</span>
    </span>
  );
};
