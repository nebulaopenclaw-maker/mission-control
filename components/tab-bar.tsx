'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: number | string;
}

interface TabBarProps {
  tabs: TabItem[];
  paramKey?: string;
  className?: string;
  onTabChange?: (id: string) => void;
  activeTab?: string;
}

export function TabBar({ tabs, paramKey = 'tab', className, onTabChange, activeTab: controlledActive }: TabBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const active = controlledActive ?? searchParams.get(paramKey) ?? tabs[0]?.id;

  function setTab(id: string) {
    if (onTabChange) {
      onTabChange(id);
      return;
    }
    const params = new URLSearchParams(searchParams.toString());
    params.set(paramKey, id);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  return (
    <div
      className={cn(
        'flex items-center gap-1 p-1 rounded-xl bg-white/[0.03] border border-white/[0.06] w-fit',
        className
      )}
    >
      {tabs.map((tab) => {
        const isActive = active === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setTab(tab.id)}
            className={cn(
              'relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors select-none',
              isActive
                ? 'text-text-primary'
                : 'text-text-muted hover:text-text-secondary'
            )}
          >
            {isActive && (
              <motion.div
                layoutId="tab-pill"
                className="absolute inset-0 bg-white/[0.07] border border-white/[0.1] rounded-lg"
                transition={{ type: 'spring', stiffness: 500, damping: 35 }}
              />
            )}
            <span className="relative flex items-center gap-1.5">
              {tab.icon && <span className="text-[13px]">{tab.icon}</span>}
              {tab.label}
              {tab.badge !== undefined && (
                <span
                  className={cn(
                    'inline-flex items-center justify-center min-w-[16px] h-4 px-1 rounded-full text-[10px] font-semibold',
                    isActive
                      ? 'bg-primary/20 text-primary'
                      : 'bg-white/[0.06] text-text-muted'
                  )}
                >
                  {tab.badge}
                </span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}
