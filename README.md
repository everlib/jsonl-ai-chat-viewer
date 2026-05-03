# JSONL AI Chat Viewer

> **Nekoi 제작**  
> Claude / ChatGPT / 기타 AI JSONL 대화 로그를 실제 AI 채팅 UI처럼 렌더링하는 로컬 프론트엔드 뷰어

---

## 프로젝트 정보

| 항목 | 값 |
|---|---|
| Project | jsonl-ai-chat-viewer |
| Author | Nekoi |
| Version | 0.0.0 |
| Type | module |
| Runtime | Browser Frontend |
| Framework | Vite + React + TypeScript |
| Storage | localStorage |
| Server Required | No |
| Build Target | Static Web App |

---

## 목적

이 프로젝트는 AI 대화 로그 파일을 브라우저에서 직접 불러와서, 실제 AI 서비스 UI처럼 시각적으로 확인하기 위한 도구

주요 목적은 다음이에요.

| 목적 | 설명 |
|---|---|
| JSONL 로그 렌더링 | Claude / ChatGPT 계열 JSONL 로그를 줄 단위로 파싱 |
| 대화 UI 재현 | 사용자 프롬프트, AI 응답, thinking, tool_use, tool_result를 시각적으로 분리 |
| 로컬 처리 | 파일 업로드, 파싱, 저장, 출력까지 전부 프론트엔드에서 처리 |
| localStorage 저장 | 업로드한 로그를 브라우저 localStorage에 저장 |
| TXT / MD 가공 | 복사 가능한 TXT / Markdown 보고서 형태로 변환 |
| RAW 확인 | 정규화된 내부 JSON 구조를 Inspector로 확인 |
| 테마 지원 | 화이트 / 다크 테마 지원 |

---

## 핵심 기능

| 기능 | 상태 | 설명 |
|---|---:|---|
| JSONL 파일 업로드 | 지원 | `.jsonl`, `.txt` 파일 선택 가능 |
| 줄 단위 JSON 파싱 | 지원 | JSONL 각 줄을 독립 JSON으로 파싱 |
| Role 분리 | 지원 | user / assistant / system / tool / unknown |
| Block 분리 | 지원 | text / thinking / tool_use / tool_result / attachment / summary |
| Chat UI 렌더링 | 지원 | 실제 AI 대화형 UI로 표시 |
| Sidebar 세션 목록 | 지원 | 저장된 로그 선택 / 삭제 / 전체 삭제 |
| localStorage 저장 | 지원 | 서버 없이 브라우저 저장 |
| TXT Export | 지원 | 복사용 TXT 생성 / 다운로드 |
| MD Export | 지원 | 표 기반 Markdown 생성 / 다운로드 |
| RAW Inspector | 지원 | 정규화된 로그 JSON 확인 |
| Theme Toggle | 지원 | light / dark 전환 |
| 반응형 UI | 지원 | 데스크톱 / 태블릿 / 모바일 대응 |

---

## 사용 기술 및 버전

### Dependencies

| 패키지 | 버전 | 용도 |
|---|---:|---|
| react | ^19.2.5 | React UI |
| react-dom | ^19.2.5 | React DOM 렌더링 |
| lucide-react | ^1.14.0 | 아이콘 확장용 |
| clsx | ^2.1.1 | 조건부 className 구성 |

### Dev Dependencies

| 패키지 | 버전 | 용도 |
|---|---:|---|
| vite | ^8.0.10 | 개발 서버 / 빌드 |
| @vitejs/plugin-react | ^6.0.1 | React 플러그인 |
| typescript | ~6.0.2 | TypeScript 컴파일 |
| eslint | ^10.2.1 | 린트 |
| @eslint/js | ^10.0.1 | ESLint JS 규칙 |
| typescript-eslint | ^8.58.2 | TypeScript ESLint |
| eslint-plugin-react-hooks | ^7.1.1 | React Hooks 규칙 |
| eslint-plugin-react-refresh | ^0.5.2 | React Refresh 규칙 |
| globals | ^17.5.0 | 글로벌 환경 정의 |
| @types/node | ^24.12.2 | Node 타입 |
| @types/react | ^19.2.14 | React 타입 |
| @types/react-dom | ^19.2.3 | React DOM 타입 |

---

## 프로젝트 구조

```txt
jsonl-ai-chat-viewer/
├─ public/
├─ src/
│  ├─ components/
│  │  ├─ chat/
│  │  │  ├─ ChatLogViewer.tsx
│  │  │  └─ JsonlFileLoader.tsx
│  │  ├─ export/
│  │  │  └─ ExportPanel.tsx
│  │  ├─ inspector/
│  │  │  └─ RawInspector.tsx
│  │  ├─ layout/
│  │  │  └─ ThemeToggle.tsx
│  │  └─ sidebar/
│  │     └─ LogSidebar.tsx
│  ├─ lib/
│  │  ├─ export/
│  │  │  ├─ export-md.ts
│  │  │  └─ export-text.ts
│  │  ├─ parsers/
│  │  │  └─ jsonl-parser.ts
│  │  ├─ storage/
│  │  │  └─ chat-log-storage.ts
│  │  └─ utils/
│  │     └─ download-text.ts
│  ├─ types/
│  │  └─ chat-log.ts
│  ├─ App.tsx
│  ├─ index.css
│  └─ main.tsx
├─ README.md
├─ package.json
├─ tsconfig.json
└─ vite.config.ts

Made by Nekoi
Project: JSONL AI Chat Viewer
Version: 0.0.0
Stack: Vite + React + TypeScript