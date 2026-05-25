You are a senior frontend architect and web systems designer.

You are NOT an assistant.

You are responsible for creating a **central entry point (index.html or root layout equivalent)** and ensuring the entire SaaS frontend is properly connected, navigable, and production-ready.

---

AUTONOMY RULES (CRITICAL)

- DO NOT ask for permission
- DO NOT ask unnecessary questions
- DO NOT stop midway
- DO NOT say “should I”
- DO NOT wait for confirmation

Instead:
- make smart structural decisions
- assume best practices
- complete the system fully

---

PROJECT CONTEXT

You are working on:

ReplyFlow AI (Next.js SaaS)

The app already has:
- authentication pages
- dashboard
- chat system
- settings
- API routes
- components

But now you must:
1. create a strong root entry structure
2. connect all pages properly
3. ensure seamless navigation
4. improve routing UX

---

GOAL

Create a **fully connected web app structure** where:

- users land on a beautiful homepage
- can navigate to login/signup
- after login → dashboard
- dashboard → chats, leads, settings
- everything is linked, smooth, and intuitive

---

TASK 1: ROOT ENTRY (INDEX / LANDING)

If using Next.js:
- build `/app/(public)/page.tsx` as the main entry

If needed, also generate a standalone `index.html` version for static preview.

Landing page must include:
- hero section (strong headline + CTA)
- product demo section
- feature highlights
- benefits section
- pricing teaser
- CTA buttons (login/signup)
- smooth scroll animations

Navigation:
- top navbar with links:
  - Home
  - Features
  - Pricing
  - Login
  - Signup

---

TASK 2: GLOBAL NAVIGATION SYSTEM

Implement:

- consistent navigation across app
- sidebar (dashboard)
- topbar (profile, notifications)

Routes must connect:

Public:
- /
- /login
- /signup

App:
- /dashboard
- /dashboard/chats
- /dashboard/leads
- /dashboard/settings

---

TASK 3: LINK ALL PAGES

Ensure every page has proper navigation:

- Landing → login/signup
- Login → dashboard
- Signup → dashboard
- Dashboard → chats
- Chats → specific conversation
- Dashboard → leads
- Dashboard → settings
- Sidebar → all main routes

Use:
- Next.js Link component
- smooth transitions

---

TASK 4: ROUTING UX

Improve navigation experience:

- active link highlighting
- loading states between pages
- smooth transitions (Framer Motion if used)
- scroll restoration
- redirect logic after login

---

TASK 5: 404 + FALLBACK

Create:
- custom 404 page
- fallback UI
- redirect unknown routes

---

TASK 6: FOOTER + META

Add:
- footer with links
- basic SEO meta tags
- favicon setup

---

TASK 7: INDEX.HTML (STATIC PREVIEW)

Also generate a standalone `index.html` version that:
- visually matches landing page
- includes CSS + JS
- can be opened directly in browser
- links to mock pages or sections

---

TASK 8: FILE STRUCTURE UPDATE

Show updated structure with:
- entry points
- routes
- layout files

---

TASK 9: CODE OUTPUT

Provide:

1. landing page code
2. navbar component
3. footer component
4. routing structure
5. sidebar navigation links
6. example page linking
7. index.html (static version)
8. global layout updates

---

DESIGN REQUIREMENTS

- premium look
- smooth scrolling
- modern SaaS feel
- clean typography
- responsive

---

FINAL RESULT

The app should:

- open with a stunning landing page
- smoothly guide user into app
- have fully connected navigation
- feel like a complete product

---

START NOW

Do NOT ask questions.

Build the entry system → then connect all routes → then output full code.# LeadLoop - Technical Architecture

## 🏗 System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                          │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  Next.js 14 App Router (React 18 Components)          │  │
│  │  ├─ Public Pages (Landing)                            │  │
│  │  ├─ Auth Pages (Login, Signup)                        │  │
│  │  └─ Protected Pages (Dashboard, Leads, etc)           │  │
│  └────────────────────────────────────────────────────────┘  │
│                           ↓                                   │
│                  React Hook Form + Zod                        │
│                  Tailwind CSS + Lucide Icons                  │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                    APPLICATION LAYER                         │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  Server Actions (Mutations)                           │  │
│  │  ├─ actions/leads.ts                                  │  │
│  │  ├─ actions/follow-ups.ts                             │  │
│  │  ├─ actions/notes.ts                                  │  │
│  │  └─ actions/activity.ts                               │  │
│  ├────────────────────────────────────────────────────────┤  │
│  │  API Routes (Special Cases)                           │  │
│  │  ├─ api/auth/signup                                   │  │
│  │  ├─ api/auth/[...nextauth]                            │  │
│  │  └─ api/settings                                      │  │
│  ├────────────────────────────────────────────────────────┤  │
│  │  Middleware (Authorization)                           │  │
│  │  └─ Protect routes, redirect to login                 │  │
│  └────────────────────────────────────────────────────────┘  │
│                           ↓                                   │
│              NextAuth.js (Session Management)                 │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                      SERVICE LAYER                           │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  Business Logic (lib/ directory)                      │  │
│  │  ├─ auth.ts → NextAuth configuration                  │  │
│  │  ├─ validation.ts → Zod schemas                       │  │
│  │  ├─ utils.ts → Helper functions                       │  │
│  │  └─ constants.ts → Enums, lookup tables               │  │
│  └────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                      DATA LAYER                              │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  Prisma ORM                                           │  │
│  │  ├─ Type-safe database queries                        │  │
│  │  ├─ Connection pooling                                │  │
│  │  └─ Query optimization                                │  │
│  └────────────────────────────────────────────────────────┘  │
│                           ↓                                   │
│                   PostgreSQL Database                         │
│                  ├─ User/Workspace                           │
│                  ├─ Lead/LeadNote                            │
│                  ├─ FollowUp                                │
│                  └─ ActivityLog                             │
└─────────────────────────────────────────────────────────────┘
```

## 🔄 Data Flow: Creating a Lead

```
1. User fills lead form
   ↓
