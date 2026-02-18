import { NextResponse } from 'next/server';
import { readTextFile, workspacePath } from '@/lib/workspace';

function parseQueueMd(content: string) {
  const items: Array<{
    id: string;
    title: string;
    platform: string;
    status: string;
    preview?: string;
    createdAt: string;
    tags: string[];
  }> = [];

  if (!content) return items;

  const lines = content.split('\n');
  let currentStatus = 'draft';
  let idCounter = 1;

  for (const line of lines) {
    const h2 = line.match(/^##\s+(.+)/);
    if (h2) {
      const label = h2[1].toLowerCase();
      if (label.includes('draft')) currentStatus = 'draft';
      else if (label.includes('review')) currentStatus = 'review';
      else if (label.includes('approved')) currentStatus = 'approved';
      else if (label.includes('published')) currentStatus = 'published';
      continue;
    }

    const item = line.match(/^[-*]\s+(.+)/);
    if (item) {
      const text = item[1];
      const platformMatch = text.match(/\[(.+?)\]/);
      const tagsMatch = text.match(/#(\w+)/g);
      const title = text
        .replace(/\[.+?\]/g, '')
        .replace(/#\w+/g, '')
        .trim();

      items.push({
        id: `item-${idCounter++}`,
        title: title || text,
        platform: platformMatch ? platformMatch[1] : 'General',
        status: currentStatus,
        preview: title.slice(0, 120),
        createdAt: new Date().toISOString(),
        tags: tagsMatch ? tagsMatch.map((t) => t.slice(1)) : [],
      });
    }
  }

  return items;
}

const FALLBACK_ITEMS = [
  { id: '1', title: 'OpenClaw launch post', platform: 'Twitter', status: 'draft', createdAt: new Date().toISOString(), tags: ['launch'] },
  { id: '2', title: 'AI agent tutorial thread', platform: 'Twitter', status: 'review', createdAt: new Date().toISOString(), tags: ['education'] },
  { id: '3', title: 'Monthly update newsletter', platform: 'Email', status: 'approved', createdAt: new Date().toISOString(), tags: ['newsletter'] },
];

export async function GET() {
  try {
    const content = await readTextFile(workspacePath('content', 'queue.md'));
    const items = content ? parseQueueMd(content) : FALLBACK_ITEMS;

    const stats = {
      draft: items.filter((i) => i.status === 'draft').length,
      review: items.filter((i) => i.status === 'review').length,
      approved: items.filter((i) => i.status === 'approved').length,
      published: items.filter((i) => i.status === 'published').length,
    };

    return NextResponse.json({ items, stats });
  } catch {
    const items = FALLBACK_ITEMS;
    return NextResponse.json({
      items,
      stats: { draft: 1, review: 1, approved: 1, published: 0 },
    });
  }
}
