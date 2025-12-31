# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed

- **SVG Generation Updates**: Progress is now driven by WebSocket (Socket.IO) events instead of polling
  - Listen for `generation-job:update` and filter by `jobId`
  - Use server-sent `progress` (0–100) to drive the progress UI
  - On `SUCCEEDED`/`FAILED`, perform a final `GET /svg/generation-jobs/:id` to fetch the SVG + updated credits

## [0.2.0] - 2025-12-29

### Added

- **BullMQ Async Jobs**: Async job processing with real-time status updates

  - Handle QUEUED, RUNNING, SUCCEEDED, FAILED states
  - Timeout protection while waiting for terminal status
  - Transient error retry with circuit breaker (max 3 consecutive errors)

- **Idempotency System**: Per-attempt keys prevent duplicate job creation

  - Generate UUID per form submission attempt
  - Reset key when prompt/style/model/privacy changes
  - Backend validates key uniqueness and payload consistency

- **Professional Progress Modal**: Real-time generation status with UX polish

  - Animated progress bar with gradient styling
  - Status-specific messaging (queue position, AI activity, completion)
  - Modal dismissal disabled during active generation
  - Graceful error states with actionable messaging

- **Real-Time Credit Updates**: Credits refresh from terminal job result

  - No page refresh needed after generation
  - Credits captured from terminal job status (SUCCEEDED/FAILED)
  - Immediate UI sync via `updateUserCredits` callback

- **Type-Safe Job Interface**: Export `Job`, `QueueStats`, `GenerationProgressUpdate` types
  - Full TypeScript support for job status tracking
  - Type-safe progress callbacks with queue metadata
  - Optional credits field in responses

### Changed

- **Breaking**: `generateSvg` now requires `idempotencyKey` parameter

  - Old: `generateSvg({ prompt, style, privacy, model })`
  - New: `generateSvg({ prompt, style, privacy, model, idempotencyKey }, { onStatusUpdate? })`

- **Refactored**: Modal component accepts `showCloseButton` prop for conditional close icon
- **Enhanced**: Error handling includes 429 rate-limit detection with retry-after messaging
- **Improved**: Session storage now persists prompt drafts across page refreshes

### Fixed

- Credits not updating after generation without refresh
- Duplicate job creation on double-click or rapid submission
- Modal closing mid-generation causing orphaned polling requests
- Progress bar animation stuttering on status transitions

### Documentation

- Updated README with BullMQ architecture and job flow
- Added detailed feature list with async processing notes
- Included TypeScript examples for new interfaces

## [0.1.0] - 2025-12-27

### Added

- Initial production release
- AI-powered SVG generation with GPT-4o and GPT-5
- Email/password and OAuth authentication (Google, GitHub)
- Credit-based generation system
- Multiple export formats (SVG, React, TypeScript, Data URI, PNG)
- Responsive UI with Tailwind CSS
- Sentry error tracking integration
- Playwright E2E test suite
- CI/CD with GitHub Actions
- Vercel deployment configuration
