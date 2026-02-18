import { query, mutation } from './_generated/server';
import { v } from 'convex/values';

export const list = query({
  args: {
    startDate: v.optional(v.string()),
    endDate: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let q = ctx.db.query('calendarEvents').order('asc');
    const events = await q.collect();
    if (args.startDate || args.endDate) {
      return events.filter((e) => {
        if (args.startDate && e.startTime < args.startDate) return false;
        if (args.endDate && e.startTime > args.endDate) return false;
        return true;
      });
    }
    return events;
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    startTime: v.string(),
    endTime: v.string(),
    type: v.union(
      v.literal('meeting'),
      v.literal('task'),
      v.literal('deadline'),
      v.literal('personal'),
      v.literal('other')
    ),
    description: v.optional(v.string()),
    attendees: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert('calendarEvents', args);
  },
});

export const remove = mutation({
  args: { id: v.id('calendarEvents') },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
