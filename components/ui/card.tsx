import { cn } from '@/lib/utils';
import { HTMLAttributes, forwardRef } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'flat';
  hoverable?: boolean;
  compact?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', hoverable = false, compact = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'glass-card',
          hoverable && 'glass-card-hover cursor-pointer',
          compact ? 'p-4' : 'p-5',
          variant === 'elevated' && 'bg-white/[0.04] shadow-card',
          variant === 'flat' && 'bg-transparent border-white/[0.04]',
          className
        )}
        {...props}
      />
    );
  }
);
Card.displayName = 'Card';

export function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex items-center justify-between mb-4', className)} {...props} />;
}

export function CardTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn('label-xs', className)}
      {...props}
    />
  );
}

export function CardContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('', className)} {...props} />;
}

export function CardFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('flex items-center mt-4 pt-4 border-t border-white/[0.04]', className)}
      {...props}
    />
  );
}

export function CardValue({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('text-2xl font-semibold text-text-primary tabular-nums', className)}
      {...props}
    />
  );
}
