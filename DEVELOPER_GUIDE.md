# LeadLoop - Developer Quick Reference

Quick answers to common questions while developing.

## ⚡ Common Tasks

### Add a New Field to Lead

1. **Update Prisma Schema**
```prisma
model Lead {
  id            String   @id @default(cuid())
  ...
  newField      String?  // Add your field
  ...
}
```

2. **Push to Database**
```bash
npm run db:push
```

3. **Update Validation Schema** (`lib/validation.ts`)
```typescript
export const createLeadSchema = z.object({
  // ... existing fields
  newField: z.string().optional(),
});
```

4. **Update Form** (`app/dashboard/leads/new/page.tsx`)
```tsx
<div className="space-y-2">
  <Label htmlFor="newField">New Field</Label>
  <Input id="newField" {...register("newField")} />
</div>
```

5. **Update Lead Detail Page** (`app/dashboard/leads/[id]/page.tsx`)
```tsx
<div>
  <h4 className="text-sm font-medium text-gray-600 mb-1">New Field</h4>
  <p className="text-gray-900">{lead.newField || "-"}</p>
</div>
```

### Add a New Lead Status

1. **Update Schema** (`prisma/schema.prisma`)
```prisma
enum LeadStatus {
  NEW
  CONTACTED
  INTERESTED
  NEGOTIATION
  WON
  LOST
  CUSTOM_STATUS  // Add here
}
```

2. **Update Constants** (`lib/constants.ts`)
```typescript
export const LEAD_STATUSES = [
  // ... existing
  { value: "CUSTOM_STATUS", label: "Custom Status", color: "bg-pink-100 text-pink-800" },
];
```

3. **Push to Database**
```bash
npm run db:push
```

### Add a New Lead Source

1. **Update Schema** (`prisma/schema.prisma`)
```prisma
enum LeadSource {
  WHATSAPP
  CALL
  EMAIL
  INSTAGRAM
  WEBSITE
  REFERRAL
  OTHER
  NEW_SOURCE  // Add here
}
```

2. **Update Constants** (`lib/constants.ts`)
```typescript
export const LEAD_SOURCES = [
  // ... existing
  { value: "NEW_SOURCE", label: "New Source" },
];
```

3. **Push to Database**
```bash
npm run db:push
```

### Create a New Server Action

1. **Create File** (`actions/myfeature.ts`)
```typescript
"use server";

import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";

export async function myAction(id: string) {
  try {
    const session = await getServerSession(authConfig);
    if (!session?.user) throw new Error("Unauthorized");

    // Your logic here
    const result = await db.mymodel.findUnique({ where: { id } });

    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
```

2. **Import in Component**
```typescript
import { myAction } from "@/actions/myfeature";

// Use in Server Action or form submit
const result = await myAction(id);
```

### Create a New Route

1. **Page Component** (`app/dashboard/mypage/page.tsx`)
```typescript
export default async function MyPage() {
  const session = await getServerSession(authConfig);
  const data = await db.model.findMany();

  return (
    <div>
      {/* Your content */}
    </div>
  );
}
```

2. **Route Auto-created**
The page is now available at `/dashboard/mypage`

### Create a New API Route

1. **Create Route** (`app/api/myapi/route.ts`)
```typescript
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Your logic
    return NextResponse.json({ data: "..." });
  } catch (error) {
    return NextResponse.json({ error: "..." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  // Process body
  return NextResponse.json({ success: true });
}
```

### Add Form Validation

1. **Create Zod Schema** (`lib/validation.ts`)
```typescript
export const mySchema = z.object({
  name: z.string().min(2, "Name required"),
  email: z.string().email("Valid email required"),
});
```

2. **Use in Form**
```typescript
const form = useForm({
  resolver: zodResolver(mySchema),
});
```

3. **Use in Server Action**
```typescript
const validated = mySchema.parse(input);
```

### Create a Reusable Component

1. **Create Component** (`components/MyComponent.tsx`)
```typescript
"use client"; // Add if using hooks

interface MyComponentProps {
  title: string;
  onClick?: () => void;
}

export function MyComponent({ title, onClick }: MyComponentProps) {
  return (
    <div onClick={onClick}>
      {title}
    </div>
  );
}
```

2. **Import and Use**
```typescript
import { MyComponent } from "@/components/MyComponent";

export default function MyPage() {
  return <MyComponent title="Hello" />;
}
```

## 🔍 Debugging

### View Database Data Visually
```bash
npm run db:studio
# Opens http://localhost:5555
```

### Check Database State
```typescript
// In any server action
const allLeads = await db.lead.findMany({
  where: { workspaceId }
});
console.log(allLeads); // Will appear in server logs
```

### Debug Session
```typescript
const session = await getServerSession(authConfig);
console.log("Session:", session);
```

### View Server Logs Locally
```bash
npm run dev
# Logs appear in terminal
```

