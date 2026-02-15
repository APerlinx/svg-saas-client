# ChatSVG Frontend - AI Agent Documentation

**Last Updated:** February 15, 2026  
**Version:** 0.2.0

---

## 1. System Overview

ChatSVG is a React-based single-page application (SPA) for AI-powered SVG generation. The frontend provides both a web interface and documentation for the REST API. It's deployed on Vercel and connects to the backend API at `api.chatsvg.dev`.

**Key Features:**

- AI-powered SVG generation with multiple models and styles
- User authentication (email/password + OAuth)
- Credit-based system for generations
- Real-time job status updates via Socket.IO
- API key management for programmatic access
- User history and generation gallery
- Admin dashboard for moderation

**Deployment:**

- **Platform:** Vercel (SPA with client-side routing)
- **Backend API:** `https://api.chatsvg.dev`
- **Environment:** Production, staging, and preview deployments

---

## 2. Tech Stack

### Core

- **React:** 19.2.0 (latest with concurrent features)
- **TypeScript:** 5.9.3 (strict mode enabled)
- **Build Tool:** Vite 7.2.4 (fast HMR, ES modules)
- **Package Manager:** npm

### Routing & Navigation

- **React Router:** 7.9.6 (`react-router-dom`)
- Client-side routing with `createBrowserRouter`
- Nested routes under root layout (`App.tsx`)

### State Management

- **Context API:** Built-in React Context for global state
- **Contexts:**
  - `AuthContext` - User authentication and session
  - `ToastContext` - Toast notifications
  - `NotificationsContext` - User notifications and badge count
- **Local State:** `useState` and `useReducer` for component state

### Styling

- **Tailwind CSS:** 4.1.17 (utility-first CSS framework)
- **Vite Plugin:** `@tailwindcss/vite` for build integration
- **Approach:** Utility classes with component-specific styles
- **Responsive:** Mobile-first design with breakpoints (`sm:`, `md:`, `lg:`)

### HTTP Client

- **Axios:** 1.13.2 for API requests
- Configured with base URL, credentials, and interceptors
- CSRF token handling via request interceptors

### Real-time Communication

- **Socket.IO Client:** 4.8.3
- WebSocket connection for live job status updates
- Auto-reconnection and connection management
- Authentication via cookies (withCredentials: true)

### Error Tracking

- **Sentry:** @sentry/react 10.31.0
- Error boundary integration
- User feedback collection
- Performance monitoring

### Testing

- **Testing Framework:** Vitest 4.0.15 (Vite-native test runner)
- **Component Testing:** @testing-library/react 16.3.0
- **User Interactions:** @testing-library/user-event 14.6.1
- **E2E Testing:** Playwright 1.57.0 (browser automation)
- **Test Environment:** jsdom 27.3.0 (DOM simulation)

### Linting & Formatting

- **ESLint:** 9.39.1 with TypeScript support
- **Plugins:** react-hooks, react-refresh
- **Configuration:** `eslint.config.js` (flat config)

---

## 3. Project Structure

