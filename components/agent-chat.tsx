'use client';

import { useState, useRef, useEffect } from 'react';
import { Agent, Message } from '@/lib/types';
import { Send } from 'lucide-react';

interface AgentChatProps {
  agent: Agent;
  messages: Message[];
}

export default function AgentChat({ agent, messages }: AgentChatProps) {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    setLoading(true);
    // TODO: Send message to gateway
    setInput('');
    setLoading(false);
  };

  const agentMessages = messages.filter(m => m.agentId === agent.id);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="border-b border-dark-border px-6 py-4 bg-dark-card">
        <h2 className="text-xl font-semibold">{agent.name}</h2>
        <p className="text-sm text-gray-400">{agent.role}</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {agentMessages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-gray-400">
            <div className="text-center">
              <p className="text-lg">Start a conversation with {agent.name}</p>
              <p className="text-sm mt-2">Type your message below</p>
            </div>
          </div>
        ) : (
          agentMessages.map(message => (
            <div
              key={message.id}
              className={`flex gap-4 ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-dark-card border border-dark-border text-gray-100'
                }`}
              >
                {message.content}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-dark-border px-6 py-4 bg-dark-card">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your message..."
            className="flex-1 bg-dark-bg border border-dark-border rounded px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
            disabled={loading}
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 px-4 py-2 rounded transition flex items-center gap-2"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
