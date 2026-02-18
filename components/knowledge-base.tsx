'use client';

import { useState, useCallback, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Search, FileText, Folder, ChevronRight, ExternalLink, Globe } from 'lucide-react';
import { Card, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Skeleton } from './ui/skeleton';
import { TabBar } from './tab-bar';
import { Input } from './ui/input';
import { useFetch } from '@/hooks/use-auto-refresh';
import { cn, relativeTime, formatBytes } from '@/lib/utils';
import { KnowledgeEntry, EcosystemProduct } from '@/lib/types';

const TABS = [
  { id: 'knowledge', label: 'Knowledge' },
  { id: 'ecosystem', label: 'Ecosystem' },
];

// ─── Knowledge Tab ────────────────────────────────────────────────────────────

function KnowledgeTab() {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  const { data, loading } = useFetch(
    `/api/knowledge?q=${encodeURIComponent(debouncedQuery)}`,
    { refreshInterval: 60000 }
  );

  const results: KnowledgeEntry[] = (data as any)?.results ?? [];

  const categories = [...new Set(results.map((r) => r.category).filter(Boolean))];

  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    setQuery(e.target.value);
    const v = e.target.value;
    setTimeout(() => setDebouncedQuery(v), 400);
  }

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.04 } },
  };

  return (
    <div>
      <div className="mb-5">
        <Input
          icon={<Search size={13} />}
          value={query}
          onChange={handleSearch}
          placeholder="Search workspace files..."
          className="max-w-md h-9 text-[12px]"
        />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-24" />)}
        </div>
      ) : results.length === 0 ? (
        <div className="text-center py-16">
          <Search size={24} className="text-text-dim mx-auto mb-3" />
          <p className="text-[12px] text-text-muted">
            {debouncedQuery ? `No results for "${debouncedQuery}"` : 'No files found in workspace'}
          </p>
          <p className="text-[11px] text-text-dim mt-1">Configure OPENCLAW_WORKSPACE_PATH to point to your workspace</p>
        </div>
      ) : (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3"
        >
          {results.map((entry) => (
            <motion.div
              key={entry.path}
              variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}
              className="glass-card glass-card-hover p-4"
            >
              <div className="flex items-start gap-2 mb-2">
                <FileText size={12} className="text-primary flex-shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <p className="text-[12px] font-medium text-text-primary truncate">{entry.title}</p>
                  <p className="text-[9px] text-text-muted font-mono truncate">{entry.path}</p>
                </div>
              </div>
              <p className="text-[11px] text-text-muted leading-relaxed line-clamp-3">{entry.excerpt}</p>
              <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/[0.04]">
                <div className="flex items-center gap-2">
                  {entry.category && <Badge variant="ghost">{entry.category}</Badge>}
                  <span className="text-[9px] text-text-dim">{formatBytes(entry.size)}</span>
                </div>
                <span className="text-[9px] text-text-dim">{relativeTime(entry.lastModified)}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}

// ─── Ecosystem Tab ────────────────────────────────────────────────────────────

const STATUS_STYLES: Record<string, { text: string; bg: string; dot: string }> = {
  Active: { text: 'text-success', bg: 'bg-success/10', dot: 'bg-success' },
  Development: { text: 'text-warning', bg: 'bg-warning/10', dot: 'bg-warning' },
  Concept: { text: 'text-primary', bg: 'bg-primary/10', dot: 'bg-primary' },
  Paused: { text: 'text-text-muted', bg: 'bg-white/[0.06]', dot: 'bg-text-muted' },
  Deprecated: { text: 'text-danger', bg: 'bg-danger/10', dot: 'bg-danger' },
};

const FALLBACK_PRODUCTS = [
  { id: '1', slug: 'openclaw', name: 'OpenClaw', tagline: 'Autonomous AI agent platform', status: 'Active' as const, healthScore: 95, metrics: { uptime: '99.9%', sessions: 142 } },
  { id: '2', slug: 'nebula-os', name: 'Nebula OS', tagline: 'Operating system for AI agents', status: 'Development' as const, healthScore: 60 },
  { id: '3', slug: 'tradegpt', name: 'TradeGPT', tagline: 'AI-powered trading signals', status: 'Concept' as const, healthScore: 20 },
  { id: '4', slug: 'mission-control', name: 'Mission Control', tagline: 'Command center for OpenClaw', status: 'Active' as const, healthScore: 98 },
];

function EcosystemTab() {
  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4"
    >
      {FALLBACK_PRODUCTS.map((product) => {
        const style = STATUS_STYLES[product.status] ?? STATUS_STYLES.Concept;
        return (
          <motion.div
            key={product.id}
            variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}
          >
            <a href={`/ecosystem/${product.slug}`} className="block glass-card glass-card-hover p-5 h-full">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-[13px] font-semibold text-text-primary">{product.name}</h3>
                  {product.tagline && (
                    <p className="text-[10px] text-text-muted mt-0.5">{product.tagline}</p>
                  )}
                </div>
                <span className={cn('text-[9px] font-semibold px-2 py-0.5 rounded-full', style.text, style.bg)}>
                  {product.status}
                </span>
              </div>

              {product.healthScore !== undefined && (
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[9px] text-text-muted uppercase tracking-wide">Health</span>
                    <span className="text-[10px] font-semibold tabular-nums text-text-secondary">
                      {product.healthScore}%
                    </span>
                  </div>
                  <div className="h-1 rounded-full bg-white/[0.06]">
                    <div
                      className={cn(
                        'h-full rounded-full transition-all',
                        product.healthScore >= 80 ? 'bg-success' :
                        product.healthScore >= 50 ? 'bg-warning' : 'bg-danger'
                      )}
                      style={{ width: `${product.healthScore}%` }}
                    />
                  </div>
                </div>
              )}

              {product.metrics && (
                <div className="grid grid-cols-2 gap-2 mt-3">
                  {Object.entries(product.metrics).slice(0, 4).map(([key, val]) => (
                    <div key={key} className="bg-white/[0.02] rounded-lg p-2">
                      <p className="text-[9px] text-text-muted uppercase tracking-wide">{key}</p>
                      <p className="text-[11px] font-semibold text-text-secondary tabular-nums">{String(val)}</p>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-end mt-3">
                <ChevronRight size={12} className="text-text-dim" />
              </div>
            </a>
          </motion.div>
        );
      })}
    </motion.div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export function KnowledgeView() {
  const [activeTab, setActiveTab] = useState('knowledge');

  return (
    <div className="p-4 md:p-6 max-w-screen-xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[15px] font-semibold text-text-primary">Knowledge</h1>
          <p className="text-[11px] text-text-muted mt-0.5">Workspace files and ecosystem overview</p>
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
        {activeTab === 'knowledge' && <KnowledgeTab />}
        {activeTab === 'ecosystem' && <EcosystemTab />}
      </motion.div>
    </div>
  );
}
