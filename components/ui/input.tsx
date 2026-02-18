import { cn } from '@/lib/utils';
import { InputHTMLAttributes, forwardRef } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, icon, ...props }, ref) => {
    if (icon) {
      return (
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none">
            {icon}
          </span>
          <input
            ref={ref}
            className={cn(
              'w-full h-8 pl-9 pr-3 rounded-lg bg-white/[0.04] border border-white/[0.08] text-xs text-text-primary placeholder:text-text-muted',
              'focus:outline-none focus:ring-1 focus:ring-primary/40 focus:border-primary/40',
              'transition-colors',
              className
            )}
            {...props}
          />
        </div>
      );
    }

    return (
      <input
        ref={ref}
        className={cn(
          'w-full h-8 px-3 rounded-lg bg-white/[0.04] border border-white/[0.08] text-xs text-text-primary placeholder:text-text-muted',
          'focus:outline-none focus:ring-1 focus:ring-primary/40 focus:border-primary/40',
          'transition-colors',
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={cn(
        'w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-xs text-text-primary placeholder:text-text-muted',
        'focus:outline-none focus:ring-1 focus:ring-primary/40 focus:border-primary/40',
        'resize-none transition-colors',
        className
      )}
      {...props}
    />
  );
});
Textarea.displayName = 'Textarea';
