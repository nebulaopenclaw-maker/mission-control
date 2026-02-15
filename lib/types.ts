// Agent Types
export interface Agent {
  id: string;
  name: string;
  role: string;
  description: string;
  status: 'active' | 'idle' | 'running';
  model: string;
  createdAt: string;
  lastActive: string;
  personality?: string;
  focusAreas?: string[];
  targets?: string[];
  controlledTools?: string[];
  managedAgents?: string[];
  instructions?: string;
  systemPrompt?: string;
}

export interface Message {
  id: string;
  agentId: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface ChatSession {
  id: string;
  agentId: string;
  title: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

export interface Email {
  id: string;
  from: string;
  subject: string;
  date: string;
  unread: boolean;
  preview: string;
  labels: string[];
}

export interface CronJob {
  id: string;
  name: string;
  schedule: string;
  enabled: boolean;
  nextRun: string;
  lastRun: string;
}

export interface DashboardStats {
  totalAgents: number;
  activeAgents: number;
  unreadEmails: number;
  scheduledJobs: number;
  costToday: number;
}
