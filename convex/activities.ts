import { query, mutation } from './_generated/server';
import { v } from 'convex/values';

export const list = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 50;
    return await ctx.db
      .query('activities')
      .order('desc')
      .take(limit);
  },
});

export const create = mutation({
  args: {
    type: v.string(),
    description: v.string(),
    agentId: v.optional(v.string()),
    metadata: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert('activities', args);
  },
});

export const byType = query({
  args: { type: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('activities')
      .withIndex('by_type', (q) => q.eq('type', args.type))
      .order('desc')
      .take(20);
  },
});
