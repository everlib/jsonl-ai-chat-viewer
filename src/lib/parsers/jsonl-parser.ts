import type {
  ChatBlock,
  ChatBlockType,
  ChatRole,
  ChatTurn,
  ParsedChatLog,
} from "../../types";

type JsonObject = Record<string, unknown>;

function isObject(value: unknown): value is JsonObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function createId(): string {
  return crypto.randomUUID();
}

function parseJson(line: string): unknown | null {
  try {
    return JSON.parse(line);
  } catch {
    return null;
  }
}

/**
 * Check if this is a real user prompt (not tool_result feedback or hook)
 */
function isRealUserPrompt(obj: JsonObject): boolean {
  if (obj.type !== "user") return false;
  
  const message = isObject(obj.message) ? obj.message : null;
  if (!message) return false;
  
  const content = message.content;
  if (!Array.isArray(content)) return false;
  
  // Check if this has real text content (not just tool_result)
  for (const block of content) {
    if (isObject(block)) {
      // If it has tool_result, it's system feedback
      if (block.type === "tool_result") {
        return false;
      }
      // If it has real text, it's a user prompt
      if (block.type === "text" && typeof block.text === "string" && block.text.trim()) {
        return true;
      }
    }
  }
  
  return false;
}

/**
 * Check if this is an assistant message with actual content
 */
function isAssistantMessage(obj: JsonObject): boolean {
  if (obj.type !== "assistant") return false;
  
  const message = isObject(obj.message) ? obj.message : null;
  if (!message) return false;
  
  const content = message.content;
  if (!Array.isArray(content)) return false;
  
  // Must have at least one non-empty content block
  for (const block of content) {
    if (isObject(block)) {
      const blockType = block.type;
      if (blockType === "text" && typeof block.text === "string" && block.text.trim()) {
        return true;
      }
      if (blockType === "thinking" && typeof block.thinking === "string" && block.thinking.trim()) {
        return true;
      }
      if (blockType === "tool_use") {
        return true;
      }
    }
  }
  
  return false;
}

/**
 * Check if this JSONL entry should be displayed in conversation
 */
function isDisplayableEntry(obj: JsonObject): boolean {
  // Real user prompts
  if (isRealUserPrompt(obj)) return true;
  
  // Assistant messages with content
  if (isAssistantMessage(obj)) return true;
  
  return false;
}

function getMessage(obj: JsonObject): JsonObject | null {
  const message = obj.message;
  return isObject(message) ? message : null;
}

function getRole(obj: JsonObject): ChatRole {
  const type = obj.type;
  
  if (type === "user") return "user";
  if (type === "assistant") return "assistant";
  
  const message = getMessage(obj);
  const role = message?.role ?? obj.role;

  if (role === "user") return "user";
  if (role === "assistant") return "assistant";
  if (role === "system") return "system";
  if (role === "tool") return "tool";

  return "unknown";
}

function getTimestamp(obj: JsonObject): string | undefined {
  const timestamp = obj.timestamp;
  if (typeof timestamp === "string") {
    // Format timestamp to be more readable
    try {
      const date = new Date(timestamp);
      return date.toLocaleString();
    } catch {
      return timestamp;
    }
  }
  return undefined;
}

function getContent(obj: JsonObject): unknown {
  const message = getMessage(obj);

  if (message && "content" in message) {
    return message.content;
  }

  return obj.content ?? "";
}

function getBlockType(block: JsonObject): ChatBlockType {
  const type = block.type;

  if (type === "text") return "text";
  if (type === "thinking") return "thinking";
  if (type === "tool_use") return "tool_use";
  if (type === "tool_result") return "tool_result";
  if (type === "attachment") return "attachment";
  if (type === "summary") return "summary";

  return "unknown";
}

function stringifyUnknown(value: unknown): string {
  if (typeof value === "string") return value;

  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}

/**
 * Extract text from a block, handling special cases
 */
