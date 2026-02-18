'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Users, ChevronRight, Phone, Mail, Building2 } from 'lucide-react';
import { Card, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Skeleton } from './ui/skeleton';
import { TabBar } from './tab-bar';
import { useFetch } from '@/hooks/use-auto-refresh';
import { cn, relativeTime, formatCurrency } from '@/lib/utils';
import { CRMClient, CRMStage } from '@/lib/types';

const TABS = [
  { id: 'comms', label: 'Comms' },
  { id: 'crm', label: 'CRM' },
];

// ─── Comms Feed ───────────────────────────────────────────────────────────────

const SAMPLE_DIGEST = [
  { id: 'd1', source: 'Telegram', content: 'Market scan completed. BTC up 3.2% in last 4h. Key resistance at 68k.', timestamp: new Date(Date.now() - 1800000).toISOString(), type: 'market' },
  { id: 'd2', source: 'Discord', content: '3 new community members joined #general. Engagement up 12% this week.', timestamp: new Date(Date.now() - 3600000).toISOString(), type: 'community' },
  { id: 'd3', source: 'Telegram', content: 'Task completed: Weekly report generated and sent to stakeholders.', timestamp: new Date(Date.now() - 7200000).toISOString(), type: 'task' },
  { id: 'd4', source: 'Discord', content: 'New question in #support about API integration. Flagged for response.', timestamp: new Date(Date.now() - 10800000).toISOString(), type: 'support' },
];

const SOURCE_COLORS: Record<string, string> = {
  Telegram: 'text-blue-400',
  Discord: 'text-indigo-400',
  Email: 'text-success',
};

function CommsTab() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <MessageCircle size={13} className="text-text-muted" />
        </CardHeader>
        <div className="space-y-3">
          {SAMPLE_DIGEST.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]"
            >
              <div className={cn('text-[10px] font-semibold mt-0.5 flex-shrink-0', SOURCE_COLORS[item.source])}>
                {item.source}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[12px] text-text-secondary leading-relaxed">{item.content}</p>
                <p className="text-[9px] text-text-dim mt-1">{relativeTime(item.timestamp)}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Telegram Messages', value: '24', sub: 'last 24h' },
          { label: 'Discord Posts', value: '11', sub: 'last 24h' },
          { label: 'Notifications Sent', value: '38', sub: 'last 24h' },
          { label: 'Response Rate', value: '98%', sub: 'avg' },
        ].map((stat) => (
          <Card key={stat.label} compact>
            <p className="label-xs">{stat.label}</p>
            <p className="text-2xl font-semibold text-text-primary mt-2 tabular-nums">{stat.value}</p>
            <p className="text-[10px] text-text-muted mt-0.5">{stat.sub}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ─── CRM ──────────────────────────────────────────────────────────────────────

const CRM_STAGES: CRMStage[] = ['Prospect', 'Contacted', 'Meeting', 'Proposal', 'Active'];

const STAGE_COLORS: Record<CRMStage, { dot: string; text: string }> = {
  Prospect: { dot: 'bg-text-muted', text: 'text-text-muted' },
  Contacted: { dot: 'bg-accent', text: 'text-sky-400' },
  Meeting: { dot: 'bg-warning', text: 'text-warning' },
  Proposal: { dot: 'bg-primary', text: 'text-primary' },
  Active: { dot: 'bg-success', text: 'text-success' },
};

function CRMCard({ client }: { client: CRMClient }) {
  const colors = STAGE_COLORS[client.stage];

  return (
    <div className="glass-card glass-card-hover p-3 space-y-2">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[12px] font-medium text-text-primary">{client.name}</p>
          {client.company && (
            <p className="text-[10px] text-text-muted flex items-center gap-1 mt-0.5">
              <Building2 size={9} />
              {client.company}
            </p>
          )}
        </div>
        {client.value && (
          <span className="text-[10px] text-success font-semibold tabular-nums">
            {formatCurrency(client.value)}
          </span>
        )}
      </div>
      {client.nextAction && (
        <p className="text-[10px] text-text-muted leading-snug">{client.nextAction}</p>
      )}
      <div className="flex items-center justify-between pt-1 border-t border-white/[0.04]">
        {client.lastInteraction && (
          <span className="text-[9px] text-text-dim">{relativeTime(client.lastInteraction)}</span>
        )}
        <div className="flex items-center gap-1.5">
          <span className={cn('w-1.5 h-1.5 rounded-full', colors.dot)} />
          <span className={cn('text-[9px] font-medium', colors.text)}>{client.stage}</span>
        </div>
      </div>
    </div>
  );
}

function CRMView() {
  const { data, loading } = useFetch('/api/clients');
  const clients: CRMClient[] = (data as any)?.clients ?? [];

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-4">
        {CRM_STAGES.map((stage) => {
          const count = clients.filter((c) => c.stage === stage).length;
          const colors = STAGE_COLORS[stage];
          return (
            <div key={stage} className="text-center p-3 glass-card">
              <span className={cn('text-xl font-semibold tabular-nums', colors.text)}>{count}</span>
              <p className="text-[9px] text-text-muted mt-0.5 uppercase tracking-wide">{stage}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
        {CRM_STAGES.map((stage) => {
          const stageClients = clients.filter((c) => c.stage === stage);
          const colors = STAGE_COLORS[stage];
          return (
            <div key={stage}>
              <div className="flex items-center gap-1.5 mb-2">
                <span className={cn('w-1.5 h-1.5 rounded-full', colors.dot)} />
                <span className={cn('text-[10px] font-semibold uppercase tracking-wide', colors.text)}>
                  {stage}
                </span>
              </div>
              <div className="kanban-col p-2 space-y-2">
                {loading ? (
                  <Skeleton className="h-16" />
                ) : stageClients.length === 0 ? (
                  <p className="text-[9px] text-text-dim text-center py-4">Empty</p>
                ) : (
                  stageClients.map((client) => (
                    <CRMCard key={client.id} client={client} />
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export function CommsView() {
  const [activeTab, setActiveTab] = useState('comms');

  return (
    <div className="p-4 md:p-6 max-w-screen-xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[15px] font-semibold text-text-primary">Communications</h1>
          <p className="text-[11px] text-text-muted mt-0.5">Comms digest and client pipeline</p>
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
        {activeTab === 'comms' && <CommsTab />}
        {activeTab === 'crm' && <CRMView />}
      </motion.div>
    </div>
  );
}
