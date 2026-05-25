# LeadLoop - Never Lose a Lead Again

A production-ready MVP for a simple lead follow-up CRM designed for small service businesses, agencies, consultants, real estate agents, clinics, and local businesses.

## 🎯 Features

### Core Functionality
- **Lead Management**: Create, edit, delete, and track leads from multiple sources (WhatsApp, calls, email, Instagram, website forms, referrals)
- **Smart Follow-Up System**: Schedule, track, and complete follow-ups with visibility of overdue and upcoming tasks
- **Lead Status Tracking**: NEW → CONTACTED → INTERESTED → NEGOTIATION → WON/LOST
- **Rich Notes**: Add detailed notes to leads with timestamps and user attribution
- **Activity Timeline**: Complete audit trail of all actions on leads
- **Dashboard**: Real-time metrics, status distribution, and activity overview
- **Filtering & Search**: Find leads by name, status, source, or date range

### Technical Highlights
- Multi-tenant architecture (workspace-scoped data)
- Server-side rendering with Next.js 14 App Router
- Type-safe with TypeScript
- Beautiful, responsive UI with Tailwind CSS
- Form validation with React Hook Form + Zod
- Secure authentication with NextAuth.js
- PostgreSQL with Prisma ORM
- Activity logging for compliance and audit trails

## 🛠 Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Server Actions
- **Database**: PostgreSQL, Prisma ORM
- **Authentication**: NextAuth.js v5
- **Forms**: React Hook Form, Zod
- **UI Components**: shadcn/ui patterns, Lucide icons
- **Deployment**: Vercel-ready

## 📋 Prerequisites

- **Node.js 18+** (check with `node --version`)
- **npm** or **yarn** package manager
- **PostgreSQL 14+** (local or cloud instance)
- Git (for cloning)

## 🚀 Quick Start

### 1. Clone and Setup

```bash
# Clone the repository
git clone <your-repo-url>
cd leadloop

# Install dependencies
npm install
```

### 2. Configure Environment

```bash
# Copy the example environment file
cp .env.example .env.local

# Edit .env.local with your values
```

**Environment variables needed:**

```env
# Database (PostgreSQL)
DATABASE_URL="postgresql://username:password@localhost:5432/leadloop"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
```

**Generate a secure NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

**To set up PostgreSQL locally:**

On macOS with Homebrew:
```bash
brew install postgresql
brew services start postgresql
createdb leadloop
```

On Linux (Ubuntu):
```bash
sudo apt-get install postgresql postgresql-contrib
sudo -u postgres createdb leadloop
```

On Windows or for cloud databases:
- Use pgAdmin (local GUI)
- Use managed services like:
  - **Vercel Postgres** (easiest for deployment)
  - **Supabase** (free tier available)
  - **Railway** (simple hosting)
  - **Render** (good documentation)

### 3. Set Up Database

```bash
# Push Prisma schema to database
npm run db:push

# Seed database with demo data
npm run db:seed
```

You'll see:
```
✓ Demo user created: user@example.com
✓ 5 demo leads created
✓ Demo notes created
✓ Demo follow-ups created
✓ Demo activities created

✅ Database seeded successfully!

Demo credentials:
  Email: user@example.com
  Password: password123
```

### 4. Start Development Server

```bash
npm run dev
```

Server starts at **http://localhost:3000**

### 5. First Login

Visit http://localhost:3000 and use:
- **Email**: `user@example.com`
- **Password**: `password123`

## 📁 Project Structure

```
leadloop/
├── app/
│   ├── (auth)/                    # Login/signup routes
│   ├── (public)/                  # Landing page
│   ├── dashboard/                 # Protected dashboard routes
│   │   ├── leads/
│   │   ├── follow-ups/
│   │   └── settings/
│   ├── api/
│   │   └── auth/
│   └── globals.css
├── components/
│   ├── ui/                        # shadcn-style base components
│   ├── Sidebar.tsx
│   ├── StatCard.tsx
│   ├── LeadFilters.tsx
│   └── ...
├── lib/
│   ├── auth.ts                    # NextAuth configuration
│   ├── db.ts                      # Prisma client
│   ├── validation.ts              # Zod schemas
│   ├── utils.ts                   # Helper functions
│   └── constants.ts               # Enums and constants
├── actions/
│   ├── leads.ts                   # Server actions for leads
│   ├── follow-ups.ts
│   ├── notes.ts
│   └── activity.ts
├── prisma/
│   ├── schema.prisma              # Database schema
│   └── seed.ts                    # Demo data
└── types/
    └── index.ts                   # TypeScript types
```

## 🗄 Database Schema

### Core Models

**User**
- id, name, email, passwordHash
- workspaceId (foreign key)

**Workspace**
- id, name, ownerId (foreign key)
- timezone, createdAt, updatedAt

**Lead**
- id, workspaceId, name, company, phone, email
- source, status, priority, value
- followUpDate, lastContactedAt
- createdAt, updatedAt

**LeadNote**
- id, leadId, userId, content
- createdAt, updatedAt

**FollowUp**
- id, leadId, userId
- dueDate, completedAt, status
- createdAt, updatedAt

**ActivityLog**
- id, workspaceId, leadId, userId
- actionType, description
- createdAt

## 🔑 Key Features Breakdown

### Lead Statuses
- **NEW**: Just entered the system
- **CONTACTED**: You've reached out
- **INTERESTED**: They expressed interest
- **NEGOTIATION**: Active discussion
- **WON**: Deal closed
- **LOST**: Won't pursue further

### Lead Sources
- WhatsApp
- Call
- Email
- Instagram
- Website form
- Referral
- Other

