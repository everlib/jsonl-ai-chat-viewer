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
    setStatus(`${label} 복사 완료`);
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
    setStatus("TXT 다운로드 생성 완료");
  }

  function handleDownloadMarkdown(): void {
    if (!log) {
      setStatus("선택된 로그가 없습니다.");
      return;
    }

    downloadTextFile(`${getBaseName(log.name)}.md`, exportChatLogToMarkdown(log));
    setStatus("MD 다운로드 생성 완료");
  }

  return (
    <section className="export-panel">
      <header>
        <h2>TXT / MD 가공 출력</h2>
        <p>현재 선택된 로그를 복사용 TXT 또는 MD로 변환합니다.</p>
      </header>

      <div className="export-actions">
        <button type="button" onClick={handleCopyText} disabled={!log}>
          TXT 복사
        </button>

        <button type="button" onClick={handleDownloadText} disabled={!log}>
          TXT 다운로드
        </button>
      </div>

      <div className="export-actions">
        <button type="button" onClick={handleCopyMarkdown} disabled={!log}>
          MD 복사
        </button>

        <button type="button" onClick={handleDownloadMarkdown} disabled={!log}>
          MD 다운로드
        </button>
      </div>

      {status ? <p className="export-status">{status}</p> : null}
    </section>
  );
}
