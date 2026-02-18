import { NextResponse } from 'next/server';
import { appendTextFile, workspacePath } from '@/lib/workspace';
import { randomUUID } from 'crypto';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { content, channel = 'webchat', sessionId } = body;

    if (!content?.trim()) {
      return NextResponse.json({ error: 'Message content is required' }, { status: 400 });
    }

    const message = {
      id: randomUUID(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date().toISOString(),
      channel,
      sessionId: sessionId ?? `session-${Date.now()}`,
    };

    // Append to the agent's input queue
    const queuePath = workspacePath('state', 'message-queue.jsonl');
    await appendTextFile(queuePath, JSON.stringify(message) + '\n');

    // Also append to the session transcript
    if (sessionId) {
      const transcriptPath = workspacePath('transcripts', `${sessionId}.jsonl`);
      await appendTextFile(transcriptPath, JSON.stringify(message) + '\n');
    }

    return NextResponse.json({ message, queued: true });
  } catch (err) {
    // Even if file write fails (non-existent workspace), return success for UI testing
    const message = {
      id: randomUUID(),
      role: 'user',
      content: (await req.json().catch(() => ({})) as any)?.content ?? '',
      timestamp: new Date().toISOString(),
      channel: 'webchat',
    };
    return NextResponse.json({ message, queued: false, note: 'Workspace not configured' });
  }
}
