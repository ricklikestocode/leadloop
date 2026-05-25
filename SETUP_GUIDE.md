# LeadLoop - Complete Setup Guide

This is your step-by-step guide to get LeadLoop running in 10 minutes.

## ✅ Checklist

- [ ] Node.js 18+ installed
- [ ] PostgreSQL running locally or have a cloud connection string
- [ ] Code editor (VS Code recommended)
- [ ] Terminal/Command Prompt

## 📋 Step 1: Prepare Your Environment (2 min)

### 1a. Check Node.js
```bash
node --version  # Should be v18 or higher
npm --version
```

### 1b. Install PostgreSQL (if not already installed)

**macOS:**
```bash
brew install postgresql
brew services start postgresql
```

**Ubuntu/Debian:**
```bash
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
```

**Windows:**
- Download from https://www.postgresql.org/download/windows/
- Use PostgreSQL installer
- Remember your password

**Or use cloud database (easier):**
- Sign up for Supabase: https://supabase.com
- Create new project
- Copy connection string

### 1c. Create Database
```bash
createdb leadloop
```

## 🔧 Step 2: Configure Project (2 min)

### 2a. Clone and Install
```bash
cd /path/to/B2BSAAS
npm install
```

This will install all 30+ dependencies.

### 2b. Set Environment Variables
```bash
# Create and edit the environment file
nano .env.local  # or use your editor
```

**Add these variables:**
```env
# Database connection string
DATABASE_URL="postgresql://username:password@localhost:5432/leadloop"

# For local development, you might use:
DATABASE_URL="postgresql://postgres:password@localhost:5432/leadloop"

# NextAuth configuration
NEXTAUTH_URL="http://localhost:3000"

# Generate this with:
# openssl rand -base64 32
NEXTAUTH_SECRET="your-generated-secret-here"
```

**Generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
# Copy the output and paste in .env.local
```

**Using Supabase?**
Your `DATABASE_URL` will be provided in Supabase dashboard:
```env
DATABASE_URL="postgresql://[user]:[password]@[host]:[port]/[database]?sslmode=require"
```

## 💾 Step 3: Initialize Database (3 min)

```bash
# Apply database schema
npm run db:push

# You'll see:
# Environment variables loaded from .env.local
# Datasource "db": PostgreSQL database "leadloop"
# ...

# This will sync Prisma schema to your database
```

**Expected output:**
```
✔ Prisma schema is in sync with the database.
```

### 3b. Seed with Demo Data
```bash
npm run db:seed
```

**You'll see:**
```
Creating demo user and workspace...
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

## 🚀 Step 4: Start Development Server (1 min)

```bash
npm run dev
```

**You'll see:**
```
▲ Next.js 14.0.0
- Local:        http://localhost:3000
```

## 🌐 Step 5: Access Your App (2 min)

### 5a. Open in Browser
Go to: **http://localhost:3000**

### 5b. Test the App

**Sign In with demo account:**
- Email: `user@example.com`
- Password: `password123`

**You should see:**
- Dashboard with metrics
- 5 sample leads
- Upcoming follow-ups
- Recent activity

### 5c. Try These Actions

1. **Create a new lead:**
   - Click "+ New Lead" button
   - Fill in the form
   - Click "Create Lead"

2. **Edit a lead:**
   - Click on any lead
   - Click "Edit" button
   - Update fields
   - Click "Save Changes"

3. **Add a note:**
   - View a lead detail
   - Click "+ Add Note"
   - Type your note
   - Click "Save Note"

4. **Schedule follow-up:**
   - View a lead detail
   - Click "+ Add Follow-Up"
   - Pick a date/time
   - Click "Schedule"

5. **Filter leads:**
   - Go to /dashboard/leads
   - Use the search bar and filters
   - See results update

6. **View follow-ups:**
   - Go to /dashboard/follow-ups
   - See Overdue, Today, and Upcoming sections

## 🧪 Common Test Scenarios

### Scenario 1: Lead from WhatsApp
```
Name: Client Name
Company: Their Company
Phone: +1 (555) 123-4567
Source: WhatsApp
Status: New
Priority: High
```

### Scenario 2: Web Inquiry
```
Name: Website Visitor
Email: visitor@company.com
Source: Website
Status: New
Notes: Filled form at bottom of home page
```

### Scenario 3: Referral
```
Name: John Referral
Company: New Corp
Phone: +1 (555) 987-6543
Source: Referral
Status: Interested
Priority: High
Value: $25000
```

## 🔑 User Credentials

### Default Demo Account
- **Email**: user@example.com
- **Password**: password123

### Create Your Own Account
1. Go to http://localhost:3000
2. Click "Sign up"
3. Fill in the form
4. Click "Create account"
5. Go to login page
6. Sign in with your credentials

## 📊 What's Pre-Loaded

The seed script creates:
- ✅ 1 workspace (Demo Agency)
- ✅ 1 admin user
- ✅ 5 sample leads with various statuses
- ✅ Notes on some leads
- ✅ Scheduled follow-ups (including 1 overdue)
- ✅ Complete activity log

## 🛠 Useful Commands

```bash
# Start development
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Database schema to code
npm run db:push

# Reseed database
npm run db:seed

# Browse database visually
npm run db:studio

# Check for errors
npm run lint
```

## ⚠️ Troubleshooting

### "Cannot find module" error
```bash
# Re-install dependencies
npm install
```

### "DatabaseError: database 'leadloop' does not exist"
```bash
# Create the database
createdb leadloop

# Then try again
npm run db:push
```

### "connection refused" or "ECONNREFUSED"
PostgreSQL isn't running:
```bash
# macOS
brew services start postgresql

# Linux
sudo systemctl start postgresql

# Windows
# Open Services app and start "postgresql-x64-###"
```

### "NEXTAUTH_SECRET not found"
Make sure `.env.local` exists in project root with `NEXTAUTH_SECRET` set.

### "Session not found" after login
This means NextAuth didn't initialize properly. Check:
- [ ] NEXTAUTH_URL is correct
- [ ] NEXTAUTH_SECRET is set
- [ ] DATABASE_URL is correct

## 📁 First-Time Users: Key Files

- **Pages to explore:**
  - `app/(public)/page.tsx` - Landing page
  - `app/(auth)/login/page.tsx` - Login form
  - `app/dashboard/page.tsx` - Dashboard
  - `app/dashboard/leads/page.tsx` - Leads list

- **Key configurations:**
  - `prisma/schema.prisma` - Database schema
  - `.env.local` - Environment variables
  - `lib/constants.ts` - Lead statuses, sources, etc.

- **Server logic:**
  - `actions/leads.ts` - Lead creation/updates
  - `actions/follow-ups.ts` - Follow-up management
  - `lib/validation.ts` - Form validation rules

## 🎓 Next: Customization

Once everything is running:

1. **Change branding:**
   - Edit `app/(public)/page.tsx` hero section
   - Change logo in `components/Sidebar.tsx`

2. **Add custom fields:**
   - Edit `prisma/schema.prisma`
   - Run `npm run db:push`
   - Update forms and pages

3. **Add more lead sources:**
   - Add to `LeadSource` enum in schema
   - Update `lib/constants.ts`
   - Update forms

4. **Deploy to production:**
   - See `DEPLOYMENT_GUIDE.md`

## ✨ You're Ready!

Your LeadLoop instance is now running. Start by:
1. Exploring the demo data
2. Creating a test lead
3. Scheduling a follow-up
4. Adding notes

**Welcome to LeadLoop!** 🎉

Need help? Check:
- README.md (comprehensive documentation)
- DEPLOYMENT_GUIDE.md (going live)
- Code comments throughout the project
