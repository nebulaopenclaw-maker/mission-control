import { NextResponse } from 'next/server';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { GitRepo } from '@/lib/types';

function detectLanguage(repoPath: string): string {
  const files = fs.readdirSync(repoPath).map((f) => f.toLowerCase());
  if (files.some((f) => f === 'package.json')) return 'TypeScript/JavaScript';
  if (files.some((f) => f.endsWith('.py') || f === 'requirements.txt')) return 'Python';
  if (files.some((f) => f === 'go.mod')) return 'Go';
  if (files.some((f) => f === 'cargo.toml')) return 'Rust';
  if (files.some((f) => f.endsWith('.rb') || f === 'gemfile')) return 'Ruby';
  return 'Unknown';
}

function getGitInfo(repoPath: string): Partial<GitRepo> {
  try {
    const branch = execSync('git branch --show-current', { cwd: repoPath, timeout: 3000 })
      .toString().trim();
    const lastCommit = execSync('git log -1 --format="%H|%s|%ar" 2>/dev/null', { cwd: repoPath, timeout: 3000 })
      .toString().trim();
    const [hash, msg, when] = lastCommit.split('|');
    const dirtyOutput = execSync('git status --porcelain 2>/dev/null', { cwd: repoPath, timeout: 3000 })
      .toString().trim();
    const dirtyLines = dirtyOutput ? dirtyOutput.split('\n').length : 0;

    let remoteUrl = '';
    try {
      remoteUrl = execSync('git remote get-url origin 2>/dev/null', { cwd: repoPath, timeout: 2000 })
        .toString().trim();
    } catch {}

    return {
      branch,
      lastCommit: when,
      lastCommitMsg: msg,
      dirty: dirtyLines > 0,
      dirtyCount: dirtyLines,
      remoteUrl,
    };
  } catch {
    return { branch: 'unknown', dirty: false, dirtyCount: 0 };
  }
}

const FALLBACK_REPOS: GitRepo[] = [
  { name: 'mission-control', path: '/home/user/mission-control', branch: 'main', lastCommit: '5m ago', lastCommitMsg: 'Initial setup', dirty: false, dirtyCount: 0, language: 'TypeScript/JavaScript' },
];

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  // Scan directories for git repos
  const scanDirs = [
    path.join(os.homedir(), 'Desktop', 'Projects'),
    path.join(os.homedir(), 'Projects'),
    path.join(os.homedir(), 'Code'),
    '/home/user',
  ];

  const repos: GitRepo[] = [];

  for (const dir of scanDirs) {
    try {
      if (!fs.existsSync(dir)) continue;
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        if (!entry.isDirectory()) continue;
        const repoPath = path.join(dir, entry.name);
        const gitDir = path.join(repoPath, '.git');
        if (!fs.existsSync(gitDir)) continue;

        const gitInfo = getGitInfo(repoPath);
        const language = detectLanguage(repoPath);

        repos.push({
          name: entry.name,
          path: repoPath,
          branch: gitInfo.branch ?? 'unknown',
          lastCommit: gitInfo.lastCommit,
          lastCommitMsg: gitInfo.lastCommitMsg,
          dirty: gitInfo.dirty ?? false,
          dirtyCount: gitInfo.dirtyCount ?? 0,
          remoteUrl: gitInfo.remoteUrl,
          language,
        });
      }
    } catch {}
  }

  if (repos.length === 0) {
    // At least show the mission-control repo itself
    const mcPath = path.join('/home/user', 'mission-control');
    if (fs.existsSync(path.join(mcPath, '.git'))) {
      const info = getGitInfo(mcPath);
      repos.push({
        name: 'mission-control',
        path: mcPath,
        branch: info.branch ?? 'main',
        lastCommit: info.lastCommit,
        lastCommitMsg: info.lastCommitMsg,
        dirty: info.dirty ?? false,
        dirtyCount: info.dirtyCount ?? 0,
        language: 'TypeScript/JavaScript',
      });
    }
  }

  return NextResponse.json({
    repos: repos.length > 0 ? repos : FALLBACK_REPOS,
    total: repos.length || FALLBACK_REPOS.length,
    dirty: repos.filter((r) => r.dirty).length,
  });
}