function extractBlockText(block: JsonObject): string {
  const type = getBlockType(block);

  if (type === "text") {
    return typeof block.text === "string" ? block.text : "";
  }

  if (type === "thinking") {
    // Get thinking content, exclude signature field
    const thinking = typeof block.thinking === "string" ? block.thinking : "";
    return thinking;
  }

  if (type === "tool_use") {
    const input = block.input ?? {};
    return stringifyUnknown(input);
  }

  if (type === "tool_result") {
    const content = block.content;
    if (typeof content === "string") {
      return content;
    }
    return stringifyUnknown(content ?? "");
  }

  return stringifyUnknown(block);
}

/**
 * Get a summary/label for collapsible blocks
 */
function getBlockLabel(block: JsonObject): string {
  const type = getBlockType(block);
  
  if (type === "tool_use") {
    const name = typeof block.name === "string" ? block.name : "Tool";
    return name;
  }
  
  if (type === "thinking") {
    return "Thinking...";
  }
  
  return "";
}

function normalizeBlocks(content: unknown, role: ChatRole): ChatBlock[] {
  if (typeof content === "string") {
    return [
      {
        id: createId(),
        type: "text",
        text: content,
        label: "",
        raw: content,
      },
    ];
  }

  if (!Array.isArray(content)) {
    return [];
  }

  const blocks: ChatBlock[] = [];
  
  for (const item of content) {
    if (!isObject(item)) continue;
    
    const type = getBlockType(item);
    
    // Skip tool_result blocks for user messages (they are system feedback)
    if (role === "user" && type === "tool_result") continue;
    
    // Skip empty text blocks
    if (type === "text") {
      const text = typeof item.text === "string" ? item.text : "";
      if (!text.trim()) continue;
    }
    
    // Skip empty thinking blocks
    if (type === "thinking") {
      const thinking = typeof item.thinking === "string" ? item.thinking : "";
      if (!thinking.trim()) continue;
    }

    blocks.push({
      id: createId(),
      type,
      text: extractBlockText(item),
      label: getBlockLabel(item),
      raw: item,
    });
  }

  return blocks;
}

/**
 * Merge consecutive assistant turns that are part of the same message
 * Claude Code logs split assistant responses into multiple entries
 */
function mergeTurns(turns: ChatTurn[]): ChatTurn[] {
  const merged: ChatTurn[] = [];
  
  for (const turn of turns) {
    const lastTurn = merged[merged.length - 1];
    
    // Merge consecutive assistant turns
    if (lastTurn && lastTurn.role === "assistant" && turn.role === "assistant") {
      // Check if blocks overlap (same message split into multiple entries)
      // Add only new blocks that don't duplicate existing ones
      const existingBlockTexts = new Set(lastTurn.blocks.map(b => b.text.slice(0, 100)));
      
      for (const block of turn.blocks) {
        const blockStart = block.text.slice(0, 100);
        if (!existingBlockTexts.has(blockStart)) {
          lastTurn.blocks.push(block);
          existingBlockTexts.add(blockStart);
        }
      }
    } else {
      merged.push(turn);
    }
  }
  
  return merged;
}

export function parseJsonlToChatLog(
  fileName: string,
  rawText: string,
): ParsedChatLog {
  const lines = rawText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const turns: ChatTurn[] = [];

  for (const line of lines) {
    const parsed = parseJson(line);

    if (!isObject(parsed)) continue;
    
    // Skip non-displayable entries
    if (!isDisplayableEntry(parsed)) continue;
    
    const role = getRole(parsed);
    const blocks = normalizeBlocks(getContent(parsed), role);

    // Skip empty turns
    if (blocks.length === 0) continue;

    turns.push({
      id: createId(),
      index: turns.length + 1,
      timestamp: getTimestamp(parsed),
      role,
      blocks,
      raw: parsed,
    });
  }

  // Merge consecutive assistant turns
  const mergedTurns = mergeTurns(turns);
  
  // Re-index after merging
  mergedTurns.forEach((turn, i) => {
    turn.index = i + 1;
  });

  return {
    id: createId(),
    name: fileName,
    createdAt: new Date().toISOString(),
    sourceType: "jsonl",
    turns: mergedTurns,
  };
}
