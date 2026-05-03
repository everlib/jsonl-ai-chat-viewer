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
          <p>{logs.length}개 로그</p>
        </div>

        <button
          type="button"
          className="sidebar-clear-button"
          onClick={onClear}
          disabled={logs.length === 0}
        >
          전체 삭제
        </button>
      </header>

      <div className="log-sidebar-list">
        {logs.length === 0 ? (
          <p className="log-sidebar-empty">저장된 로그가 없습니다.</p>
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
                >
                  삭제
                </button>
              </article>
            );
          })
        )}
      </div>
    </aside>
  );
}
