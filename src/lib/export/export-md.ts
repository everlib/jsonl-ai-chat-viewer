import type { ChatBlock, ChatTurn, ParsedChatLog } from "../../types/chat-log";

function escapeMdTableCell(value: string): string {
  return value
    .replace(/\|/g, "\\|")
    .replace(/\r?\n/g, "<br />");
}

function formatBlocks(blocks: ChatBlock[], type: ChatBlock["type"]): string {
  return blocks
    .filter((block) => block.type === type)
    .map((block) => block.text)
    .join("\n\n");
}

function formatTurnRow(turn: ChatTurn): string {
  const prompt = formatBlocks(turn.blocks, "text");
  const thinking = formatBlocks(turn.blocks, "thinking");
  const toolUse = formatBlocks(turn.blocks, "tool_use");
  const toolResult = formatBlocks(turn.blocks, "tool_result");

  return [
    turn.index,
    turn.timestamp ?? "",
    turn.role,
    escapeMdTableCell(prompt),
    escapeMdTableCell(thinking),
    escapeMdTableCell(toolUse),
    escapeMdTableCell(toolResult),
  ].join(" | ");
}

export function exportChatLogToMarkdown(log: ParsedChatLog): string {
  const lines: string[] = [];

  lines.push(`# ${log.name}`);
  lines.push("");
  lines.push(`- createdAt: ${log.createdAt}`);
  lines.push(`- sourceType: ${log.sourceType}`);
  lines.push(`- turns: ${log.turns.length}`);
  lines.push("");
  lines.push("| # | timestamp | role | text | thinking | tool_use | tool_result |");
  lines.push("|---:|---|---|---|---|---|---|");

  for (const turn of log.turns) {
    lines.push(`| ${formatTurnRow(turn)} |`);
  }

  return lines.join("\n");
}
