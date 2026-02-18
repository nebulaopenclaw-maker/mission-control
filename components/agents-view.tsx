'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, ChevronRight, X, Table, BarChart, Cpu } from 'lucide-react';
import { Card, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Skeleton } from './ui/skeleton';
import { TabBar } from './tab-bar';
import { useFetch } from '@/hooks/use-auto-refresh';
import { cn, relativeTime } from '@/lib/utils';
import { AgentRecord, ModelEntry } from '@/lib/types';

const REFRESH_MS = 15000;

const TABS = [
  { id: 'agents', label: 'Agents' },
  { id: 'models', label: 'Models' },
];

const MODELS: ModelEntry[] = [
  { id: 'claude-opus-4', name: 'Claude Opus 4', provider: 'Anthropic', contextWindow: 200000, costPerMillion: 15, usedFor: ['Orchestration', 'Complex reasoning', 'Strategy'], isDefault: false },
  { id: 'claude-sonnet-4', name: 'Claude Sonnet 4', provider: 'Anthropic', contextWindow: 200000, costPerMillion: 3, usedFor: ['Analysis', 'Content', 'Planning'], isDefault: true },
  { id: 'claude-haiku-4', name: 'Claude Haiku 4', provider: 'Anthropic', contextWindow: 200000, costPerMillion: 0.25, usedFor: ['Quick tasks', 'Classification', 'Extraction'], isDefault: false, failoverTo: 'claude-sonnet-4' },
  { id: 'gpt-4o', name: 'GPT-4o', provider: 'OpenAI', contextWindow: 128000, costPerMillion: 5, usedFor: ['Fallback', 'Vision tasks'], failoverTo: 'claude-sonnet-4' },
  { id: 'gemini-2.0-pro', name: 'Gemini 2.0 Pro', provider: 'Google', contextWindow: 2000000, costPerMillion: 3.5, usedFor: ['Long context', 'Document analysis'] },
];

const LEVEL_COLORS: Record<string, string> = {
  L1: 'text-text-muted bg-white/[0.04]',
  L2: 'text-primary bg-primary/10',
  L3: 'text-warning bg-warning/10',
  L4: 'text-danger bg-danger/10',
};

// ─── Agent Detail Panel ──────────────────────────────────────────────────────

