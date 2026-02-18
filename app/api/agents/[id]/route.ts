import { NextResponse } from 'next/server';
import { readJsonFile, readTextFile, workspacePath, listDirectory } from '@/lib/workspace';
import path from 'path';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    const [soul, rules, registry] = await Promise.all([
      readTextFile(workspacePath('agents', id, 'SOUL.md')),
      readTextFile(workspacePath('agents', id, 'RULES.md')),
      readJsonFile(workspacePath('agents', 'registry.json'), { agents: [] }) as Promise<any>,
    ]);

    const agent = (registry.agents ?? []).find((a: any) => a.id === id);

    // Read recent outputs
    const outputsDir = workspacePath('shared-context', 'agent-outputs');
    const outputFiles = listDirectory(outputsDir)
      .filter((f) => f.includes(id))
      .slice(-5);

    const outputs = await Promise.all(
      outputFiles.map(async (f) => {
        const content = await readTextFile(path.join(outputsDir, f));
        return { filename: f, content: content.slice(0, 500) };
      })
    );

    return NextResponse.json({
      agent: agent ?? { id, name: id, status: 'unknown' },
      soul,
      rules,
      outputs,
    });
  } catch {
    return NextResponse.json(
      { error: 'Agent not found' },
      { status: 404 }
    );
  }
}
