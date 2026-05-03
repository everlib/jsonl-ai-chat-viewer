import { useMemo, useState } from "react";
import type { ParsedChatLog } from "../../types";

interface InspectorPanelProps {
  log: ParsedChatLog | null;
}

export function InspectorPanel({ log }: InspectorPanelProps) {
  const [status, setStatus] = useState("");

  const rawJson = useMemo(() => {
    if (!log) return "";
    return JSON.stringify(log, null, 2);
  }, [log]);

  async function handleCopyRaw(): Promise<void> {
    if (!rawJson) {
      setStatus("선택된 로그가 없습니다.");
      return;
    }

    await navigator.clipboard.writeText(rawJson);
    setStatus("JSON 복사 완료");
    setTimeout(() => setStatus(""), 2000);
  }

  return (
    <aside className="inspector-panel">
      <header className="inspector-header">
        <h2>RAW Inspector</h2>
        <div className="inspector-header-actions">
          <button
            type="button"
            className="inspector-btn"
            onClick={handleCopyRaw}
            disabled={!log}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
            복사
          </button>
        </div>
      </header>

      {status && <div className="inspector-status">{status}</div>}

      <pre className="inspector-body">
        {rawJson || (
          <span style={{ opacity: 0.5 }}>
            선택된 로그가 없습니다.
          </span>
        )}
      </pre>
    </aside>
  );
}
