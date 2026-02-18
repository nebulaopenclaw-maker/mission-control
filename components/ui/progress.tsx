import { cn } from '@/lib/utils';

interface ProgressProps {
  value: number;
  max?: number;
  className?: string;
  trackClassName?: string;
  variant?: 'default' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'default' | 'lg';
  showLabel?: boolean;
}

export function Progress({
  value,
  max = 100,
  className,
  trackClassName,
  variant = 'default',
  size = 'default',
  showLabel = false,
}: ProgressProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));

  const trackColor = {
    default: 'bg-primary',
    success: 'bg-success',
    warning: 'bg-warning',
    danger: 'bg-danger',
  }[variant];

  const height = {
    sm: 'h-[3px]',
    default: 'h-1.5',
    lg: 'h-2.5',
  }[size];

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div
        className={cn(
          'flex-1 overflow-hidden rounded-full bg-white/[0.06]',
          height,
          trackClassName
        )}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
      >
        <div
          className={cn('h-full rounded-full transition-all duration-500', trackColor)}
          style={{ width: `${pct}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-[10px] text-text-muted tabular-nums w-7 text-right">
          {Math.round(pct)}%
        </span>
      )}
    </div>
  );
}
