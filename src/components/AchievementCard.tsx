import React from 'react';
import { Award, CheckCircle2, Compass, Footprints, Lock, Mountain } from 'lucide-react';
import { Achievement } from '../types/trail';

interface AchievementCardProps {
  achievement: Achievement;
}

const ICONS: Record<Achievement['metric'], React.ReactNode> = {
  hikes: <Footprints className="w-5 h-5" aria-hidden="true" />,
  mountains: <Mountain className="w-5 h-5" aria-hidden="true" />,
  elevation: <Mountain className="w-5 h-5" aria-hidden="true" />,
  distance: <Compass className="w-5 h-5" aria-hidden="true" />,
};

export const AchievementCard: React.FC<AchievementCardProps> = ({ achievement }) => {
  return (
    <div
      className={`rounded-[18px] p-4 border transition-all flex items-start gap-3.5 ${
        achievement.unlocked
          ? 'bg-[#FAFAF5] border-[#A6B79B]'
          : 'bg-[#F4F3EC]/70 border-[#DDE5D6] opacity-80'
      }`}
    >
      <div
        className={`w-11 h-11 rounded-[12px] flex items-center justify-center shrink-0 ${
          achievement.unlocked
            ? 'bg-[#304B37] text-[#FAFAF5]'
            : 'bg-[#DDE5D6] text-[#858B80]'
        }`}
      >
        {achievement.unlocked ? (
          achievement.id === 'ach-adventure-champion' ? (
            <Award className="w-5 h-5" aria-hidden="true" />
          ) : (
            ICONS[achievement.metric]
          )
        ) : (
          <Lock className="w-4 h-4" aria-hidden="true" />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-0.5">
          <h4 className="font-display text-sm font-bold text-[#242923] leading-snug">
            {achievement.title}
          </h4>
          {achievement.unlocked ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#304B37] shrink-0">
              <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{achievement.unlockedDate ?? 'Unlocked'}</span>
            </span>
          ) : (
            <span className="text-[11px] font-medium text-[#858B80] shrink-0 tabular-nums">
              Goal: {achievement.targetValue} {achievement.unit}
            </span>
          )}
        </div>
        <p className="mt-1 text-xs text-[#858B80] leading-relaxed">{achievement.description}</p>
      </div>
    </div>
  );
};