```
client/
├── docs/                          # Documentation
│   ├── AGENTS.md                  # This file - AI agent guide
│   ├── BETA_CHECKLIST.md          # Pre-release checklist
│   ├── FRONTEND_ARCHITECTURE.md   # Architecture decisions
│   ├── NOTIFICATIONS.md           # Notification system docs
│   ├── RELEASE_PROCESS.md         # Release workflow
│   ├── SENTRY_IMPLEMENTATION.md   # Error tracking setup
│   └── SENTRY_SETUP.md            # Sentry configuration
│
├── public/                        # Static assets (served as-is)
│
├── src/
│   ├── main.tsx                   # App entry point
│   ├── App.tsx                    # Root layout component
│   ├── index.css                  # Global styles & Tailwind directives
│   │
│   ├── assets/                    # Images, fonts, etc.
│   │   └── Dashboard-background/  # Hero background images
│   │
│   ├── components/                # Reusable components
│   │   ├── apiKeys/               # API Keys page components
│   │   │   ├── CreateKeyModal.tsx
│   │   │   ├── RevealKeyModal.tsx
│   │   │   ├── KeyStatsPopover.tsx
│   │   │   ├── RevokeConfirmModal.tsx
│   │   │   ├── SummaryCard.tsx
│   │   │   ├── StatRow.tsx
│   │   │   └── index.ts           # Barrel export
│   │   │
│   │   ├── auth/                  # Auth-related components
│   │   │   ├── GoogleButton.tsx
│   │   │   └── ProtectedRoute.tsx
│   │   │
│   │   ├── dashboard/             # Dashboard-specific components
│   │   │   └── RecentHistorySection.tsx
│   │   │
│   │   ├── icons/                 # SVG icon components
│   │   │   ├── LoaderIcon.tsx
│   │   │   ├── PencilIcon.tsx
│   │   │   ├── GalleryIcon.tsx
│   │   │   └── ...
│   │   │
│   │   ├── modal/                 # Modal components
│   │   │   ├── Modal.tsx          # Base modal wrapper
│   │   │   └── SvgResultModal.tsx # SVG generation result
│   │   │
│   │   ├── promptGenerator/       # Prompt generator logic
│   │   │   ├── usePromptDraft.ts  # Auto-save draft hook
│   │   │   └── useSvgGeneration.ts # Generation logic hook
│   │   │
│   │   ├── ui/                    # Generic UI components
│   │   │   ├── Dropdown.tsx
│   │   │   ├── PrivacySwitch.tsx
│   │   │   └── ...
│   │   │
│   │   ├── AppErrorBoundary.tsx   # Sentry-integrated error boundary
│   │   ├── ErrorBoundary.tsx      # React Router error boundary
│   │   ├── Header.tsx             # Site header/navigation
│   │   ├── Footer.tsx             # Site footer
│   │   ├── NotFound.tsx           # 404 page
│   │   ├── Notification.tsx       # Notification item component
│   │   ├── PromptGenerator.tsx    # Main SVG generation form
│   │   ├── CreditReminderBanner.tsx # Low credit warning
│   │   └── ScrollToTop.tsx        # Scroll restoration on route change
│   │
│   ├── constants/                 # Static configuration
│   │   ├── models.ts              # AI models (GPT-4o, Claude Sonnet, etc.)
│   │   └── svgStyles.ts           # SVG style presets (minimal, flat, etc.)
│   │
│   ├── context/                   # React Context providers
│   │   ├── AuthContext.tsx        # Auth context definition
│   │   ├── AuthProvider.tsx       # Auth provider implementation
│   │   ├── NotificationsContext.tsx
│   │   ├── NotificationsProvider.tsx
│   │   ├── ToastContext.ts
│   │   └── ToastProvider.tsx
│   │
│   ├── hooks/                     # Custom React hooks
│   │   ├── useAuth.ts             # Auth hook (useContext wrapper)
│   │   ├── useNotifications.ts    # Notifications hook
│   │   └── useToast.ts            # Toast hook
│   │
│   ├── lib/                       # Third-party library wrappers
│   │   └── socket.ts              # Socket.IO client setup
│   │
│   ├── pages/                     # Page components (routes)
│   │   ├── auth/                  # Auth pages
│   │   │   ├── SignIn.tsx
│   │   │   ├── SignUp.tsx
│   │   │   ├── ForgotPassword.tsx
│   │   │   ├── ResetPssword.tsx   # [Typo in filename]
│   │   │   └── OAuthCallback.tsx  # OAuth redirect handler
│   │   │
│   │   ├── Admin.tsx              # Admin dashboard (moderation)
│   │   ├── ApiKeys.tsx            # API key management
│   │   ├── Contact.tsx            # Contact/support page
│   │   ├── Dashboard.tsx          # Home page with prompt generator
│   │   ├── Docs.tsx               # API documentation
│   │   ├── Gallery.tsx            # Public SVG gallery
│   │   ├── Pricing.tsx            # Credit packs and pricing
│   │   ├── PrivacyPolicy.tsx      # Privacy policy (legal)
│   │   ├── Status.tsx             # System status page
│   │   ├── TermsOfService.tsx     # Terms of service (legal)
│   │   └── UserHistory.tsx        # User's generation history
│   │
│   ├── routes/                    # Routing configuration
│   │   └── index.tsx              # Router setup with all routes
│   │
│   ├── services/                  # API service layer
│   │   ├── adminService.ts        # Admin operations (moderation, stats)
│   │   ├── apiKeyService.ts       # API key CRUD operations
│   │   ├── authService.ts         # Authentication API calls
│   │   ├── csrfInterceptor.ts     # CSRF token injection
│   │   ├── csrfService.ts         # CSRF token fetching
│   │   ├── logger.ts              # Sentry integration
│   │   ├── notificationService.ts # Notification fetching
│   │   ├── planService.ts         # Credit purchase operations
│   │   ├── supportService.ts      # Contact form submission
│   │   ├── svgService.ts          # SVG generation and retrieval
│   │   └── userService.ts         # User profile operations
│   │
│   ├── test/                      # Test utilities
│   │   ├── setup.ts               # Vitest setup file
│   │   └── test-utils.tsx         # Testing library wrappers
│   │
│   ├── types/                     # TypeScript type definitions
│   │   ├── svg.ts                 # SVG generation types
│   │   └── user.ts                # User and auth types
│   │
│   └── utils/                     # Utility functions
│       ├── csrf.ts                # CSRF token storage helpers
│       └── getInitials.ts         # User initials from name
│
├── tests/                         # E2E tests (Playwright)
│   ├── auth.setup.spec.ts         # Auth test setup
│   ├── auth/                      # Authentication tests
│   ├── authenticated/             # Tests requiring auth
│   ├── smoke/                     # Basic smoke tests
│   └── svg/                       # SVG generation tests
│
├── test-results/                  # Playwright test artifacts
├── playwright-report/             # HTML test reports
│
├── index.html                     # SPA entry HTML
├── package.json                   # Dependencies and scripts
├── vite.config.ts                 # Vite configuration
├── tsconfig.json                  # TypeScript config (base)
├── tsconfig.app.json              # TypeScript config (app)
├── tsconfig.node.json             # TypeScript config (build)
├── eslint.config.js               # ESLint flat config
├── playwright.config.ts           # Playwright test config
├── vercel.json                    # Vercel deployment config
├── CHANGELOG.md                   # Release notes
├── README.md                      # Project documentation
└── LICENSE                        # License file
```

---

## 4. Routing

All routes are defined in `src/routes/index.tsx` using React Router's `createBrowserRouter`.

### Route Table

| Path               | Component        | Purpose                         | Auth Required |
| ------------------ | ---------------- | ------------------------------- | ------------- |
| `/`                | `Dashboard`      | Home page with prompt generator | No            |
| `/gallery`         | `Gallery`        | Public SVG gallery              | No            |
| `/history`         | `UserHistory`    | User's generation history       | Yes           |
| `/pricing`         | `Pricing`        | Credit packs and pricing plans  | No            |
| `/docs`            | `Docs`           | API documentation               | No            |
| `/contact`         | `Contact`        | Contact/support form            | No            |
| `/privacy`         | `PrivacyPolicy`  | Privacy policy (legal)          | No            |
| `/terms`           | `TermsOfService` | Terms of service (legal)        | No            |
| `/api-keys`        | `ApiKeys`        | API key management dashboard    | Yes           |
| `/status`          | `Status`         | System status page (mock)       | No            |
| `/admin`           | `Admin`          | Admin dashboard (moderation)    | Yes (Admin)   |
| `/signin`          | `SignIn`         | Sign in page                    | No            |
| `/signup`          | `SignUp`         | Sign up page                    | No            |
| `/forgot-password` | `ForgotPassword` | Password reset request          | No            |
| `/reset-password`  | `ResetPassword`  | Password reset with token       | No            |
| `/auth/callback`   | `OAuthCallback`  | OAuth redirect handler (Google) | No            |
| `*`                | `NotFound`       | 404 page                        | No            |

### Layout Structure

```
App (root layout)
├── Header
├── CreditReminderBanner (conditional)
├── Outlet (child routes render here)
└── Footer
```

### Navigation Patterns

- **Unauthenticated users:** Can access all pages except `/history`, `/api-keys`, `/admin`
- **Authenticated users:** Full access based on role (admin gets `/admin`)
- **Protected routes:** Redirect to `/signin` when accessed without auth
- **OAuth flow:** User clicks Google button → redirects to backend OAuth → backend redirects to `/auth/callback?token=...` → frontend stores token and redirects to dashboard

---

## 5. State Management

### Global State (Context API)

#### 1. AuthContext (`src/context/AuthProvider.tsx`)

**Purpose:** Manages user authentication state and session.

**State:**

```typescript
{
  user: User | null // Current user object or null
  isLoading: boolean // Initial auth check in progress
}
```

**Methods:**

```typescript
login(email, password, rememberMe): Promise<void>
register(name, email, password, agreedToTerms): Promise<void>
logout(): Promise<void>
updateUserCredits(creditsUsed): void
refreshAccessToken(): Promise<void>
checkAuth(): Promise<void>
```

