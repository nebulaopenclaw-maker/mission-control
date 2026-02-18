'use client';

import { useState, Suspense } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Clock, RefreshCw, Tag, BarChart2, Filter } from 'lucide-react';
import { Card, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Skeleton } from './ui/skeleton';
import { TabBar } from './tab-bar';
import { useFetch } from '@/hooks/use-auto-refresh';
import { cn, relativeTime, groupBy } from '@/lib/utils';
import { SuggestedTask, TaskCategory } from '@/lib/types';
import { CalendarView } from './calendar-view';

const REFRESH_MS = 15000;

const CATEGORY_EMOJI: Record<string, string> = {
  Revenue: '💰',
  Product: '🚀',
  Community: '👥',
  Content: '✍️',
  Operations: '⚙️',
  Clients: '🤝',
  Trading: '📈',
  Brand: '🎨',
};

const TABS = [
  { id: 'operations', label: 'Operations' },
  { id: 'tasks', label: 'Tasks' },
  { id: 'calendar', label: 'Calendar' },
];

// ─── Operations Tab ─────────────────────────────────────────────────────────

function OperationsTab() {
  const { data: sysData, loading: sysLoading } = useFetch('/api/system-state', { refreshInterval: REFRESH_MS });
  const { data: obsData } = useFetch('/api/observations', { refreshInterval: REFRESH_MS });
  const { data: priData } = useFetch('/api/priorities', { refreshInterval: REFRESH_MS });

  const services = (sysData as any)?.services ?? [];
  const branches = (sysData as any)?.branches ?? [];
  const observations = (obsData as any)?.observations ?? [];
  const priorities = (priData as any)?.priorities ?? [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Server Health */}
      <Card>
        <CardHeader>
          <CardTitle>Server Health</CardTitle>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-[11px]">
            <thead>
              <tr className="border-b border-white/[0.04]">
                <th className="text-left text-text-muted pb-2 font-medium">Service</th>
                <th className="text-left text-text-muted pb-2 font-medium">Port</th>
                <th className="text-left text-text-muted pb-2 font-medium">Status</th>
                <th className="text-right text-text-muted pb-2 font-medium">Last Check</th>
              </tr>
            </thead>
            <tbody>
              {services.map((svc: any) => (
                <tr key={svc.name} className="border-b border-white/[0.03] last:border-0">
                  <td className="py-2 text-text-secondary pr-4">{svc.name}</td>
                  <td className="py-2 text-text-muted font-mono">{svc.port ?? '—'}</td>
                  <td className="py-2">
                    <span className={cn(
                      'text-[10px] font-semibold',
                      svc.status === 'up' ? 'text-success' : 'text-danger'
                    )}>
                      {svc.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-2 text-text-muted text-right">
                    {svc.lastCheck ? relativeTime(svc.lastCheck) : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Branch Status */}
      <Card>
        <CardHeader>
          <CardTitle>Branch Status</CardTitle>
        </CardHeader>
        {branches.length === 0 ? (
          <p className="text-[11px] text-text-muted text-center py-8">No branch data available</p>
        ) : (
          <div className="space-y-2">
            {branches.map((b: any) => (
              <div key={`${b.repo}-${b.branch}`} className="flex items-center justify-between p-2 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                <div>
                  <p className="text-[11px] text-text-primary font-medium">{b.repo}</p>
                  <p className="text-[10px] text-text-muted font-mono">{b.branch}</p>
                </div>
                <Badge variant={b.status === 'clean' ? 'success' : b.status === 'dirty' ? 'warning' : 'primary'}>
                  {b.status}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Observations */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Observations Feed</CardTitle>
          <span className="text-[10px] text-text-muted">{observations.length} entries</span>
        </CardHeader>
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {observations.slice(0, 20).map((obs: any) => (
            <div key={obs.id} className="flex gap-3 py-1.5 border-b border-white/[0.03] last:border-0">
              <span className="text-[10px] text-text-muted font-mono flex-shrink-0 mt-0.5">
                {relativeTime(obs.timestamp)}
              </span>
              <p className="text-[11px] text-text-secondary leading-relaxed">{obs.content}</p>
            </div>
          ))}
          {observations.length === 0 && (
            <p className="text-[11px] text-text-muted text-center py-4">No observations recorded</p>
          )}
        </div>
      </Card>

      {/* Priorities */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>System Priorities</CardTitle>
        </CardHeader>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {priorities.map((section: any, i: number) => (
            <div key={i}>
              <h4 className="text-[11px] font-semibold text-text-secondary mb-2">{section.title}</h4>
              <ul className="space-y-1.5">
                {section.items.map((item: string, j: number) => (
                  <li key={j} className="flex items-start gap-2 text-[11px] text-text-muted">
                    <span className="text-primary mt-0.5">›</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ─── Tasks Tab ───────────────────────────────────────────────────────────────

function TaskCard({ task, onAction }: { task: SuggestedTask; onAction: (id: string, action: 'approve' | 'reject') => void }) {
  const [acting, setActing] = useState(false);

  async function handleAction(action: 'approve' | 'reject') {
    setActing(true);
    try {
      await fetch('/api/suggested-tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId: task.id, action }),
      });
      onAction(task.id, action);
    } finally {
      setActing(false);
    }
  }

  const priorityVariant: Record<string, any> = {
    critical: 'critical', high: 'high', medium: 'medium', low: 'low',
  };

  const effortColor: Record<string, string> = {
    quick: 'text-success', medium: 'text-warning', heavy: 'text-danger',
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="glass-card p-4 space-y-3"
    >
      <div className="flex items-start justify-between gap-2">
        <h4 className="text-[12px] font-medium text-text-primary leading-snug">{task.title}</h4>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <Badge variant={priorityVariant[task.priority]}>{task.priority}</Badge>
        </div>
      </div>

      <p className="text-[11px] text-text-muted leading-relaxed">{task.reasoning}</p>

      <div className="bg-white/[0.02] rounded-lg px-3 py-2 border border-white/[0.04]">
        <span className="text-[9px] uppercase tracking-wide text-text-muted">Next action</span>
        <p className="text-[11px] text-text-secondary mt-0.5">{task.nextAction}</p>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={cn('text-[10px] font-medium', effortColor[task.effort])}>
            {task.effort} effort
          </span>
        </div>
        {task.status === 'pending' && (
          <div className="flex items-center gap-1.5">
            <Button
              size="sm"
              variant="danger"
              disabled={acting}
              onClick={() => handleAction('reject')}
            >
              <XCircle size={10} /> Reject
            </Button>
            <Button
              size="sm"
              variant="success"
              disabled={acting}
              onClick={() => handleAction('approve')}
            >
              <CheckCircle size={10} /> Approve
            </Button>
          </div>
        )}
        {task.status === 'approved' && (
          <Badge variant="success">Approved</Badge>
        )}
        {task.status === 'rejected' && (
          <Badge variant="danger">Rejected</Badge>
        )}
      </div>
    </motion.div>
  );
}

function TasksTab() {
  const { data, loading, refetch } = useFetch('/api/suggested-tasks', { refreshInterval: REFRESH_MS });
  const [statusFilter, setStatusFilter] = useState<string>('pending');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [localUpdates, setLocalUpdates] = useState<Record<string, 'approved' | 'rejected'>>({});

  const allTasks: SuggestedTask[] = ((data as any)?.tasks ?? []).map((t: SuggestedTask) => ({
    ...t,
    status: localUpdates[t.id] ?? t.status,
  }));

  const filtered = allTasks.filter((t) => {
    if (statusFilter && t.status !== statusFilter) return false;
    if (categoryFilter && t.category !== categoryFilter) return false;
    return true;
  });

  const grouped = groupBy(filtered, 'category');

  function handleAction(id: string, action: 'approve' | 'reject') {
    setLocalUpdates((prev) => ({ ...prev, [id]: action === 'approve' ? 'approved' : 'rejected' }));
  }

  const categories = [...new Set(allTasks.map((t) => t.category))];

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2 mb-5">
        <div className="flex items-center gap-1 text-text-muted">
          <Filter size={12} />
          <span className="text-[10px]">Filter:</span>
        </div>
        {['pending', 'approved', 'rejected'].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(statusFilter === s ? '' : s)}
            className={cn(
              'px-2.5 py-1 rounded-lg text-[10px] font-medium transition-colors',
              statusFilter === s
                ? 'bg-primary/15 text-primary border border-primary/25'
                : 'bg-white/[0.04] text-text-muted border border-white/[0.06] hover:text-text-secondary'
            )}
          >
            {s}
          </button>
        ))}
        <div className="w-px h-4 bg-white/[0.06]" />
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCategoryFilter(categoryFilter === c ? '' : c)}
            className={cn(
              'px-2.5 py-1 rounded-lg text-[10px] font-medium transition-colors',
              categoryFilter === c
                ? 'bg-white/[0.08] text-text-primary'
                : 'bg-white/[0.02] text-text-muted hover:text-text-secondary'
            )}
          >
            {CATEGORY_EMOJI[c] ?? '📌'} {c}
          </button>
        ))}
      </div>

      {loading && !allTasks.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-36" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-[13px] text-text-muted">No tasks match the current filter</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([category, tasks]) => (
            <div key={category}>
              <h3 className="text-[11px] font-semibold text-text-muted mb-3 flex items-center gap-2">
                <span>{CATEGORY_EMOJI[category] ?? '📌'}</span>
                <span className="uppercase tracking-wide">{category}</span>
                <span className="text-text-dim">({tasks.length})</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {tasks.map((task) => (
                  <TaskCard key={task.id} task={task} onAction={handleAction} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export function OpsView() {
  const [activeTab, setActiveTab] = useState('operations');

  return (
    <div className="p-4 md:p-6 max-w-screen-xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[15px] font-semibold text-text-primary">Operations</h1>
          <p className="text-[11px] text-text-muted mt-0.5">System status, tasks, and calendar</p>
        </div>
      </div>

      <div className="mb-5">
        <TabBar tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {activeTab === 'operations' && <OperationsTab />}
        {activeTab === 'tasks' && <TasksTab />}
        {activeTab === 'calendar' && <CalendarView />}
      </motion.div>
    </div>
  );
}
