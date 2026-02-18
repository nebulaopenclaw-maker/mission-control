'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Server, Bot, Clock, DollarSign, FileText, Zap,
  TrendingUp, TrendingDown, Minus, CheckCircle, XCircle,
  AlertTriangle, RefreshCw, Activity
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardValue } from './ui/card';
import { Badge, StatusBadge } from './ui/badge';
import { Button } from './ui/button';
import { Skeleton, SkeletonCard } from './ui/skeleton';
import { Progress } from './ui/progress';
import { useFetch } from '@/hooks/use-auto-refresh';
import { cn, formatCurrency, relativeTime, formatUptime } from '@/lib/utils';

const REFRESH_MS = 15000;

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 28 } },
};

function StatusDot({ status }: { status: string }) {
  const s = status.toLowerCase();
  const cls = ['up', 'healthy', 'active', 'running', 'success'].includes(s)
    ? 'status-dot-up'
    : ['down', 'error', 'failed'].includes(s)
    ? 'status-dot-down'
    : 'status-dot-warn';
  return <span className={cn('status-dot', cls)} />;
}

function SystemHealthCard() {
  const { data, loading } = useFetch('/api/system-state', { refreshInterval: REFRESH_MS });
  const services = (data as any)?.services ?? [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>System Health</CardTitle>
        <Server size={13} className="text-text-muted" />
      </CardHeader>
      {loading && !services.length ? (
        <div className="space-y-2">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-7 w-full" />)}
        </div>
      ) : (
        <div className="space-y-1.5">
          {services.map((svc: any) => (
            <div key={svc.name} className="flex items-center justify-between py-1">
              <div className="flex items-center gap-2">
                <StatusDot status={svc.status} />
                <span className="text-[12px] text-text-secondary">{svc.name}</span>
              </div>
              <div className="flex items-center gap-2">
                {svc.port && (
                  <span className="text-[10px] text-text-muted font-mono">:{svc.port}</span>
                )}
                <span className={cn(
                  'text-[10px] font-semibold uppercase tracking-wide',
                  svc.status === 'up' ? 'text-success' : svc.status === 'down' ? 'text-danger' : 'text-warning'
                )}>
                  {svc.status}
                </span>
              </div>
            </div>
          ))}
          {services.length === 0 && (
            <p className="text-[11px] text-text-muted text-center py-4">No services configured</p>
          )}
        </div>
      )}
      <div className="mt-4 pt-3 border-t border-white/[0.04] flex items-center justify-between">
        <span className="text-[10px] text-text-muted">
          {services.filter((s: any) => s.status === 'up').length}/{services.length} operational
        </span>
        {services.length > 0 && (
          <Progress
            value={services.filter((s: any) => s.status === 'up').length}
            max={services.length}
            variant="success"
            size="sm"
            className="w-20"
          />
        )}
      </div>
    </Card>
  );
}