**Usage:**

```typescript
import { useAuth } from '../hooks/useAuth'

const { user, isLoading, login, logout } = useAuth()
```

**Key Features:**

- Automatic session restoration on app load
- Token refresh logic (access token expires in 15min, refresh token in 7 days)
- Socket.IO connection management (connect on login, disconnect on logout)
- CSRF token bootstrapping

#### 2. ToastContext (`src/context/ToastProvider.tsx`)

**Purpose:** Display temporary toast notifications (success, error, info).

**State:**

```typescript
{
  toast: Toast | null // Current toast or null
}

interface Toast {
  message: string
  type: 'success' | 'error' | 'info'
}
```

**Methods:**

```typescript
showToast(message: string, type: 'success' | 'error' | 'info'): void
```

**Usage:**

```typescript
import { useToast } from '../hooks/useToast'

const { showToast } = useToast()
showToast('SVG generated successfully!', 'success')
```

**Behavior:**

- Auto-dismisses after 3 seconds
- Only one toast visible at a time
- Toast component rendered at app root level

#### 3. NotificationsContext (`src/context/NotificationsProvider.tsx`)

**Purpose:** User notifications (generation complete, admin actions, etc.).

**State:**

```typescript
{
  notifications: Notification[]  // Array of notifications
  unreadCount: number            // Badge count
  isLoading: boolean             // Fetching notifications
}
```

**Methods:**

```typescript
fetchNotifications(): Promise<void>
markAsRead(id: string): Promise<void>
markAllAsRead(): Promise<void>
deleteNotification(id: string): Promise<void>
refreshBadgeCount(): Promise<void>
```

**Usage:**

```typescript
import { useNotifications } from '../hooks/useNotifications'

const { notifications, unreadCount, markAsRead } = useNotifications()
```

**Socket.IO Integration:**

- Listens for `notification` events from server
- Auto-increments `unreadCount` on new notification
- Plays sound/shows browser notification (if enabled)

### Local Component State

**Patterns:**

- `useState` for simple state (form inputs, toggles, loading flags)
- `useRef` for DOM references and mutable values (idempotency keys, timers)
- `useReducer` for complex state with multiple actions (not commonly used in this codebase)

**Example (Form State):**

```typescript
const [formData, setFormData] = useState({
  prompt: '',
  style: 'minimal',
  model: 'gpt-4o',
  isPrivate: false,
})
```

---

## 6. Authentication Flow

### Overview

ChatSVG uses **cookie-based authentication** with JWT tokens stored in HTTP-only cookies. This prevents XSS attacks while maintaining session across page reloads.

### Token Strategy

1. **Access Token:** Short-lived (15 minutes), used for API requests
2. **Refresh Token:** Long-lived (7 days or 30 days with "Remember Me"), used to get new access tokens
3. **Storage:** Both stored as HTTP-only cookies (not accessible via JavaScript)

### Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│ 1. App Load                                                  │
│    - AuthProvider.useEffect() runs                           │
│    - bootstrapCsrf() fetches CSRF token                      │
│    - authService.ensureSession() checks for existing session │
│    - If session valid, setupSocket()                         │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. User Action (Login/Register)                              │
│    - User submits form                                       │
│    - authService.signIn() or authService.register()          │
│    - Backend validates credentials                           │
│    - Backend sets HTTP-only cookies (access + refresh)       │
│    - Frontend calls authService.getCurrentUser()             │
│    - setupSocket() establishes WebSocket connection          │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. Authenticated API Requests                                │
│    - All requests include { withCredentials: true }          │
│    - Cookies automatically sent with each request            │
│    - CSRF token added to headers for mutating requests       │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. Token Refresh (when access token expires)                 │
│    - Backend responds with 401 Unauthorized                  │
│    - Frontend calls authService.refreshAccessToken()         │
│    - Backend validates refresh token cookie                  │
│    - Backend issues new access token cookie                  │
│    - Original request retried automatically                  │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ 5. Logout                                                    │
│    - authService.logout() calls /auth/logout endpoint        │
│    - Backend clears cookies                                  │
│    - Frontend sets user to null                              │
│    - disconnectSocket()                                      │
└─────────────────────────────────────────────────────────────┘
```

### Protected Routes

**Pattern:** Check `user` state from `useAuth()` in component.

```typescript
function ProtectedPage() {
  const { user, isLoading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/signin', { replace: true })
    }
  }, [user, isLoading, navigate])

  if (isLoading) return <LoadingSpinner />
  if (!user) return null

  return <div>Protected content</div>
}
```

**Better Pattern:** Use `ProtectedRoute` wrapper component:

```typescript
<Route
  path="/history"
  element={
    <ProtectedRoute>
      <UserHistory />
    </ProtectedRoute>
  }
/>
```

### OAuth Flow (Google)

1. User clicks "Sign in with Google" button
2. Frontend redirects to `{API_URL}/auth/google` (backend endpoint)
3. Backend redirects to Google OAuth consent screen
4. User authorizes app
5. Google redirects to backend callback: `{API_URL}/auth/google/callback?code=...`
6. Backend exchanges code for tokens, creates/updates user
7. Backend sets HTTP-only cookies (access + refresh tokens)
8. Backend redirects to frontend: `{FRONTEND_URL}/auth/callback?success=true`
9. Frontend `OAuthCallback` component detects success, calls `getCurrentUser()`
10. Frontend redirects to dashboard

### CSRF Protection

**Why:** Prevent cross-site request forgery attacks.

**Implementation:**

1. On app load, `bootstrapCsrf()` fetches token from `/api/csrf-token`
2. Token stored in memory via `csrf.ts` utility
3. `csrfInterceptor` automatically adds `X-CSRF-Token` header to mutating requests (POST, PUT, DELETE, PATCH)
4. Backend validates token on each mutating request

**Files:**

- `src/services/csrfService.ts` - Fetches token
- `src/utils/csrf.ts` - In-memory storage
- `src/services/csrfInterceptor.ts` - Axios interceptor

---

## 7. API Integration

### Base Configuration

**File:** `src/services/authService.ts` (and all other service files)

```typescript
import axios from 'axios'
import { attachCsrfInterceptor } from './csrfInterceptor'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  withCredentials: true, // Send cookies with requests
})

