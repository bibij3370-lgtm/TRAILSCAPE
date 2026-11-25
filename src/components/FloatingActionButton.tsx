import React from 'react';

interface FloatingActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  label: string;
  variant?: 'forest' | 'cream';
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  icon,
  label,
  variant = 'forest',
  className = '',
  ...props
}) => {
  const styles =
    variant === 'forest'
      ? 'bg-[#304B37] text-[#FAFAF5] hover:bg-[#243D2D] shadow-lg shadow-[#243D2D]/25'
      : 'bg-[#FAFAF5]/90 backdrop-blur-md text-[#242923] border border-[#DDE5D6] hover:bg-[#FAFAF5] shadow-md';

  return (
    <button
      aria-label={label}
      className={`min-h-[48px] min-w-[48px] inline-flex items-center justify-center rounded-full transition-all duration-150 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#304B37] cursor-pointer ${styles} ${className}`}
      {...props}
    >
      {icon}
    </button>
  );
};