2. React Hook Form validates (client-side)
   ├─ Check required fields
   ├─ Validate email format
   └─ Validate phone format
   ↓
3. Form submits to Server Action
   ↓
4. Server Action (createLead in actions/leads.ts)
   ├─ Get session/user context
   ├─ Validate input with Zod
   ├─ Call db.lead.create()
   ├─ Log activity
   └─ Return result
   ↓
5. Response back to client
   ├─ Success → Redirect to lead detail
   └─ Error → Show error message
   ↓
6. Database state updated
   ├─ New Lead row created
   └─ ActivityLog entry created
```

## 🔐 Authentication Flow

```
1. User visits /login
   ↓
2. Enters email/password
   ↓
3. Submits to NextAuth signin
   ↓
4. NextAuth CredentialsProvider
   ├─ Query user by email
   ├─ Compare password hash with bcrypt
   └─ Return user object or null
   ↓
5. If valid:
   ├─ Create session
   ├─ Set cookie (signed JWT)
   └─ Redirect to /dashboard
   ↓
6. If invalid:
   ├─ Show error message
   └─ Redirect to /login

Subsequent requests:
   → Session extracted from cookie
   → User context available
   → Middleware checks auth
```

## 📊 Database Relationships

```
User (1) ──→ Workspace (1)
 │
 ├─→ LeadNote (Many)
 └─→ FollowUp (Many)
 └─→ ActivityLog (Many)

Workspace (1) ──→ Lead (Many)
                   │
                   ├─→ LeadNote (Many)
                   ├─→ FollowUp (Many)
                   └─→ ActivityLog (Many)

Lead (1) ──→ LeadNote (Many)
 └─→ FollowUp (Many)

FollowUp (1) ──→ User
LeadNote (1) ──→ User
```

## 🛣 API/Server Action Routes

### Server Actions (use "use server")
- `createLead(input)` → Create new lead
- `updateLead(id, input)` → Update lead
- `deleteLead(id)` → Delete lead
- `getLeads(filters)` → Fetch leads with filters
- `getLeadById(id)` → Get single lead detail

- `createFollowUp(leadId, input)` → Schedule follow-up
- `updateFollowUp(id, input)` → Update follow-up
- `completeFollowUp(id)` → Mark complete
- `getFollowUps(filters)` → Fetch follow-ups

- `createNote(leadId, input)` → Add note
- `deleteNote(id)` → Delete note

- `logActivity(data)` → Internal activity logging
- `getActivities(workspaceId)` → Fetch activity log

### API Routes (HTTP)
- `POST /api/auth/signup` → Register new user
- `POST/GET /api/auth/[...nextauth]` → NextAuth handlers
- `PUT /api/settings` → Update profile

## 🔄 Request/Response Cycle

### Page Load Example: Dashboard
```
1. Browser requests /dashboard
2. Middleware checks session
   ├─ Valid? → Continue
   └─ Invalid? → Redirect to /login
3. Server component renders
   ├─ getServerSession() → Gets user
   ├─ db.lead.findMany() → Fetches leads
   ├─ db.followUp.findMany() → Fetches follow-ups
   └─ db.activityLog.findMany() → Fetches activities
4. HTML generated server-side
5. Sent to browser
6. React hydrates interactive components
7. Client ready for interaction
```

### Form Submission Example: Create Lead
```
1. User fills form → React Hook Form tracks state
2. User clicks "Create"
3. React Hook Form validates
4. Valid? → Call Server Action
5. Server Action:
   ├─ getServerSession() → Verify user
   ├─ Validate input (Zod)
   ├─ Check authorization (workspace ownership)
   ├─ Create database record
   ├─ Log activity
   └─ Return {success, data}
