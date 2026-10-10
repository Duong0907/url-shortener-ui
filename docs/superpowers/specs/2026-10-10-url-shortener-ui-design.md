# URL Shortener UI Design

## Goal

One-page web UI to shorten a URL using the existing backend (`http://localhost:8080`).

## Backend contract (from `/v3/api-docs`)

- `POST /api/links` body `{ "targetUrl": string }` → `201` `LinkResponse`, `400` on invalid URL/slug/expiry.
- `LinkResponse`: `id`, `slug`, `shortUrl`, `targetUrl`, `active`, `expiresAt?`, `createdAt`.
- `GET /{slug}` → `302` redirect (not used by the UI).

## Stack

Next.js (App Router) + TypeScript + Tailwind CSS + shadcn/ui (`button`, `input`, `card`). Tests: Jest (via `next/jest`) + React Testing Library.

## Architecture

Code is grouped by feature. Each feature folder holds its UI, API calls, and tests. Shared code stays in `components/ui/` (shadcn) and `lib/utils.ts`. A feature never imports from another feature's internals.

- `next.config.ts` rewrites `/api/:path*` to `${API_URL}/api/:path*`. `API_URL` defaults to `http://localhost:8080`. The browser stays on one origin, so no CORS setup.
- `features/shorten/api.ts`: `createLink(targetUrl)` returns `LinkResponse` or throws an `Error` with a user-readable message.
- `features/shorten/shorten-form.tsx`: client component. Owns input, loading, result, error, and copied state.
- `app/page.tsx`: centered shadcn `Card` with title, tagline, and `ShortenForm`.

## Flow

1. User pastes a URL and submits.
2. Button shows loading state. Input is disabled.
3. Success: show `shortUrl`, a Copy button ("Copied" for 2 s), and `expiresAt` when set. Input stays for the next URL.
4. Error: inline message under the input. 400 → "That URL isn't valid". Network error → "Can't reach server". Other → "Something went wrong. Try again".

## Visual design (simple, easy to use)

- One centered column, one task. No nav, no footer, no extra links.
- Neutral shadcn default theme (zinc). One accent: the primary button. Light/dark follow the OS.
- System font stack from Next.js default. Title 24px, body 16px.
- Input and button are 44px tall (touch target). On phones the button goes full width under the input.
- Input autofocuses. Enter submits. Browser URL validation is off; the backend validates.
- Result sits in a bordered box with a clear Copy button. `aria-live="polite"` announces it to screen readers.
- Errors use text, not only color: `role="alert"` with the message.
- Visible focus ring on all controls (shadcn default). Contrast at least 4.5:1.

## Out of scope

History, accounts, QR codes, analytics, custom slugs, theme toggle (dark mode follows the OS).

## Testing

Jest + React Testing Library with `fetch` mocked (plain objects, since jsdom has no `Response`). Tests: `createLink` (success, 400, network error) and `ShortenForm` (success shows link, 400 shows error). Coverage threshold: 80% global (statements, branches, functions, lines) on `features/**`, enforced by `npm run test:coverage`. Manual check against the live backend.
