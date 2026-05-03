import { type ChangeEvent, useRef, useState } from "react";
import type { ParsedChatLog } from "../../types/chat-log";
import { parseJsonlToChatLog } from "../../lib/parsers/jsonl-parser";
import { addChatLog } from "../../lib/storage/chat-log-storage";

interface JsonlFileLoaderProps {
  onLoaded: (log: ParsedChatLog) => void;
}

export function JsonlFileLoader({ onLoaded }: JsonlFileLoaderProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [status, setStatus] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);

  async function handleFile(file: File): Promise<void> {
    setStatus("파일 분석 중...");

    const rawText = await file.text();
    const parsedLog = parseJsonlToChatLog(file.name, rawText);

    if (parsedLog.turns.length === 0) {
      setStatus("렌더링 가능한 대화 턴이 없습니다.");
      return;
    }

    addChatLog(parsedLog);
    onLoaded(parsedLog);

    setStatus(`${parsedLog.turns.length}개 턴을 성공적으로 불러왔습니다.`);
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
    if (file) {
      await handleFile(file);
    }
  }

  return (
    <section className="file-loader">
      <h2>JSONL 로그 불러오기</h2>
      <p>
        Claude / ChatGPT JSONL 파일을 브라우저에서 읽고 로컬에 저장합니다.
      </p>

      <input
        ref={inputRef}
        type="file"
        accept=".jsonl,.txt"
        className="hidden"
        onChange={handleChange}
      />

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className="file-loader-button"
        style={{
          borderColor: isDragging ? "var(--accent)" : undefined,
          background: isDragging ? "var(--accent-muted)" : undefined,
        }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ marginRight: 10, opacity: 0.7 }}
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
        파일 선택 또는 드래그 앤 드롭
      </button>

      {status ? (
        <div className="file-loader-status">
          {status}
        </div>
      ) : null}
    </section>
  );
}