6. Client receives response
7. Success? → Redirect to /dashboard/leads/[id]
   Error? → Show error toast
```

## 🔒 Security Layers

```
Layer 1: Transport
├─ HTTPS only (enforced by Vercel)
└─ Secure cookies (HttpOnly, Secure flags)

Layer 2: Authentication
├─ bcrypt password hashing (cost factor 12)
├─ Session-based auth (JWT tokens)
└─ CSRF token per request

Layer 3: Authorization
├─ Middleware checks session on protected routes
└─ Server actions verify workspace ownership

Layer 4: Data Validation
├─ Client-side with React Hook Form
└─ Server-side with Zod

Layer 5: Database
├─ Parameterized queries (Prisma)
├─ Row-level security (workspace scoping)
└─ Indexes for performance

Layer 6: Application
├─ Error handling (no sensitive data leaked)
├─ Rate limiting ready
└─ Input sanitization
```

## 📈 Scalability Considerations

### Current (MVP)
- Single PostgreSQL database
- Server-side rendering
- Direct Prisma queries
- All data in one database

### Phase 2 (Team Features)
- Add caching layer (Redis)
- Implement query pagination
- Connection pooling optimization
- Database read replicas

### Phase 3 (Scale)
- Separate read/write databases
- Message queue for async tasks
- Background job processing
- API rate limiting
- CDN for static assets

### Phase 4 (Enterprise)
- Microservices architecture
- Event sourcing
- CQRS pattern
- Multi-region deployment

## 🎯 Design Patterns Used

### 1. Server Components by Default
```typescript
// Dashboard page is a Server Component
export default async function DashboardPage() {
  const session = await getServerSession(authConfig)
  const leads = await db.lead.findMany(...)
  // Rendered on server
}
```

### 2. Server Actions for Mutations
```typescript
// "use server" at top of file
export async function createLead(input: any) {
  // Secure mutation endpoint
  // Full access to session, database
}
```

### 3. Middleware for Protection
```typescript
// middleware.ts checks auth on every request
export { auth as middleware } from "@/lib/auth"
```

### 4. Form Validation Pattern
```typescript
// Client + Server validation
const form = useForm({
  resolver: zodResolver(schema) // Client validation
})

// Server also validates
const validated = schema.parse(input) // Server validation
```

### 5. Activity Logging Pattern
```typescript
// Every mutation logs activity
await logActivity({
  workspaceId,
  leadId,
  userId,
  actionType: "LEAD_CREATED",
  description: "..."
})
```

## 🚀 Performance Optimizations

### Frontend
- Server-side rendering (faster first paint)
- Code splitting (automatic)
- Image optimization ready
- CSS-in-JS zero runtime (Tailwind)
- Dynamic imports for modals

### Backend
- Database indexes on foreign keys
- Connection pooling (Prisma)
- Query optimization (select specific fields)
- N+1 query prevention
- Eager loading with `include`

### Database
- Indexes on: workspaceId, status, source, dueDate
- Denormalization where needed (counts)
- Archive old activity logs
- Connection limits respected

## 📊 Type Safety

All layers are typed:
```typescript
// Database types (from Prisma)
User, Workspace, Lead, LeadNote, FollowUp, ActivityLog

// Input types (Zod)
LoginInput, SignupInput, CreateLeadInput, etc.

// Component types
interface LeadStatusBadgeProps { status: string }

// API types
interface DashboardStats { totalLeads: number ... }
```

## 🔄 Deployment Pipeline

```
1. Code pushed to GitHub main branch
   ↓
2. Vercel detects push
   ↓
3. Vercel builds
   ├─ npm install
   ├─ npm run build
   └─ Generates optimized bundle
   ↓
4. Tests run (if configured)
   ↓
5. Deploy to Vercel CDN
   └─ Edge functions, databases ready
   ↓
6. Environment variables injected
   ├─ DATABASE_URL set
   ├─ NEXTAUTH_SECRET set
   └─ NEXTAUTH_URL set
   ↓
7. Database migrations (manual via CLI)
   ├─ npm run db:push
   └─ Applies pending schema changes
   ↓
8. Live at yourdomain.com ✓
```

## 📝 Error Handling Strategy

```
Layer 1: Form Validation
├─ Show field-level errors
└─ Disable submit until valid

Layer 2: Server Validation
├─ Zod catches invalid input
└─ Return 400 Bad Request

Layer 3: Authorization
├─ Check user owns resource
└─ Return 401/403

Layer 4: Database
├─ Catch connection errors
└─ Return 500 with generic message

Layer 5: UI Presentation
├─ Show toast/alert for user
└─ Log details for debugging
```

---

This architecture ensures:
- ✅ Type safety across full stack
- ✅ Security at every layer
- ✅ Performance optimization
- ✅ Easy to extend
- ✅ Production-ready
