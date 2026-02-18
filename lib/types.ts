// ─── System / Health ───────────────────────────────────────────────────────

export interface ServiceStatus {
  name: string;
  status: 'up' | 'down' | 'degraded';
  port?: number;
  lastCheck: string;
  latencyMs?: number;
  notes?: string;
}

export interface SystemState {
  services: ServiceStatus[];
  branches?: BranchStatus[];
  lastUpdated: string;
}

export interface BranchStatus {
  repo: string;
  branch: string;
  status: 'clean' | 'dirty' | 'ahead' | 'behind';
  lastCommit?: string;
  uncommittedFiles?: number;
}

// ─── Agents ────────────────────────────────────────────────────────────────

export interface AgentRecord {
  id: string;
  name: string;
  role: string;
  model: string;
  level: 'L1' | 'L2' | 'L3' | 'L4';
  status: 'active' | 'idle' | 'error' | 'offline';
  description?: string;
  workspacePath?: string;
  soul?: string;
  rules?: string;
  subAgents?: string[];
  lastActive?: string;
  sessionCount?: number;
}

export interface AgentRegistry {
  agents: AgentRecord[];
  lastUpdated: string;
}

// ─── Cron Jobs ─────────────────────────────────────────────────────────────

export interface CronJob {
  id: string;
  name: string;
  schedule: string;
  description?: string;
  lastRun?: string;
  lastStatus: 'success' | 'failed' | 'running' | 'pending';
  consecutiveErrors: number;
  nextRun?: string;
}

// ─── Revenue ───────────────────────────────────────────────────────────────

export interface RevenueData {
  currentMRR: number;
  monthlyBurn: number;
  netRevenue: number;
  currency: string;
  lastUpdated: string;
  trend?: 'up' | 'down' | 'flat';
  trendPercent?: number;
  breakdown?: { source: string; amount: number }[];
}

// ─── Content ───────────────────────────────────────────────────────────────

export interface ContentDraft {
  id: string;
  title: string;
  platform: string;
  status: 'draft' | 'review' | 'approved' | 'published';
  preview?: string;
  createdAt: string;
  scheduledFor?: string;
  tags?: string[];
}

export interface ContentPipelineStats {
  draft: number;
  review: number;
  approved: number;
  published: number;
  items: ContentDraft[];
}

// ─── Suggested Tasks ────────────────────────────────────────────────────────

export type TaskCategory = 'Revenue' | 'Product' | 'Community' | 'Content' | 'Operations' | 'Clients' | 'Trading' | 'Brand';
export type TaskStatus = 'pending' | 'approved' | 'rejected';
export type TaskPriority = 'critical' | 'high' | 'medium' | 'low';
export type TaskEffort = 'quick' | 'medium' | 'heavy';

export interface SuggestedTask {
  id: string;
  title: string;
  category: TaskCategory;
  reasoning: string;
  nextAction: string;
  priority: TaskPriority;
  effort: TaskEffort;
  status: TaskStatus;
  createdAt: string;
  reviewedAt?: string;
}

// ─── Chat ──────────────────────────────────────────────────────────────────

export type MessageRole = 'user' | 'assistant' | 'system';
export type MessageChannel = 'telegram' | 'discord' | 'webchat' | 'api';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: string;
  channel?: MessageChannel;
  agentId?: string;
}

export interface ChatSession {
  id: string;
  title: string;
  channel: MessageChannel;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
  messageCount: number;
}

// ─── Clients / CRM ─────────────────────────────────────────────────────────

export type CRMStage = 'Prospect' | 'Contacted' | 'Meeting' | 'Proposal' | 'Active';

export interface CRMClient {
  id: string;
  name: string;
  company?: string;
  stage: CRMStage;
  contacts?: string[];
  lastInteraction?: string;
  nextAction?: string;
  value?: number;
  notes?: string;
  tags?: string[];
}

// ─── Ecosystem ─────────────────────────────────────────────────────────────

export type ProductStatus = 'Active' | 'Development' | 'Concept' | 'Paused' | 'Deprecated';

export interface EcosystemProduct {
  id: string;
  slug: string;
  name: string;
  tagline?: string;
  status: ProductStatus;
  healthScore?: number;
  metrics?: Record<string, string | number>;
  description?: string;
  url?: string;
  repo?: string;
  lastUpdated?: string;
}

// ─── Repositories ──────────────────────────────────────────────────────────

export interface GitRepo {
  name: string;
  path: string;
  branch: string;
  lastCommit?: string;
  lastCommitMsg?: string;
  dirty: boolean;
  dirtyCount: number;
  language?: string;
  languages?: Record<string, number>;
  remoteUrl?: string;
}

// ─── Observations / Priorities ─────────────────────────────────────────────

export interface Observation {
  id: string;
  timestamp: string;
  content: string;
  category?: string;
  priority?: TaskPriority;
}

// ─── Activity ──────────────────────────────────────────────────────────────

export interface ActivityEvent {
  id: string;
  type: string;
  description: string;
  agentId?: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

// ─── Dashboard Stats ───────────────────────────────────────────────────────

export interface QuickStats {
  totalTasks: number;
  pendingApprovals: number;
  activeSessions: number;
  uptimeSeconds: number;
}

// ─── Knowledge ─────────────────────────────────────────────────────────────

export interface KnowledgeEntry {
  path: string;
  title: string;
  excerpt: string;
  lastModified: string;
  size: number;
  category?: string;
}

// ─── Model Routing ─────────────────────────────────────────────────────────

export interface ModelEntry {
  id: string;
  name: string;
  provider: string;
  contextWindow: number;
  costPerMillion: number;
  usedFor: string[];
  failoverTo?: string;
  isDefault?: boolean;
}

// ─── Convex (mirrored shapes) ───────────────────────────────────────────────

export interface ConvexTask {
  _id: string;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority: TaskPriority;
  category: string;
  assignedTo?: string;
  dueDate?: string;
  _creationTime: number;
}

export interface ConvexCalendarEvent {
  _id: string;
  title: string;
  startTime: string;
  endTime: string;
  type: 'meeting' | 'task' | 'deadline' | 'personal' | 'other';
  description?: string;
  attendees?: string[];
  _creationTime: number;
}

export interface ConvexContact {
  _id: string;
  name: string;
  email?: string;
  company?: string;
  stage: CRMStage;
  tags?: string[];
  notes?: string;
  lastContact?: string;
  _creationTime: number;
}

export interface ConvexContentDraft {
  _id: string;
  title: string;
  body: string;
  platform: string;
  status: 'draft' | 'review' | 'approved' | 'published';
  scheduledFor?: string;
  tags?: string[];
  _creationTime: number;
}

export interface ConvexActivity {
  _id: string;
  type: string;
  description: string;
  agentId?: string;
  metadata?: string;
  _creationTime: number;
}

export interface ConvexEcosystemProduct {
  _id: string;
  slug: string;
  name: string;
  tagline?: string;
  status: ProductStatus;
  healthScore?: number;
  metrics?: string;
  _creationTime: number;
}
