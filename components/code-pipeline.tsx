'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { GitBranch, GitCommit, AlertCircle, CheckCircle, FolderGit2, ExternalLink, RefreshCw } from 'lucide-react';
import { Card, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Skeleton } from './ui/skeleton';
import { Progress } from './ui/progress';
import { useFetch } from '@/hooks/use-auto-refresh';
import { cn, relativeTime } from '@/lib/utils';
import { GitRepo } from '@/lib/types';

const REFRESH_MS = 30000;

const LANG_COLORS: Record<string, string> = {
  'TypeScript/JavaScript': '#3B82F6',
  Python: '#F59E0B',
  Go: '#10B981',
  Rust: '#EF4444',
  Ruby: '#EF4444',
  Unknown: '#475569',
};

function RepoCard({ repo }: { repo: GitRepo }) {
  const langColor = LANG_COLORS[repo.language ?? 'Unknown'] ?? LANG_COLORS.Unknown;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 28 }}
      className="glass-card glass-card-hover p-4"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center">
            <FolderGit2 size={14} className="text-primary" />
          </div>
          <div>
            <p className="text-[12px] font-semibold text-text-primary">{repo.name}</p>
            <div className="flex items-center gap-1 mt-0.5">
              <GitBranch size={9} className="text-text-muted" />
              <span className="text-[9px] text-text-muted font-mono">{repo.branch}</span>
            </div>
          </div>
        </div>
        {repo.dirty ? (
          <Badge variant="warning">
            <AlertCircle size={8} />
            {repo.dirtyCount} dirty
          </Badge>
        ) : (
          <Badge variant="success">
            <CheckCircle size={8} />
            Clean
          </Badge>
        )}
      </div>

      {repo.lastCommitMsg && (
        <div className="bg-white/[0.02] rounded-lg px-2.5 py-2 border border-white/[0.04] mb-3">
          <div className="flex items-center gap-1.5 mb-1">
            <GitCommit size={9} className="text-text-muted" />
            <span className="text-[9px] text-text-muted">{repo.lastCommit}</span>
          </div>
          <p className="text-[11px] text-text-secondary truncate">{repo.lastCommitMsg}</p>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ backgroundColor: langColor }}
          />
          <span className="text-[10px] text-text-muted">{repo.language ?? 'Unknown'}</span>
        </div>
        {repo.remoteUrl && (
          <Button size="icon-sm" variant="ghost" title="Open remote">
            <ExternalLink size={10} />
          </Button>
        )}
      </div>
    </motion.div>
  );
}

export function CodeView() {
  const { data, loading, refetch } = useFetch('/api/repos', { refreshInterval: REFRESH_MS });
  const repos: GitRepo[] = (data as any)?.repos ?? [];
  const dirty = (data as any)?.dirty ?? 0;

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } },
  };

  return (
    <div className="p-4 md:p-6 max-w-screen-xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[15px] font-semibold text-text-primary">Code</h1>
          <p className="text-[11px] text-text-muted mt-0.5">Git repositories and pipeline status</p>
        </div>
        <Button size="sm" variant="secondary" onClick={refetch}>
          <RefreshCw size={11} /> Refresh
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <Card compact>
          <p className="label-xs">Repositories</p>
          <p className="text-2xl font-semibold text-text-primary mt-2">{repos.length}</p>
        </Card>
        <Card compact>
          <p className="label-xs">Dirty</p>
          <p className={cn('text-2xl font-semibold mt-2', dirty > 0 ? 'text-warning' : 'text-success')}>
            {dirty}
          </p>
        </Card>
        <Card compact>
          <p className="label-xs">Clean</p>
          <p className="text-2xl font-semibold text-success mt-2">{repos.length - dirty}</p>
        </Card>
      </div>

      {/* Repo Grid */}
      {loading && repos.length === 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-36" />)}
        </div>
      ) : repos.length === 0 ? (
        <div className="text-center py-16">
          <FolderGit2 size={24} className="text-text-dim mx-auto mb-3" />
          <p className="text-[12px] text-text-muted">No git repositories found</p>
          <p className="text-[11px] text-text-dim mt-1">
            Repos are scanned from ~/Desktop/Projects and ~/Projects
          </p>
        </div>
      ) : (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3"
        >
          {repos.map((repo) => (
            <RepoCard key={repo.path} repo={repo} />
          ))}
        </motion.div>
      )}
    </div>
  );
}
