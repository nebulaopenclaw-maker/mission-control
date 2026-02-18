import { query, mutation } from './_generated/server';
import { v } from 'convex/values';

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query('ecosystemProducts').collect();
  },
});

export const bySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('ecosystemProducts')
      .withIndex('by_slug', (q) => q.eq('slug', args.slug))
      .unique();
  },
});

export const create = mutation({
  args: {
    slug: v.string(),
    name: v.string(),
    tagline: v.optional(v.string()),
    status: v.union(v.literal('Active'), v.literal('Development'), v.literal('Concept'), v.literal('Paused'), v.literal('Deprecated')),
    healthScore: v.optional(v.number()),
    metrics: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert('ecosystemProducts', args);
  },
});

export const update = mutation({
  args: {
    id: v.id('ecosystemProducts'),
    healthScore: v.optional(v.number()),
    status: v.optional(v.union(v.literal('Active'), v.literal('Development'), v.literal('Concept'), v.literal('Paused'), v.literal('Deprecated'))),
    metrics: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...rest } = args;
    const patch: any = {};
    if (rest.healthScore !== undefined) patch.healthScore = rest.healthScore;
    if (rest.status !== undefined) patch.status = rest.status;
    if (rest.metrics !== undefined) patch.metrics = rest.metrics;
    await ctx.db.patch(id, patch);
  },
});
