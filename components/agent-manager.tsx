'use client';

import { useState } from 'react';
import { Agent } from '@/lib/types';
import { Trash2, Edit2, Plus } from 'lucide-react';
import AgentEditor from './agent-editor';

interface AgentManagerProps {
  agents: Agent[];
  onSelectAgent: (agent: Agent) => void;
}

const AVAILABLE_TOOLS = [
  'Gmail',
  'Calendar',
  'SuperMemory',
  'Crypto Market Data',
  'ClawRouter',
  'Web Search',
  'PDF Reader',
  'Notion',
  'Sheets',
  'Analytics',
];

export default function AgentManager({ agents, onSelectAgent }: AgentManagerProps) {
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null);
  const [agentsList, setAgentsList] = useState(agents);

  const handleSaveAgent = (updatedAgent: Agent) => {
    setAgentsList(prev =>
      prev.map(a => a.id === updatedAgent.id ? updatedAgent : a)
    );
    setEditingAgent(null);
  };

  return (
    <div className="h-full p-6 overflow-y-auto">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Agent Management</h2>
          <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded flex items-center gap-2 transition">
            <Plus size={18} />
            New Agent
          </button>
        </div>

        {/* Agents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {agentsList.map(agent => (
            <div
              key={agent.id}
              className="bg-dark-card border border-dark-border rounded-lg p-6 hover:border-blue-500 transition cursor-pointer group"
              onClick={() => onSelectAgent(agent)}
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white">{agent.name}</h3>
                  <p className="text-sm text-gray-400">{agent.role}</p>
                </div>
                <div className={`w-3 h-3 rounded-full ${agent.status === 'active' ? 'bg-green-500' : agent.status === 'running' ? 'bg-yellow-500' : 'bg-gray-500'}`}></div>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-300 mb-4">{agent.description}</p>

              {/* Focus Areas */}
              {agent.focusAreas && agent.focusAreas.length > 0 && (
                <div className="mb-3 flex flex-wrap gap-1">
                  {agent.focusAreas.slice(0, 2).map(area => (
                    <span key={area} className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded">
                      {area}
                    </span>
                  ))}
                  {agent.focusAreas.length > 2 && (
                    <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded">
                      +{agent.focusAreas.length - 2}
                    </span>
                  )}
                </div>
              )}

              {/* Model */}
              <div className="mb-4 p-2 bg-dark-bg rounded">
                <p className="text-xs text-gray-400">Model</p>
                <p className="text-sm text-white">{agent.model}</p>
              </div>

              {/* Tools */}
              {agent.controlledTools && agent.controlledTools.length > 0 && (
                <div className="mb-4 p-2 bg-dark-bg rounded">
                  <p className="text-xs text-gray-400 mb-1">Tools ({agent.controlledTools.length})</p>
                  <div className="flex flex-wrap gap-1">
                    {agent.controlledTools.slice(0, 3).map(tool => (
                      <span key={tool} className="text-xs bg-green-500/20 text-green-300 px-1.5 py-0.5 rounded">
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingAgent(agent);
                  }}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded text-sm flex items-center justify-center gap-2 transition"
                >
                  <Edit2 size={16} />
                  Configure
                </button>
                <button className="bg-red-600 hover:bg-red-700 px-3 py-2 rounded transition">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Agent Editor Modal */}
        {editingAgent && (
          <AgentEditor
            agent={editingAgent}
            onSave={handleSaveAgent}
            onCancel={() => setEditingAgent(null)}
            availableTools={AVAILABLE_TOOLS}
            allAgents={agentsList}
          />
        )}
      </div>
    </div>
  );
}
