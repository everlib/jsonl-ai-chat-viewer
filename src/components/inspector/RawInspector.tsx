import { useMemo, useState } from "react";
import type { ParsedChatLog } from "../../types/chat-log";

interface RawInspectorProps {
  log: ParsedChatLog | null;
}

export function RawInspector({ log }: RawInspectorProps) {
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
    setStatus("RAW JSON 클립보드에 복사 완료");
    setTimeout(() => setStatus(""), 3000);
  }

  return (
    <section className="raw-inspector">
      <header className="raw-inspector-header">
        <div>
          <h2>RAW Inspector</h2>
          <p>로그의 정규화된 JSON 구조</p>
        </div>

        <button type="button" onClick={handleCopyRaw} disabled={!log}>
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
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
          JSON 복사
        </button>
      </header>

      {status ? <div className="raw-inspector-status">{status}</div> : null}

      <pre className="raw-inspector-body">
        {rawJson || (
          <span style={{ opacity: 0.5 }}>
            선택된 로그가 없습니다.
          </span>
        )}
      </pre>
    </section>
  );
}
