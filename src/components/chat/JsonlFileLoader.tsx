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

  async function handleFile(file: File): Promise<void> {
    setStatus("파일 읽는 중");

    const rawText = await file.text();
    const parsedLog = parseJsonlToChatLog(file.name, rawText);

    if (parsedLog.turns.length === 0) {
      setStatus("렌더링 가능한 대화 턴이 없습니다.");
      return;
    }

    addChatLog(parsedLog);
    onLoaded(parsedLog);

    setStatus(`${parsedLog.turns.length}개 턴 불러옴`);
  }

  async function handleChange(event: ChangeEvent<HTMLInputElement>): Promise<void> {
    const file = event.target.files?.[0];

    if (!file) return;

    await handleFile(file);

    event.target.value = "";
  }

  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mb-3">
        <h2 className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
          JSONL 로그 불러오기
        </h2>
        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
          Claude / ChatGPT JSONL 파일을 브라우저에서만 읽고 localStorage에 저장합니다.
        </p>
      </div>

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
        className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm font-medium text-zinc-800 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-900"
      >
        파일 선택
      </button>

      {status ? (
        <p className="mt-3 text-xs text-zinc-500 dark:text-zinc-400">
          {status}
        </p>
      ) : null}
    </section>
  );
}
