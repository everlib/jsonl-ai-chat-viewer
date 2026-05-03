import type { ParsedChatLog } from "../../types/chat-log";

const STORAGE_KEY = "jsonl-ai-chat-viewer.logs";

function readRawStorage(): string | null {
  return localStorage.getItem(STORAGE_KEY);
}

export function loadChatLogs(): ParsedChatLog[] {
  const raw = readRawStorage();

  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);

    if (!Array.isArray(parsed)) return [];

    return parsed as ParsedChatLog[];
  } catch {
    return [];
  }
}

export function saveChatLogs(logs: ParsedChatLog[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
}

export function addChatLog(log: ParsedChatLog): ParsedChatLog[] {
  const logs = loadChatLogs();
  const next = [log, ...logs];

  saveChatLogs(next);

  return next;
}

export function removeChatLog(logId: string): ParsedChatLog[] {
  const logs = loadChatLogs();
  const next = logs.filter((log) => log.id !== logId);

  saveChatLogs(next);

  return next;
}

export function getChatLog(logId: string): ParsedChatLog | null {
  const logs = loadChatLogs();

  return logs.find((log) => log.id === logId) ?? null;
}

export function clearChatLogs(): void {
  localStorage.removeItem(STORAGE_KEY);
}
