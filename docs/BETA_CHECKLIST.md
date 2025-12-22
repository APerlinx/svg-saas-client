# v0.1.0-beta

## Beta checklist

- [x]CI green on PR
- [x]Branch protection enabled
- [x]Production deploy from main only
- [x]Sentry: errors visible, release set (optional)
- [x]Backend logs: Render log drain / pino output confirmed
- [x]Health endpoint works: /api/health
- [x]Auth flows tested (signup/login/logout/refresh)
- [x]Rate limiting doesn’t block normal users
- [x]Secrets only in platform env vars (no .env committed)
