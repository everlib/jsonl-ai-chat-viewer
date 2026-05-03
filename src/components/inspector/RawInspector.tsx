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
    setStatus("RAW JSON 복사 완료");
  }

  return (
    <section className="raw-inspector">
      <header className="raw-inspector-header">
        <div>
          <h2>RAW Inspector</h2>
          <p>현재 선택된 로그의 정규화된 내부 구조를 확인합니다.</p>
        </div>

        <button type="button" onClick={handleCopyRaw} disabled={!log}>
          RAW 복사
        </button>
      </header>

      {status ? <p className="raw-inspector-status">{status}</p> : null}

      <pre className="raw-inspector-body">
        {rawJson || "선택된 로그가 없습니다."}
      </pre>
    </section>
  );
}