attachCsrfInterceptor(api) // Add CSRF token to mutating requests
```

### Environment Variable

**`.env.local` (local development):**

```
VITE_API_BASE_URL=http://localhost:3000/api
```

**Production (Vercel):**

```
VITE_API_BASE_URL=https://api.chatsvg.dev/api
```

### Service Layer Structure

Each domain has its own service file in `src/services/`:

```
authService.ts         → /auth/* endpoints (login, register, logout, session)
svgService.ts          → /svg/* endpoints (generate, history, delete, public gallery)
userService.ts         → /users/* endpoints (profile, credits, settings)
apiKeyService.ts       → /api-keys/* endpoints (CRUD operations)
planService.ts         → /plans/* endpoints (purchase credits, Stripe checkout)
notificationService.ts → /notifications/* endpoints (fetch, mark read, delete)
adminService.ts        → /admin/* endpoints (moderation, stats, users)
supportService.ts      → /support/* endpoints (contact form)
csrfService.ts         → /csrf-token endpoint (fetch CSRF token)
```

### Error Handling Pattern

**Standard pattern in all service files:**

```typescript
async function someApiCall(): Promise<ReturnType> {
  try {
    const response = await api.post<ReturnType>('/endpoint', data)
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const err = error as AxiosError<ApiError>
      const msg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.response?.statusText ||
        'Unexpected server error'
      throw new Error(msg)
    }
    throw error
  }
}
```

**Usage in components:**

```typescript
try {
  const result = await svgService.generateSvg(formData)
  showToast('SVG generated!', 'success')
} catch (error) {
  const message =
    error instanceof Error ? error.message : 'Failed to generate SVG'
  showToast(message, 'error')
}
```

### Request/Response Interceptors

**CSRF Interceptor** (`csrfInterceptor.ts`):

- Intercepts mutating requests (POST, PUT, DELETE, PATCH)
- Adds `X-CSRF-Token` header
- Bootstraps CSRF token if not present

**Potential Future Interceptor** (not implemented yet):

- Response interceptor for 401 errors
- Auto-refresh access token
- Retry original request

---

## 8. Key Components

### Layout Components

#### `Header.tsx`

- Site-wide navigation bar
- Logo, links (API, Docs, Pricing, Status)
- User menu (dropdown with profile, history, API keys, logout)
- Notifications bell icon with badge count
- Mobile-responsive hamburger menu

#### `Footer.tsx`

- Developer links (API, Docs, Status)
- Legal links (Privacy, Terms, Contact)
- Social media icons
- Copyright notice

#### `CreditReminderBanner.tsx`

- Displays banner when user has low credits (< 10)
- "Buy More Credits" CTA → `/pricing`
- Conditionally rendered in `App.tsx`

### Core Components

#### `PromptGenerator.tsx`

- Main SVG generation form
- Prompt textarea with character counter
- Style dropdown (minimal, flat, line art, etc.)
- Model dropdown (GPT-4o, Claude Sonnet, etc.)
- Privacy switch (public/private)
- Generate button with loading state
- Result modal with download/copy options
- Auto-saves draft to sessionStorage
- Handles job resumption on reload
- Socket.IO integration for real-time status

**Dependencies:**

- `usePromptDraft` hook - Auto-save form data
- `useSvgGeneration` hook - Generation logic and Socket.IO
- `SvgResultModal` - Display generated SVG

#### `Notification.tsx`

- Single notification item
- Icon, title, message, timestamp
- Read/unread visual state
- Mark as read button
- Delete button
- Click to navigate (if `linkTo` present)

#### `ScrollToTop.tsx`

- Scrolls to top on route change
- Uses `useEffect` with `location.pathname` dependency

### UI Components (`src/components/ui/`)

#### `Dropdown.tsx`

- Generic dropdown component
- Label, current value, options array
- Search/filter functionality
- Keyboard navigation (arrow keys, Enter, Escape)
- Click-outside-to-close

#### `PrivacySwitch.tsx`

- Toggle switch for public/private generations
- Icons and labels
- Accessible (keyboard support)

#### `Modal.tsx`

- Base modal wrapper
- Backdrop with click-to-close
- Escape key to close
- Focus trap (optional)

### Page-Specific Components

#### `apiKeys/` folder

- `CreateKeyModal` - Form to create new API key
- `RevealKeyModal` - Show newly created key (one-time view)
- `KeyStatsPopover` - Display key usage statistics
- `RevokeConfirmModal` - Confirmation before revoking key
- `SummaryCard` - Usage summary card (total requests, etc.)
- `StatRow` - Single stat row in popover

#### `dashboard/` folder

- `RecentHistorySection` - Recent generations preview

#### `promptGenerator/` folder

- `usePromptDraft` - Custom hook for auto-saving form draft
- `useSvgGeneration` - Custom hook for generation logic

### Icon Components (`src/components/icons/`)

All icon components are functional components returning inline SVG:

- `LoaderIcon` - Spinning loader animation
- `PencilIcon` - Edit/prompt icon
- `GalleryIcon` - Gallery icon
- `CodeIcon` - API/code icon
- `DocsIcon` - Documentation icon
- `PricingIcon` - Pricing/credit icon

**Pattern:**

```typescript
export function IconName({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="..." />
    </svg>
  )
}
```

---

## 9. Custom Hooks

### `useAuth()`

**File:** `src/hooks/useAuth.ts`

**Purpose:** Access authentication context.

**Returns:**

```typescript
{
  user: User | null
  isLoading: boolean
  login: (email, password, rememberMe) => Promise<void>
  register: (name, email, password, agreedToTerms) => Promise<void>
  logout: () => Promise<void>
  updateUserCredits: (creditsUsed) => void
  refreshAccessToken: () => Promise<void>
  checkAuth: () => Promise<void>
}
```

**Usage:**

```typescript
const { user, isLoading, login } = useAuth()

if (isLoading) return <Loader />
if (!user) return <SignInPrompt />
return <ProtectedContent />
```

### `useToast()`

**File:** `src/hooks/useToast.ts`

**Purpose:** Display toast notifications.

**Returns:**

```typescript
{
  showToast: (message: string, type: 'success' | 'error' | 'info') => void
}
```

**Usage:**

```typescript
const { showToast } = useToast()
showToast('Changes saved!', 'success')
```

### `useNotifications()`

**File:** `src/hooks/useNotifications.ts`

**Purpose:** Access notifications context.

**Returns:**

```typescript
{
  notifications: Notification[]
  unreadCount: number
  isLoading: boolean
  fetchNotifications: () => Promise<void>
  markAsRead: (id: string) => Promise<void>
  markAllAsRead: () => Promise<void>
  deleteNotification: (id: string) => Promise<void>
  refreshBadgeCount: () => Promise<void>
}
```

**Usage:**

```typescript
const { notifications, unreadCount, markAsRead } = useNotifications()
```

### `usePromptDraft()` (Custom)

**File:** `src/components/promptGenerator/usePromptDraft.ts`

**Purpose:** Auto-save form data to sessionStorage.

**Signature:**

```typescript
function usePromptDraft<T>(
  sessionKey: string,
  initialValue: T,
): [T, (value: T | ((prev: T) => T)) => void]
```

**Behavior:**

- Returns `[data, setData]` like `useState`
- Automatically saves to sessionStorage on change (debounced)
- Restores from sessionStorage on mount

**Usage:**

```typescript
const [formData, setFormData] = usePromptDraft('svg_prompt_draft', {
  prompt: '',
  style: 'minimal',
  model: 'gpt-4o',
})
```

### `useSvgGeneration()` (Custom)

**File:** `src/components/promptGenerator/useSvgGeneration.ts`

**Purpose:** Handle SVG generation logic with Socket.IO.

**Returns:**

```typescript
{
  isGenerating: boolean
  generatedResult: GenerationResult | null
  errorMessage: string | null
  handleGenerate: (formData) => Promise<void>
  handleExistingJob: (jobId, jobStatus) => void
  resetResult: () => void
}
```

**Features:**

- Initiates generation via API
- Listens for Socket.IO `jobProgress` and `jobComplete` events
- Handles idempotency (prevents duplicate submissions)
- Manages loading/error states
- Auto-resumes job on page reload

---

## 10. Real-time Updates

### Socket.IO Integration

**File:** `src/lib/socket.ts`

**Configuration:**

```typescript
const socket = io(getSocketOrigin(), {
  withCredentials: true, // Send cookies for auth
  autoConnect: false, // Manual connection control
})
```

**Connection Management:**

- `setupSocket()` - Connect socket (called after login)
- `disconnectSocket()` - Disconnect socket (called on logout)
- Auto-reconnection handled by Socket.IO library

### Event Handling

**1. SVG Generation Status**

**Events:**

- `jobProgress` - Job status update (queued → processing → complete)
- `jobComplete` - Final result with SVG data

**Listener Setup (in `useSvgGeneration.ts`):**

```typescript
useEffect(() => {
  const socket = getSocket()

  socket.on('jobProgress', (data) => {
    // Update progress state
  })

  socket.on('jobComplete', (data) => {
    // Update result state
    // Show success toast
  })

  return () => {
    socket.off('jobProgress')
    socket.off('jobComplete')
  }
}, [jobId])
```

**2. Notifications**

**Event:** `notification` - New notification received

**Listener Setup (in `NotificationsProvider.tsx`):**

```typescript
useEffect(() => {
  if (!user) return

  const socket = getSocket()

  socket.on('notification', (notification: Notification) => {
    // Add to notifications array
    // Increment unread count
    // Play sound (optional)
    // Show browser notification (optional)
  })

  return () => {
    socket.off('notification')
  }
}, [user])
```

### Reconnection Logic

**Automatic Reconnection:**

- Socket.IO handles reconnection automatically
- Exponential backoff (1s, 2s, 4s, 8s, ...)
- Max attempts: Infinity (keeps retrying)

**Manual Reconnection:**

```typescript
socket.on('disconnect', () => {
  console.log('Socket disconnected')
})

socket.on('connect', () => {
  console.log('Socket connected')
  // Re-subscribe to rooms if needed
})
```

**Job Resumption:**

- On page reload, check sessionStorage for active `jobId`
- If found, re-subscribe to Socket.IO events for that job
- Backend delivers missed events (if job completed during disconnect)

---

## 11. Styling Patterns

### Tailwind CSS v4

**Configuration:** Tailwind is configured via `@tailwindcss/vite` plugin in `vite.config.ts`.

**Global Styles:** `src/index.css`

```css
@import 'tailwindcss';

/* Custom CSS variables for theme colors */
:root {
  --wizard-orange: #f97316;
  --wizard-red: #ef4444;
}

