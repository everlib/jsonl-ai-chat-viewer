import type {
  ChatBlock,
  ChatBlockType,
  ChatRole,
  ChatTurn,
  ParsedChatLog,
} from "../../types/chat-log";

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

function getMessage(obj: JsonObject): JsonObject | null {
  const message = obj.message;
  return isObject(message) ? message : null;
}

function getRole(obj: JsonObject): ChatRole {
  const message = getMessage(obj);
  const role = message?.role ?? obj.role ?? obj.type;

  if (role === "user") return "user";
  if (role === "assistant") return "assistant";
  if (role === "system") return "system";
  if (role === "tool") return "tool";

  return "unknown";
}

function getTimestamp(obj: JsonObject): string | undefined {
  const timestamp = obj.timestamp;

  return typeof timestamp === "string" ? timestamp : undefined;
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

function extractBlockText(block: JsonObject): string {
  const type = getBlockType(block);

  if (type === "text") {
    return typeof block.text === "string" ? block.text : "";
  }

  if (type === "thinking") {
    return typeof block.thinking === "string" ? block.thinking : "";
  }

  if (type === "tool_use") {
    const name = typeof block.name === "string" ? block.name : "unknown_tool";
    const input = block.input ?? {};
    return `${name}\n${stringifyUnknown(input)}`;
  }

  if (type === "tool_result") {
    return stringifyUnknown(block.content ?? "");
  }

  return stringifyUnknown(block);
}

function normalizeBlocks(content: unknown): ChatBlock[] {
  if (typeof content === "string") {
    return [
      {
        id: createId(),
        type: "text",
        text: content,
        raw: content,
      },
    ];
  }

  if (!Array.isArray(content)) {
    return [];
  }

  return content
    .filter(isObject)
    .map((block): ChatBlock => {
      const type = getBlockType(block);

      return {
        id: createId(),
        type,
        text: extractBlockText(block),
        raw: block,
      };
    });
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

    const blocks = normalizeBlocks(getContent(parsed));

    if (blocks.length === 0) continue;

    turns.push({
      id: createId(),
      index: turns.length + 1,
      timestamp: getTimestamp(parsed),
      role: getRole(parsed),
      blocks,
      raw: parsed,
    });
  }

  return {
    id: createId(),
    name: fileName,
    createdAt: new Date().toISOString(),
    sourceType: "jsonl",
    turns,
  };
}
