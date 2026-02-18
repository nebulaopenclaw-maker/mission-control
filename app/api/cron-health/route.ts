import { NextResponse } from 'next/server';
import { readJsonFile, workspacePath } from '@/lib/workspace';

const FALLBACK_CRONS = [
  { id: 'daily-report', name: 'Daily Report', schedule: '0 8 * * *', lastStatus: 'success', consecutiveErrors: 0, lastRun: new Date(Date.now() - 3600000).toISOString() },
  { id: 'market-scan', name: 'Market Scan', schedule: '*/30 * * * *', lastStatus: 'success', consecutiveErrors: 0, lastRun: new Date(Date.now() - 1800000).toISOString() },
  { id: 'memory-consolidation', name: 'Memory Consolidation', schedule: '0 2 * * *', lastStatus: 'success', consecutiveErrors: 0, lastRun: new Date(Date.now() - 86400000).toISOString() },
  { id: 'content-scheduler', name: 'Content Scheduler', schedule: '0 9 * * 1-5', lastStatus: 'success', consecutiveErrors: 0, lastRun: new Date(Date.now() - 7200000).toISOString() },
  { id: 'health-check', name: 'Health Check', schedule: '*/5 * * * *', lastStatus: 'success', consecutiveErrors: 0, lastRun: new Date(Date.now() - 300000).toISOString() },
];

export async function GET() {
  try {
    const data = await readJsonFile(
      workspacePath('state', 'crons.json'),
      { jobs: FALLBACK_CRONS }
    ) as any;

    const jobs = data.jobs ?? data.crons ?? FALLBACK_CRONS;

    return NextResponse.json({
      jobs,
      total: jobs.length,
      healthy: jobs.filter((j: any) => j.consecutiveErrors === 0).length,
      failing: jobs.filter((j: any) => j.consecutiveErrors > 0).length,
      lastUpdated: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json({
      jobs: FALLBACK_CRONS,
      total: FALLBACK_CRONS.length,
      healthy: FALLBACK_CRONS.length,
      failing: 0,
      lastUpdated: new Date().toISOString(),
    });
  }
}
