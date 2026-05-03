import { type ChangeEvent, useRef, useState, useEffect } from "react";
import type { ParsedChatLog } from "../../types";
import {
  exportChatLogToText,
  exportChatLogToMarkdown,
  downloadTextFile,
} from "../../lib";

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function HelpModal({ isOpen, onClose }: HelpModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <header className="modal-header">
          <h2>JSONL AI Chat Viewer</h2>
          <button type="button" className="modal-close" onClick={onClose} aria-label="Close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </header>

        <div className="modal-body">
          <section className="help-section">
            <h3>사용 방법</h3>
            <ol>
              <li>
                <strong>JSONL 파일 업로드</strong>
                <p>사이드바의 "JSONL 업로드" 버튼을 클릭하거나 파일을 드래그 앤 드롭하세요.</p>
              </li>
              <li>
                <strong>세션 선택</strong>
                <p>업로드된 세션 목록에서 원하는 세션을 클릭하면 대화 내용이 표시됩니다.</p>
              </li>
              <li>
                <strong>대화 탐색</strong>
                <p>Thinking, Tool Use 블록은 접기/펼치기가 가능합니다. 클릭하여 상세 내용을 확인하세요.</p>
              </li>
              <li>
                <strong>내보내기</strong>
                <p>사이드바 하단의 버튼으로 TXT/Markdown 형식으로 복사하거나 다운로드할 수 있습니다.</p>
              </li>
              <li>
                <strong>RAW JSON 보기</strong>
                <p>상단의 문서 아이콘을 클릭하면 원본 JSON 데이터를 확인할 수 있습니다.</p>
              </li>
            </ol>
          </section>

          <section className="help-section">
            <h3>지원 형식</h3>
            <ul>
              <li>Claude Code 세션 로그 (.jsonl)</li>
              <li>일반 AI 대화 로그 (user/assistant 구조)</li>
            </ul>
          </section>

          <section className="help-section">
            <h3>메시지 구분</h3>
            <ul>
              <li><span className="help-badge user">User</span> 실제 사용자가 입력한 프롬프트</li>
              <li><span className="help-badge assistant">Assistant</span> AI 응답 (텍스트, Thinking, Tool Use 포함)</li>
              <li><span className="help-badge system">System</span> 시스템 메시지 및 Hook 피드백</li>
            </ul>
          </section>

          <section className="help-section about">
            <h3>제작자 정보</h3>
            <div className="about-info">
              <p><strong>Nekoi</strong></p>
              <div className="about-links">
                <a href="https://github.com/everlib/jsonl-ai-chat-viewer" target="_blank" rel="noopener noreferrer">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  GitHub
                </a>
                <a href="https://everlib.pro/" target="_blank" rel="noopener noreferrer">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="2" y1="12" x2="22" y2="12" />
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                  </svg>
                  everlib.pro
                </a>
                <a href="mailto:nekoi@everlib.pro">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  nekoi@everlib.pro
                </a>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

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
  const [showHelp, setShowHelp] = useState(false);

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
    <>
    <HelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} />
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
            onClick={() => setShowHelp(true)}
            aria-label="도움말"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </button>
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
    </>
  );
}
