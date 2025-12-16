# Sentry Error Tracking Setup

This project uses [Sentry](https://sentry.io) for production error tracking and monitoring.

## Features

- 🔍 **Error tracking**: Automatic error capture and reporting
- 📊 **Performance monitoring**: Track application performance
- 🎥 **Session replay**: See what users experienced when errors occurred
- 🔔 **Real-time alerts**: Get notified when issues occur
- 📈 **Analytics**: Understand error patterns and user impact

## Setup Instructions

### 1. Create a Sentry Account

1. Go to [sentry.io](https://sentry.io) and sign up (free tier available)
2. Create a new project and select "React" as the platform
3. Copy your DSN (Data Source Name) from the project settings

### 2. Configure Your Environment

Add your Sentry DSN to your `.env` file:

```bash
VITE_SENTRY_DSN="https://your-key@sentry.io/your-project-id"
```

> **Note**: The Sentry integration only activates in production builds. During development, all logs go to the browser console.

### 3. Deploy to Production

When you deploy your application, make sure to set the `VITE_SENTRY_DSN` environment variable in your hosting platform (Vercel, Netlify, etc.).

## How It Works

### Logger Service

The app uses a custom logger service (`src/services/logger.ts`) that:

- **Development**: Logs to browser console with prefixes (`[ERROR]`, `[WARN]`, `[INFO]`, `[DEBUG]`)
- **Production**: Sends errors to Sentry for tracking

### Usage Examples

```typescript
import { logger } from './services/logger'

// Error logging (production: sent to Sentry)
logger.error('Failed to fetch user', error, { userId: 123 })

// Warning logging (production: sent to Sentry as warning)
logger.warn('API rate limit approaching', { remaining: 10 })

// Info logging (development only, not sent in production)
logger.info('User logged in', { email: 'user@example.com' })

// Debug logging (development only)
logger.debug('Rendering component', { props })
```

## Production Optimizations

### Automatic Console Removal

In production builds, all `console.log` and `debugger` statements are automatically removed by Vite to:

- Reduce bundle size
- Prevent sensitive data leaks
- Improve performance

This is configured in `vite.config.ts`:

```typescript
esbuild: {
  drop: mode === 'production' ? ['console', 'debugger'] : [],
}
```

### Error Context

Errors sent to Sentry include useful context:

- User information (if authenticated)
- Error stack traces
- Custom context (email, IDs, etc.)
- Session replay (for visual debugging)

## Monitoring Best Practices

1. **Set up alerts**: Configure Sentry to notify you via email/Slack when errors occur
2. **Review regularly**: Check the Sentry dashboard weekly for trends
3. **Fix high-impact issues first**: Sentry shows which errors affect the most users
4. **Use releases**: Tag your deployments to track which version introduced issues
5. **Sampling rates**: Adjust `tracesSampleRate` and `replaysSessionSampleRate` based on traffic

## Disabling Sentry

If you don't want to use Sentry:

1. Remove or comment out `VITE_SENTRY_DSN` from your `.env` file
2. The logger will continue to work in development, but won't send data in production

## Support

- [Sentry Documentation](https://docs.sentry.io/)
- [React Integration Guide](https://docs.sentry.io/platforms/javascript/guides/react/)
- [Performance Monitoring](https://docs.sentry.io/product/performance/)