### Follow-Up Logic
- Schedule follow-ups for any lead
- See overdue follow-ups prominently
- Mark follow-ups complete when done
- Automatically update lead's last contacted time

## 🔐 Security

- ✅ Password hashing with bcrypt
- ✅ Session-based authentication
- ✅ Protected API routes (check authorization)
- ✅ CSRF protection via NextAuth
- ✅ Input validation (Zod)
- ✅ SQL injection prevention (Prisma ORM)
- ✅ Multi-tenant data isolation (workspace scoping)

## 📊 API Routes

### Authentication
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/[...nextauth]` - NextAuth handlers

### Settings
- `PUT /api/settings` - Update profile settings

## 🚢 Deployment to Vercel

### 1. Push to GitHub

```bash
git add .
git commit -m "Initial LeadLoop commit"
git push origin main
```

### 2. Connect to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Select your GitHub repository
4. Vercel auto-detects Next.js

### 3. Add Environment Variables

In Vercel dashboard, add:
```
DATABASE_URL=<your-production-postgres-url>
NEXTAUTH_URL=<your-domain.com>
NEXTAUTH_SECRET=<generate-new-one>
```

### 4. Deploy

Vercel automatically deploys on push. Database migrations happen automatically.

### Production Database Recommendations

**Easiest: Vercel Postgres**
```bash
npm i @vercel/postgres
# Configure in Vercel dashboard
# Get connection string from Vercel
```

**Alternative: Supabase (PostgreSQL)**
- Free tier: 500MB storage, 2GB bandwidth
- Connection string provided
- https://supabase.com

**Alternative: Railway**
- Simple PostgreSQL provisioning
- https://railway.app

## 🧪 Testing the App

### Demo Data Included
After seeding, the app includes:
- 1 user account
- 5 sample leads with various statuses
- Notes and follow-ups for some leads
- Activity log entries

### Manual Testing Checklist
- [ ] Sign up with new email
- [ ] Login with credentials
- [ ] Create a new lead
- [ ] Edit the lead
- [ ] Add notes
- [ ] Schedule follow-ups
- [ ] Mark follow-up complete
- [ ] Filter leads by status/source
- [ ] View dashboard metrics
- [ ] Check activity log

## 🛠 Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Push database schema changes
npm run db:push

# Seed database with demo data
npm run db:seed

# Open Prisma Studio (database browser)
npm run db:studio

# Run linter
npm run lint
```

## 📝 Customization Guide

### Change Colors
Edit `app/globals.css` CSS variables or `tailwind.config.ts`

### Modify Database Schema
1. Edit `prisma/schema.prisma`
2. Run `npm run db:push`
3. Update types in `types/index.ts`

### Add New Fields to Leads
1. Add field to Prisma schema
2. Update validation schema in `lib/validation.ts`
3. Update form in `app/dashboard/leads/new/page.tsx`
4. Run `npm run db:push`

### Add New Lead Status
1. Update `LeadStatus` enum in `prisma/schema.prisma`
2. Update constants in `lib/constants.ts`
3. Run `npm run db:push`

## 🐛 Troubleshooting

### Issue: "DATABASE_URL not found"
**Solution**: Make sure `.env.local` exists in the root directory with `DATABASE_URL` set

### Issue: "Error: ECONNREFUSED" (PostgreSQL)
**Solution**: Ensure PostgreSQL is running:
```bash
# macOS
brew services start postgresql

# Linux
sudo systemctl start postgresql

# Windows
# Start PostgreSQL service or use pgAdmin
```

### Issue: "Prisma schema validation errors"
**Solution**: Run `npm run db:push` to sync schema

### Issue: "Session not found"
**Solution**: Ensure `NEXTAUTH_SECRET` is set and sessions table exists

## 📖 Learning Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [NextAuth.js Documentation](https://next-auth.js.org)
- [Tailwind CSS](https://tailwindcss.com)
- [React Hook Form](https://react-hook-form.com)
- [Zod Validation](https://zod.dev)

## 📦 What's Included

✅ Complete authentication system  
✅ Multi-tenant database structure  
✅ Lead management (CRUD)  
✅ Follow-up scheduling  
✅ Note-taking system  
✅ Activity logging  
✅ Dashboard with metrics  
✅ Responsive UI  
✅ Form validation  
✅ TypeScript types  
✅ Demo data seeding  
✅ Production-ready code  

## 🚫 What's NOT Included (Out of MVP Scope)

❌ Email notifications (easily added)  
❌ SMS reminders  
❌ Calendar integration  
❌ AI features  
❌ Team collaboration (comments, etc.)  
❌ Billing/payments  
❌ Invoicing  
❌ Advanced reporting  
❌ Mobile app  
❌ Third-party integrations  

## 💡 Next Steps for Production

1. **Add email notifications**
   - Use SendGrid or Resend
   - Send follow-up reminders
   - Send signup confirmation

2. **Add SMS reminders**
   - Integrate Twilio
   - Send SMS alerts for overdue follow-ups

3. **Enhance security**
   - Add rate limiting
   - Add email verification
   - Add 2FA

4. **Add features**
   - Bulk lead import
   - Export to CSV
   - Custom fields
   - Lead assignment (for teams)
   - Automation workflows

5. **Optimize**
   - Add caching
   - Optimize queries
   - Add pagination
   - Monitor performance

## 📞 Support

For issues, questions, or feature requests:
1. Check the troubleshooting section above
2. Review code comments
3. Check Next.js and Prisma docs
4. Create GitHub issues

## 📄 License

MIT - Use freely for personal and commercial projects

---

**LeadLoop** - Never lose a lead again.

Built with ❤️ for entrepreneurs and small business owners.
