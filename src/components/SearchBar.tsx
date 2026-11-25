import React from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  ariaLabel?: string;
  className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = 'Search mountains, trails, parks...',
  ariaLabel = 'Search trails',
  className = '',
}) => {
  return (
    <div
      className={`relative flex items-center bg-[#FAFAF5] border border-[#DDE5D6] rounded-[18px] shadow-sm shadow-[#242923]/5 focus-within:border-[#304B37] focus-within:ring-2 focus-within:ring-[#304B37]/15 transition-all ${className}`}
    >
      <Search className="w-4 h-4 text-[#858B80] ml-4 shrink-0" aria-hidden="true" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={ariaLabel}
        className="w-full min-h-[46px] bg-transparent pl-3 pr-10 text-sm text-[#242923] placeholder:text-[#858B80] focus:outline-none"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          aria-label="Clear search"
          className="absolute right-1.5 min-w-[36px] min-h-[36px] flex items-center justify-center rounded-full text-[#858B80] hover:text-[#242923] hover:bg-[#DDE5D6]/40 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