/* Custom utility classes */
.bg-linear-to-r {
  background-image: linear-gradient(to right, var(--tw-gradient-stops));
}
```

### Color Palette

**Primary Colors:**

- `wizard-orange` (#f97316) - Primary brand color
- `wizard-red` (#ef4444) - Accent color

**Gradients:**

```html
<div class="bg-linear-to-r from-wizard-orange to-wizard-orange/90">
  Button with gradient
</div>
```

**Gray Scale:**

- `gray-50` to `gray-900` - Standard Tailwind grays

### Component Styling Patterns

**1. Cards:**

```html
<div
  class="rounded-2xl border border-gray-200 bg-white shadow-sm p-6 hover:shadow-md transition-shadow"
>
  Card content
</div>
```

**2. Buttons (Primary):**

```html
<button
  class="rounded-lg bg-linear-to-r from-wizard-orange to-wizard-orange/90 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:from-wizard-orange/90 hover:to-wizard-orange transition-all"
>
  Click me
</button>
```

**3. Buttons (Secondary):**

```html
<button
  class="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
>
  Cancel
</button>
```

**4. Form Inputs:**

```html
<input
  class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-wizard-orange/40 focus:border-wizard-orange"
  placeholder="Enter text"
/>
```

**5. Modal Backdrop:**

```html
<div
  class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
>
  <div class="bg-white rounded-2xl shadow-xl border border-gray-200 max-w-lg">
    Modal content
  </div>
</div>
```

### Responsive Design

**Breakpoints:**

- `sm:` - 640px
- `md:` - 768px
- `lg:` - 1024px
- `xl:` - 1280px
- `2xl:` - 1536px

**Mobile-First Approach:**

```html
<div class="text-sm sm:text-base lg:text-lg">Responsive text size</div>

<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  Responsive grid
</div>
```

### Animation & Transitions

**Motion-Safe Prefix:**

```html
<div
  class="motion-safe:transition-transform motion-safe:duration-300 motion-safe:hover:scale-105"
>
  Animates only if user hasn't reduced motion
</div>
```

**Common Patterns:**

- `transition-colors` - Color transitions (200ms)
- `transition-all` - All properties (200ms)
- `hover:shadow-md` - Shadow on hover
- `hover:-translate-y-1` - Lift effect

### Dark Mode

**Status:** Not implemented yet.

**Future Pattern:**

```html
<div class="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
  Dark mode support
</div>
```

---

## 12. Form Handling

### Approach

**Library:** None - Native React state management with controlled components.

### Pattern

```typescript
// 1. Define form state
const [formData, setFormData] = useState({
  email: '',
  password: '',
  rememberMe: false,
})

