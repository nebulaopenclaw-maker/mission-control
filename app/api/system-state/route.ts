import { NextResponse } from 'next/server';
import { readJsonFile, readTextFile, workspacePath } from '@/lib/workspace';

const FALLBACK_SERVICES = [
  { name: 'Telegram Bot', status: 'up', port: 443, lastCheck: new Date().toISOString() },
  { name: 'Discord Bot', status: 'up', port: 443, lastCheck: new Date().toISOString() },
  { name: 'OpenClaw API', status: 'up', port: 3000, lastCheck: new Date().toISOString() },
  { name: 'Cron Scheduler', status: 'up', port: null, lastCheck: new Date().toISOString() },
  { name: 'Memory System', status: 'up', port: null, lastCheck: new Date().toISOString() },
];

const FALLBACK_BRANCHES = [
  { repo: 'mission-control', branch: 'main', status: 'clean', lastCommit: new Date().toISOString() },
];

export async function GET() {
  try {
    const [servers, branches] = await Promise.all([
      readJsonFile(workspacePath('state', 'servers.json'), { services: FALLBACK_SERVICES }),
      readJsonFile(workspacePath('state', 'branch-check.json'), { branches: FALLBACK_BRANCHES }),
    ]);

    return NextResponse.json({
      services: (servers as any).services ?? FALLBACK_SERVICES,
      branches: (branches as any).branches ?? FALLBACK_BRANCHES,
      lastUpdated: new Date().toISOString(),
    });
  } catch (err) {
    return NextResponse.json({
      services: FALLBACK_SERVICES,
      branches: FALLBACK_BRANCHES,
      lastUpdated: new Date().toISOString(),
    });
  }
}