function AgentStatusCard() {
  const { data, loading } = useFetch('/api/agents', { refreshInterval: REFRESH_MS });
  const agents = (data as any)?.agents ?? [];
  const total = (data as any)?.total ?? 0;
  const active = (data as any)?.active ?? 0;

  const levels = { L1: 0, L2: 0, L3: 0, L4: 0 };
  agents.forEach((a: any) => {
    if (a.level && levels[a.level as keyof typeof levels] !== undefined) {
      levels[a.level as keyof typeof levels]++;
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Agent Status</CardTitle>
        <Bot size={13} className="text-text-muted" />
      </CardHeader>
      {loading && !agents.length ? (
        <Skeleton className="h-16 w-full" />
      ) : (
        <>
          <div className="flex items-end gap-4 mb-4">
            <div>
              <CardValue>{total}</CardValue>
              <p className="text-[10px] text-text-muted mt-0.5">Total agents</p>
            </div>
            <div>
              <div className="text-xl font-semibold text-success tabular-nums">{active}</div>
              <p className="text-[10px] text-text-muted mt-0.5">Active</p>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {(Object.entries(levels) as [string, number][]).map(([level, count]) => (
              <div key={level} className="text-center">
                <div className="text-[11px] font-mono font-semibold text-text-secondary">{count}</div>
                <div className="text-[9px] text-text-muted">{level}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 space-y-1.5">
            {agents.slice(0, 4).map((a: any) => (
              <div key={a.id} className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <StatusDot status={a.status} />
                  <span className="text-[11px] text-text-secondary truncate max-w-[120px]">{a.name}</span>
                </div>
                <span className="text-[9px] text-text-muted font-mono">{a.level ?? 'L?'}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </Card>
  );
}

function CronHealthCard() {
  const { data, loading } = useFetch('/api/cron-health', { refreshInterval: REFRESH_MS });
  const jobs = (data as any)?.jobs ?? [];
  const healthy = (data as any)?.healthy ?? 0;
  const failing = (data as any)?.failing ?? 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cron Health</CardTitle>
        <Clock size={13} className="text-text-muted" />
      </CardHeader>
      {loading && !jobs.length ? (
        <Skeleton className="h-24 w-full" />
      ) : (
        <>
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-1.5">
              <CheckCircle size={11} className="text-success" />
              <span className="text-[11px] text-text-secondary">{healthy} healthy</span>
            </div>
            {failing > 0 && (
              <div className="flex items-center gap-1.5">
                <XCircle size={11} className="text-danger" />
                <span className="text-[11px] text-danger">{failing} failing</span>
              </div>
            )}
          </div>
          <div className="space-y-1.5">
            {jobs.map((job: any) => (
              <div key={job.id ?? job.name} className="flex items-center justify-between py-0.5">
                <div className="flex items-center gap-2">
                  <span className={cn(
                    'w-1.5 h-1.5 rounded-full flex-shrink-0',
                    job.consecutiveErrors > 0 ? 'bg-danger' :
                    job.lastStatus === 'running' ? 'bg-warning' : 'bg-success'
                  )} />
                  <span className="text-[11px] text-text-secondary truncate max-w-[140px]">{job.name}</span>
                </div>
                <span className="text-[10px] text-text-muted font-mono">{job.schedule}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </Card>
  );
}

function RevenueCard() {
  const { data, loading } = useFetch('/api/revenue', { refreshInterval: REFRESH_MS });
  const rev = data as any;

  const TrendIcon = rev?.trend === 'up' ? TrendingUp : rev?.trend === 'down' ? TrendingDown : Minus;
  const trendColor = rev?.trend === 'up' ? 'text-success' : rev?.trend === 'down' ? 'text-danger' : 'text-text-muted';

  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue</CardTitle>
        <DollarSign size={13} className="text-text-muted" />
      </CardHeader>
      {loading && !rev ? (
        <Skeleton className="h-16 w-full" />
      ) : (
        <>
          <div className="mb-3">
            <div className="flex items-end gap-2">
              <CardValue>{formatCurrency(rev?.currentMRR ?? 0)}</CardValue>
              <div className={cn('flex items-center gap-0.5 mb-1', trendColor)}>
                <TrendIcon size={12} />
                {rev?.trendPercent !== 0 && (
                  <span className="text-[10px] font-semibold">{rev?.trendPercent ?? 0}%</span>
                )}
              </div>
            </div>
            <p className="text-[10px] text-text-muted">MRR</p>
          </div>
          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/[0.04]">
            <div>
              <div className="text-[11px] text-text-secondary font-semibold tabular-nums">
                {formatCurrency(rev?.monthlyBurn ?? 0)}
              </div>
              <div className="text-[9px] text-text-muted mt-0.5">Burn</div>
            </div>
            <div>
              <div className={cn(
                'text-[11px] font-semibold tabular-nums',
                (rev?.netRevenue ?? 0) >= 0 ? 'text-success' : 'text-danger'
              )}>
                {formatCurrency(rev?.netRevenue ?? 0)}
              </div>
              <div className="text-[9px] text-text-muted mt-0.5">Net</div>
            </div>
          </div>
          {rev?.breakdown?.length > 0 && (
            <div className="mt-3 space-y-1">
              {rev.breakdown.slice(0, 3).map((b: any) => (
                <div key={b.source} className="flex items-center justify-between">
                  <span className="text-[10px] text-text-muted">{b.source}</span>
                  <span className="text-[10px] text-text-secondary tabular-nums">{formatCurrency(b.amount)}</span>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </Card>
  );
}

function ContentPipelineCard() {
  const { data, loading } = useFetch('/api/content-pipeline', { refreshInterval: REFRESH_MS });
  const stats = (data as any)?.stats;

  const STAGES = [
    { key: 'draft', label: 'Draft', color: 'text-text-muted' },
    { key: 'review', label: 'Review', color: 'text-warning' },
    { key: 'approved', label: 'Approved', color: 'text-primary' },
    { key: 'published', label: 'Published', color: 'text-success' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Content Pipeline</CardTitle>
        <FileText size={13} className="text-text-muted" />
      </CardHeader>
      {loading && !stats ? (
        <Skeleton className="h-16 w-full" />
      ) : (
        <div className="grid grid-cols-4 gap-2">
          {STAGES.map((s) => (
            <div key={s.key} className="text-center p-2 rounded-lg bg-white/[0.02] border border-white/[0.04]">
              <div className={cn('text-lg font-semibold tabular-nums', s.color)}>
                {stats?.[s.key] ?? 0}
              </div>
              <div className="text-[9px] text-text-muted mt-0.5 uppercase tracking-wide">{s.label}</div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

function QuickStatsCard() {
  const { data: healthData } = useFetch('/api/health', { refreshInterval: REFRESH_MS });
  const { data: agentsData } = useFetch('/api/agents', { refreshInterval: REFRESH_MS });
  const { data: tasksData } = useFetch('/api/suggested-tasks', { refreshInterval: REFRESH_MS });

  const uptime = formatUptime((healthData as any)?.uptime ?? 0);
  const sessions = (agentsData as any)?.total ?? 0;
  const pending = ((tasksData as any)?.tasks ?? []).filter((t: any) => t.status === 'pending').length;

  const stats = [
    { label: 'Uptime', value: uptime, icon: Activity },
    { label: 'Agents', value: sessions, icon: Bot },
    { label: 'Pending Tasks', value: pending, icon: Zap },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Stats</CardTitle>
        <Zap size={13} className="text-text-muted" />
      </CardHeader>
      <div className="space-y-3">
        {stats.map(({ label, value, icon: Icon }) => (
          <div key={label} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon size={12} className="text-text-muted" />
              <span className="text-[12px] text-text-secondary">{label}</span>
            </div>
            <span className="text-[12px] font-semibold text-text-primary tabular-nums">{value}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-3 border-t border-white/[0.04]">
        <div className="flex items-center gap-1.5">
          <span className="status-dot-live w-1.5 h-1.5 rounded-full bg-success" />
          <span className="text-[10px] text-text-muted">All systems monitoring active</span>
        </div>
      </div>
    </Card>
  );
}

export function DashboardOverview() {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), REFRESH_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="p-4 md:p-6 max-w-screen-xl mx-auto">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[15px] font-semibold text-text-primary">Mission Control</h1>
          <p className="text-[11px] text-text-muted mt-0.5">OpenClaw agent system overview</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-md glass-card border-success/[0.15]">
            <span className="status-dot-live w-1.5 h-1.5 rounded-full bg-success" />
            <span className="text-[10px] text-success/80">LIVE</span>
          </div>
          <Badge variant="ghost">AUTO 15S</Badge>
        </div>
      </div>

      {/* Cards grid */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        <motion.div variants={item}>
          <SystemHealthCard />
        </motion.div>
        <motion.div variants={item}>
          <AgentStatusCard />
        </motion.div>
        <motion.div variants={item}>
          <CronHealthCard />
        </motion.div>
        <motion.div variants={item}>
          <RevenueCard />
        </motion.div>
        <motion.div variants={item}>
          <ContentPipelineCard />
        </motion.div>
        <motion.div variants={item}>
          <QuickStatsCard />
        </motion.div>
      </motion.div>
    </div>
  );
}
