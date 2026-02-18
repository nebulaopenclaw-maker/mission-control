import { NextResponse } from 'next/server';
import { readJsonFile, readTextFile, workspacePath, listDirectory } from '@/lib/workspace';
import path from 'path';

const FALLBACK_AGENTS = [
  { id: 'nebula', name: 'Nebula', role: 'Orchestrator', model: 'claude-opus-4', level: 'L4', status: 'active', description: 'Primary AI orchestrator' },
  { id: 'analyst', name: 'Analyst', role: 'Investment Strategist', model: 'claude-sonnet-4', level: 'L3', status: 'idle', description: 'Market and investment analysis' },
  { id: 'marketer', name: 'Marketer', role: 'Marketing Strategist', model: 'claude-sonnet-4', level: 'L3', status: 'idle', description: 'Campaign planning and execution' },
  { id: 'writer', name: 'Writer', role: 'Content Creator', model: 'claude-haiku-4', level: 'L2', status: 'idle', description: 'Content generation and editing' },
  { id: 'bizdev', name: 'BizDev', role: 'Business Developer', model: 'claude-sonnet-4', level: 'L3', status: 'idle', description: 'Partnership and growth strategy' },
];

export async function GET() {
  try {
    const registry = await readJsonFile(
      workspacePath('agents', 'registry.json'),
      { agents: FALLBACK_AGENTS }
    ) as any;

    const agents = registry.agents ?? FALLBACK_AGENTS;

    // Enrich each agent with their SOUL.md if available
    const enriched = await Promise.all(
      agents.map(async (agent: any) => {
        const soulPath = workspacePath('agents', agent.id, 'SOUL.md');
        const soul = await readTextFile(soulPath);
        return { ...agent, soul: soul || undefined };
      })
    );

    return NextResponse.json({
      agents: enriched,
      total: enriched.length,
      active: enriched.filter((a: any) => a.status === 'active').length,
      lastUpdated: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json({
      agents: FALLBACK_AGENTS,
      total: FALLBACK_AGENTS.length,
      active: 1,
      lastUpdated: new Date().toISOString(),
    });
  }
}
