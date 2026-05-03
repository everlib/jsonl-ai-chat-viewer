import type { ParsedChatLog } from "../../types/chat-log";

interface LogSidebarProps {
  logs: ParsedChatLog[];
  selectedLogId?: string;
  onSelect: (log: ParsedChatLog) => void;
  onRemove: (logId: string) => void;
  onClear: () => void;
}

export function LogSidebar({
  logs,
  selectedLogId,
  onSelect,
  onRemove,
  onClear,
}: LogSidebarProps) {
  return (
    <aside className="log-sidebar">
      <header className="log-sidebar-header">
        <div>
          <h2>세션 목록</h2>
          <p>{logs.length}개 로그 저장됨</p>
        </div>

        <button
          type="button"
          className="sidebar-clear-button"
          onClick={onClear}
          disabled={logs.length === 0}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ marginRight: 6 }}
          >
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          </svg>
          전체 삭제
        </button>
      </header>

      <div className="log-sidebar-list">
        {logs.length === 0 ? (
          <div className="log-sidebar-empty">
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ opacity: 0.3, marginBottom: 12 }}
            >
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
            </svg>
            <p>저장된 로그가 없습니다</p>
          </div>
        ) : (
          logs.map((log) => {
            const selected = log.id === selectedLogId;

            return (
              <article
                key={log.id}
                className={selected ? "log-sidebar-item selected" : "log-sidebar-item"}
              >
                <button
                  type="button"
                  className="log-sidebar-select"
                  onClick={() => onSelect(log)}
                >
                  <strong>{log.name}</strong>
                  <span>{log.turns.length} turns</span>
                  <small>{log.createdAt}</small>
                </button>

                <button
                  type="button"
                  className="log-sidebar-remove"
                  onClick={() => onRemove(log.id)}
                  aria-label={`${log.name} 삭제`}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </article>
            );
          })
        )}
      </div>
    </aside>
  );
}
