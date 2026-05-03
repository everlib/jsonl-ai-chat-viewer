import { type ChangeEvent, useRef, useState } from "react";
import type { ParsedChatLog } from "../../types/chat-log";
import { exportChatLogToText } from "../../lib/export/export-text";
import { exportChatLogToMarkdown } from "../../lib/export/export-md";
import { downloadTextFile } from "../../lib/utils/download-text";

interface SidebarProps {
  logs: ParsedChatLog[];
  selectedLogId?: string;
  isOpen: boolean;
  onSelect: (log: ParsedChatLog) => void;
  onRemove: (logId: string) => void;
  onClear: () => void;
  onFileUpload: (file: File) => Promise<string>;
  onClose: () => void;
  theme: "light" | "dark";
  onThemeToggle: () => void;
  selectedLog: ParsedChatLog | null;
}

function getBaseName(fileName: string): string {
  return fileName.replace(/\.[^.]+$/, "");
}

export function Sidebar({
  logs,
  selectedLogId,
  isOpen,
  onSelect,
  onRemove,
  onClear,
  onFileUpload,
  onClose,
  theme,
  onThemeToggle,
  selectedLog,
}: SidebarProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [exportStatus, setExportStatus] = useState("");

  async function handleFile(file: File): Promise<void> {
    setUploadStatus("분석 중...");
    const result = await onFileUpload(file);
    setUploadStatus(result);
    setTimeout(() => setUploadStatus(""), 3000);
  }

  async function handleChange(event: ChangeEvent<HTMLInputElement>): Promise<void> {
    const file = event.target.files?.[0];
    if (!file) return;
    await handleFile(file);
    event.target.value = "";
  }

  function handleDragOver(e: React.DragEvent): void {
    e.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave(e: React.DragEvent): void {
    e.preventDefault();
    setIsDragging(false);
  }

  async function handleDrop(e: React.DragEvent): Promise<void> {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) await handleFile(file);
  }

  function handleExport(type: "txt" | "md"): void {
    if (!selectedLog) return;
    const content = type === "txt" 
      ? exportChatLogToText(selectedLog) 
      : exportChatLogToMarkdown(selectedLog);
    const ext = type === "txt" ? ".txt" : ".md";
    downloadTextFile(`${getBaseName(selectedLog.name)}${ext}`, content);
    setExportStatus(`${type.toUpperCase()} 다운로드 완료`);
    setTimeout(() => setExportStatus(""), 2000);
  }

  async function handleCopy(type: "txt" | "md"): Promise<void> {
    if (!selectedLog) return;
    const content = type === "txt"
      ? exportChatLogToText(selectedLog)
      : exportChatLogToMarkdown(selectedLog);
    await navigator.clipboard.writeText(content);
    setExportStatus(`${type.toUpperCase()} 복사 완료`);
    setTimeout(() => setExportStatus(""), 2000);
  }

  return (
    <aside className={isOpen ? "sidebar open" : "sidebar"}>
      {/* Header */}
      <header className="sidebar-header">
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <h1>Chat Viewer</h1>
        </div>
        <div className="sidebar-actions">
          <button
            type="button"
            className="sidebar-action-btn"
            onClick={onThemeToggle}
            aria-label={theme === "dark" ? "라이트 모드" : "다크 모드"}
          >
            {theme === "dark" ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>
          <button
            type="button"
            className="sidebar-action-btn"
            onClick={onClose}
            aria-label="Close sidebar"
            style={{ display: "none" }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      </header>

      {/* Upload Section */}
      <div className="sidebar-upload">
        <input
          ref={inputRef}
          type="file"
          accept=".jsonl,.txt"
          className="hidden"
          onChange={handleChange}
        />
        <button
          type="button"
          className={isDragging ? "upload-dropzone dragging" : "upload-dropzone"}
          onClick={() => inputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          JSONL 업로드
        </button>
        {uploadStatus && <div className="upload-status">{uploadStatus}</div>}
      </div>

      {/* Session List */}
      <div className="sidebar-sessions">
        <div className="sidebar-section-header">
          <span>세션 ({logs.length})</span>
          {logs.length > 0 && (
            <button type="button" onClick={onClear}>
              전체 삭제
            </button>
          )}
        </div>

        {logs.length === 0 ? (
          <div className="session-empty">
            <p>JSONL 파일을 업로드하면<br />여기에 세션이 표시됩니다</p>
          </div>
        ) : (
          <div className="session-list">
            {logs.map((log) => (
              <div
                key={log.id}
                className={log.id === selectedLogId ? "session-item active" : "session-item"}
              >
                <button
                  type="button"
                  className="session-item-content"
                  onClick={() => onSelect(log)}
                >
                  <div className="session-item-title">{log.name}</div>
                  <div className="session-item-meta">
                    <span>{log.turns.length} turns</span>
                    <span>{log.createdAt}</span>
                  </div>
                </button>
                <button
                  type="button"
                  className="session-item-delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemove(log.id);
                  }}
                  aria-label={`${log.name} 삭제`}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer - Export */}
      <div className="sidebar-footer">
        {exportStatus && (
          <div className="upload-status" style={{ marginBottom: 8 }}>
            {exportStatus}
          </div>
        )}
        <div className="sidebar-footer-grid">
          <button
            type="button"
            className="sidebar-footer-btn"
            onClick={() => handleCopy("txt")}
            disabled={!selectedLog}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
            TXT
          </button>
          <button
            type="button"
            className="sidebar-footer-btn"
            onClick={() => handleExport("txt")}
            disabled={!selectedLog}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            TXT
          </button>
          <button
            type="button"
            className="sidebar-footer-btn"
            onClick={() => handleCopy("md")}
            disabled={!selectedLog}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
            MD
          </button>
          <button
            type="button"
            className="sidebar-footer-btn"
            onClick={() => handleExport("md")}
            disabled={!selectedLog}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            MD
          </button>
        </div>
      </div>
    </aside>
  );
}
