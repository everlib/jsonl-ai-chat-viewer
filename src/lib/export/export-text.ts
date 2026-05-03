import type { ChatBlock, ChatTurn, ParsedChatLog } from "../../types";

function formatBlock(block: ChatBlock): string {
  const typeLabel = block.type === "tool_use" && block.label 
    ? `${block.type}: ${block.label}`
    : block.type;
    
  return [
    `### ${typeLabel}`,
    "",
    block.text,
    "",
  ].join("\n");
}

function formatTurn(turn: ChatTurn): string {
  const header = [
    "---",
    `[${turn.index}] ${turn.role}${turn.timestamp ? ` / ${turn.timestamp}` : ""}`,
    "",
  ].join("\n");

  const blocks = turn.blocks.map(formatBlock).join("\n");

  return `${header}${blocks}`;
}

export function exportChatLogToText(log: ParsedChatLog): string {
  return [
    `# ${log.name}`,
    "",
    `createdAt: ${log.createdAt}`,
    `sourceType: ${log.sourceType}`,
    `turns: ${log.turns.length}`,
    "",
    ...log.turns.map(formatTurn),
  ].join("\n");
}
