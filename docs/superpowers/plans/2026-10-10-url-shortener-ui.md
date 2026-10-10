# URL Shortener UI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** One-page Next.js UI that shortens a URL through the existing backend and lets the user copy the result.

**Architecture:** Next.js App Router SPA-like page. A rewrite proxies `/api/*` to the backend. A small `features/shorten/api.ts` wraps the call. One client component holds form state. UI uses shadcn/ui components styled with Tailwind.

**Tech Stack:** Next.js, TypeScript, Tailwind CSS, shadcn/ui, Jest (`next/jest`), React Testing Library.

**Spec:** `docs/superpowers/specs/2026-10-10-url-shortener-ui-design.md`

## Global Constraints

- Backend base URL: `http://localhost:8080`, read from env var `API_URL`.
- Browser calls only `/api/links` on its own origin (no direct calls to :8080).
- UI components come from shadcn/ui: `button`, `input`, `card`. Styling with Tailwind only, no extra CSS files.
- Error copy is exact: `That URL isn't valid`, `Can't reach server`, `Something went wrong. Try again`.
- Folder layout: group by feature under `features/<name>/` (UI, API calls, tests together, flat). Shared code only in `components/ui/` and `lib/utils.ts`. Tests sit beside the file they test.
- Unit test coverage threshold: 80% global (statements, branches, functions, lines) for `features/**`, enforced by `npm run test:coverage`. `components/ui/` (generated) is excluded.
- Package manager: `npm`.
- Project root is the current directory `url-shortener-ui` (it already holds `.claude/` and `docs/`).

---

### Task 1: Scaffold project, shadcn, and Jest

**Files:**

- Create: whole Next.js scaffold, `components.json`, `components/ui/{button,input,card}.tsx`, `jest.config.mjs`, `jest.setup.ts`
- Modify: `package.json` (add `test` script)

**Interfaces:**

- Produces: `@/components/ui/button` (`Button`), `@/components/ui/input` (`Input`), `@/components/ui/card` (`Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`); `npm test` runs Jest; alias `@/*` → project root.

- [ ] **Step 1: Init git**

```bash
git init
```

- [ ] **Step 2: Scaffold Next.js in place**

```bash
npx create-next-app@latest . --ts --tailwind --eslint --app --no-src-dir --import-alias "@/*" --use-npm --yes
```

Expected: `app/`, `package.json`, `next.config.ts` created. The repo already has a `.gitignore` with AI agent entries (`.claude/`, `CLAUDE.md`, `AGENTS.md`, ...). If `create-next-app` replaced it, restore those entries. Keep Next.js defaults too (`node_modules`, `.next`, `.env*`). If it refuses because the directory is not empty, run it in a temp dir inside the scratchpad and copy the files over, keeping `.claude/` and `docs/`.

- [ ] **Step 3: Init shadcn and add components**

```bash
npx shadcn@latest init -d
npx shadcn@latest add button input card
```

Expected: `components.json`, `lib/utils.ts`, and the three files in `components/ui/`.

- [ ] **Step 4: Install test deps**

```bash
npm i -D jest jest-environment-jsdom @types/jest @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

- [ ] **Step 5: Create `jest.config.mjs`**

```js
import nextJest from "next/jest.js";

const createJestConfig = nextJest({ dir: "./" });

export default createJestConfig({
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: { "^@/(.*)$": "<rootDir>/$1" },
  collectCoverageFrom: ["features/**/*.{ts,tsx}", "!**/*.test.{ts,tsx}"],
  coverageThreshold: {
    global: { statements: 80, branches: 80, functions: 80, lines: 80 },
  },
});
```

- [ ] **Step 6: Create `jest.setup.ts`**

```ts
import "@testing-library/jest-dom";
```

- [ ] **Step 7: Add test script to `package.json`**

In `"scripts"` add: `"test": "jest"` and `"test:coverage": "jest --coverage"`. `test:coverage` fails if any global metric is below 80%.

- [ ] **Step 8: Verify build and tooling**

Run: `npm run build && npx jest --passWithNoTests`
Expected: build succeeds, Jest exits 0 with no tests.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "chore: scaffold Next.js, Tailwind, shadcn, Jest"
```

---

### Task 2: API proxy and `createLink`

**Files:**

- Modify: `next.config.ts`
- Create: `features/shorten/api.ts`
- Test: `features/shorten/api.test.ts`

**Interfaces:**

- Produces: `type LinkResponse = { id: string; slug: string; shortUrl: string; targetUrl: string; active: boolean; expiresAt?: string | null; createdAt: string }`; `createLink(targetUrl: string): Promise<LinkResponse>` — throws `Error` with the exact copy from Global Constraints.

