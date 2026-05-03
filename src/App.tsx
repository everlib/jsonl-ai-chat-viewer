import { useEffect, useState } from "react";
import type { ParsedChatLog } from "./types/chat-log";
import { ChatViewer } from "./components/chat/ChatViewer";
import { Sidebar } from "./components/sidebar/Sidebar";
import { InspectorPanel } from "./components/inspector/InspectorPanel";
import {
  clearChatLogs,
  loadChatLogs,
  removeChatLog,
  addChatLog,
} from "./lib/storage/chat-log-storage";
import { parseJsonlToChatLog } from "./lib/parsers/jsonl-parser";
import "./index.css";

export default function App() {
  const [logs, setLogs] = useState<ParsedChatLog[]>([]);
  const [selectedLog, setSelectedLog] = useState<ParsedChatLog | null>(null);
  const [showInspector, setShowInspector] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    const saved = localStorage.getItem("jsonl-ai-chat-viewer.theme");
    if (saved === "light" || saved === "dark") return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });

  useEffect(() => {
    const savedLogs = loadChatLogs();
    setLogs(savedLogs);
    setSelectedLog(savedLogs[0] ?? null);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("jsonl-ai-chat-viewer.theme", theme);
  }, [theme]);

  // Desktop: sidebar always visible
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setSidebarOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  async function handleFileUpload(file: File): Promise<string> {
    const rawText = await file.text();
    const parsedLog = parseJsonlToChatLog(file.name, rawText);

    if (parsedLog.turns.length === 0) {
      return "렌더링 가능한 대화 턴이 없습니다.";
    }

    addChatLog(parsedLog);
    const nextLogs = loadChatLogs();
    setLogs(nextLogs);
    setSelectedLog(parsedLog);

    if (window.innerWidth <= 768) {
      setSidebarOpen(false);
    }

    return `${parsedLog.turns.length}개 턴을 성공적으로 불러왔습니다.`;
  }

  function handleSelect(log: ParsedChatLog): void {
    setSelectedLog(log);
    if (window.innerWidth <= 768) {
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
      {/* Mobile Sidebar Overlay */}
      <div
        className={sidebarOpen ? "sidebar-overlay visible" : "sidebar-overlay"}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <Sidebar
        logs={logs}
        selectedLogId={selectedLog?.id}
        isOpen={sidebarOpen}
        onSelect={handleSelect}
        onRemove={handleRemove}
        onClear={handleClear}
        onFileUpload={handleFileUpload}
        onClose={() => setSidebarOpen(false)}
        theme={theme}
        onThemeToggle={() => setTheme(t => t === "dark" ? "light" : "dark")}
        selectedLog={selectedLog}
      />

      {/* Main Content */}
      <main className="app-main">
        {/* Mobile Header */}
        <header className="mobile-header">
          <div className="mobile-header-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            Chat Viewer
          </div>
          <div className="mobile-header-actions">
            <button
              type="button"
              className="mobile-menu-btn"
              onClick={() => setShowInspector(prev => !prev)}
              aria-label="Toggle inspector"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
            </button>
            <button
              type="button"
              className="mobile-menu-btn"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          </div>
        </header>

        <ChatViewer
          log={selectedLog}
          onToggleInspector={() => setShowInspector(prev => !prev)}
          showInspector={showInspector}
        />
      </main>

      {/* Inspector Panel */}
      {showInspector && <InspectorPanel log={selectedLog} />}
    </div>
  );
}
