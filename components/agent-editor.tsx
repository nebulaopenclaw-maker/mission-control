'use client';

import { useState } from 'react';
import { Agent } from '@/lib/types';
import { Save, X } from 'lucide-react';

interface AgentEditorProps {
  agent: Agent;
  onSave: (agent: Agent) => void;
  onCancel: () => void;
  availableTools: string[];
  allAgents: Agent[];
}

export default function AgentEditor({
  agent,
  onSave,
  onCancel,
  availableTools,
  allAgents,
}: AgentEditorProps) {
  const [formData, setFormData] = useState<Agent>(agent);

  const handleSave = () => {
    onSave(formData);
  };

  const toggleFocusArea = (area: string) => {
    setFormData(prev => ({
      ...prev,
      focusAreas: prev.focusAreas?.includes(area)
        ? prev.focusAreas.filter(f => f !== area)
        : [...(prev.focusAreas || []), area]
    }));
  };

  const toggleTool = (tool: string) => {
    setFormData(prev => ({
      ...prev,
      controlledTools: prev.controlledTools?.includes(tool)
        ? prev.controlledTools.filter(t => t !== tool)
        : [...(prev.controlledTools || []), tool]
    }));
  };

  const toggleManagedAgent = (agentId: string) => {
    setFormData(prev => ({
      ...prev,
      managedAgents: prev.managedAgents?.includes(agentId)
        ? prev.managedAgents.filter(a => a !== agentId)
        : [...(prev.managedAgents || []), agentId]
    }));
  };

  const focusAreaOptions = [
    'Market Analysis',
    'Content Creation',
    'Marketing Strategy',
    'Financial Planning',
    'Tax Optimization',
    'Project Management',
    'Business Development',
    'Legal Compliance',
    'Reporting',
    'Risk Assessment',
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-dark-card border border-dark-border rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-dark-card border-b border-dark-border px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">Edit Agent: {agent.name}</h2>
          <button onClick={onCancel} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Basic Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-dark-bg border border-dark-border rounded px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Role</label>
                <input
                  type="text"
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  className="w-full bg-dark-bg border border-dark-border rounded px-3 py-2 text-white"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full bg-dark-bg border border-dark-border rounded px-3 py-2 text-white h-20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Model</label>
              <input
                type="text"
                value={formData.model}
                onChange={(e) => setFormData({...formData, model: e.target.value})}
                className="w-full bg-dark-bg border border-dark-border rounded px-3 py-2 text-white"
                placeholder="blockrun/auto"
              />
            </div>
          </div>

          {/* Personality */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Personality & Behavior</h3>
            <div>
              <label className="block text-sm font-medium mb-2">Personality</label>
              <input
                type="text"
                value={formData.personality || ''}
                onChange={(e) => setFormData({...formData, personality: e.target.value})}
                className="w-full bg-dark-bg border border-dark-border rounded px-3 py-2 text-white"
                placeholder="e.g., Analytical, Creative, Strategic, Data-driven"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">System Prompt</label>
              <textarea
                value={formData.systemPrompt || ''}
                onChange={(e) => setFormData({...formData, systemPrompt: e.target.value})}
                className="w-full bg-dark-bg border border-dark-border rounded px-3 py-2 text-white h-24"
                placeholder="Define how this agent should behave and respond..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Custom Instructions</label>
              <textarea
                value={formData.instructions || ''}
                onChange={(e) => setFormData({...formData, instructions: e.target.value})}
                className="w-full bg-dark-bg border border-dark-border rounded px-3 py-2 text-white h-20"
                placeholder="Additional instructions for this agent..."
              />
            </div>
          </div>

          {/* Focus Areas */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Focus Areas</h3>
            <div className="grid grid-cols-2 gap-2">
              {focusAreaOptions.map(area => (
                <button
                  key={area}
                  onClick={() => toggleFocusArea(area)}
                  className={`text-left px-3 py-2 rounded transition ${
                    formData.focusAreas?.includes(area)
                      ? 'bg-blue-600 text-white'
                      : 'bg-dark-bg border border-dark-border text-gray-300 hover:border-blue-500'
                  }`}
                >
                  {area}
                </button>
              ))}
            </div>
          </div>

          {/* Controlled Tools */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Available Tools</h3>
            <div className="grid grid-cols-2 gap-2">
              {availableTools.map(tool => (
                <button
                  key={tool}
                  onClick={() => toggleTool(tool)}
                  className={`text-left px-3 py-2 rounded transition ${
                    formData.controlledTools?.includes(tool)
                      ? 'bg-green-600 text-white'
                      : 'bg-dark-bg border border-dark-border text-gray-300 hover:border-green-500'
                  }`}
                >
                  ✓ {tool}
                </button>
              ))}
            </div>
          </div>

          {/* Managed Agents */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Can Manage These Agents</h3>
            <div className="grid grid-cols-2 gap-2">
              {allAgents
                .filter(a => a.id !== agent.id)
                .map(a => (
                  <button
                    key={a.id}
                    onClick={() => toggleManagedAgent(a.id)}
                    className={`text-left px-3 py-2 rounded transition text-sm ${
                      formData.managedAgents?.includes(a.id)
                        ? 'bg-purple-600 text-white'
                        : 'bg-dark-bg border border-dark-border text-gray-300 hover:border-purple-500'
                    }`}
                  >
                    👤 {a.name}
                  </button>
                ))}
            </div>
          </div>

          {/* Targets */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Target Stakeholders</h3>
            <textarea
              value={(formData.targets || []).join('\n')}
              onChange={(e) => setFormData({
                ...formData,
                targets: e.target.value.split('\n').filter(t => t.trim())
              })}
              className="w-full bg-dark-bg border border-dark-border rounded px-3 py-2 text-white h-20"
              placeholder="One per line: e.g., Bill, Elena, External Partners"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4 border-t border-dark-border">
            <button
              onClick={handleSave}
              className="flex-1 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded flex items-center justify-center gap-2 transition"
            >
              <Save size={18} />
              Save Agent Configuration
            </button>
            <button
              onClick={onCancel}
              className="flex-1 bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded transition"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
