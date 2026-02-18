import { NextResponse } from 'next/server';
import { readJsonFile, writeJsonFile, workspacePath } from '@/lib/workspace';
import { SuggestedTask } from '@/lib/types';

const FALLBACK_TASKS: SuggestedTask[] = [
  {
    id: 'task-1',
    title: 'Set up automated revenue tracking',
    category: 'Revenue',
    reasoning: 'No revenue tracking is currently connected. Automating this will give real-time visibility into MRR and burn rate.',
    nextAction: 'Connect Stripe webhook to state/revenue.json updater script',
    priority: 'high',
    effort: 'medium',
    status: 'pending',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-2',
    title: 'Create weekly content calendar',
    category: 'Content',
    reasoning: 'Consistent content output requires pre-planning. A structured calendar improves publishing consistency.',
    nextAction: 'Ask agent to draft 4-week content plan across all platforms',
    priority: 'medium',
    effort: 'quick',
    status: 'pending',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-3',
    title: 'Audit all sub-agent capabilities',
    category: 'Operations',
    reasoning: 'Current agent registry may be outdated. An audit ensures all agents have up-to-date SOUL and RULES files.',
    nextAction: 'Run registry validation script and update stale agents',
    priority: 'medium',
    effort: 'heavy',
    status: 'pending',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-4',
    title: 'Set up Discord community onboarding flow',
    category: 'Community',
    reasoning: 'New members need a clear onboarding path to become engaged. An automated welcome flow reduces churn.',
    nextAction: 'Design welcome message sequence and configure Discord bot',
    priority: 'high',
    effort: 'medium',
    status: 'pending',
    createdAt: new Date().toISOString(),
  },
];

const TASK_FILE = workspacePath('state', 'suggested-tasks.json');

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status');
  const category = searchParams.get('category');

  try {
    const data = await readJsonFile(TASK_FILE, { tasks: FALLBACK_TASKS }) as any;
    let tasks: SuggestedTask[] = data.tasks ?? FALLBACK_TASKS;

    if (status) tasks = tasks.filter((t) => t.status === status);
    if (category) tasks = tasks.filter((t) => t.category === category);

    return NextResponse.json({ tasks });
  } catch {
    return NextResponse.json({ tasks: FALLBACK_TASKS });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { taskId, action } = body;

    if (!taskId || !['approve', 'reject'].includes(action)) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    const data = await readJsonFile(TASK_FILE, { tasks: FALLBACK_TASKS }) as any;
    const tasks: SuggestedTask[] = data.tasks ?? FALLBACK_TASKS;

    const idx = tasks.findIndex((t) => t.id === taskId);
    if (idx === -1) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    tasks[idx] = {
      ...tasks[idx],
      status: action === 'approve' ? 'approved' : 'rejected',
      reviewedAt: new Date().toISOString(),
    };

    await writeJsonFile(TASK_FILE, { tasks, lastUpdated: new Date().toISOString() });

    return NextResponse.json({ task: tasks[idx] });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
  }
}
