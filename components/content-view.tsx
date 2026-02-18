'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Edit3, Plus, Twitter, Linkedin, Mail, Globe } from 'lucide-react';
import { Card, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Skeleton } from './ui/skeleton';
import { useFetch } from '@/hooks/use-auto-refresh';
import { cn, relativeTime, truncate } from '@/lib/utils';
import { ContentDraft } from '@/lib/types';

const REFRESH_MS = 15000;

const STAGES = [
  { id: 'draft', label: 'Draft', color: 'text-text-muted', dot: 'bg-text-muted' },
  { id: 'review', label: 'Review', color: 'text-warning', dot: 'bg-warning' },
  { id: 'approved', label: 'Approved', color: 'text-primary', dot: 'bg-primary' },
  { id: 'published', label: 'Published', color: 'text-success', dot: 'bg-success' },
];

const PLATFORM_ICON: Record<string, any> = {
  Twitter: Twitter,
  LinkedIn: Linkedin,
  Email: Mail,
  Blog: Globe,
};

function ContentCard({ item, onStatusChange }: {
  item: ContentDraft;
  onStatusChange: (id: string, status: string) => void;
}) {
  const Icon = PLATFORM_ICON[item.platform] ?? Globe;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="glass-card p-4 space-y-3"
    >
      <div className="flex items-start justify-between gap-2">
        <h4 className="text-[12px] font-medium text-text-primary leading-snug flex-1">
          {item.title}
        </h4>
        <Icon size={12} className="text-text-muted flex-shrink-0 mt-0.5" />
      </div>

      {item.preview && (
        <p className="text-[11px] text-text-muted leading-relaxed">
          {truncate(item.preview, 120)}
        </p>
      )}

      <div className="flex items-center gap-1.5 flex-wrap">
        <Badge variant="ghost">{item.platform}</Badge>
        {item.tags?.map((tag) => (
          <Badge key={tag} variant="ghost">#{tag}</Badge>
        ))}
      </div>

      <div className="flex items-center justify-between pt-1 border-t border-white/[0.04]">
        <span className="text-[9px] text-text-dim">{relativeTime(item.createdAt)}</span>
        <div className="flex items-center gap-1">
          {item.status === 'draft' && (
            <Button size="sm" variant="secondary" onClick={() => onStatusChange(item.id, 'review')}>
              Submit for review
            </Button>
          )}
          {item.status === 'review' && (
            <>
              <Button size="sm" variant="danger" onClick={() => onStatusChange(item.id, 'draft')}>
                <XCircle size={10} />
              </Button>
              <Button size="sm" variant="success" onClick={() => onStatusChange(item.id, 'approved')}>
                <CheckCircle size={10} /> Approve
              </Button>
            </>
          )}
          {item.status === 'approved' && (
            <Button size="sm" variant="primary" onClick={() => onStatusChange(item.id, 'published')}>
              Publish
            </Button>
          )}
          {item.status === 'published' && (
            <Badge variant="success">Published</Badge>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export function ContentView() {
  const { data, loading, refetch } = useFetch('/api/content-pipeline', { refreshInterval: REFRESH_MS });
  const [items, setItems] = useState<ContentDraft[]>([]);
  const initialItems = (data as any)?.items ?? [];

  const displayItems = items.length > 0 ? items : initialItems;

  function handleStatusChange(id: string, newStatus: string) {
    setItems((prev) => {
      const base = prev.length > 0 ? prev : initialItems;
      return base.map((item: ContentDraft) =>
        item.id === id ? { ...item, status: newStatus as any } : item
      );
    });
  }

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.04 } },
  };

  return (
    <div className="p-4 md:p-6 max-w-screen-xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[15px] font-semibold text-text-primary">Content Pipeline</h1>
          <p className="text-[11px] text-text-muted mt-0.5">Manage drafts from creation to publishing</p>
        </div>
        <Button size="sm" variant="primary">
          <Plus size={11} /> New Draft
        </Button>
      </div>

      {/* Kanban Columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {STAGES.map((stage) => {
          const stageItems = displayItems.filter((i: ContentDraft) => i.status === stage.id);
          return (
            <div key={stage.id}>
              {/* Column Header */}
              <div className="flex items-center gap-2 mb-3 px-1">
                <span className={cn('w-2 h-2 rounded-full', stage.dot)} />
                <span className={cn('text-[11px] font-semibold uppercase tracking-wide', stage.color)}>
                  {stage.label}
                </span>
                <span className="text-[10px] text-text-dim ml-auto">{stageItems.length}</span>
              </div>

              {/* Column Body */}
              <div className="kanban-col p-2 space-y-2">
                {loading && stageItems.length === 0 && (
                  <div className="space-y-2">
                    <Skeleton className="h-24" />
                    <Skeleton className="h-24" />
                  </div>
                )}
                <AnimatePresence mode="popLayout">
                  {stageItems.map((item: ContentDraft) => (
                    <ContentCard
                      key={item.id}
                      item={item}
                      onStatusChange={handleStatusChange}
                    />
                  ))}
                </AnimatePresence>
                {!loading && stageItems.length === 0 && (
                  <div className="text-center py-6">
                    <p className="text-[10px] text-text-dim">Empty</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
