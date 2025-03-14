
import { cn } from '@/lib/utils';
import { ButtonHTMLAttributes, forwardRef } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-95 disabled:opacity-50 disabled:pointer-events-none';
    
    const variants = {
      primary: 'bg-constalib-blue text-white hover:bg-constalib-blue/90 focus:ring-constalib-blue/30',
      secondary: 'bg-constalib-light-blue text-constalib-blue hover:bg-constalib-light-blue/90 focus:ring-constalib-blue/30',
      outline: 'border border-constalib-blue text-constalib-blue bg-transparent hover:bg-constalib-light-blue focus:ring-constalib-blue/30',
      ghost: 'text-constalib-blue hover:bg-constalib-light-blue focus:ring-constalib-blue/30',
      link: 'text-constalib-blue underline-offset-4 hover:underline focus:ring-0'
    };
    
    const sizes = {
      sm: 'h-9 px-3 rounded-md text-sm',
      md: 'h-11 px-6 rounded-lg',
      lg: 'h-14 px-8 rounded-lg text-lg'
    };

    return (
      <button
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          isLoading && 'opacity-70 cursor-wait',
          className
        )}
        ref={ref}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading ? (
          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : null}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
