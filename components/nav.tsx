'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Settings2,
  Bot,
  MessageSquare,
  FileText,
  Radio,
  BookOpen,
  Code2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { href: '/', label: 'Home', icon: LayoutDashboard, exact: true },
  { href: '/ops', label: 'Ops', icon: Settings2 },
  { href: '/agents', label: 'Agents', icon: Bot },
  { href: '/chat', label: 'Chat', icon: MessageSquare },
  { href: '/content', label: 'Content', icon: FileText },
  { href: '/comms', label: 'Comms', icon: Radio },
  { href: '/knowledge', label: 'Knowledge', icon: BookOpen },
  { href: '/code', label: 'Code', icon: Code2 },
] as const;

function LiveIndicator() {
  return (
    <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-success/[0.08] border border-success/[0.15]">
      <span className="status-dot-live w-[5px] h-[5px] rounded-full bg-success" />
      <span className="nav-label text-success/80 hidden sm:block">Auto 15s</span>
    </div>
  );
}

export function Nav() {
  const pathname = usePathname();

  function isActive(item: (typeof NAV_ITEMS)[number]) {
    if ('exact' in item && item.exact) return pathname === item.href;
    return pathname.startsWith(item.href);
  }

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 h-[46px] flex items-center px-3 gap-1"
      style={{
        background: 'rgba(6,8,15,0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}
    >
      {/* Logo */}
      <Link
        href="/"
        className="flex items-center gap-2 mr-3 flex-shrink-0 group"
        aria-label="OpenClaw Mission Control"
      >
        <div className="w-6 h-6 rounded-md bg-primary/20 border border-primary/30 flex items-center justify-center">
          <span className="text-primary text-[10px] font-bold">◆</span>
        </div>
        <span className="hidden md:inline text-[11px] font-semibold tracking-wider text-text-secondary group-hover:text-text-primary transition-colors">
          OPENCLAW
        </span>
      </Link>

      {/* Nav items */}
      <nav className="flex items-center flex-1 min-w-0">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'relative flex flex-1 items-center justify-center gap-1 px-1 py-1.5 rounded-md transition-colors group',
                'min-w-0',
                active
                  ? 'text-primary bg-primary/[0.06]'
                  : 'text-text-muted hover:text-text-secondary hover:bg-white/[0.03]'
              )}
            >
              <Icon
                size={13}
                className={cn(
                  'flex-shrink-0',
                  active ? 'text-primary' : 'text-inherit'
                )}
              />
              <span className="nav-label truncate">{item.label}</span>
              {active && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute bottom-0 left-2 right-2 h-px bg-primary/50 rounded-full"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Right side */}
      <div className="flex items-center gap-2 flex-shrink-0 ml-2">
        <LiveIndicator />
      </div>
    </header>
  );
}
