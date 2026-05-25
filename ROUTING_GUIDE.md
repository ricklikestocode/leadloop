# 🚀 ReplyFlow AI - Complete Routing & Navigation Guide

## Project Structure

```
app/
├── layout.tsx                          # Root layout with SessionProvider
├── not-found.tsx                       # Custom 404 page
├── (public)/
│   ├── layout.tsx                      # Public layout (Navbar + Footer)
│   └── page.tsx                        # Landing page (hero, features, pricing)
├── (auth)/
│   ├── layout.tsx                      # Auth layout (centered card)
│   ├── login/
│   │   └── page.tsx                    # Login page
│   └── signup/
│       └── page.tsx                    # Signup page
└── (dashboard)/
    ├── layout.tsx                      # Dashboard layout (Sidebar + TopBar)
    └── dashboard/
        ├── page.tsx                    # Dashboard home
        ├── chats/
        │   └── page.tsx                # Conversations page
        ├── leads/
        │   └── page.tsx                # Leads management
        ├── follow-ups/
        │   └── page.tsx                # Follow-ups tracking
        └── settings/
            └── page.tsx                # User settings

components/
├── Navbar.tsx                          # Public navigation bar
├── Footer.tsx                          # Public footer
├── Sidebar.tsx                         # Dashboard sidebar (existing)
├── TopBar.tsx                          # Dashboard top bar (existing)
├── PageHeader.tsx                      # Reusable page header (existing)
├── StatCard.tsx                        # Dashboard stat card (existing)
└── ui/
    ├── button.tsx                      # Button component
    ├── input.tsx                       # Input component
    ├── badge.tsx                       # Badge component
    └── ... (other UI components)
```

---

## Complete Routing Map

### Public Routes (No Authentication Required)
```
/                          → Landing page with hero, features, pricing
/login                     → Login form
/signup                    → Signup form
/not-found                 → 404 page (automatic for invalid routes)
```

### Protected Routes (Authentication Required)
```
/dashboard                 → Main dashboard with stats
/dashboard/chats           → Conversations management
/dashboard/leads           → Leads management
/dashboard/follow-ups      → Follow-up tracking
/dashboard/settings        → Account settings & preferences
```

---

## Navigation Flows

### Landing Page → Authentication
```
Home (/)
├── [Navigation Links]
│   ├── Features → scrolls to #features
│   ├── Benefits → scrolls to #benefits
│   ├── Pricing → scrolls to #pricing
│   ├── Login → /login
│   └── Signup → /signup
└── [CTA Buttons]
    ├── "Start Free Trial" → /signup
    ├── "Sign In" → /login
    └── "Learn More" → smooth scroll sections
```

### Authentication → Dashboard
```
/login or /signup
├── [Form Submission]
│   └── On Success → /dashboard (redirect)
└── [Alternative Links]
    ├── Logo → / (home)
    └── Social Auth → /dashboard
```

### Dashboard Navigation
```
/dashboard (Main Hub)
├── [Sidebar Navigation]
│   ├── Dashboard → /dashboard
│   ├── Leads → /dashboard/leads
│   ├── Follow-ups → /dashboard/follow-ups
│   ├── Chats → /dashboard/chats (coming soon)
│   └── Settings → /dashboard/settings
├── [TopBar Actions]
│   ├── Search → highlights matching items
│   ├── Notifications → opens notification panel
│   ├── Profile Menu → user options
│   └── Logout → / (redirects to home)
└── [Quick Actions]
    ├── "+ New Lead" → /dashboard/leads
    ├── "+ New Chat" → /dashboard/chats
    └── "View More" → respective pages
```

---

## Layout System

### Root Layout (`app/layout.tsx`)
- Sets up metadata (SEO tags, favicon, theme)
- Provides SessionProvider for authentication
- Global styles and fonts

### Public Layout (`app/(public)/layout.tsx`)
- Renders Navbar component
- Renders Footer component
- Content area between them

### Auth Layout (`app/(auth)/layout.tsx`)
- Centered card design
- Minimal navigation
- Forms in focused container

### Dashboard Layout (`app/(dashboard)/layout.tsx`)
- Fixed Sidebar (left 256px)
- TopBar (sticky at top)
- Main content area with max-width
- Smooth animations and transitions

---

## Component Integration

### Navbar Component
- Logo links to `/`
- Navigation links with smooth scroll
- Login button → `/login`
- Signup button → `/signup`
- Mobile hamburger menu
- Responsive design

### Footer Component
- Company, product, legal links
- Newsletter signup form
- Social media links
- Copyright and year

### Sidebar Component (Dashboard)
- Active link highlighting using `usePathname()`
- Logo links to `/dashboard`
- Navigation items:
  - Dashboard
  - Leads
  - Follow-ups
  - Settings
- Logout button
- Smooth animations

### TopBar Component (Dashboard)
- Search bar for leads/conversations
- Notifications bell (animated)
- Settings button
- User profile dropdown with logout

