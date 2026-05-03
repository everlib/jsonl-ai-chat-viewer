import { useState } from "react";
import type { ChatBlock, ChatTurn, ParsedChatLog } from "../../types";

interface ChatViewerProps {
  log: ParsedChatLog | null;
  onToggleInspector: () => void;
  showInspector: boolean;
}

function getRoleLabel(role: ChatTurn["role"]): string {
  switch (role) {
    case "user": return "You";
    case "assistant": return "Assistant";
    case "system": return "System";
    case "tool": return "Tool";
    default: return "Unknown";
  }
}

function getRoleInitial(role: ChatTurn["role"]): string {
  switch (role) {
    case "user": return "Y";
    case "assistant": return "A";
    case "system": return "S";
    case "tool": return "T";
    default: return "?";
  }
}

// Collapsible Block Component
function CollapsibleBlock({
  type,
  label,
  content,
  accentColor,
  defaultExpanded = false,
}: {
  type: string;
  label: string;
  content: string;
  accentColor: string;
  defaultExpanded?: boolean;
}) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  const blockClass = type === "thinking" ? "block-thinking" : 
                     type === "tool_use" ? "block-tool-use" : 
                     type === "tool_result" ? "block-tool-result" : "";

  const headerClass = type === "thinking" ? "block-thinking-header" : "block-tool-header";
  const contentClass = type === "thinking" ? "block-thinking-content" : "block-tool-content";

  return (
    <div className={`block ${blockClass}`}>
      <button
        type="button"
        className={expanded ? `${headerClass} expanded` : headerClass}
        onClick={() => setExpanded(!expanded)}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="9 18 15 12 9 6" />
        </svg>
        <span className={type === "thinking" ? "block-thinking-icon" : ""}>
          {type === "thinking" ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          ) : type === "tool_use" ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="2">
              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="2">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}
        </span>
        <span className="block-thinking-label">{label}</span>
      </button>
      <div className={expanded ? `${contentClass} expanded` : contentClass}>
        <pre>{content}</pre>
      </div>
    </div>
  );
}

// Block Renderer
function BlockView({ block }: { block: ChatBlock }) {
  if (block.type === "thinking") {
    return (
      <CollapsibleBlock
        type="thinking"
        label="Thinking..."
        content={block.text}
        accentColor="var(--thinking-accent)"
      />
    );
  }

  if (block.type === "tool_use") {
    const toolLabel = block.label || "Tool Use";
    return (
      <CollapsibleBlock
        type="tool_use"
        label={toolLabel}
        content={block.text}
        accentColor="var(--tool-accent)"
      />
    );
  }

  if (block.type === "tool_result") {
    return (
      <CollapsibleBlock
        type="tool_result"
        label="Result"
        content={block.text}
        accentColor="var(--tool-accent)"
        defaultExpanded={false}
      />
    );
  }

  if (block.type === "attachment") {
    return (
      <div className="block block-attachment">
        <div className="block-attachment-label">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
          </svg>
          Attachment
        </div>
        <pre>{block.text}</pre>
      </div>
    );
  }

  // Default: text block
  return <div className="block block-text">{block.text}</div>;
}

// Message Component
function MessageView({ turn }: { turn: ChatTurn }) {
  return (
    <article className={`message message-${turn.role}`}>
      <div className="message-avatar">
        {getRoleInitial(turn.role)}
      </div>
      <div className="message-body">
        <div className="message-role">
          {getRoleLabel(turn.role)}
          {turn.timestamp && (
            <span className="message-timestamp">{turn.timestamp}</span>
          )}
        </div>
        <div className="message-blocks">
          {turn.blocks.map((block) => (
            <BlockView key={block.id} block={block} />
          ))}
        </div>
      </div>
    </article>
  );
}

export function ChatViewer({ log, onToggleInspector, showInspector }: ChatViewerProps) {
  if (!log) {
    return (
      <div className="chat-container">
        <div className="chat-empty">
          <div className="chat-empty-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <h2>JSONL 파일을 업로드하세요</h2>
          <p>
            Claude, ChatGPT 등의 JSONL 대화 로그를 업로드하면
            Thinking, Tool Use, Tool Result가 분리되어 시각적으로 표시됩니다.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-container">
      <div className="chat-scroll">
        <div className="chat-content">
          {/* Header */}
          <header className="chat-header">
            <div className="chat-header-info">
              <h1>{log.name}</h1>
              <p>
                <span className="chat-header-badge">{log.sourceType}</span>
                {log.turns.length} turns
                <span style={{ opacity: 0.5, margin: "0 6px" }}>·</span>
                {log.createdAt}
              </p>
            </div>
            <div className="chat-header-actions">
              <button
                type="button"
                className="chat-header-btn"
                onClick={onToggleInspector}
                aria-label={showInspector ? "Close inspector" : "Open inspector"}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                </svg>
              </button>
            </div>
          </header>

          {/* Messages */}
          <div className="message-list">
            {log.turns.map((turn) => (
              <MessageView key={turn.id} turn={turn} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