- [ ] **Step 1: Write the failing test `features/shorten/api.test.ts`**

```ts
import { createLink } from "@/features/shorten/api";

const link = {
  id: "1",
  slug: "abc123",
  shortUrl: "http://localhost:8080/abc123",
  targetUrl: "https://example.com",
  active: true,
  createdAt: "2026-10-10T00:00:00Z",
};

// jsdom has no Response, so fetch returns plain objects.
const reply = (status: number, body: unknown = {}) => ({
  ok: status >= 200 && status < 300,
  status,
  json: async () => body,
});

const fetchMock = jest.fn();
beforeEach(() => {
  fetchMock.mockReset();
  global.fetch = fetchMock as unknown as typeof fetch;
});

describe("createLink", () => {
  it("posts the URL and returns the link", async () => {
    fetchMock.mockResolvedValue(reply(201, link));

    await expect(createLink("https://example.com")).resolves.toEqual(link);
    expect(fetchMock).toHaveBeenCalledWith("/api/links", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ targetUrl: "https://example.com" }),
    });
  });

  it("maps 400 to the invalid URL message", async () => {
    fetchMock.mockResolvedValue(reply(400));
    await expect(createLink("nope")).rejects.toThrow("That URL isn't valid");
  });

  it("maps other failures to the generic message", async () => {
    fetchMock.mockResolvedValue(reply(500));
    await expect(createLink("https://example.com")).rejects.toThrow(
      "Something went wrong. Try again",
    );
  });

  it("maps a network error to the unreachable message", async () => {
    fetchMock.mockRejectedValue(new TypeError("fail"));
    await expect(createLink("https://example.com")).rejects.toThrow("Can't reach server");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx jest features/shorten/api.test.ts`
Expected: FAIL, cannot resolve `@/features/shorten/api`.

- [ ] **Step 3: Create `features/shorten/api.ts`**

```ts
export type LinkResponse = {
  id: string;
  slug: string;
  shortUrl: string;
  targetUrl: string;
  active: boolean;
  expiresAt?: string | null;
  createdAt: string;
};

export async function createLink(targetUrl: string): Promise<LinkResponse> {
  let res: Response;
  try {
    res = await fetch("/api/links", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ targetUrl }),
    });
  } catch {
    throw new Error("Can't reach server");
  }
  if (res.status === 400) throw new Error("That URL isn't valid");
  if (!res.ok) throw new Error("Something went wrong. Try again");
  return res.json();
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx jest features/shorten/api.test.ts`
Expected: 4 passed.

- [ ] **Step 5: Add the rewrite in `next.config.ts`**

