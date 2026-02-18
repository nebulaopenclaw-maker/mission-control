import path from 'path';
import os from 'os';
import fs from 'fs';

export function getWorkspacePath(): string {
  const envPath = process.env.OPENCLAW_WORKSPACE_PATH;
  if (envPath) {
    return envPath.replace('~', os.homedir());
  }
  return path.join(os.homedir(), '.openclaw', 'workspace');
}

export function workspacePath(...parts: string[]): string {
  return path.join(getWorkspacePath(), ...parts);
}

export async function readJsonFile<T>(filePath: string, fallback: T): Promise<T> {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content) as T;
  } catch {
    return fallback;
  }
}

export async function writeJsonFile(filePath: string, data: unknown): Promise<void> {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

export async function readTextFile(filePath: string, fallback = ''): Promise<string> {
  try {
    return fs.readFileSync(filePath, 'utf-8');
  } catch {
    return fallback;
  }
}

export async function appendTextFile(filePath: string, content: string): Promise<void> {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.appendFileSync(filePath, content, 'utf-8');
}

export function fileExists(filePath: string): boolean {
  try {
    fs.accessSync(filePath, fs.constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

export function listDirectory(dirPath: string): string[] {
  try {
    return fs.readdirSync(dirPath);
  } catch {
    return [];
  }
}

export function getFileStat(filePath: string): fs.Stats | null {
  try {
    return fs.statSync(filePath);
  } catch {
    return null;
  }
}
