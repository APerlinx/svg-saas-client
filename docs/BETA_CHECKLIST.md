# v0.2.0 Release Checklist

## Core Features ✅

- [x] BullMQ async jobs with WebSocket (Socket.IO) progress updates
- [x] Per-attempt idempotency keys
- [x] Real-time progress modal with animated UI
- [x] Credit updates from terminal job result (no refresh needed)
- [x] Type-safe Job/QueueStats interfaces exported
- [x] Modal close button disabled during generation

## Testing 🧪

- [ ] E2E tests pass for new async generation flow
- [ ] Manual testing: generate SVG and verify progress states
- [ ] Manual testing: double-click prevention with same idempotency key
- [ ] Manual testing: credit balance updates without refresh
- [ ] Manual testing: modal cannot be closed mid-generation
- [ ] Manual testing: timeout handling (60s limit)
- [ ] Manual testing: error states display correctly

## Documentation 📝

- [x] README updated with BullMQ architecture
- [x] CHANGELOG.md created with v0.2.0 notes
- [x] package.json version bumped to 0.2.0
- [ ] API contract documented (job status responses)

## Production Readiness 🚀

- [ ] CI green on PR
- [ ] No secrets in client code (only VITE\_\* env vars)
- [ ] Sentry DSN configured for production
- [ ] Backend idempotency validation deployed
- [ ] Rate limiting tested (429 with retry-after header)
- [ ] Job update delivery (Socket.IO) tested under load
- [ ] Polling fallback hardened (when Socket.IO updates are missing):
  - [ ] Add jitter to polling interval to avoid thundering herd
  - [ ] Respect `Retry-After` on 429 responses (delay next poll accordingly)
  - [ ] Consider backoff/cap strategy for prolonged polling windows
  - [ ] Validate total timeout budget (socket wait + polling fallback) matches desired UX

## Deployment 🌐

- [ ] Merge to `main` branch
- [ ] Tag release: `git tag v0.2.0`
- [ ] Push tags: `git push origin v0.2.0`
- [ ] Create GitHub release with changelog
- [ ] Verify Vercel auto-deploy completes
- [ ] Smoke test production: generate SVG end-to-end

## Rollback Plan 🔄

If critical issues found:

1. Revert `main` to previous commit
2. Force push: `git push origin main --force`
3. Vercel will auto-deploy previous version
4. Tag hotfix branch from reverted state