// 2. Define errors state
const [errors, setErrors] = useState<Record<string, string>>({})

// 3. Handle input changes
const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value, type, checked } = e.target
  setFormData(prev => ({
    ...prev,
    [name]: type === 'checkbox' ? checked : value,
  }))
  // Clear error for this field
  if (errors[name]) {
    setErrors(prev => ({ ...prev, [name]: '' }))
  }
}

// 4. Validate form
const validate = (): boolean => {
  const newErrors: Record<string, string> = {}

  if (!formData.email) {
    newErrors.email = 'Email is required'
  } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    newErrors.email = 'Email is invalid'
  }

  if (!formData.password) {
    newErrors.password = 'Password is required'
  } else if (formData.password.length < 8) {
    newErrors.password = 'Password must be at least 8 characters'
  }

  setErrors(newErrors)
  return Object.keys(newErrors).length === 0
}

// 5. Handle submit
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()

  if (!validate()) return

  setSubmitting(true)
  try {
    await login(formData.email, formData.password, formData.rememberMe)
    navigate('/dashboard')
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Login failed'
    showToast(message, 'error')
  } finally {
    setSubmitting(false)
  }
}

// 6. Render form
return (
  <form onSubmit={handleSubmit}>
    <input
      type="email"
      name="email"
      value={formData.email}
      onChange={handleChange}
    />
    {errors.email && <p className="text-red-600 text-sm">{errors.email}</p>}

    <button type="submit" disabled={submitting}>
      {submitting ? 'Submitting...' : 'Submit'}
    </button>
  </form>
)
```

### Validation Patterns

**Client-Side:**

- Email format: `/\S+@\S+\.\S+/`
- Password length: Min 8 characters
- Required fields: Check truthy value
- Character limits: `maxLength` attribute

**Server-Side:**

- Backend returns error messages in response
- Frontend displays them via toast or inline errors

### Error Display

**Inline Errors:**

```html
<input class={errors.email ? 'border-red-300' : 'border-gray-300'} />
{errors.email && <p class="text-red-600 text-sm mt-1">{errors.email}</p>}
```

**Toast Errors:**

```typescript
catch (error) {
  showToast(error.message, 'error')
}
```

---

## 13. Error Handling

### Error Boundaries

**1. AppErrorBoundary** (`src/components/AppErrorBoundary.tsx`)

- Wraps entire app in `main.tsx`
- Integrates with Sentry for error reporting
- Displays user-friendly error page with feedback form
- Allows user to reset and continue

**2. ErrorBoundary** (`src/components/ErrorBoundary.tsx`)

- Used by React Router for route-level errors
- Displays 404 page for missing routes
- Catches rendering errors in route components

### API Error Handling

**Service Layer:**

```typescript
try {
  const response = await api.post('/endpoint', data)
  return response.data
} catch (error) {
  if (axios.isAxiosError(error)) {
    const message =
      error.response?.data?.error ||
      error.response?.data?.message ||
      'Something went wrong'
    throw new Error(message)
  }
  throw error
}
```

**Component Layer:**

```typescript
try {
  await someApiCall()
  showToast('Success!', 'success')
} catch (error) {
  const message = error instanceof Error ? error.message : 'Operation failed'
  showToast(message, 'error')
  logger.error('Operation failed', error)
}
```

### Toast Notification System

**Implementation:** `src/context/ToastProvider.tsx`

**Features:**

- 3-second auto-dismiss
- Color-coded by type (green=success, red=error, blue=info)
- Positioned at top-center
- Smooth fade-in/out animations

**Usage:**

```typescript
const { showToast } = useToast()

showToast('SVG generated successfully!', 'success')
showToast('Failed to generate SVG', 'error')
showToast('This is just information', 'info')
```

### Sentry Integration

**File:** `src/services/logger.ts`

**Initialization:**

```typescript
import * as Sentry from '@sentry/react'

export function initSentry() {
  if (import.meta.env.PROD) {
    Sentry.init({
      dsn: import.meta.env.VITE_SENTRY_DSN,
      integrations: [
        Sentry.browserTracingIntegration(),
        Sentry.replayIntegration(),
      ],
      tracesSampleRate: 0.1,
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0,
    })
  }
}
```

**Usage:**

```typescript
import { logger } from '../services/logger'

logger.error('Something went wrong', error)
logger.warn('This is a warning')
logger.info('This is informational')
```

**User Feedback:**

```typescript
Sentry.showReportDialog({
  eventId: 'event-id',
  user: { email: user.email },
})
```

---

## 14. Performance

### Code Splitting

**Pattern:** React.lazy() for route-level code splitting.

**Example:**

```typescript
const AdminPage = React.lazy(() => import('./pages/Admin'))

<Route
  path="/admin"
  element={
    <Suspense fallback={<Loader />}>
      <AdminPage />
    </Suspense>
  }
/>
```

**Current Status:** Not implemented yet (all routes are eagerly loaded).

### Lazy Loading

**Images:**

```html
<img src="image.jpg" loading="lazy" alt="Description" />
```

**Components:**

```typescript
const HeavyComponent = React.lazy(() => import('./HeavyComponent'))

<Suspense fallback={<Spinner />}>
  <HeavyComponent />
