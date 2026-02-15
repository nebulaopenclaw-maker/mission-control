'use client';

import { useState } from 'react';
import { Mail, Archive, Trash2, Reply } from 'lucide-react';

const MOCK_EMAILS = [
  {
    id: '1',
    from: 'Anthropic <no-reply@anthropic.com>',
    subject: 'Monthly Claude API Spend Exceeding Thresholds',
    date: '2026-02-15 18:07',
    unread: true,
    preview: 'Your Claude API usage has exceeded...',
  },
  {
    id: '2',
    from: 'Google <no-reply@accounts.google.com>',
    subject: '2-Step Verification turned on',
    date: '2026-02-15 17:43',
    unread: true,
    preview: '2-Step Verification has been enabled on your account',
  },
];

export default function EmailDashboard() {
  const [emails, setEmails] = useState(MOCK_EMAILS);
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null);

  return (
    <div className="h-full flex gap-4 p-6 overflow-hidden">
      {/* Email List */}
      <div className="flex-1 bg-dark-card rounded-lg border border-dark-border overflow-hidden flex flex-col">
        <div className="border-b border-dark-border px-6 py-4">
          <h2 className="text-xl font-semibold">Inbox</h2>
          <p className="text-sm text-gray-400">{emails.filter(e => e.unread).length} unread</p>
        </div>

        <div className="flex-1 overflow-y-auto">
          {emails.map(email => (
            <div
              key={email.id}
              onClick={() => setSelectedEmail(email.id)}
              className={`border-b border-dark-border px-6 py-4 cursor-pointer hover:bg-dark-bg transition ${
                selectedEmail === email.id ? 'bg-dark-bg' : ''
              } ${email.unread ? 'bg-dark-bg/50' : ''}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-white truncate">{email.from}</p>
                  <p className="text-sm text-gray-300 truncate">{email.subject}</p>
                  <p className="text-xs text-gray-500 mt-1">{email.preview}</p>
                </div>
                {email.unread && <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 ml-2"></div>}
              </div>
              <p className="text-xs text-gray-500 mt-2">{email.date}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Email Detail */}
      {selectedEmail && (
        <div className="w-full md:w-96 bg-dark-card rounded-lg border border-dark-border overflow-hidden flex flex-col">
          <div className="border-b border-dark-border px-6 py-4 flex justify-between items-center">
            <h3 className="font-semibold">Email Details</h3>
            <div className="flex gap-2">
              <button className="p-2 hover:bg-dark-bg rounded transition">
                <Archive size={18} />
              </button>
              <button className="p-2 hover:bg-dark-bg rounded transition">
                <Trash2 size={18} />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {emails
              .filter(e => e.id === selectedEmail)
              .map(email => (
                <div key={email.id}>
                  <p className="font-semibold">{email.from}</p>
                  <p className="text-lg font-bold mt-2">{email.subject}</p>
                  <p className="text-sm text-gray-400 mt-1">{email.date}</p>
                  <div className="mt-6 p-4 bg-dark-bg rounded border border-dark-border">
                    <p className="text-sm leading-relaxed">
                      This is a preview of the email content. Full email rendering would be implemented here with the actual email body, attachments, and formatting.
                    </p>
                  </div>
                </div>
              ))}
          </div>

          <div className="border-t border-dark-border p-4">
            <button className="w-full bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded flex items-center justify-center gap-2 transition">
              <Reply size={18} />
              Reply
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
