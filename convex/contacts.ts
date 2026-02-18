import { query, mutation } from './_generated/server';
import { v } from 'convex/values';

export const list = query({
  args: { stage: v.optional(v.string()) },
  handler: async (ctx, args) => {
    if (args.stage) {
      return await ctx.db
        .query('contacts')
        .withIndex('by_stage', (q) => q.eq('stage', args.stage as any))
        .collect();
    }
    return await ctx.db.query('contacts').collect();
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    email: v.optional(v.string()),
    company: v.optional(v.string()),
    stage: v.union(v.literal('Prospect'), v.literal('Contacted'), v.literal('Meeting'), v.literal('Proposal'), v.literal('Active')),
    tags: v.optional(v.array(v.string())),
    notes: v.optional(v.string()),
    lastContact: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert('contacts', args);
  },
});

export const updateStage = mutation({
  args: {
    id: v.id('contacts'),
    stage: v.union(v.literal('Prospect'), v.literal('Contacted'), v.literal('Meeting'), v.literal('Proposal'), v.literal('Active')),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { stage: args.stage });
  },
});
