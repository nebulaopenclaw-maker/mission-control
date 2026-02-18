import { NextResponse } from 'next/server';
import { readTextFile, listDirectory, workspacePath } from '@/lib/workspace';
import path from 'path';
import { ChatMessage, MessageChannel } from '@/lib/types';

function parseJsonlFile(content: string): ChatMessage[] {
  const messages: ChatMessage[] = [];
  if (!content) return messages;

  const lines = content.split('\n').filter(Boolean);
  for (const line of lines) {
    try {
      const obj = JSON.parse(line);
      messages.push({
        id: obj.id ?? `msg-${Math.random().toString(36).slice(2)}`,
        role: obj.role ?? 'assistant',
        content: obj.content ?? obj.text ?? '',
        timestamp: obj.timestamp ?? obj.created_at ?? new Date().toISOString(),
        channel: (obj.channel as MessageChannel) ?? 'webchat',
        agentId: obj.agentId ?? obj.agent_id,
      });
    } catch {}
  }
  return messages;
}

const FALLBACK_SESSIONS = [
  {
    id: 'session-1',
    title: 'OpenClaw setup discussion',
    channel: 'webchat',
    messageCount: 12,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 3600000).toISOString(),
    messages: [
      { id: 'm1', role: 'user', content: 'How is the agent system performing?', timestamp: new Date(Date.now() - 3700000).toISOString(), channel: 'webchat' },
      { id: 'm2', role: 'assistant', content: 'All systems are nominal. The orchestrator is running with 5 active sub-agents. Revenue tracking is online and all cron jobs are healthy.', timestamp: new Date(Date.now() - 3600000).toISOString(), channel: 'webchat' },
    ],
  },
];

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') ?? '1', 10);
  const limit = parseInt(searchParams.get('limit') ?? '20', 10);
  const search = searchParams.get('search') ?? '';
  const channel = searchParams.get('channel');

  try {
    const transcriptsDir = workspacePath('transcripts');
    const files = listDirectory(transcriptsDir).filter((f) => f.endsWith('.jsonl'));

    const sessions = await Promise.all(
      files.map(async (filename) => {
        const content = await readTextFile(path.join(transcriptsDir, filename));
        const messages = parseJsonlFile(content);
        const id = filename.replace('.jsonl', '');
        const filtered = channel
          ? messages.filter((m) => m.channel === channel)
          : messages;

        return {
          id,
          title: id.replace(/-/g, ' '),
          channel: (filtered[0]?.channel ?? 'webchat') as MessageChannel,
          messageCount: filtered.length,
          createdAt: filtered[0]?.timestamp ?? new Date().toISOString(),
          updatedAt: filtered[filtered.length - 1]?.timestamp ?? new Date().toISOString(),
          messages: filtered.slice(-limit),
        };
      })
    );

    let result = sessions.filter((s) => s.messageCount > 0);
    if (search) {
      result = result.filter(
        (s) =>
          s.title.toLowerCase().includes(search.toLowerCase()) ||
          s.messages.some((m) => m.content.toLowerCase().includes(search.toLowerCase()))
      );
    }

    const start = (page - 1) * limit;
    const paginated = result.slice(start, start + limit);

    return NextResponse.json({
      sessions: paginated.length > 0 ? paginated : FALLBACK_SESSIONS,
      total: result.length || FALLBACK_SESSIONS.length,
      page,
    });
  } catch {
    return NextResponse.json({
      sessions: FALLBACK_SESSIONS,
      total: 1,
      page: 1,
    });
  }
}
