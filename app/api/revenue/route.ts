import { NextResponse } from 'next/server';
import { readJsonFile, workspacePath } from '@/lib/workspace';

const FALLBACK: Record<string, unknown> = {
  currentMRR: 0,
  monthlyBurn: 0,
  netRevenue: 0,
  currency: 'USD',
  trend: 'flat',
  trendPercent: 0,
  breakdown: [],
  lastUpdated: new Date().toISOString(),
};

export async function GET() {
  try {
    const data = await readJsonFile(
      workspacePath('state', 'revenue.json'),
      FALLBACK
    ) as any;

    return NextResponse.json({
      currentMRR: data.currentMRR ?? 0,
      monthlyBurn: data.monthlyBurn ?? 0,
      netRevenue: data.netRevenue ?? (data.currentMRR ?? 0) - (data.monthlyBurn ?? 0),
      currency: data.currency ?? 'USD',
      trend: data.trend ?? 'flat',
      trendPercent: data.trendPercent ?? 0,
      breakdown: data.breakdown ?? [],
      lastUpdated: data.lastUpdated ?? new Date().toISOString(),
    });
  } catch {
    return NextResponse.json(FALLBACK);
  }
}