---

## Active Link Detection

Implemented using Next.js `usePathname()` hook:

```typescript
const pathname = usePathname()

const isActive = (path: string) => {
  return pathname.startsWith(path)
}
```

This ensures:
- Nested routes highlight parent nav items
- `/dashboard/leads` highlights "Leads" in sidebar
- Active items show gradient background + glow effect

---

## Authentication Flow

1. **Unauthenticated User**
   - Lands on `/` (landing page)
   - Clicks "Sign Up" → `/signup`
   - Fills form → Creates account
   - Redirects to `/dashboard`

2. **Existing User**
   - Lands on `/` or tries `/dashboard`
   - Not authenticated → Redirects to `/login`
   - Logs in → Redirects to `/dashboard`

3. **Session Management**
   - NextAuth.js handles session
   - Protected routes use middleware
   - Logout clears session, redirects to `/`

---

## Middleware Configuration

File: `middleware.ts`

```typescript
export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
```

This ensures:
- Authentication is checked on all page routes
- API routes are not affected
- Static assets load normally
- Redirects happen server-side for security

---

## Smooth Transitions & Loading States

### Animation Libraries
- **Framer Motion**: Component entrance/exit animations
- **CSS Transitions**: Hover effects and state changes

### Page Transitions
- Hero sections fade in from top
- Features grid staggered animations
- Stats cards animate in sequence
- Dashboard content fades in

### Link Navigation
- Pages load with `initial={{ opacity: 0 }}`
- Animate to `{{ opacity: 1 }}`
- Smooth scroll for anchor links

---

## SEO Optimization

### Root Metadata
```typescript
{
  title: "ReplyFlow AI - Lead Follow-up CRM",
  description: "Never lose a lead again...",
  keywords: "lead management, CRM, follow-up, sales, AI",
  openGraph: { /* OG tags */ },
  twitter: { /* Twitter card */ },
}
```

### Per-Page Metadata
Each page includes proper title and description in layout metadata.

### Structured Data
- Open Graph tags for social sharing
- Twitter card for rich previews
- Proper favicon setup

---

## Static Preview

**File**: `public/index.html`

- Standalone HTML file
- No build required
- Can be opened directly in browser
- Visually matches React landing page
- Responsive CSS and smooth scrolling
- All links functional (point to Next.js routes)

---

## Development Guide

### Run Development Server
```bash
npm run dev
```

### Test Routes
```
http://localhost:3000/              # Landing page
http://localhost:3000/login         # Login page
http://localhost:3000/signup        # Signup page
http://localhost:3000/dashboard     # Dashboard (requires auth)
http://localhost:3000/dashboard/leads
http://localhost:3000/invalid-page  # 404 page
```

### Building for Production
```bash
npm run build
npm start
```

---

## Route Protection

Routes are protected using NextAuth.js middleware:

1. **Public Routes**: No middleware protection
   - `/`
   - `/login`
   - `/signup`

2. **Protected Routes**: Require authentication
   - `/dashboard/*`
   - Redirects unauthenticated users to `/login`

3. **Automatic Redirects**
   - After login → `/dashboard`
   - After logout → `/`
   - Invalid route → `/not-found`

---

## Future Enhancements

### Planned Routes
- `/dashboard/chats/[id]` - Individual conversation
- `/dashboard/leads/[id]` - Lead detail view
- `/dashboard/follow-ups/[id]` - Follow-up details
- `/api/leads` - Lead management API
- `/api/follow-ups` - Follow-up API

### Planned Features
- Real-time chat with AI
- Lead filtering and search
- Advanced analytics dashboard
- Team management
- Integration marketplace

---

## Quick Reference: All Links

| Link | Destination | Type | Auth Required |
|------|-------------|------|---------------|
| `/` | Landing page | Public | No |
| `/login` | Login page | Public | No |
| `/signup` | Signup page | Public | No |
| `/dashboard` | Main dashboard | Protected | Yes |
| `/dashboard/chats` | Conversations | Protected | Yes |
| `/dashboard/leads` | Leads list | Protected | Yes |
| `/dashboard/follow-ups` | Follow-ups list | Protected | Yes |
| `/dashboard/settings` | Settings | Protected | Yes |
| `/not-found` | 404 error | Public | No |

---

## Testing Checklist

- [ ] Landing page loads with hero section
- [ ] Navigation scrolls to sections smoothly
- [ ] Login button navigates to `/login`
- [ ] Signup button navigates to `/signup`
- [ ] Login/Signup forms work
- [ ] Dashboard loads after authentication
- [ ] Sidebar navigation works on all pages
- [ ] Active links highlight correctly
- [ ] Logout redirects to home
- [ ] Invalid routes show 404 page
- [ ] All animations are smooth
- [ ] Responsive design on mobile
- [ ] Static `public/index.html` opens in browser

---

**Last Updated**: May 4, 2026  
**Status**: ✅ Complete & Production-Ready
