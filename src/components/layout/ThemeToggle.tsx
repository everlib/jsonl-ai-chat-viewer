import { useEffect, useState } from "react";

type ThemeMode = "light" | "dark";

const STORAGE_KEY = "jsonl-ai-chat-viewer.theme";

function getInitialTheme(): ThemeMode {
  const saved = localStorage.getItem(STORAGE_KEY);

  if (saved === "light" || saved === "dark") {
    return saved;
  }

  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  return prefersDark ? "dark" : "light";
}

function applyTheme(theme: ThemeMode): void {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem(STORAGE_KEY, theme);
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<ThemeMode>(() => getInitialTheme());

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  function handleToggle(): void {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  }

  return (
    <button type="button" className="theme-toggle" onClick={handleToggle}>
      {theme === "dark" ? "화이트" : "다크"}
    </button>
  );
}
