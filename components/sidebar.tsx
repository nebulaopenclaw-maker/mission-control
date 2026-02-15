'use client';

import { Agent } from '@/lib/types';
import { Menu, MessageSquare, Users, Mail, Settings, BarChart3 } from 'lucide-react';

interface SidebarProps {
  agents: Agent[];
  selectedAgent: Agent | null;
  onSelectAgent: (agent: Agent) => void;
  onTabChange: (tab: string) => void;
  activeTab: string;
  connected: boolean;
}

export default function Sidebar({
  agents,
  selectedAgent,
  onSelectAgent,
  onTabChange,
  activeTab,
  connected,
}: SidebarProps) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'chat', label: 'Chat', icon: MessageSquare },
    { id: 'agents', label: 'Agents', icon: Users },
    { id: 'email', label: 'Email', icon: Mail },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="w-full md:w-64 bg-dark-card border-b md:border-b-0 md:border-r border-dark-border flex flex-col h-auto md:h-screen overflow-y-auto">
      {/* Logo */}
      <div className="p-4 border-b border-dark-border">
        <h1 className="text-xl font-bold text-white">🌌 Nebula</h1>
        <p className="text-xs text-gray-400">{connected ? '🟢 Connected' : '🔴 Offline'}</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map(item => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-2 rounded transition ${
                activeTab === item.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:bg-dark-bg'
              }`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Agents List */}
      {activeTab === 'chat' && (
        <div className="border-t border-dark-border p-4 space-y-2 max-h-96 overflow-y-auto">
          <p className="text-xs font-semibold text-gray-400 px-2 py-1">AGENTS</p>
          {agents.map(agent => (
            <button
              key={agent.id}
              onClick={() => onSelectAgent(agent)}
              className={`w-full text-left px-3 py-2 rounded text-sm transition ${
                selectedAgent?.id === agent.id
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-300 hover:bg-dark-bg'
              }`}
            >
              {agent.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