</Suspense>
```

### Memoization

**React.memo:**

```typescript
export const ExpensiveComponent = React.memo(({ data }) => {
  // Only re-renders if data changes
  return <div>{data}</div>
})
```

**useMemo:**

```typescript
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(data)
}, [data])
```

**useCallback:**

```typescript
const memoizedCallback = useCallback(() => {
  doSomething(a, b)
}, [a, b])
```

### Build Optimizations

**Vite Configuration:**

```typescript
esbuild: {
  drop: mode === 'production' ? ['console', 'debugger'] : [],
}
```

- Removes console.log and debugger statements in production
- Tree-shaking unused code
- Minification enabled by default
- CSS purging via Tailwind

### Performance Monitoring

**Tools:**

- Vercel Analytics (built-in)
- Sentry Performance Monitoring
- React DevTools Profiler

**Metrics:**

- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)
- Time to Interactive (TTI)
- Cumulative Layout Shift (CLS)

---

## 15. Environment Variables

### Available Variables

**Required:**

```bash
VITE_API_BASE_URL=https://api.chatsvg.dev/api
```

**Optional:**

```bash
VITE_SENTRY_DSN=https://...@sentry.io/...
VITE_ENABLE_ANALYTICS=true
```

### Usage in Code

```typescript
const apiUrl = import.meta.env.VITE_API_BASE_URL
const isDev = import.meta.env.DEV
const isProd = import.meta.env.PROD
```

### Environment Files

**.env.local** (local development, gitignored):

```bash
VITE_API_BASE_URL=http://localhost:3000/api
```

**.env.production** (production builds):

```bash
VITE_API_BASE_URL=https://api.chatsvg.dev/api
```

### Vercel Environment Variables

Set in Vercel dashboard under Project Settings → Environment Variables:

- `VITE_API_BASE_URL` (Production, Preview, Development)
- `VITE_SENTRY_DSN` (Production only)

---

## 16. Build & Deployment

### Build Process

**Development:**

```bash
npm run dev
# Starts Vite dev server on http://localhost:5173
```

**Production Build:**

```bash
npm run build
# 1. TypeScript compilation (tsc -b)
# 2. Vite build (outputs to dist/)
# 3. Minification & tree-shaking
```

**Preview Build:**

```bash
npm run preview
# Serves production build locally
```

### Vercel Configuration

**File:** `vercel.json`

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

**Purpose:** Client-side routing - all requests serve `index.html` for React Router to handle.

### Deployment Workflow

**1. Preview Deployments (Pull Requests):**

- Every PR triggers automatic preview deployment
- Unique URL: `chatsvg-pr-123.vercel.app`
- Uses preview environment variables
- Runs E2E tests (optional)

**2. Production Deployment (main branch):**

- Push to `main` triggers production deployment
- URL: `chatsvg.com` (custom domain)
- Uses production environment variables
- Automatic rollback on errors

**3. Manual Deployment:**

```bash
# From Vercel CLI
vercel --prod
```

### Build Optimization

**Outputs:**

- `dist/index.html` - Entry HTML
- `dist/assets/index-[hash].js` - Main JS bundle
- `dist/assets/index-[hash].css` - Main CSS bundle
- `dist/assets/[chunk]-[hash].js` - Code-split chunks

**Cache Headers:**

- HTML: No cache (always fresh)
- Assets: Immutable (aggressive caching via hashed filenames)

---

## 17. Testing

### Unit & Component Tests (Vitest)

**Configuration:** `vite.config.ts`

```typescript
test: {
  environment: 'jsdom',
  setupFiles: './src/test/setup.ts',
}
```

**Setup File:** `src/test/setup.ts`

```typescript
import '@testing-library/jest-dom'
```

**Test Utilities:** `src/test/test-utils.tsx`

- Custom `render()` with providers (Auth, Toast, Router)

**Run Tests:**

```bash
npm run test        # Run all tests
npm run test:watch  # Watch mode
npm run test:ui     # Vitest UI
npm run coverage    # Coverage report
```

**Example Test:**

```typescript
import { render, screen } from '../test/test-utils'
import Dashboard from './Dashboard'

test('renders prompt generator', () => {
  render(<Dashboard />)
  expect(screen.getByPlaceholderText(/describe the SVG/i)).toBeInTheDocument()
})
```

### E2E Tests (Playwright)

**Configuration:** `playwright.config.ts`

**Test Structure:**

```
tests/
├── auth.setup.spec.ts         # Auth state setup
├── auth/                      # Authentication tests
│   ├── signin.spec.ts
│   └── signup.spec.ts
├── authenticated/             # Tests requiring auth
│   ├── history.spec.ts
│   └── api-keys.spec.ts
├── smoke/                     # Basic smoke tests
│   └── homepage.spec.ts
└── svg/                       # SVG generation tests
    └── generate.spec.ts
```

**Run E2E Tests:**

```bash
npx playwright test              # Run all tests
npx playwright test --headed     # With browser UI
npx playwright test --debug      # Debug mode
npx playwright show-report       # View HTML report
```

**Example Test:**

```typescript
import { test, expect } from '@playwright/test'

test('user can generate SVG', async ({ page }) => {
  await page.goto('/')
  await page.fill('textarea[name="prompt"]', 'A red circle')
  await page.click('button:has-text("Generate")')
  await expect(page.locator('.svg-result')).toBeVisible()
})
```

### Test Patterns

**Component Testing:**

- Test user interactions, not implementation details
- Use accessible queries (`getByRole`, `getByLabelText`)
- Mock API calls with MSW (Mock Service Worker)

**E2E Testing:**

- Test critical user flows (auth, generation, purchase)
- Use `auth.setup.spec.ts` for shared auth state
- Run against production-like environment

**Coverage Goals:**

- Unit tests: 70%+
- E2E tests: Critical paths covered

---

## 18. Development Workflow

### Local Setup

**1. Clone Repository:**

```bash
git clone https://github.com/your-org/chatsvg-frontend.git
cd chatsvg-frontend/client
```

**2. Install Dependencies:**

```bash
npm install
```

**3. Set Up Environment:**

```bash
cp .env.example .env.local
# Edit .env.local with local API URL
```

**4. Start Dev Server:**

```bash
npm run dev
# App runs on http://localhost:5173
```

**5. Start Backend (separate terminal):**

```bash
cd ../backend
npm run dev
# API runs on http://localhost:3000
```

### Git Workflow

**Branching Strategy:**

- `main` - Production branch
- `feat/feature-name` - New features
- `fix/bug-name` - Bug fixes
- `chore/task-name` - Maintenance tasks

**Commit Messages:**

```
feat: add API key management page
fix: resolve CSRF token refresh issue
chore: upgrade React to 19.2.0
docs: update README with setup instructions
```

**Pull Request Process:**

1. Create feature branch from `main`
2. Make changes and commit
3. Push branch to GitHub
4. Create PR with description
5. Wait for CI checks (linting, tests)
6. Get code review approval
7. Merge to `main`

### Linting & Formatting

**Run Linter:**

```bash
npm run lint
```

**Linting Rules:**

- ESLint with TypeScript plugin
- React Hooks rules enforced
- React Refresh rules for HMR

**Auto-Fix:**

```bash
eslint . --fix
```

**Editor Integration:**

- VS Code: Install ESLint extension
- Configure `settings.json`:

```json
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

### Hot Module Replacement (HMR)

**Vite HMR:**

- Changes to `.tsx` files trigger instant updates
- React Fast Refresh preserves component state
- CSS changes applied without full reload

**Limitations:**

- Context provider changes require full reload
- Route configuration changes require full reload

---

## 19. Common Patterns

### How to Add a New Page

**1. Create Page Component:**

```typescript
// src/pages/NewPage.tsx
export default function NewPage() {
  return (
    <div className="w-full max-w-7xl mx-auto py-10 px-4">
      <h1 className="text-4xl font-bold text-gray-900">New Page</h1>
    </div>
  )
}
```

