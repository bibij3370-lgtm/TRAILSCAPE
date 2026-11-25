import React from 'react';
import { Compass, Droplets, Mountain, Trees, Waves } from 'lucide-react';
import { CategoryFilterValue } from '../utils/trailLogic';

interface CategoryFilterProps {
  selected: CategoryFilterValue;
  onSelect: (category: CategoryFilterValue) => void;
}

const CATEGORIES: { value: CategoryFilterValue; label: string; icon: React.ReactNode }[] = [
  { value: 'All', label: 'All Paths', icon: <Compass className="w-4 h-4" aria-hidden="true" /> },
  { value: 'Mountains', label: 'Mountains', icon: <Mountain className="w-4 h-4" aria-hidden="true" /> },
  { value: 'Lakes', label: 'Lakes', icon: <Droplets className="w-4 h-4" aria-hidden="true" /> },
  { value: 'Forests', label: 'Forests', icon: <Trees className="w-4 h-4" aria-hidden="true" /> },
  { value: 'Coastal', label: 'Coastal', icon: <Waves className="w-4 h-4" aria-hidden="true" /> },
  { value: 'Waterfalls', label: 'Waterfalls', icon: <Droplets className="w-4 h-4" aria-hidden="true" /> },
];

export const CategoryFilter: React.FC<CategoryFilterProps> = ({ selected, onSelect }) => {
  return (
    <div
      role="tablist"
      aria-label="Trail categories"
      className="flex items-center gap-2.5 overflow-x-auto no-scrollbar pb-1"
    >
      {CATEGORIES.map((cat) => {
        const isActive = selected === cat.value;
        return (
          <button
            key={cat.value}
            role="tab"
            aria-selected={isActive}
            type="button"
            onClick={() => onSelect(cat.value)}
            className={`min-h-[44px] px-4 py-2 rounded-[18px] text-sm font-medium inline-flex items-center gap-2 transition-all duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#304B37] ${
              isActive
                ? 'bg-[#304B37] text-[#FAFAF5] shadow-sm shadow-[#243D2D]/20'
                : 'bg-[#FAFAF5]/85 backdrop-blur-sm text-[#242923] border border-[#DDE5D6] hover:bg-[#DDE5D6]/50'
            }`}
          >
            <span className={isActive ? 'text-[#DDE5D6]' : 'text-[#304B37]'}>{cat.icon}</span>
            <span>{cat.label}</span>
          </button>
        );
      })}
    </div>
  );
};
