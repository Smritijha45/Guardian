import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost' | 'soft-blue';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, icon, disabled, ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-[0.97]';

    const variants = {
      primary: 'bg-brand-500 hover:bg-brand-600 text-white focus-visible:ring-brand-500 shadow-md shadow-brand-500/15 hover:shadow-lg hover:shadow-brand-500/20',
      secondary: 'bg-slate-100 hover:bg-slate-200/80 text-slate-800 focus-visible:ring-slate-400 border border-slate-200/60 shadow-sm',
      danger: 'bg-rose-600 hover:bg-rose-700 text-white focus-visible:ring-rose-500 shadow-md shadow-rose-500/15 hover:shadow-lg hover:shadow-rose-500/20',
      outline: 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 focus-visible:ring-slate-400 shadow-sm',
      ghost: 'bg-transparent hover:bg-slate-100 text-slate-600 shadow-none focus-visible:ring-slate-300',
      'soft-blue': 'bg-brand-50 hover:bg-brand-100 text-brand-700 border border-brand-200 focus-visible:ring-brand-500 shadow-sm',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-xs gap-1.5',
      md: 'px-4 py-2.5 text-sm gap-2',
      lg: 'px-6 py-3 text-sm font-semibold gap-2.5 rounded-2xl',
    };

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {icon && <span className="inline-flex shrink-0 items-center">{icon}</span>}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
