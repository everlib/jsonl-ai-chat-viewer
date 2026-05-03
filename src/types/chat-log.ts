export type ChatRole =
  | "user"
  | "assistant"
  | "system"
  | "tool"
  | "unknown";

export type ChatBlockType =
  | "text"
  | "thinking"
  | "tool_use"
  | "tool_result"
  | "attachment"
  | "summary"
  | "unknown";

export interface ChatBlock {
  id: string;
  type: ChatBlockType;
  text: string;
  label: string;
  raw: unknown;
}

export interface ChatTurn {
  id: string;
  index: number;
  timestamp?: string;
  role: ChatRole;
  blocks: ChatBlock[];
  raw: unknown;
}

export interface ParsedChatLog {
  id: string;
  name: string;
  createdAt: string;
  sourceType: "jsonl" | "txt" | "md" | "unknown";
  turns: ChatTurn[];
}