Replace the file content with:

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.API_URL ?? "http://localhost:8080"}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
```

- [ ] **Step 6: Verify the proxy against the live backend**

Run (second terminal): `npm run dev`, then
`curl -s -X POST localhost:3000/api/links -H 'Content-Type: application/json' -d '{"targetUrl":"https://example.com"}'`
Expected: JSON with `slug` and `shortUrl`. Stop the dev server.

- [ ] **Step 7: Commit**

```bash
git add features next.config.ts
git commit -m "feat: add createLink and /api proxy rewrite"
```

---

### Task 3: `ShortenForm` component

**Files:**

- Create: `features/shorten/shorten-form.tsx`
- Test: `features/shorten/shorten-form.test.tsx`

**Interfaces:**

- Consumes: `createLink`, `LinkResponse` from `@/features/shorten/api`; `Button`, `Input` from `@/components/ui/*`.
- Produces: `export function ShortenForm()` — no props.

- [ ] **Step 1: Write the failing test `features/shorten/shorten-form.test.tsx`**

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ShortenForm } from "@/features/shorten/shorten-form";

const link = {
  id: "1",
  slug: "abc123",
  shortUrl: "http://localhost:8080/abc123",
  targetUrl: "https://example.com",
  active: true,
  createdAt: "2026-10-10T00:00:00Z",
};

// jsdom has no Response, so fetch returns plain objects.
const reply = (status: number, body: unknown = {}) => ({
  ok: status >= 200 && status < 300,
  status,
  json: async () => body,
});

const fetchMock = jest.fn();
beforeEach(() => {
  fetchMock.mockReset();
  global.fetch = fetchMock as unknown as typeof fetch;
});

async function submit(url: string) {
  const user = userEvent.setup();
  render(<ShortenForm />);
  await user.type(screen.getByLabelText("URL to shorten"), url);
  await user.click(screen.getByRole("button", { name: "Shorten" }));
}

describe("ShortenForm", () => {
  it("shows the short link on success", async () => {
    fetchMock.mockResolvedValue(reply(201, link));
    await submit("https://example.com");
    expect(await screen.findByText(link.shortUrl)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Copy" })).toBeInTheDocument();
  });

  it("shows an error on 400", async () => {
    fetchMock.mockResolvedValue(reply(400));
    await submit("nope");
    expect(await screen.findByRole("alert")).toHaveTextContent("That URL isn't valid");
  });

  it("copies the link and shows the expiry date", async () => {
    fetchMock.mockResolvedValue(reply(201, { ...link, expiresAt: "2030-01-01T00:00:00Z" }));
    const user = userEvent.setup();
    render(<ShortenForm />);
    await user.type(screen.getByLabelText("URL to shorten"), "https://example.com");
    await user.click(screen.getByRole("button", { name: "Shorten" }));
    await user.click(await screen.findByRole("button", { name: "Copy" }));
    expect(await screen.findByRole("button", { name: "Copied" })).toBeInTheDocument();
    expect(screen.getByText(/Expires/)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx jest features/shorten/shorten-form.test.tsx`
Expected: FAIL, cannot resolve `@/features/shorten/shorten-form`.

- [ ] **Step 3: Create `features/shorten/shorten-form.tsx`**

```tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createLink, type LinkResponse } from "@/features/shorten/api";

export function ShortenForm() {
  const [url, setUrl] = useState("");
  const [link, setLink] = useState<LinkResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setLink(null);
    try {
      setLink(await createLink(url.trim()));
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  async function copy() {
    if (!link) return;
    await navigator.clipboard.writeText(link.shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="space-y-4">
      <form onSubmit={onSubmit} className="flex flex-col gap-2 sm:flex-row">
        <Input
          aria-label="URL to shorten"
          type="text"
          autoFocus
          placeholder="https://example.com/very/long/link"
          className="h-11"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          disabled={loading}
          required
        />
        <Button type="submit" className="h-11 px-6" disabled={loading || !url.trim()}>
          {loading ? "Shortening…" : "Shorten"}
        </Button>
      </form>

      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}

      <div aria-live="polite">
        {link && (
          <div className="flex items-center justify-between gap-2 rounded-md border p-3">
            <div className="min-w-0">
              <a
                href={link.shortUrl}
                target="_blank"
                rel="noreferrer"
                className="block truncate font-medium underline-offset-4 hover:underline"
              >
                {link.shortUrl}
              </a>
              {link.expiresAt && (
                <p className="text-xs text-muted-foreground">
                  Expires {new Date(link.expiresAt).toLocaleDateString()}
                </p>
              )}
            </div>
            <Button type="button" variant="outline" className="h-11" onClick={copy}>
              {copied ? "Copied" : "Copy"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx jest features/shorten/shorten-form.test.tsx`
Expected: 3 passed.

- [ ] **Step 5: Commit**

```bash
git add features/shorten/shorten-form.tsx features/shorten/shorten-form.test.tsx
git commit -m "feat: add ShortenForm component"
```

---

### Task 4: Page and end-to-end check

**Files:**

- Modify: `app/page.tsx`, `app/layout.tsx` (title/description only)

**Interfaces:**

- Consumes: `ShortenForm` from `@/features/shorten/shorten-form`; `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent` from `@/components/ui/card`.

- [ ] **Step 1: Replace `app/page.tsx`**

```tsx
import { ShortenForm } from "@/features/shorten/shorten-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-xl">
        <CardHeader>
          <CardTitle className="text-2xl">Shorten a link</CardTitle>
          <CardDescription>Paste a long URL and get a short one.</CardDescription>
        </CardHeader>
        <CardContent>
          <ShortenForm />
        </CardContent>
      </Card>
    </main>
  );
}
```

- [ ] **Step 2: Set metadata in `app/layout.tsx`**

Set `metadata` to `{ title: "URL Shortener", description: "Shorten long links." }`.

- [ ] **Step 3: Run all checks**

Run: `npm run test:coverage && npm run lint && npm run build`
Expected: all tests pass, coverage at or above 80% on all four metrics, lint clean, build succeeds.

- [ ] **Step 4: Manual end-to-end check**

Run `npm run dev`, open `http://localhost:3000` (backend must run on :8080). Verify:

1. Enter `https://example.com`, click Shorten → short link appears. Click Copy → button shows "Copied" for 2 s, clipboard holds the link.
2. Open the short link → redirects to `https://example.com`.
3. Enter `not a url` → red inline message `That URL isn't valid`.
4. Stop the backend, submit → `Can't reach server` (or `Something went wrong. Try again` if the proxy returns 500; accept either).

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add shorten page"
```
