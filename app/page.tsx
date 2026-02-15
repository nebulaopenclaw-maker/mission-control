'use client';

import { useEffect, useState } from 'react';
import { Agent, Message, DashboardStats } from '@/lib/types';
import { GatewayClient } from '@/lib/gateway';
import Sidebar from '@/components/sidebar';
import AgentChat from '@/components/agent-chat';
import AgentManager from '@/components/agent-manager';
import EmailDashboard from '@/components/email-dashboard';

const AGENTS_CONFIG = [
  { id: '1', name: 'Nebula', role: 'Main AI Assistant', description: 'Primary AI orchestrator' },
  { id: '2', name: 'Analyst & Investor', role: 'Investment Strategist', description: 'Market and investment analysis' },
  { id: '3', name: 'Marketing Expert', role: 'Marketing Strategist', description: 'Campaign planning and execution' },
  { id: '4', name: 'Content Writer', role: 'Content Creator', description: 'Content generation and editing' },
  { id: '5', name: 'Business Dev', role: 'Business Developer', description: 'Partnership and growth strategy' },
  { id: '6', name: 'Croatian Tax & Law', role: 'Legal/Tax Expert', description: 'Croatian compliance and tax' },
  { id: '7', name: 'Chief Finance', role: 'CFO-Level Finance', description: 'Financial strategy and analysis' },
  { id: '8', name: 'Reporting Expert', role: 'Reporting Specialist', description: 'Financial and business reporting' },
  { id: '9', name: 'Project Manager', role: 'Project Lead', description: 'Project planning and execution' },
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalAgents: 9,
    activeAgents: 1,
    unreadEmails: 5,
    scheduledJobs: 3,
    costToday: 0,
  });
  const [gatewayUrl, setGatewayUrl] = useState('http://localhost:18789');
  const [gatewayToken, setGatewayToken] = useState('');
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize agents from config
    const initialAgents: Agent[] = AGENTS_CONFIG.map(config => ({
      ...config,
      status: 'idle' as const,
      model: 'blockrun/auto',
      createdAt: new Date().toISOString(),
      lastActive: new Date().toISOString(),
    }));
    
    setAgents(initialAgents);
    setSelectedAgent(initialAgents[0]);
    setLoading(false);

    // Try to get credentials from env or localStorage
    const savedToken = localStorage.getItem('gatewayToken');
    const savedUrl = localStorage.getItem('gatewayUrl');
    
    if (savedToken) setGatewayToken(savedToken);
    if (savedUrl) setGatewayUrl(savedUrl);
  }, []);

  const handleConnect = async () => {
    if (!gatewayToken) {
      alert('Please enter your Gateway token');
      return;
    }

    try {
      localStorage.setItem('gatewayToken', gatewayToken);
      localStorage.setItem('gatewayUrl', gatewayUrl);
      
      const client = new GatewayClient(gatewayUrl, gatewayToken);
      await client.connect();
      setConnected(true);
      
      client.on('message', (data) => {
        setMessages(prev => [...prev, data as Message]);
      });
    } catch (error) {
      alert('Failed to connect to gateway: ' + String(error));
    }
  };

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-dark-bg">
        <div className="text-2xl">Loading Mission Control...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen bg-dark-bg text-white">
      <Sidebar 
        agents={agents}
        selectedAgent={selectedAgent}
        onSelectAgent={setSelectedAgent}
        onTabChange={setActiveTab}
        activeTab={activeTab}
        connected={connected}
      />
      
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="border-b border-dark-border px-6 py-4 bg-dark-card">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">🌌 Mission Control</h1>
            <div className="flex items-center gap-4">
              <div className={`w-3 h-3 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-sm">{connected ? 'Connected' : 'Disconnected'}</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-auto">
          {activeTab === 'dashboard' && (
            <DashboardView stats={stats} agents={agents} />
          )}
          {activeTab === 'chat' && selectedAgent && (
            <AgentChat agent={selectedAgent} messages={messages} />
          )}
          {activeTab === 'agents' && (
            <AgentManager agents={agents} onSelectAgent={setSelectedAgent} />
          )}
          {activeTab === 'email' && (
            <EmailDashboard />
          )}
          {activeTab === 'settings' && (
            <SettingsView
              gatewayUrl={gatewayUrl}
              setGatewayUrl={setGatewayUrl}
              gatewayToken={gatewayToken}
              setGatewayToken={setGatewayToken}
              onConnect={handleConnect}
              connected={connected}
            />
          )}
        </div>
      </main>
    </div>
  );
}

function DashboardView({ stats, agents }: { stats: DashboardStats; agents: Agent[] }) {
  return (
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-semibold">Dashboard</h2>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Total Agents" value={stats.totalAgents} />
        <StatCard title="Active Agents" value={stats.activeAgents} />
        <StatCard title="Unread Emails" value={stats.unreadEmails} />
        <StatCard title="Scheduled Jobs" value={stats.scheduledJobs} />
      </div>

      {/* Agents List */}
      <div className="bg-dark-card rounded-lg p-6 border border-dark-border">
        <h3 className="text-lg font-semibold mb-4">Active Agents</h3>
        <div className="space-y-3">
          {agents.map(agent => (
            <div key={agent.id} className="flex items-center justify-between p-3 bg-dark-bg rounded">
              <div>
                <p className="font-medium">{agent.name}</p>
                <p className="text-sm text-gray-400">{agent.role}</p>
              </div>
              <div className={`w-3 h-3 rounded-full ${agent.status === 'active' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="bg-dark-card rounded-lg p-4 border border-dark-border">
      <p className="text-sm text-gray-400">{title}</p>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  );
}

function SettingsView({
  gatewayUrl,
  setGatewayUrl,
  gatewayToken,
  setGatewayToken,
  onConnect,
  connected,
}: {
  gatewayUrl: string;
  setGatewayUrl: (url: string) => void;
  gatewayToken: string;
  setGatewayToken: (token: string) => void;
  onConnect: () => void;
  connected: boolean;
}) {
  return (
    <div className="p-6 space-y-6 max-w-2xl">
      <h2 className="text-xl font-semibold">Settings</h2>
      
      <div className="bg-dark-card rounded-lg p-6 border border-dark-border space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Gateway URL</label>
          <input
            type="text"
            value={gatewayUrl}
            onChange={(e) => setGatewayUrl(e.target.value)}
            className="w-full bg-dark-bg border border-dark-border rounded px-4 py-2 text-white"
            placeholder="http://localhost:18789"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Gateway Token</label>
          <input
            type="password"
            value={gatewayToken}
            onChange={(e) => setGatewayToken(e.target.value)}
            className="w-full bg-dark-bg border border-dark-border rounded px-4 py-2 text-white"
            placeholder="Your gateway token"
          />
        </div>

        <button
          onClick={onConnect}
          disabled={connected}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-green-600 px-4 py-2 rounded font-medium transition"
        >
          {connected ? '✓ Connected' : 'Connect to Gateway'}
        </button>
      </div>
    </div>
  );
}
