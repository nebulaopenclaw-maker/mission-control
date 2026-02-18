import { NextResponse } from 'next/server';
import { readTextFile, workspacePath } from '@/lib/workspace';

function parsePrioritiesMd(content: string) {
  const sections: Array<{ title: string; items: string[] }> = [];
  const lines = content.split('\n');
  let current: { title: string; items: string[] } | null = null;

  for (const line of lines) {
    const h = line.match(/^#{1,3}\s+(.+)/);
    if (h) {
      if (current) sections.push(current);
      current = { title: h[1].trim(), items: [] };
    } else if (current && line.match(/^[-*\d]\s*.+/)) {
      const item = line.replace(/^[-*\d.]\s*/, '').trim();
      if (item) current.items.push(item);
    }
  }
  if (current) sections.push(current);
  return sections;
}

const FALLBACK = [
  {
    title: 'This Week',
    items: [
      'Complete Mission Control dashboard deployment',
      'Set up automated agent health monitoring',
      'Configure revenue tracking pipeline',
    ],
  },
  {
    title: 'This Month',
    items: [
      'Launch content automation system',
      'Integrate all communication channels',
      'Build ecosystem product tracking',
    ],
  },
];

export async function GET() {
  try {
    const content = await readTextFile(workspacePath('shared-context', 'priorities.md'));
    const priorities = content ? parsePrioritiesMd(content) : FALLBACK;
    return NextResponse.json({ priorities, raw: content });
  } catch {
    return NextResponse.json({ priorities: FALLBACK, raw: '' });
  }
}