**2. Register Route:**

```typescript
// src/routes/index.tsx
import NewPage from '../pages/NewPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      // ... existing routes
      {
        path: 'new-page',
        element: <NewPage />,
      },
    ],
  },
])
```

**3. Add Navigation Link:**

```typescript
// src/components/Header.tsx
<Link to="/new-page">New Page</Link>
```

### How to Add a New API Call

**1. Define Types:**

```typescript
// src/types/feature.ts
export interface FeatureData {
  id: string
  name: string
  createdAt: string
}
```

**2. Create Service Function:**

```typescript
// src/services/featureService.ts
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  withCredentials: true,
})

export async function getFeature(id: string): Promise<FeatureData> {
  try {
    const response = await api.get<FeatureData>(`/features/${id}`)
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.error || 'Failed to fetch feature'
      throw new Error(message)
    }
    throw error
  }
}
```

**3. Use in Component:**

```typescript
import { useEffect, useState } from 'react'
import { getFeature } from '../services/featureService'

function FeatureComponent({ id }: { id: string }) {
  const [data, setData] = useState<FeatureData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    const fetchData = async () => {
      try {
        const result = await getFeature(id)
        if (!cancelled) setData(result)
      } catch (err) {
        if (!cancelled) setError(err.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchData()
    return () => { cancelled = true }
  }, [id])

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  if (!data) return null

  return <div>{data.name}</div>
}
```

### How to Create a New Component

**1. Create Component File:**

```typescript
// src/components/MyComponent.tsx
interface MyComponentProps {
  title: string
  onClick?: () => void
}

export function MyComponent({ title, onClick }: MyComponentProps) {
  return (
    <div className="rounded-lg border border-gray-200 p-4">
      <h3 className="text-lg font-bold">{title}</h3>
      {onClick && (
        <button onClick={onClick} className="mt-2 text-sm text-blue-600">
          Click me
        </button>
      )}
    </div>
  )
}
```

**2. Use Component:**

```typescript
import { MyComponent } from '../components/MyComponent'

<MyComponent
  title="Hello"
  onClick={() => console.log('Clicked')}
/>
```

### How to Add a New Form

**1. Define Form State:**

```typescript
const [formData, setFormData] = useState({
  name: '',
  email: '',
  message: '',
})
```

**2. Handle Changes:**

```typescript
const handleChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
) => {
  const { name, value } = e.target
  setFormData((prev) => ({ ...prev, [name]: value }))
}
```

**3. Validate & Submit:**

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()

  // Validation
  if (!formData.name || !formData.email) {
    showToast('Please fill in all fields', 'error')
    return
  }

  // Submit
  try {
    await submitForm(formData)
    showToast('Form submitted!', 'success')
    setFormData({ name: '', email: '', message: '' })
  } catch (error) {
    showToast('Submission failed', 'error')
  }
}
```

**4. Render Form:**

```tsx
<form onSubmit={handleSubmit}>
  <input
    type="text"
    name="name"
    value={formData.name}
    onChange={handleChange}
    className="w-full rounded-lg border border-gray-300 px-3 py-2"
  />
  <button
    type="submit"
    className="mt-4 px-4 py-2 bg-wizard-orange text-white rounded-lg"
  >
    Submit
  </button>
</form>
```

---

## 20. Quick Reference

### Making API Calls

```typescript
// GET request
import { api } from '../services/authService'

const response = await api.get<DataType>('/endpoint')
const data = response.data

// POST request with data
const response = await api.post<ReturnType>('/endpoint', {
  key: 'value',
})

// With error handling
try {
  const response = await api.post('/endpoint', data)
  showToast('Success!', 'success')
  return response.data
} catch (error) {
  const message = error instanceof Error ? error.message : 'Failed'
  showToast(message, 'error')
}
```

### Accessing User Context

```typescript
import { useAuth } from '../hooks/useAuth'

const { user, isLoading } = useAuth()

if (isLoading) return <Loader />
if (!user) return <SignInPrompt />

return <div>Welcome, {user.name}!</div>
```

### Protected Route Pattern

```typescript
function ProtectedPage() {
  const { user, isLoading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/signin', { replace: true })
    }
  }, [user, isLoading, navigate])

  if (isLoading) return <LoadingScreen />
  if (!user) return null

  return <div>Protected content</div>
}
```

### Socket.IO Event Listener

```typescript
import { getSocket } from '../lib/socket'

useEffect(() => {
  const socket = getSocket()

  socket.on('eventName', (data) => {
    console.log('Received:', data)
    // Update state based on event
  })

  return () => {
    socket.off('eventName')
  }
}, [dependency])
```

### Toast Notifications

```typescript
import { useToast } from '../hooks/useToast'

const { showToast } = useToast()

// Success toast
showToast('Operation successful!', 'success')

// Error toast
showToast('Something went wrong', 'error')

// Info toast
showToast('This is just information', 'info')
```

### Navigation

```typescript
import { useNavigate, Link } from 'react-router-dom'

// Programmatic navigation
const navigate = useNavigate()
navigate('/dashboard')
navigate(-1) // Go back

// Link component
<Link to="/pricing" className="text-blue-600">
  View Pricing
</Link>

// With state
navigate('/profile', { state: { from: 'dashboard' } })
```

### Conditional Rendering

```typescript
// If/else
{user ? <UserMenu /> : <SignInButton />}

// Logical AND
{isLoading && <Spinner />}

// Nullish coalescing
{error ?? 'No error'}

// Ternary with null
{data ? <DataDisplay data={data} /> : null}
```

### List Rendering

```typescript
{items.map((item) => (
  <div key={item.id}>
    {item.name}
  </div>
))}
```

### Loading States

```typescript
const [loading, setLoading] = useState(false)

const handleAction = async () => {
  setLoading(true)
  try {
    await someApiCall()
  } finally {
    setLoading(false)
  }
}

return (
  <button disabled={loading}>
    {loading ? 'Loading...' : 'Submit'}
  </button>
)
```

---

## Additional Resources

- **React Docs:** https://react.dev
- **Vite Docs:** https://vitejs.dev
- **React Router Docs:** https://reactrouter.com
- **Tailwind CSS Docs:** https://tailwindcss.com
- **Axios Docs:** https://axios-http.com
- **Socket.IO Client Docs:** https://socket.io/docs/v4/client-api/
- **Vitest Docs:** https://vitest.dev
- **Playwright Docs:** https://playwright.dev

---

**End of AGENTS.md**
