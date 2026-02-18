'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Globe, GitBranch, ExternalLink } from 'lucide-react';
import { Card, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Skeleton } from './ui/skeleton';
import { TabBar } from './tab-bar';
import { useFetch } from '@/hooks/use-auto-refresh';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const SECTION_TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'brand', label: 'Brand' },
  { id: 'community', label: 'Community' },
  { id: 'content', label: 'Content' },
  { id: 'legal', label: 'Legal' },
  { id: 'product', label: 'Product' },
  { id: 'website', label: 'Website' },
];

// ─── Ecosystem Products List ──────────────────────────────────────────────────

export function EcosystemView() {
  return (
    <div className="p-4 md:p-6 max-w-screen-xl mx-auto">
      <div className="mb-6">
        <h1 className="text-[15px] font-semibold text-text-primary">Ecosystem</h1>
        <p className="text-[11px] text-text-muted mt-0.5">All products and services in the OpenClaw ecosystem</p>
      </div>
      <div className="text-center py-16">
        <Globe size={24} className="text-text-dim mx-auto mb-3" />
        <p className="text-[12px] text-text-muted">View the Ecosystem tab in Knowledge for the product grid</p>
        <Link href="/knowledge?tab=ecosystem">
          <Button size="sm" variant="primary" className="mt-4">
            Go to Ecosystem
          </Button>
        </Link>
      </div>
    </div>
  );
}

// ─── Ecosystem Detail ─────────────────────────────────────────────────────────

export function EcosystemDetail({ slug }: { slug: string }) {
  const { data, loading } = useFetch(`/api/ecosystem/${slug}`);
  const product = (data as any)?.product;
  const sections = (data as any)?.sections ?? {};
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="p-4 md:p-6 max-w-screen-xl mx-auto">
      <div className="mb-5">
        <Link href="/knowledge?tab=ecosystem" className="flex items-center gap-1.5 text-[11px] text-text-muted hover:text-text-secondary transition-colors mb-4">
          <ArrowLeft size={12} />
          Back to Ecosystem
        </Link>

        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
        ) : (
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-[18px] font-semibold text-text-primary">{product?.name ?? slug}</h1>
              {product?.tagline && (
                <p className="text-[12px] text-text-muted mt-0.5">{product.tagline}</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              {product?.url && (
                <a href={product.url} target="_blank" rel="noopener noreferrer">
                  <Button size="sm" variant="ghost" type="button">
                    <ExternalLink size={11} /> Website
                  </Button>
                </a>
              )}
              {product?.repo && (
                <Button size="sm" variant="ghost">
                  <GitBranch size={11} /> Repo
                </Button>
              )}
              {product?.status && (
                <Badge variant={product.status === 'Active' ? 'success' : product.status === 'Development' ? 'warning' : 'default'}>
                  {product.status}
                </Badge>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="mb-5">
        <TabBar tabs={SECTION_TABS} activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {sections[activeTab] ? (
          <Card>
            <pre className="text-[12px] text-text-secondary font-sans whitespace-pre-wrap leading-relaxed">
              {sections[activeTab]}
            </pre>
          </Card>
        ) : (
          <Card>
            <div className="text-center py-12">
              <p className="text-[12px] text-text-muted">
                No {activeTab} documentation found.
              </p>
              <p className="text-[11px] text-text-dim mt-1">
                Create <code className="font-mono text-[10px]">{slug}/{activeTab}.md</code> in your workspace.
              </p>
            </div>
          </Card>
        )}
      </motion.div>
    </div>
  );
}
