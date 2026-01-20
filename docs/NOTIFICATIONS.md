# Notifications (v1)

This document describes the **Notifications v1** feature implemented in the frontend.

## UX summary

- A notifications bell is shown in the header when authenticated.
- When there are unread notifications:
  - A small orange dot appears **inside** the bell icon (Instagram-style).
  - The bell periodically “wiggles” to draw attention.
- Clicking the bell opens a dropdown:
  - Shows a list of the latest notifications with relative time (e.g. “2m ago”).
  - Supports pagination via a **Load more** button.
  - Dropdown closes on outside click.

## Backend contract (consumed by frontend)

Notifications are fetched and marked as “seen” using a watermark-style model (badge count is based on notifications newer than the server-side watermark).

Endpoints used:

- `GET /notification/badge` → `{ unreadCount: number }`
- `GET /notification/latest?cursor=<string|null>&limit=<number>` → `{ notifications: NotificationDto[], nextCursor: string | null }`
- `POST /notification/seen` → marks all as seen (updates server watermark)

### Notification types

The frontend expects these notification shapes:

- `JOB_SUCCEEDED` / `JOB_FAILED`
  - `data` includes human-readable context so items are distinguishable:
    - `prompt`, `style`, `model` (and optionally `generationId`/`jobId` for correlation)
- `LOW_CREDITS`
  - `data` includes `credits`

Note: the UI intentionally avoids rendering internal IDs in v1.

## Frontend implementation

### State + API

- Provider: `src/context/NotificationsProvider.tsx`
  - Owns `unreadCount`, `notifications`, pagination (`nextCursor`), and loading flags.
  - Caching: avoids refetching the latest notifications on every bell open.
  - Seen optimization: only calls `/notification/seen` when `unreadCount > 0`.
- Hook: `src/hooks/useNotifications.ts` (typed access to the provider)
- Service: `src/services/notificationService.ts`
  - Typed DTOs and the three API calls listed above.

### UI

- Header bell: `src/components/Header.tsx`
  - Toggles dropdown open/close.
  - When opened, triggers `loadLatestAndMarkSeen()`.
  - Renders the unread dot + wiggle animation only when `unreadCount > 0`.
- Dropdown: `src/components/Notification.tsx`
  - Renders the list with time-ago labels.
  - Displays job context (prompt preview + style/model chips).
  - Supports pagination via `loadMore()`.

### Refresh triggers

Badge count refresh happens:

- On auth bootstrap (provider initialization)
- After SVG generation reaches a terminal state (success/failure)
- Also in the SVG generation `catch` path to handle non-2xx responses that still create notifications server-side

## Styling + animation

- Bell wiggle animation class: `.animate-bell-wiggle` in `src/index.css`
- Dot badge uses theme token `bg-wizard-orange`.
