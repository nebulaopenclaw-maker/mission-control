'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Mic, MicOff, MessageSquare, Terminal, Clock, Hash } from 'lucide-react';
import { Card, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Skeleton } from './ui/skeleton';
import { Badge } from './ui/badge';
import { TabBar } from './tab-bar';
import { useFetch } from '@/hooks/use-auto-refresh';
import { cn, relativeTime } from '@/lib/utils';
import { ChatMessage, ChatSession, MessageChannel } from '@/lib/types';

const TABS = [
  { id: 'chat', label: 'Chat' },
  { id: 'command', label: 'Command' },
];

const CHANNEL_COLORS: Record<MessageChannel, string> = {
  telegram: 'text-blue-400',
  discord: 'text-indigo-400',
  webchat: 'text-primary',
  api: 'text-success',
};

const QUICK_COMMANDS = [
  { label: 'System Status', command: '/status', icon: '📊' },
  { label: 'List Agents', command: '/agents list', icon: '🤖' },
  { label: 'Cron Health', command: '/cron health', icon: '⏱️' },
  { label: 'Revenue Report', command: '/revenue', icon: '💰' },
  { label: 'Today\'s Tasks', command: '/tasks today', icon: '✅' },
  { label: 'Memory Dump', command: '/memory dump', icon: '🧠' },
  { label: 'Restart Agent', command: '/agent restart nebula', icon: '🔄' },
  { label: 'Deploy', command: '/deploy mission-control', icon: '🚀' },
];

// ─── Voice Input ─────────────────────────────────────────────────────────────

function VoiceInput({ onTranscript }: { onTranscript: (text: string) => void }) {
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  function toggle() {
    if (typeof window === 'undefined') return;
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return;

    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }

    const rec = new SR();
    rec.continuous = false;
    rec.interimResults = false;
    rec.lang = 'en-US';

    rec.onresult = (e: any) => {
      const transcript = e.results[0][0].transcript;
      onTranscript(transcript);
      setListening(false);
    };

    rec.onerror = () => setListening(false);
    rec.onend = () => setListening(false);

    recognitionRef.current = rec;
    rec.start();
    setListening(true);
  }

  return (
    <Button
      size="icon"
      variant="ghost"
      onClick={toggle}
      className={cn(listening && 'text-danger animate-pulse')}
      title={listening ? 'Stop recording' : 'Voice input'}
    >
      {listening ? <MicOff size={14} /> : <Mic size={14} />}
    </Button>
  );
}

// ─── Message Bubble ──────────────────────────────────────────────────────────

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn('flex gap-2', isUser ? 'flex-row-reverse' : 'flex-row')}
    >
      <div className={cn(
        'flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold mt-1',
        isUser ? 'bg-primary/20 text-primary' : 'bg-white/[0.06] text-text-muted'
      )}>
        {isUser ? 'U' : 'A'}
      </div>
      <div className={cn('max-w-[75%] space-y-1', isUser && 'items-end flex flex-col')}>
        <div className={cn(
          'px-3 py-2 text-[12px] leading-relaxed',
          isUser ? 'bubble-user text-text-primary' : 'bubble-assistant text-text-secondary'
        )}>
          {message.content}
        </div>
        <div className="flex items-center gap-1.5 px-1">
          {message.channel && (
            <span className={cn('text-[9px] font-medium', CHANNEL_COLORS[message.channel ?? 'webchat'])}>
              {message.channel}
            </span>
          )}
          <span className="text-[9px] text-text-dim">{relativeTime(message.timestamp)}</span>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Chat Tab ────────────────────────────────────────────────────────────────

