import type { ChatBlock, ChatTurn, ParsedChatLog } from "../../types/chat-log";

interface ChatLogViewerProps {
  log: ParsedChatLog | null;
}

function getRoleLabel(role: ChatTurn["role"]): string {
  if (role === "user") return "사용자";
  if (role === "assistant") return "AI";
  if (role === "system") return "시스템";
  if (role === "tool") return "도구";

  return "알 수 없음";
}

function getBlockLabel(type: ChatBlock["type"]): string {
  if (type === "text") return "응답";
  if (type === "thinking") return "thinking";
  if (type === "tool_use") return "tool_use";
  if (type === "tool_result") return "tool_result";
  if (type === "attachment") return "attachment";
  if (type === "summary") return "summary";

  return "unknown";
}

function ChatBlockView({ block }: { block: ChatBlock }) {
  return (
    <div className={`chat-block chat-block-${block.type}`}>
      <div className="chat-block-label">{getBlockLabel(block.type)}</div>
      <pre className="chat-block-text">{block.text}</pre>
    </div>
  );
}

function ChatTurnView({ turn }: { turn: ChatTurn }) {
  return (
    <article className={`chat-turn chat-turn-${turn.role}`}>
      <div className="chat-avatar">{getRoleLabel(turn.role)}</div>

      <div className="chat-bubble">
        <div className="chat-meta">
          <span>#{turn.index}</span>
          {turn.timestamp ? <span>{turn.timestamp}</span> : null}
        </div>

        <div className="chat-block-list">
          {turn.blocks.map((block) => (
            <ChatBlockView key={block.id} block={block} />
          ))}
        </div>
      </div>
    </article>
  );
}

export function ChatLogViewer({ log }: ChatLogViewerProps) {
  if (!log) {
    return (
      <main className="chat-empty">
        <h2>JSONL 파일을 불러오세요.</h2>
        <p>파일을 선택하면 사용자 프롬프트, thinking, 도구 사용, 도구 결과가 분리되어 표시됩니다.</p>
      </main>
    );
  }

  return (
    <main className="chat-log-viewer">
      <header className="chat-log-header">
        <div>
          <h1>{log.name}</h1>
          <p>
            {log.sourceType} / {log.turns.length} turns / {log.createdAt}
          </p>
        </div>
      </header>

      <section className="chat-turn-list">
        {log.turns.map((turn) => (
          <ChatTurnView key={turn.id} turn={turn} />
        ))}
      </section>
    </main>
  );
}
