import { NextResponse } from 'next/server';
import os from 'os';

const startTime = Date.now();

export async function GET() {
  const uptimeMs = Date.now() - startTime;
  const mem = process.memoryUsage();

  return NextResponse.json({
    status: 'ok',
    uptime: Math.floor(uptimeMs / 1000),
    memory: {
      heapUsed: mem.heapUsed,
      heapTotal: mem.heapTotal,
      rss: mem.rss,
      external: mem.external,
    },
    cpu: os.loadavg(),
    platform: os.platform(),
    nodeVersion: process.version,
    timestamp: new Date().toISOString(),
    convex: !!process.env.NEXT_PUBLIC_CONVEX_URL,
  });
}