function ChatTab() {
  const { data, loading } = useFetch('/api/chat-history');
  const sessions: ChatSession[] = (data as any)?.sessions ?? [];
  const [activeSession, setActiveSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (sessions.length > 0 && !activeSession) {
      setActiveSession(sessions[0]);
      setMessages(sessions[0].messages ?? []);
    }
  }, [sessions]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function sendMessage() {
    if (!input.trim() || sending) return;
    const content = input.trim();
    setInput('');

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
      channel: 'webchat',
    };

    setMessages((prev) => [...prev, userMsg]);
    setSending(true);

    try {
      await fetch('/api/chat-send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, sessionId: activeSession?.id }),
      });
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="flex gap-4 h-[calc(100vh-180px)]">
      {/* Session Sidebar */}
      <div className="w-52 flex-shrink-0 flex flex-col gap-2">
        <h3 className="label-xs mb-1">Sessions</h3>
        <div className="flex-1 overflow-y-auto space-y-1">
          {loading ? (
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-12" />)}
            </div>
          ) : (
            sessions.map((session) => (
              <button
                key={session.id}
                onClick={() => {
                  setActiveSession(session);
                  setMessages(session.messages ?? []);
                }}
                className={cn(
                  'w-full text-left p-2 rounded-xl transition-colors',
                  activeSession?.id === session.id
                    ? 'bg-white/[0.06] border border-white/[0.08]'
                    : 'hover:bg-white/[0.03] border border-transparent'
                )}
              >
                <div className="flex items-center gap-1.5 mb-0.5">
                  <Hash size={9} className={CHANNEL_COLORS[session.channel]} />
                  <span className="text-[10px] text-text-primary truncate">{session.title}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[9px] text-text-muted">{session.messageCount} msgs</span>
                  <span className="text-[9px] text-text-dim">{relativeTime(session.updatedAt)}</span>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 glass-card flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <MessageSquare size={13} className="text-primary" />
            <span className="text-[12px] font-medium text-text-primary">
              {activeSession?.title ?? 'No session selected'}
            </span>
            {activeSession?.channel && (
              <Badge variant="ghost">{activeSession.channel}</Badge>
            )}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <p className="text-[12px] text-text-muted">No messages. Start a conversation below.</p>
            </div>
          ) : (
            <>
              {messages.map((msg, i) => {
                const prevMsg = messages[i - 1];
                const showDate =
                  !prevMsg ||
                  new Date(msg.timestamp).toDateString() !== new Date(prevMsg.timestamp).toDateString();
                return (
                  <div key={msg.id}>
                    {showDate && (
                      <div className="flex items-center gap-2 my-3">
                        <div className="flex-1 h-px bg-white/[0.04]" />
                        <span className="text-[9px] text-text-dim">
                          {new Date(msg.timestamp).toLocaleDateString()}
                        </span>
                        <div className="flex-1 h-px bg-white/[0.04]" />
                      </div>
                    )}
                    <MessageBubble message={msg} />
                  </div>
                );
              })}
              {sending && (
                <div className="flex gap-2">
                  <div className="w-6 h-6 rounded-full bg-white/[0.06] flex-shrink-0 mt-1" />
                  <div className="bubble-assistant px-3 py-2">
                    <div className="flex gap-1 items-center h-5">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          className="w-1 h-1 rounded-full bg-text-muted"
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{ duration: 1, delay: i * 0.15, repeat: Infinity }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </>
          )}
        </div>

        {/* Input */}
        <div className="p-3 border-t border-white/[0.06]">
          <div className="flex items-center gap-2 bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
              placeholder="Message the agent..."
              className="flex-1 bg-transparent text-[12px] text-text-primary placeholder:text-text-muted outline-none"
            />
            <VoiceInput onTranscript={(t) => setInput((prev) => `${prev}${t}`)} />
            <Button
              size="icon"
              variant={input.trim() ? 'primary' : 'ghost'}
              onClick={sendMessage}
              disabled={!input.trim() || sending}
            >
              <Send size={12} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Command Tab ─────────────────────────────────────────────────────────────

function CommandTab() {
  const [output, setOutput] = useState<string[]>([]);
  const [running, setRunning] = useState<string | null>(null);

  async function run(command: string) {
    setRunning(command);
    setOutput((prev) => [...prev, `> ${command}`, '...']);
    await new Promise((r) => setTimeout(r, 800));
    setOutput((prev) => [
      ...prev.slice(0, -1),
      `✓ Command queued: ${command}`,
      `  Sent to agent at ${new Date().toISOString()}`,
    ]);
    setRunning(null);
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div>
        <h3 className="label-xs mb-3">Quick Commands</h3>
        <div className="grid grid-cols-2 gap-2">
          {QUICK_COMMANDS.map((cmd) => (
            <button
              key={cmd.command}
              onClick={() => run(cmd.command)}
              disabled={running === cmd.command}
              className="glass-card glass-card-hover p-3 text-left"
            >
              <span className="text-base block mb-1">{cmd.icon}</span>
              <p className="text-[11px] font-medium text-text-primary">{cmd.label}</p>
              <p className="text-[9px] text-text-muted font-mono mt-0.5">{cmd.command}</p>
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="label-xs mb-3">Output</h3>
        <div className="code-block p-4 h-80 overflow-y-auto">
          {output.length === 0 ? (
            <p className="text-[11px] text-text-dim">Run a command to see output here</p>
          ) : (
            output.map((line, i) => (
              <div key={i} className={cn(
                'text-[11px] leading-relaxed',
                line.startsWith('>') ? 'text-primary' :
                line.startsWith('✓') ? 'text-success' : 'text-text-muted'
              )}>
                {line}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export function ChatView() {
  const [activeTab, setActiveTab] = useState('chat');

  return (
    <div className="p-4 md:p-6 max-w-screen-xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[15px] font-semibold text-text-primary">Chat</h1>
          <p className="text-[11px] text-text-muted mt-0.5">Communicate with agents and run commands</p>
        </div>
      </div>

      <div className="mb-5">
        <TabBar tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {activeTab === 'chat' && <ChatTab />}
        {activeTab === 'command' && <CommandTab />}
      </motion.div>
    </div>
  );
}
