import { query, mutation } from './_generated/server';
import { v } from 'convex/values';

export const list = query({
  args: { status: v.optional(v.string()) },
  handler: async (ctx, args) => {
    if (args.status) {
      return await ctx.db
        .query('contentDrafts')
        .withIndex('by_status', (q) => q.eq('status', args.status as any))
        .collect();
    }
    return await ctx.db.query('contentDrafts').order('desc').take(100);
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    body: v.string(),
    platform: v.string(),
    status: v.union(v.literal('draft'), v.literal('review'), v.literal('approved'), v.literal('published')),
    scheduledFor: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert('contentDrafts', args);
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id('contentDrafts'),
    status: v.union(v.literal('draft'), v.literal('review'), v.literal('approved'), v.literal('published')),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { status: args.status });
  },
});
