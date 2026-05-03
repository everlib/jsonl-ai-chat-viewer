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
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const savedLogs = loadChatLogs();

    setLogs(savedLogs);
    setSelectedLog(savedLogs[0] ?? null);
  }, []);

  // Auto-hide sidebar on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  function handleLoaded(log: ParsedChatLog): void {
    const nextLogs = loadChatLogs();

    setLogs(nextLogs);
    setSelectedLog(log);
  }

  function handleSelect(log: ParsedChatLog): void {
    setSelectedLog(log);
    // Close sidebar on mobile after selection
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
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
      {sidebarOpen && (
        <LogSidebar
          logs={logs}
          selectedLogId={selectedLog?.id}
          onSelect={handleSelect}
          onRemove={handleRemove}
          onClear={handleClear}
        />
      )}

      <section className="app-main">
        <header className="app-toolbar">
          <div>
            <h1>JSONL AI Chat Viewer</h1>
            <p>AI 대화 로그를 시각적으로 분석하고 내보내기</p>
          </div>

          <div className="app-toolbar-actions">
            <button
              type="button"
              className="inspector-toggle"
              onClick={() => setSidebarOpen((current) => !current)}
              aria-label={sidebarOpen ? "사이드바 닫기" : "사이드바 열기"}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <line x1="9" y1="3" x2="9" y2="21" />
              </svg>
              <span className="sr-only">{sidebarOpen ? "사이드바 닫기" : "사이드바 열기"}</span>
            </button>

            <button
              type="button"
              className="inspector-toggle"
              onClick={() => setShowInspector((current) => !current)}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
              {showInspector ? "Inspector" : "Inspector"}
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
