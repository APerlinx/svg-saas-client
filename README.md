# chatSVG - Frontend

[![CI Status](<https://github.com/APerlinx/svg-saas-client/workflows/CI%20(client%20e2e)/badge.svg>)](https://github.com/APerlinx/svg-saas-client/actions)
[![Deploy Status](https://img.shields.io/badge/deploy-Vercel-black)](https://vercel.com)
[![Render](https://img.shields.io/badge/API-Render-blue)](https://chatsvg-api.onrender.com)

> A production-ready SaaS frontend for AI-powered SVG generation with enterprise-grade authentication, real-time credit management, and modern React architecture. Built with TypeScript, comprehensive testing (Playwright E2E), Sentry error tracking, and CI/CD automation.

## 🚀 Features

- **AI-Powered SVG Generation**: Create custom SVGs using GPT-4o and GPT-5 models
- **Async Job Processing**: BullMQ-powered queue with real-time progress tracking
- **Real-Time Credit Management**: Instant credit updates via polling responses
- **Idempotency Protection**: Per-attempt keys prevent duplicate job creation
- **Professional Progress UI**: Animated progress bar with status-specific messaging
- **Multiple Export Formats**: Raw SVG, React components, TypeScript, CDN URLs, PNG downloads
- **Privacy Controls**: Public/private generation options
- **Session Management**: Persistent draft prompts and secure authentication
- **Responsive Design**: Mobile-first UI with Tailwind CSS
- **Error Tracking**: Production-ready Sentry integration
- **Type Safety**: Full TypeScript coverage with strict checks

## 🛠️ Tech Stack

### Core

- **React 18** - Modern hooks and concurrent features
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool
- **React Router** - Client-side routing

### UI & Styling

- **Tailwind CSS** - Utility-first styling
- **Custom Animations** - Smooth transitions and effects
- **Responsive Design** - Mobile-first approach

### State Management

- **React Context** - Global auth and toast state
- **Session Storage** - Draft persistence
- **Custom Hooks** - Reusable logic patterns

### Testing

- **Playwright** - End-to-end testing
- **Vitest** - Unit testing
- **Testing Library** - Component testing

### Quality & Monitoring

- **Sentry** - Error tracking and performance monitoring
- **ESLint** - Code quality
- **TypeScript** - Type checking
- **GitHub Actions** - Automated CI/CD

## 📋 Prerequisites

- **Node.js** 18+ (LTS recommended)
- **npm** 9+ or **pnpm** 8+
- **Backend API** running (see [svg-saas-server](https://github.com/APerlinx/svg-saas-server))

## 🏃 Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/APerlinx/svg-saas-client.git
cd svg-saas-client
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment setup

Copy the example environment file:

```bash
cp .env.example .env
```

Configure your `.env`:

```bash
# Backend API URL
VITE_API_BASE_URL="http://localhost:4000/api"

# Sentry error tracking (optional - production only)
# VITE_SENTRY_DSN="your-sentry-dsn-here"
```

### 4. Start development server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## 📜 Available Scripts

### Development

```bash
npm run dev          # Start dev server with hot reload
npm run build        # Build for production
npm run preview      # Preview production build locally
```

### Testing

```bash
npm run test         # Run unit tests
npm run test:ui      # Open Vitest UI
npm run test:e2e     # Run Playwright E2E tests
npm run test:e2e:ui  # Open Playwright UI mode
```

### Code Quality

```bash
npm run lint         # Check code quality
npm run type-check   # Run TypeScript compiler check
```

## 🏗️ Project Structure

```
client/
├── .github/
│   └── workflows/
│       └── playwright.yml      # CI/CD pipeline
├── docs/
│   ├── SENTRY_SETUP.md        # Error tracking guide
│   └── SENTRY_IMPLEMENTATION.md
├── public/                     # Static assets
├── src/
│   ├── assets/                # SVG icons and images
│   │   └── Dashboard-background/
│   ├── components/            # Reusable components
│   │   ├── auth/             # Auth-related components
│   │   ├── icons/            # Icon components
│   │   ├── modal/            # Modal components
│   │   └── ui/               # UI primitives
│   ├── constants/            # App constants
│   │   ├── models.ts         # AI model definitions
│   │   └── svgStyles.ts      # SVG style options
│   ├── context/              # React Context providers
│   │   ├── AuthContext.tsx
│   │   ├── AuthProvider.tsx
│   │   └── ToastProvider.tsx
│   ├── hooks/                # Custom React hooks
│   ├── pages/                # Route pages
│   │   ├── auth/            # Auth pages
│   │   ├── Dashboard.tsx
│   │   ├── Gallery.tsx
│   │   └── Pricing.tsx
│   ├── routes/               # Route configuration
│   ├── services/             # API services
│   │   ├── authService.ts
│   │   ├── svgService.ts
│   │   ├── csrfInterceptor.ts
│   │   └── logger.ts        # Sentry integration
│   ├── types/                # TypeScript types
│   ├── utils/                # Utility functions
│   ├── App.tsx               # Root component
│   ├── main.tsx             # Entry point
│   └── index.css            # Global styles
├── tests/                    # E2E test specs
├── playwright.config.ts     # Playwright configuration
├── vite.config.ts          # Vite configuration
├── tsconfig.json           # TypeScript config
└── package.json
```

## 🔐 Authentication Flow

1. **Sign Up/Sign In** - Email/password or OAuth (Google, GitHub)
2. **Session Management** - HTTP-only cookies with CSRF protection
3. **Token Refresh** - Automatic token refresh on 401 responses
4. **Logout** - Clears session and prompts

## 🎨 Key Features

### SVG Generation

```typescript
// Users can generate SVGs with:
- Custom prompts (min 10 characters)
- Multiple AI models (GPT-4o, GPT-5)
- Style presets (minimal, flat, isometric, etc.)
- Privacy controls (public/private)
- Async job processing with BullMQ
- Real-time progress updates (QUEUED → RUNNING → SUCCEEDED/FAILED)
- Exponential backoff polling (2s to 10s intervals)
- Idempotency keys to prevent duplicate submissions
```

### Job Processing Flow

1. **Submit** - Frontend sends generation request with idempotency key
2. **Queue** - Backend creates BullMQ job and returns job ID
3. **Poll** - Frontend polls `/svg/generation-jobs/:id` every 2-10s
4. **Progress** - Modal shows live status with animated progress bar
5. **Complete** - SVG delivered with updated credit balance

### Credit System

- Real-time credit display in header
- Instant updates from polling responses (no refresh needed)
- Credits deducted only on successful generation
- Low credit warnings with banner
- Pricing page with purchase options

### Export Options

1. **Raw SVG** - Copy optimized SVG code
2. **React Component** - JSX with props
3. **TypeScript Component** - Fully typed
4. **CDN URL** - Data URI for embedding
5. **PNG Download** - Rasterized export

## 🧪 Testing

### Unit Tests

```bash
npm run test
```

Tests are colocated with components in `*.test.tsx` files.

### E2E Tests

```bash
# Run all tests
npm run test:e2e

# Run specific test
npx playwright test tests/auth/signin.spec.ts

# Debug mode
npm run test:e2e:ui

# Generate test report
npx playwright show-report
```

#### Test Structure

```
tests/
├── auth/
│   ├── auth.setup.spec.ts      # Creates authenticated state
│   ├── signin.spec.ts
│   └── signup.spec.ts
└── svg/
    └── authenticated-generate.spec.ts
```

## 🚦 CI/CD (Quality Gates + Automated Deployments)

This project uses **CI (Continuous Integration)** and **CD (Continuous Deployment)** to keep `main` stable and production deployments reliable.

### CI (GitHub Actions)

Every push and pull request triggers automated checks.

**The pipeline runs:**

1. **Backend unit/integration tests** (Jest) on the server repo
2. **End-to-end tests** (Playwright) on the client repo
   - Spins up a local backend + frontend in CI
   - Seeds test database with known credentials
   - Runs full authentication and generation flows
3. **Test reports/artifacts** are uploaded on failure to speed up debugging

**Workflow:** `.github/workflows/playwright.yml`

```yaml
- Checkout client and server repos
- Setup PostgreSQL service
- Install dependencies
- Run Prisma migrations
- Seed test database
- Start backend and frontend servers
- Execute Playwright tests
- Upload test reports on failure
```

### Branch Protection (Quality Gate)

`main` is protected:

- Pull requests **cannot be merged** unless required CI checks pass
- This prevents broken code from reaching production
- Ensures all changes are tested before deployment

### CD (Auto-Deploy)

Production deployments are triggered **only from `main`**:

- **Frontend** deploys to **Vercel**

  - Automatic deployments on push to `main`
  - Preview deployments for pull requests
  - Environment variables configured in Vercel dashboard

- **Backend API** deploys to **Render**
  - Connected to server repository
  - Auto-deploy on `main` branch updates

**Preview deployments** may be created for pull requests, but **production is always based on `main`**.

## 📊 Error Tracking (Sentry)

Production-ready error monitoring with Sentry.

### Setup

1. Sign up at [sentry.io](https://sentry.io)
2. Create a React project
3. Copy your DSN
4. Add to `.env`:

```bash
VITE_SENTRY_DSN="https://your-key@sentry.io/your-project"
```

### Features

- **Error tracking** - Automatic exception capture
- **Performance monitoring** - Track slow operations
- **Session replay** - Visual debugging
- **User context** - Attach user info to errors
- **Source maps** - See original TypeScript in stack traces

See [docs/SENTRY_SETUP.md](docs/SENTRY_SETUP.md) for detailed configuration.

## 🔧 Configuration

### Vite

- **Auto console removal** - Strips `console.*` and `debugger` in production
- **Fast refresh** - Instant HMR updates
- **Optimized builds** - Tree-shaking and minification

### TypeScript

- **Strict mode** enabled
- **Path aliases** configured
- **Type checking** in CI pipeline

### Tailwind CSS

Custom theme with brand colors:

```css
wizard-orange: #FF6B35
wizard-gold: #FFD700
wizard-gray-medium: #4A5568
```

## 🌐 Environment Variables

| Variable            | Description               | Required | Default                     |
| ------------------- | ------------------------- | -------- | --------------------------- |
| `VITE_API_BASE_URL` | Backend API URL           | Yes      | `http://localhost:4000/api` |
| `VITE_SENTRY_DSN`   | Sentry error tracking DSN | No       | -                           |

## 🐛 Common Issues

### 1. CORS Errors

**Problem:** Backend blocks requests from frontend

**Solution:** Ensure backend `FRONTEND_URL` matches your dev server URL

```bash
# Backend .env
FRONTEND_URL=http://localhost:5173
```

### 2. Authentication Fails

**Problem:** Cookies not being set

**Solution:** Check `withCredentials` is enabled in axios config and backend CORS allows credentials

### 3. Build Fails

**Problem:** TypeScript errors during build

**Solution:** Run type check locally:

```bash
npm run type-check
```

### 4. Tests Timeout

**Problem:** E2E tests hang or timeout

**Solution:** Ensure backend is running and seeded with test data

## 📝 Contributing

1. Create a feature branch from `main`
2. Make your changes with proper TypeScript types
3. Add tests for new features
4. Ensure all tests pass: `npm run test && npm run test:e2e`
5. Create a pull request
6. Wait for CI checks to pass
7. Request review from maintainers

## 📄 License

[MIT License](LICENSE)

## 🔗 Related Repositories

- [Backend API](https://github.com/APerlinx/svg-saas-server) - Node.js/Express server with PostgreSQL

## 📞 Support

- **Issues:** [GitHub Issues](https://github.com/APerlinx/svg-saas-client/issues)
- **Documentation:** [docs/](docs/)
- **Sentry Setup:** [docs/SENTRY_SETUP.md](docs/SENTRY_SETUP.md)

---

Built with ❤️ by [APerlinx](https://github.com/APerlinx)
