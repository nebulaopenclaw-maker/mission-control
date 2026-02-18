import { query, mutation } from './_generated/server';
import { v } from 'convex/values';

export const list = query({
  args: {
    status: v.optional(v.string()),
    category: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (args.status) {
      const tasks = await ctx.db
        .query('tasks')
        .withIndex('by_status', (q) => q.eq('status', args.status as any))
        .collect();
      return args.category ? tasks.filter((t) => t.category === args.category) : tasks;
    }
    if (args.category) {
      return await ctx.db
        .query('tasks')
        .withIndex('by_category', (q) => q.eq('category', args.category!))
        .collect();
    }
    return await ctx.db.query('tasks').order('desc').take(100);
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    status: v.union(v.literal('pending'), v.literal('in_progress'), v.literal('completed'), v.literal('cancelled')),
    priority: v.union(v.literal('critical'), v.literal('high'), v.literal('medium'), v.literal('low')),
    category: v.string(),
    assignedTo: v.optional(v.string()),
    dueDate: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert('tasks', args);
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id('tasks'),
    status: v.union(v.literal('pending'), v.literal('in_progress'), v.literal('completed'), v.literal('cancelled')),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { status: args.status });
  },
});