### Browser DevTools
- Open http://localhost:3000
- Press F12
- Network tab: Check API calls
- Console: Check client errors
- Application: Check cookies/session

## 📦 Adding Dependencies

### Tailwind Plugin
```bash
npm install @tailwindcss/forms
```

Then add to `tailwind.config.ts`:
```typescript
plugins: [require("@tailwindcss/forms")]
```

### UI Component
```bash
npm install @radix-ui/react-dropdown-menu
```

Then create `components/ui/dropdown.tsx` following shadcn patterns.

### Utility Package
```bash
npm install lodash-es
npm install --save-dev @types/lodash-es
```

## 🧪 Testing Locally

### Create Test Lead
1. Go to `/dashboard/leads/new`
2. Fill minimal form (just name and source)
3. Click "Create Lead"
4. Should redirect to lead detail

### Test Filters
1. Go to `/dashboard/leads`
2. Use search box, status filter, source filter
3. URL should update with query params
4. Results should filter

### Test Offline Functionality
Open DevTools → Network → Offline
App should gracefully handle errors.

## 🐛 Common Issues & Fixes

| Issue | Solution |
|-------|----------|
| "Cannot find module" | `npm install` |
| Prisma out of sync | `npm run db:push` |
| Types not found | Ensure imports are correct |
| Session not working | Check NEXTAUTH_SECRET is set |
| Form not validating | Check Zod schema matches form fields |
| Database errors | Check DATABASE_URL is valid |
| Styling not applied | Hard refresh (Ctrl+Shift+R) |

## 🎯 Code Style Guide

### Naming Conventions
- Components: `PascalCase` → `LeadStatusBadge`
- Functions: `camelCase` → `getLeadById`
- Constants: `UPPER_SNAKE_CASE` → `LEAD_STATUSES`
- Folders: `lowercase` → `components`, `actions`
- Files: Match export name → `LeadStatusBadge.tsx`

### Component Structure
```typescript
"use client"; // If using hooks

import { FC } from "react";
import { ... } from "@/lib/...";

interface MyComponentProps {
  title: string;
  isActive?: boolean;
}

export function MyComponent({ title, isActive }: MyComponentProps) {
  // Component code
  return <div>{title}</div>;
}
```

### Server Action Structure
```typescript
"use server";

import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";

export async function myAction(input: any) {
  try {
    const session = await getServerSession(authConfig);
    if (!session?.user) throw new Error("Unauthorized");

    // Validate
    // Query database
    // Log activity
    // Return result

    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
```

## 📚 File Organization

```
app/           → Pages and layouts
components/    → React components
lib/           → Utilities and config
actions/       → Server mutations
types/         → Shared types
prisma/        → Database schema
public/        → Static files
```

**Rule**: Keep related files close to where they're used.

## 🚀 Performance Tips

1. **Use Server Components by Default**
   Only add `"use client"` when you need client features.

2. **Fetch Data on Server**
   Get data in Server Components, not in Client Components.

3. **Optimize Database Queries**
   Only select fields you need:
   ```typescript
   db.lead.findMany({
     select: { id: true, name: true, email: true } // Not *
   })
   ```

4. **Use Prisma `include` Wisely**
   Don't fetch relations you don't need.

5. **Add Database Indexes**
   Often-filtered fields should be indexed in schema:
   ```prisma
   status  String  @db.VarChar(50)
   @@index([status])
   ```

## 🔐 Security Reminders

- ✅ Always check session in Server Actions
- ✅ Validate workspace ownership (user owns data)
- ✅ Never expose sensitive data to client
- ✅ Use parameterized queries (Prisma does this)
- ✅ Validate all inputs (Zod)
- ✅ Log important actions (security audit trail)

## 🎓 Learning Resources

Inside the project:
- Read `README.md` for overview
- Read `ARCHITECTURE.md` for design
- Read page code to see patterns
- Read server action code to see mutations

External:
- Next.js Docs: https://nextjs.org/docs
- Prisma Docs: https://www.prisma.io/docs/
- NextAuth Docs: https://next-auth.js.org/
- Tailwind Docs: https://tailwindcss.com/docs

## 💡 Pro Tips

1. **Use Prisma Studio**
   ```bash
   npm run db:studio
   # Browse and edit data visually
   ```

2. **Reseed Database**
   ```bash
   npm run db:seed
   # Clear and repopulate with demo data
   ```

3. **Push Schema Changes**
   ```bash
   npm run db:push
   # Sync schema to database
   ```

4. **Watch for Changes**
   ```bash
   npm run dev
   # Auto-reloads on file changes
   ```

5. **Check TypeScript Errors**
   ```bash
   npx tsc --noEmit
   # Type-check entire project
   ```

---

**Quick Start:**
```bash
npm install
npm run db:push
npm run dev
# Visit http://localhost:3000
```

**Default Login:**
- Email: `user@example.com`
- Password: `password123`

Happy coding! 🎉
