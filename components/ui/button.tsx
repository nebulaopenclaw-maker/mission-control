import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import { ButtonHTMLAttributes, forwardRef } from 'react';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-1.5 rounded-lg text-xs font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 disabled:pointer-events-none disabled:opacity-40 select-none',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-white hover:bg-primary/90 active:scale-[0.98]',
        secondary: 'bg-white/[0.06] text-text-primary border border-white/[0.08] hover:bg-white/[0.1] active:scale-[0.98]',
        ghost: 'text-text-secondary hover:text-text-primary hover:bg-white/[0.04]',
        danger: 'bg-danger/15 text-red-300 border border-danger/25 hover:bg-danger/25',
        success: 'bg-success/15 text-emerald-300 border border-success/25 hover:bg-success/25',
        outline: 'border border-white/[0.1] text-text-primary hover:bg-white/[0.04]',
        link: 'text-primary underline-offset-4 hover:underline p-0 h-auto',
      },
      size: {
        sm: 'h-7 px-2.5 text-[11px]',
        default: 'h-8 px-3',
        lg: 'h-9 px-4 text-sm',
        icon: 'h-8 w-8 p-0',
        'icon-sm': 'h-6 w-6 p-0',
      },
    },
    defaultVariants: {
      variant: 'secondary',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';
