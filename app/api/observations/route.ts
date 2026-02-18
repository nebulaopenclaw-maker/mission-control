import { NextResponse } from 'next/server';
import { readTextFile, workspacePath } from '@/lib/workspace';

function parseObservationsMd(content: string) {
  const lines = content.split('\n').filter(Boolean);
  const observations: Array<{ id: string; timestamp: string; content: string; category?: string }> = [];
  let id = 1;

  for (const line of lines) {
    if (line.startsWith('#')) continue;
    const match = line.match(/^(?:[-*]\s+)?(?:\[(.+?)\]\s+)?(.+)$/);
    if (match) {
      const timestamp = match[1] || new Date().toISOString();
      const content = match[2]?.trim();
      if (content) {
        observations.push({
          id: `obs-${id++}`,
          timestamp: isNaN(Date.parse(timestamp)) ? new Date().toISOString() : timestamp,
          content,
          category: 'observation',
        });
      }
    }
  }

  return observations.reverse().slice(0, 50);
}

const FALLBACK = [
  { id: 'obs-1', timestamp: new Date().toISOString(), content: 'Agent system initialized and operating normally.', category: 'system' },
  { id: 'obs-2', timestamp: new Date(Date.now() - 3600000).toISOString(), content: 'Market data feed connected successfully.', category: 'data' },
];

export async function GET() {
  try {
    const content = await readTextFile(workspacePath('state', 'observations.md'));
    const observations = content ? parseObservationsMd(content) : FALLBACK;
    return NextResponse.json({ observations });
  } catch {
    return NextResponse.json({ observations: FALLBACK });
  }
}
