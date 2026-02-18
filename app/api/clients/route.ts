import { NextResponse } from 'next/server';
import { readTextFile, listDirectory, workspacePath } from '@/lib/workspace';
import path from 'path';
import { CRMClient, CRMStage } from '@/lib/types';

function parseClientMd(filename: string, content: string): CRMClient {
  const id = filename.replace('.md', '').replace(/[^a-z0-9-]/gi, '-').toLowerCase();

  const nameMatch = content.match(/^#\s+(.+)/m);
  const stageMatch = content.match(/(?:stage|status):\s*(.+)/i);
  const companyMatch = content.match(/(?:company|org):\s*(.+)/i);
  const valueMatch = content.match(/(?:value|deal):\s*\$?([\d,]+)/i);
  const nextMatch = content.match(/(?:next action|next step):\s*(.+)/i);
  const lastMatch = content.match(/(?:last interaction|last contact):\s*(.+)/i);
  const notesMatch = content.match(/## Notes\s+([\s\S]+?)(?=##|$)/i);

  const STAGES: CRMStage[] = ['Prospect', 'Contacted', 'Meeting', 'Proposal', 'Active'];
  const rawStage = stageMatch?.[1]?.trim() ?? 'Prospect';
  const stage = STAGES.find((s) => s.toLowerCase() === rawStage.toLowerCase()) ?? 'Prospect';

  return {
    id,
    name: nameMatch?.[1]?.trim() ?? id,
    company: companyMatch?.[1]?.trim(),
    stage,
    value: valueMatch ? parseInt(valueMatch[1].replace(',', ''), 10) : undefined,
    nextAction: nextMatch?.[1]?.trim(),
    lastInteraction: lastMatch?.[1]?.trim(),
    notes: notesMatch?.[1]?.trim(),
    contacts: [],
    tags: [],
  };
}

const FALLBACK_CLIENTS: CRMClient[] = [
  { id: 'acme', name: 'ACME Corp', company: 'ACME', stage: 'Proposal', value: 5000, nextAction: 'Send contract', lastInteraction: new Date(Date.now() - 172800000).toISOString(), tags: ['enterprise'] },
  { id: 'globex', name: 'Globex', company: 'Globex Inc', stage: 'Meeting', value: 2500, nextAction: 'Follow up call', lastInteraction: new Date(Date.now() - 86400000).toISOString(), tags: ['smb'] },
  { id: 'initech', name: 'Initech', company: 'Initech LLC', stage: 'Contacted', nextAction: 'Schedule demo', tags: [] },
  { id: 'umbrella', name: 'Umbrella', company: 'Umbrella Corp', stage: 'Active', value: 12000, nextAction: 'Monthly check-in', tags: ['enterprise'] },
];

export async function GET() {
  try {
    const clientsDir = workspacePath('clients');
    const files = listDirectory(clientsDir).filter((f) => f.endsWith('.md'));

    if (files.length === 0) {
      return NextResponse.json({ clients: FALLBACK_CLIENTS });
    }

    const clients = await Promise.all(
      files.map(async (filename) => {
        const content = await readTextFile(path.join(clientsDir, filename));
        return parseClientMd(filename, content);
      })
    );

    return NextResponse.json({ clients });
  } catch {
    return NextResponse.json({ clients: FALLBACK_CLIENTS });
  }
}
