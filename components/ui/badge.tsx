import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import { HTMLAttributes } from 'react';

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wide border',
  {
    variants: {
      variant: {
        default: 'bg-white/[0.06] text-text-secondary border-white/[0.08]',
        primary: 'bg-primary/15 text-blue-300 border-primary/25',
        success: 'bg-success/15 text-emerald-300 border-success/25',
        warning: 'bg-warning/15 text-amber-300 border-warning/25',
        danger: 'bg-danger/15 text-red-300 border-danger/25',
        accent: 'bg-accent/15 text-sky-300 border-accent/25',
        ghost: 'bg-transparent text-text-muted border-white/[0.06]',
        critical: 'bg-danger/15 text-red-300 border-danger/25',
        high: 'bg-warning/15 text-amber-300 border-warning/25',
        medium: 'bg-primary/15 text-blue-300 border-primary/25',
        low: 'bg-white/[0.06] text-text-secondary border-white/[0.08]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export function StatusBadge({ status }: { status: string }) {
  const s = status.toLowerCase();
  let variant: BadgeProps['variant'] = 'default';
  let dot = 'bg-text-muted';

  if (['up', 'healthy', 'active', 'online', 'running', 'ok', 'success'].includes(s)) {
    variant = 'success';
    dot = 'bg-success';
  } else if (['down', 'error', 'failed', 'offline', 'critical'].includes(s)) {
    variant = 'danger';
    dot = 'bg-danger';
  } else if (['warning', 'warn', 'degraded', 'slow', 'pending'].includes(s)) {
    variant = 'warning';
    dot = 'bg-warning';
  }

  return (
    <Badge variant={variant}>
      <span className={cn('w-1.5 h-1.5 rounded-full', dot)} />
      {status}
    </Badge>
  );
}
