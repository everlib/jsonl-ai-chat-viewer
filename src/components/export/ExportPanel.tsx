import { useState } from "react";
import type { ParsedChatLog } from "../../types/chat-log";
import { exportChatLogToText } from "../../lib/export/export-text";
import { exportChatLogToMarkdown } from "../../lib/export/export-md";
import { downloadTextFile } from "../../lib/utils/download-text";

interface ExportPanelProps {
  log: ParsedChatLog | null;
}

function getBaseName(fileName: string): string {
  return fileName.replace(/\.[^.]+$/, "");
}

export function ExportPanel({ log }: ExportPanelProps) {
  const [status, setStatus] = useState("");

  async function copyText(value: string, label: string): Promise<void> {
    await navigator.clipboard.writeText(value);
    setStatus(`${label} 클립보드에 복사 완료`);
    setTimeout(() => setStatus(""), 3000);
  }

  async function handleCopyText(): Promise<void> {
    if (!log) {
      setStatus("선택된 로그가 없습니다.");
      return;
    }

    await copyText(exportChatLogToText(log), "TXT");
  }

  async function handleCopyMarkdown(): Promise<void> {
    if (!log) {
      setStatus("선택된 로그가 없습니다.");
      return;
    }

    await copyText(exportChatLogToMarkdown(log), "MD");
  }

  function handleDownloadText(): void {
    if (!log) {
      setStatus("선택된 로그가 없습니다.");
      return;
    }

    downloadTextFile(`${getBaseName(log.name)}.txt`, exportChatLogToText(log));
    setStatus("TXT 파일 다운로드 완료");
    setTimeout(() => setStatus(""), 3000);
  }

  function handleDownloadMarkdown(): void {
    if (!log) {
      setStatus("선택된 로그가 없습니다.");
      return;
    }

    downloadTextFile(`${getBaseName(log.name)}.md`, exportChatLogToMarkdown(log));
    setStatus("MD 파일 다운로드 완료");
    setTimeout(() => setStatus(""), 3000);
  }

  return (
    <section className="export-panel">
      <header>
        <h2>TXT / MD 내보내기</h2>
        <p>현재 선택된 로그를 복사하거나 다운로드합니다.</p>
      </header>

      <div className="export-actions">
        <button type="button" onClick={handleCopyText} disabled={!log}>
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
          TXT 복사
        </button>

        <button type="button" onClick={handleDownloadText} disabled={!log}>
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
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          TXT 다운로드
        </button>
      </div>

      <div className="export-actions">
        <button type="button" onClick={handleCopyMarkdown} disabled={!log}>
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
          MD 복사
        </button>

        <button type="button" onClick={handleDownloadMarkdown} disabled={!log}>
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
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          MD 다운로드
        </button>
      </div>

      {status ? <div className="export-status">{status}</div> : null}
    </section>
  );
}
