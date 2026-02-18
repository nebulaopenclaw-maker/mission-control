import { mutation } from './_generated/server';

export const seedAll = mutation({
  args: {},
  handler: async (ctx) => {
    // Seed activities
    const activityTypes = ['agent_action', 'system_event', 'user_command', 'cron_job'];
    const activityDescs = [
      'Orchestrator dispatched market analysis sub-agent',
      'Memory consolidation completed successfully',
      'Telegram message received and processed',
      'Daily report generated and sent',
      'Revenue data synced from Stripe',
      'Content scheduler queued 3 posts',
      'Health check passed — all services up',
      'New client contact added to CRM',
    ];

    for (let i = 0; i < 10; i++) {
      await ctx.db.insert('activities', {
        type: activityTypes[i % activityTypes.length],
        description: activityDescs[i % activityDescs.length],
        agentId: i % 2 === 0 ? 'nebula' : 'analyst',
      });
    }

    // Seed calendar events
    const now = new Date();
    const events = [
      {
        title: 'Weekly agent performance review',
        startTime: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 10, 0).toISOString(),
        endTime: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 11, 0).toISOString(),
        type: 'meeting' as const,
        description: 'Review all agent KPIs and adjust priorities',
      },
      {
        title: 'Content batch review',
        startTime: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2, 14, 0).toISOString(),
        endTime: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2, 15, 0).toISOString(),
        type: 'task' as const,
        description: 'Approve or edit queued content drafts',
      },
      {
        title: 'Investor update deadline',
        startTime: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 5, 18, 0).toISOString(),
        endTime: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 5, 19, 0).toISOString(),
        type: 'deadline' as const,
      },
    ];

    for (const event of events) {
      await ctx.db.insert('calendarEvents', event);
    }

    // Seed tasks
    const tasks = [
      { title: 'Configure Telegram bot webhook', priority: 'high' as const, category: 'Operations', status: 'pending' as const },
      { title: 'Set up revenue tracking pipeline', priority: 'critical' as const, category: 'Revenue', status: 'in_progress' as const },
      { title: 'Create Twitter content calendar', priority: 'medium' as const, category: 'Content', status: 'pending' as const },
      { title: 'Outreach to 5 new prospects', priority: 'high' as const, category: 'Clients', status: 'pending' as const },
      { title: 'Deploy Mission Control to VPS', priority: 'high' as const, category: 'Operations', status: 'completed' as const },
    ];

    for (const task of tasks) {
      await ctx.db.insert('tasks', task);
    }

    // Seed contacts
    const contacts = [
      { name: 'Alice Chen', email: 'alice@techcorp.io', company: 'TechCorp', stage: 'Active' as const, tags: ['enterprise'] },
      { name: 'Bob Martinez', email: 'bob@startup.co', company: 'Startup.co', stage: 'Proposal' as const, tags: ['smb'] },
      { name: 'Carol White', company: 'Acme', stage: 'Meeting' as const, tags: ['referral'] },
      { name: 'David Kim', email: 'david@enterprise.com', stage: 'Contacted' as const },
      { name: 'Eve Johnson', stage: 'Prospect' as const },
    ];

    for (const contact of contacts) {
      await ctx.db.insert('contacts', contact);
    }

    // Seed content drafts
    const drafts = [
      { title: 'Why autonomous AI agents are the future', body: 'The shift toward autonomous agents...', platform: 'LinkedIn', status: 'draft' as const, tags: ['ai', 'thought-leadership'] },
      { title: 'OpenClaw launch announcement', body: 'Today we\'re launching...', platform: 'Twitter', status: 'review' as const, tags: ['launch'] },
      { title: 'Building with AI: a developer\'s guide', body: 'In this post we cover...', platform: 'Blog', status: 'approved' as const, tags: ['tutorial'] },
    ];

    for (const draft of drafts) {
      await ctx.db.insert('contentDrafts', draft);
    }

    // Seed ecosystem products
    const products = [
      { slug: 'openclaw', name: 'OpenClaw', tagline: 'Autonomous AI agent platform', status: 'Active' as const, healthScore: 95 },
      { slug: 'nebula-os', name: 'Nebula OS', tagline: 'Operating system for AI agents', status: 'Development' as const, healthScore: 60 },
      { slug: 'tradegpt', name: 'TradeGPT', tagline: 'AI-powered trading signals', status: 'Concept' as const, healthScore: 20 },
      { slug: 'mission-control', name: 'Mission Control', tagline: 'Command center for OpenClaw', status: 'Active' as const, healthScore: 98 },
    ];

    for (const product of products) {
      await ctx.db.insert('ecosystemProducts', product);
    }

    return { seeded: true };
  },
});
