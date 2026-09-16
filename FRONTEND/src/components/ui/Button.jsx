import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Government-Style Button Component
 * Strictly avoids glowing neon, excessive shadows, and flashy gradients.
 * Variants adhere to official Indian Government Portal color conventions.
 */
export const Button = ({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  className = '',
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  onClick,
  ...props
}) => {
  // Base Government Button Styles: crisp borders, subtle transitions, no neon glows
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded transition-colors focus:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-1 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer text-center select-none';

  const variants = {
    // Primary: Deep Government Blue
    primary: 'bg-[#0c2340] text-white hover:bg-[#113f67] active:bg-[#08182b] border border-[#0c2340] focus-visible:ring-[#0c2340]',
    
    // Secondary: Clean White with Government Blue Border
    secondary: 'bg-white text-[#0c2340] hover:bg-slate-100 active:bg-slate-200 border border-[#0c2340] focus-visible:ring-[#0c2340]',
    
    // Outline: Muted Slate Border
    outline: 'bg-white text-slate-700 hover:bg-slate-50 active:bg-slate-100 border border-slate-300 focus-visible:ring-slate-400',
    
    // Accent: Muted National Saffron / Orange (Used for urgent citizen actions like "Apply Now" or "Upload")
    accent: 'bg-[#c2410c] text-white hover:bg-[#9a3412] active:bg-[#7c2d12] border border-[#c2410c] focus-visible:ring-[#c2410c]',
    
    // Success: Muted Forest/Gov Green
    success: 'bg-[#15803d] text-white hover:bg-[#166534] active:bg-[#14532d] border border-[#15803d] focus-visible:ring-[#15803d]',
    
    // Danger: Muted Red (Reject / Delete / Revoke)
    danger: 'bg-[#b91c1c] text-white hover:bg-[#991b1b] active:bg-[#7f1d1d] border border-[#b91c1c] focus-visible:ring-[#b91c1c]',
    
    // Subtle Ghost
    ghost: 'bg-transparent text-slate-700 hover:bg-slate-100 active:bg-slate-200 border border-transparent focus-visible:ring-slate-400'
  };

  const sizes = {
    sm: 'text-xs px-2.5 py-1.5 gap-1.5',
    md: 'text-sm px-3.5 py-2 gap-2',
    lg: 'text-base px-5 py-2.5 gap-2.5'
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin shrink-0" />
          <span>{children || 'Processing...'}</span>
        </>
      ) : (
        <>
          {LeftIcon && <LeftIcon className="w-4 h-4 shrink-0" />}
          <span>{children}</span>
          {RightIcon && <RightIcon className="w-4 h-4 shrink-0" />}
        </>
      )}
    </button>
  );
};

export default Button;
