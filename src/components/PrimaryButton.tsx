import React from 'react';

interface PrimaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  icon?: React.ReactNode;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  icon,
  className = '',
  ...props
}) => {
  const base =
    'inline-flex items-center justify-center gap-2 font-medium transition-all duration-150 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#304B37] disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap shrink-0 cursor-pointer';

  const variants = {
    primary: 'bg-[#304B37] text-[#FAFAF5] hover:bg-[#243D2D] shadow-sm shadow-[#243D2D]/15',
    secondary:
      'bg-[#FAFAF5] text-[#242923] border border-[#DDE5D6] hover:bg-[#DDE5D6]/45',
    ghost: 'bg-transparent text-[#304B37] hover:bg-[#DDE5D6]/40',
    danger: 'bg-[#C87568] text-[#FAFAF5] hover:bg-[#b56255]',
  };

  const sizes = {
    sm: 'min-h-[40px] px-4 py-2 text-xs rounded-[12px]',
    md: 'min-h-[44px] px-5 py-2.5 text-sm rounded-[18px]',
    lg: 'min-h-[50px] px-7 py-3 text-[15px] rounded-[24px]',
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {icon}
      <span>{children}</span>
    </button>
  );
};
