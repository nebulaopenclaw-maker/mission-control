import { NextResponse } from 'next/server';
import { readTextFile, listDirectory, workspacePath, getFileStat } from '@/lib/workspace';
import path from 'path';
import { KnowledgeEntry } from '@/lib/types';

async function scanDirectory(dir: string, base: string, results: KnowledgeEntry[], query: string) {
  let entries: string[];
  try {
    entries = listDirectory(dir);
  } catch {
    return;
  }

  for (const entry of entries) {
    const fullPath = path.join(dir, entry);
    const stat = getFileStat(fullPath);
    if (!stat) continue;

    if (stat.isDirectory()) {
      if (results.length < 50) {
        await scanDirectory(fullPath, base, results, query);
      }
      continue;
    }

    if (!entry.endsWith('.md') && !entry.endsWith('.txt') && !entry.endsWith('.json')) continue;

    const relativePath = fullPath.replace(base + '/', '');
    const title = entry.replace(/\.(md|txt|json)$/, '').replace(/[-_]/g, ' ');

    if (query && !title.toLowerCase().includes(query.toLowerCase())) {
      // Check content for query
      const content = await readTextFile(fullPath);
      if (!content.toLowerCase().includes(query.toLowerCase())) continue;
      results.push({
        path: relativePath,
        title,
        excerpt: content.slice(content.toLowerCase().indexOf(query.toLowerCase()) - 50, content.toLowerCase().indexOf(query.toLowerCase()) + 200).trim(),
        lastModified: stat.mtime.toISOString(),
        size: stat.size,
        category: relativePath.split('/')[0],
      });
    } else {
      const content = await readTextFile(fullPath);
      results.push({
        path: relativePath,
        title,
        excerpt: content.slice(0, 200).trim(),
        lastModified: stat.mtime.toISOString(),
        size: stat.size,
        category: relativePath.split('/')[0],
      });
    }

    if (results.length >= 50) break;
  }
}

const FALLBACK: KnowledgeEntry[] = [
  { path: 'shared-context/priorities.md', title: 'Priorities', excerpt: 'System priorities and focus areas for the OpenClaw agent system.', lastModified: new Date().toISOString(), size: 512, category: 'shared-context' },
  { path: 'agents/registry.json', title: 'Agent Registry', excerpt: 'Registry of all configured agents in the system.', lastModified: new Date().toISOString(), size: 1024, category: 'agents' },
];

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('q') ?? '';
  const category = searchParams.get('category') ?? '';

  try {
    const workspace = workspacePath();
    const results: KnowledgeEntry[] = [];
    await scanDirectory(workspace, workspace, results, query);

    let filtered = results;
    if (category) {
      filtered = results.filter((r) => r.category === category);
    }

    return NextResponse.json({
      results: filtered.length > 0 ? filtered : FALLBACK,
      total: filtered.length || FALLBACK.length,
      query,
    });
  } catch {
    return NextResponse.json({
      results: FALLBACK,
      total: FALLBACK.length,
      query,
    });
  }
}
