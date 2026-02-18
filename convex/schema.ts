import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  activities: defineTable({
    type: v.string(),
    description: v.string(),
    agentId: v.optional(v.string()),
    metadata: v.optional(v.string()),
  }).index('by_type', ['type']),

  calendarEvents: defineTable({
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
  }).index('by_start', ['startTime']),

  tasks: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    status: v.union(
      v.literal('pending'),
      v.literal('in_progress'),
      v.literal('completed'),
      v.literal('cancelled')
    ),
    priority: v.union(
      v.literal('critical'),
      v.literal('high'),
      v.literal('medium'),
      v.literal('low')
    ),
    category: v.string(),
    assignedTo: v.optional(v.string()),
    dueDate: v.optional(v.string()),
  })
    .index('by_status', ['status'])
    .index('by_category', ['category']),

  contacts: defineTable({
    name: v.string(),
    email: v.optional(v.string()),
    company: v.optional(v.string()),
    stage: v.union(
      v.literal('Prospect'),
      v.literal('Contacted'),
      v.literal('Meeting'),
      v.literal('Proposal'),
      v.literal('Active')
    ),
    tags: v.optional(v.array(v.string())),
    notes: v.optional(v.string()),
    lastContact: v.optional(v.string()),
  }).index('by_stage', ['stage']),

  contentDrafts: defineTable({
    title: v.string(),
    body: v.string(),
    platform: v.string(),
    status: v.union(
      v.literal('draft'),
      v.literal('review'),
      v.literal('approved'),
      v.literal('published')
    ),
    scheduledFor: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
  }).index('by_status', ['status']),

  ecosystemProducts: defineTable({
    slug: v.string(),
    name: v.string(),
    tagline: v.optional(v.string()),
    status: v.union(
      v.literal('Active'),
      v.literal('Development'),
      v.literal('Concept'),
      v.literal('Paused'),
      v.literal('Deprecated')
    ),
    healthScore: v.optional(v.number()),
    metrics: v.optional(v.string()),
  }).index('by_slug', ['slug']),
});