function AgentDetailPanel({ agentId, onClose }: { agentId: string; onClose: () => void }) {
  const { data, loading } = useFetch(`/api/agents/${agentId}`);
  const agent = (data as any)?.agent;
  const soul = (data as any)?.soul;
  const rules = (data as any)?.rules;
  const outputs = (data as any)?.outputs ?? [];
  const [tab, setTab] = useState('soul');

  const detailTabs = [
    { id: 'soul', label: 'Soul' },
    { id: 'rules', label: 'Rules' },
    { id: 'outputs', label: 'Outputs' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="glass-card flex flex-col h-full overflow-hidden"
    >
      <div className="flex items-center justify-between p-4 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <Bot size={14} className="text-primary" />
          <span className="text-[13px] font-semibold text-text-primary">{agent?.name ?? agentId}</span>
          {agent?.level && (
            <span className={cn('text-[9px] font-bold px-1.5 py-0.5 rounded-md', LEVEL_COLORS[agent.level])}>
              {agent.level}
            </span>
          )}
        </div>
        <Button size="icon-sm" variant="ghost" onClick={onClose}>
          <X size={12} />
        </Button>
      </div>

      <div className="p-3 border-b border-white/[0.04]">
        <TabBar tabs={detailTabs} activeTab={tab} onTabChange={setTab} />
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {loading ? (
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-3 w-full" />)}
          </div>
        ) : (
          <>
            {tab === 'soul' && (
              <div className="prose-custom">
                {soul ? (
                  <pre className="text-[11px] text-text-secondary font-mono whitespace-pre-wrap leading-relaxed">{soul}</pre>
                ) : (
                  <p className="text-[11px] text-text-muted text-center py-8">No SOUL.md found for this agent</p>
                )}
              </div>
            )}
            {tab === 'rules' && (
              <div>
                {rules ? (
                  <pre className="text-[11px] text-text-secondary font-mono whitespace-pre-wrap leading-relaxed">{rules}</pre>
                ) : (
                  <p className="text-[11px] text-text-muted text-center py-8">No RULES.md found for this agent</p>
                )}
              </div>
            )}
            {tab === 'outputs' && (
              <div className="space-y-3">
                {outputs.length === 0 ? (
                  <p className="text-[11px] text-text-muted text-center py-8">No recent outputs</p>
                ) : (
                  outputs.map((o: any) => (
                    <div key={o.filename} className="code-block p-3">
                      <p className="text-[9px] text-text-muted mb-2">{o.filename}</p>
                      <pre className="text-[10px] text-text-secondary whitespace-pre-wrap">{o.content}</pre>
                    </div>
                  ))
                )}
              </div>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
}

// ─── Agents Grid ─────────────────────────────────────────────────────────────

function AgentsTab() {
  const { data, loading } = useFetch('/api/agents', { refreshInterval: REFRESH_MS });
  const agents: AgentRecord[] = (data as any)?.agents ?? [];
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } },
  };

  const card = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 28 } },
  };

  return (
    <div className="flex gap-4">
      <div className={cn('flex-1 min-w-0', selectedId && 'hidden lg:block lg:max-w-[60%]')}>
        {loading && !agents.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
            {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-32" />)}
          </div>
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3"
          >
            {agents.map((agent) => (
              <motion.div
                key={agent.id}
                variants={card}
                onClick={() => setSelectedId(selectedId === agent.id ? null : agent.id)}
                className={cn(
                  'glass-card glass-card-hover p-4 cursor-pointer',
                  selectedId === agent.id && 'border-primary/30 bg-primary/[0.04]'
                )}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center">
                    <Bot size={16} className={cn(
                      agent.status === 'active' ? 'text-success' :
                      agent.status === 'error' ? 'text-danger' : 'text-text-muted'
                    )} />
                  </div>
                  <div className="flex items-center gap-1.5">
                    {agent.level && (
                      <span className={cn('text-[9px] font-bold px-1.5 py-0.5 rounded-md', LEVEL_COLORS[agent.level ?? 'L1'])}>
                        {agent.level}
                      </span>
                    )}
                    <span className={cn(
                      'text-[9px] font-semibold',
                      agent.status === 'active' ? 'text-success' :
                      agent.status === 'error' ? 'text-danger' : 'text-text-muted'
                    )}>
                      {agent.status?.toUpperCase()}
                    </span>
                  </div>
                </div>
                <h3 className="text-[12px] font-semibold text-text-primary mb-0.5">{agent.name}</h3>
                <p className="text-[10px] text-text-muted mb-2">{agent.role}</p>
                <p className="text-[10px] text-text-muted font-mono">{agent.model}</p>
                {agent.lastActive && (
                  <p className="text-[9px] text-text-dim mt-2">{relativeTime(agent.lastActive)}</p>
                )}
                <div className="flex items-center justify-end mt-2">
                  <ChevronRight size={11} className="text-text-dim" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {selectedId && (
          <div className="w-full lg:w-[420px] flex-shrink-0 h-[calc(100vh-120px)] sticky top-16">
            <AgentDetailPanel agentId={selectedId} onClose={() => setSelectedId(null)} />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Models Tab ──────────────────────────────────────────────────────────────

function ModelsTab() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Model Inventory</CardTitle>
        <Cpu size={13} className="text-text-muted" />
      </CardHeader>
      <div className="overflow-x-auto">
        <table className="w-full text-[11px]">
          <thead>
            <tr className="border-b border-white/[0.06]">
              {['Model', 'Provider', 'Context', '$/1M tok', 'Used For', 'Failover'].map((h) => (
                <th key={h} className="text-left text-text-muted pb-3 font-medium pr-4">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {MODELS.map((m) => (
              <tr key={m.id} className="border-b border-white/[0.03] last:border-0">
                <td className="py-3 pr-4">
                  <div className="flex items-center gap-2">
                    <span className="text-text-primary font-medium">{m.name}</span>
                    {m.isDefault && <Badge variant="primary" className="text-[9px]">Default</Badge>}
                  </div>
                </td>
                <td className="py-3 pr-4 text-text-muted">{m.provider}</td>
                <td className="py-3 pr-4 text-text-muted font-mono">
                  {m.contextWindow >= 1000000
                    ? `${m.contextWindow / 1000000}M`
                    : `${m.contextWindow / 1000}k`}
                </td>
                <td className="py-3 pr-4 text-text-secondary font-mono">${m.costPerMillion}</td>
                <td className="py-3 pr-4">
                  <div className="flex flex-wrap gap-1">
                    {m.usedFor.map((u) => (
                      <Badge key={u} variant="ghost">{u}</Badge>
                    ))}
                  </div>
                </td>
                <td className="py-3 text-text-muted font-mono">{m.failoverTo ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export function AgentsView() {
  const [activeTab, setActiveTab] = useState('agents');

  return (
    <div className="p-4 md:p-6 max-w-screen-xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[15px] font-semibold text-text-primary">Agents</h1>
          <p className="text-[11px] text-text-muted mt-0.5">Registry, configurations, and model routing</p>
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
        {activeTab === 'agents' && <AgentsTab />}
        {activeTab === 'models' && <ModelsTab />}
      </motion.div>
    </div>
  );
}
