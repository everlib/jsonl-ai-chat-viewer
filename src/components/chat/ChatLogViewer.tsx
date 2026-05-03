import type { ChatBlock, ChatTurn, ParsedChatLog } from "../../types/chat-log";

interface ChatLogViewerProps {
  log: ParsedChatLog | null;
}

function getRoleLabel(role: ChatTurn["role"]): string {
  if (role === "user") return "USER";
  if (role === "assistant") return "AI";
  if (role === "system") return "SYS";
  if (role === "tool") return "TOOL";

  return "?";
}

function getBlockLabel(type: ChatBlock["type"]): string {
  if (type === "text") return "Response";
  if (type === "thinking") return "Thinking";
  if (type === "tool_use") return "Tool Use";
  if (type === "tool_result") return "Tool Result";
  if (type === "attachment") return "Attachment";
  if (type === "summary") return "Summary";

  return "Unknown";
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
        <svg
          width="64"
          height="64"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ opacity: 0.3, marginBottom: 24 }}
        >
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
        <h2>JSONL 파일을 불러오세요</h2>
        <p>
          파일을 선택하면 사용자 프롬프트, Thinking, 도구 사용, 
          도구 결과가 분리되어 시각적으로 표시됩니다.
        </p>
      </main>
    );
  }

  return (
    <main className="chat-log-viewer">
      <header className="chat-log-header">
        <div>
          <h1>{log.name}</h1>
          <p>
            <span style={{ 
              display: "inline-flex", 
              alignItems: "center", 
              gap: 6,
              padding: "4px 10px",
              background: "var(--accent-muted)",
              borderRadius: "var(--radius-full)",
              fontSize: 12,
              fontWeight: 500,
              marginRight: 8
            }}>
              {log.sourceType}
            </span>
            {log.turns.length} turns
            <span style={{ opacity: 0.5, margin: "0 8px" }}>|</span>
            {log.createdAt}
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
