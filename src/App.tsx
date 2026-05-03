import { useEffect, useState } from "react";
import type { ParsedChatLog } from "./types/chat-log";
import { JsonlFileLoader } from "./components/chat/JsonlFileLoader";
import { ChatLogViewer } from "./components/chat/ChatLogViewer";
import { LogSidebar } from "./components/sidebar/LogSidebar";
import { ExportPanel } from "./components/export/ExportPanel";
import { RawInspector } from "./components/inspector/RawInspector";
import { ThemeToggle } from "./components/layout/ThemeToggle";
import {
  clearChatLogs,
  loadChatLogs,
  removeChatLog,
} from "./lib/storage/chat-log-storage";
import "./index.css";

export default function App() {
  const [logs, setLogs] = useState<ParsedChatLog[]>([]);
  const [selectedLog, setSelectedLog] = useState<ParsedChatLog | null>(null);
  const [showInspector, setShowInspector] = useState(false);

  useEffect(() => {
    const savedLogs = loadChatLogs();

    setLogs(savedLogs);
    setSelectedLog(savedLogs[0] ?? null);
  }, []);

  function handleLoaded(log: ParsedChatLog): void {
    const nextLogs = loadChatLogs();

    setLogs(nextLogs);
    setSelectedLog(log);
  }

  function handleSelect(log: ParsedChatLog): void {
    setSelectedLog(log);
  }

  function handleRemove(logId: string): void {
    const nextLogs = removeChatLog(logId);

    setLogs(nextLogs);

    if (selectedLog?.id === logId) {
      setSelectedLog(nextLogs[0] ?? null);
    }
  }

  function handleClear(): void {
    clearChatLogs();
    setLogs([]);
    setSelectedLog(null);
  }

  return (
    <div className="app-shell">
      <LogSidebar
        logs={logs}
        selectedLogId={selectedLog?.id}
        onSelect={handleSelect}
        onRemove={handleRemove}
        onClear={handleClear}
      />

      <section className="app-main">
        <header className="app-toolbar">
          <div>
            <h1>JSONL AI Chat Viewer</h1>
            <p>JSONL 로그를 AI 대화 UI로 렌더링합니다.</p>
          </div>

          <div className="app-toolbar-actions">
            <button
              type="button"
              className="inspector-toggle"
              onClick={() => setShowInspector((current) => !current)}
            >
              {showInspector ? "Inspector 닫기" : "Inspector 열기"}
            </button>

            <ThemeToggle />
          </div>
        </header>

        <div className="top-panel">
          <JsonlFileLoader onLoaded={handleLoaded} />
          <ExportPanel log={selectedLog} />
        </div>

        <div className={showInspector ? "content-grid inspector-open" : "content-grid"}>
          <ChatLogViewer log={selectedLog} />

          {showInspector ? <RawInspector log={selectedLog} /> : null}
        </div>
      </section>
    </div>
  );
}
