# Phase 2 Implementation & Integration Guide

## 🚀 Getting Started with Phase 2

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Installation Steps

#### 1. Install Dependencies
```bash
npm install

# If you have dependency conflicts, use:
npm install --force
```

#### 2. Setup Database

Create `.env.local`:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/leadloop"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="$(openssl rand -base64 32)"
```

Initialize database:
```bash
# Sync Prisma schema with database
npx prisma db push

# Seed demo data (optional)
npm run db:seed

# View database in Studio
npx prisma studio
```

#### 3. Start Development Server
```bash
npm run dev
```

Application runs at `http://localhost:3000`

#### 4. Login with Demo Credentials
```
Email: demo@replyflow.ai
Password: demo123456
```

---

## 🔑 Key Concepts

### Workspaces
- Each user can belong to multiple workspaces
- Data is completely isolated by workspace
- Users see only their assigned workspace by default

### Roles & Permissions
- **OWNER**: Full control, manages team and billing
- **ADMIN**: Team management and business logic
- **AGENT**: Can work with assigned leads/conversations

### Real-Time Architecture
- **Current**: Polling-based (5-second intervals)
- **Future**: WebSocket support ready
- Fallback to HTTP long-polling if needed

---

## 📊 Using the Analytics System

### Recording Daily Analytics
This should be run as a cron job daily:

```typescript
import { recordDailyAnalytics } from '@/actions/analytics';

// Schedule for 11:59 PM daily
export async function scheduleAnalytics() {
  await recordDailyAnalytics(workspaceId);
}
```

### Accessing Analytics
```typescript
import { getWorkspaceAnalytics } from '@/actions/analytics';

const result = await getWorkspaceAnalytics(workspaceId);
if (result.success) {
  console.log(result.analytics);
}
```

### Dashboard Integration
The `/dashboard/analytics` page shows:
- Key metrics cards
- Daily trend charts
- Lead distribution pie chart
- Follow-ups activity

---

## 🤝 Team Management Workflows

### Adding Team Members
```typescript
import { inviteTeamMember } from '@/actions/team';

const result = await inviteTeamMember(workspaceId, {
  email: 'john@company.com',
  role: 'AGENT'
});
```

### Permission Checks
```typescript
import { hasPermission } from '@/lib/auth-utils';

if (hasPermission(userRole, 'canManageTeam')) {
  // Show team management UI
}
```

---

## 💬 Conversation Management

### Creating Conversations
```typescript
import { createConversation } from '@/actions/conversations';

const result = await createConversation(workspaceId, {
  leadId: lead.id,
  title: `Conversation with ${lead.name}`,
  assignedToUserId: userId,
});
```

### Sending Messages
```typescript
import { sendMessage } from '@/actions/conversations';

const result = await sendMessage(conversationId, 'Hello, how can we help?');
```

### Getting Conversation History
```typescript
import { getConversation } from '@/actions/conversations';

const result = await getConversation(conversationId);
// Includes all messages and participants
```

---

## 🤖 Follow-Up Automation Rules

### Creating a Rule
```typescript
import { createFollowUpRule } from '@/actions/follow-up-rules';

const result = await createFollowUpRule(workspaceId, {
  name: 'Auto follow-up',
  triggerType: 'NO_REPLY_HOURS',
  triggerValue: 24,
  description: 'Send follow-up if no reply within 24 hours',
  isActive: true,
});
```

### Rule Trigger Types
1. **NO_REPLY_HOURS** - Trigger after X hours of no response
2. **STATUS_CHANGE** - Trigger when lead status changes
3. **DAYS_SINCE_CONTACT** - Trigger after X days since last contact

### Processing Rules (Cron Job)
```typescript
export async function processFollowUpRules(workspaceId: string) {
  const rules = await db.followUpRule.findMany({
    where: { workspaceId, isActive: true }
  });

  for (const rule of rules) {
    // Process each rule based on triggerType
    // Create automatic follow-ups
    // Send notifications
  }
}
```

---

## 🔔 Notifications System

### Creating Notifications
```typescript
import { createNotification } from '@/actions/notifications';

await createNotification(
  workspaceId,
  userId,
  'NEW_MESSAGE',
  'New message from John',
  'John Doe replied to your message',
  `/dashboard/conversations/${conversationId}`
);
```

### Broadcast to Team
```typescript
import { notifyTeamMembers } from '@/actions/notifications';

await notifyTeamMembers(
  workspaceId,
  excludeUserId, // Don't notify the person who triggered it
  'LEAD_ASSIGNED',
  'New Lead Assigned',
  'You have been assigned a new lead',
  `/dashboard/leads/${lead.id}`
);
```

### Notification Types
- `NEW_MESSAGE` - New message in conversation
- `OVERDUE_FOLLOWUP` - Follow-up is overdue
- `LEAD_ASSIGNED` - Lead assigned to user
- `TEAM_MEMBER_JOINED` - New team member joined
- `CONVERSATION_ASSIGNED` - Conversation assigned

---

## 🧩 Integrating with External Services

### WhatsApp Integration Example
```typescript
// Handle incoming WhatsApp messages
export async function handleWhatsAppWebhook(req: NextRequest) {
  const { phoneNumber, message, leadId } = req.body;

  // Find or create conversation
  let conversation = await db.conversation.findUnique({
    where: { workspaceId_leadId: { workspaceId, leadId } },
  });

  if (!conversation) {
    conversation = await createConversation(workspaceId, {
      leadId,
      title: `WhatsApp - ${phoneNumber}`,
    });
  }

  // Add message
  await sendMessage(conversation.id, message);

  // Create notification
  await createNotification(
    workspaceId,
    assignedUserId,
    'NEW_MESSAGE',
    'New WhatsApp message',
    message
  );
}
```

### Stripe Webhook Integration
```typescript
export async function handleStripeWebhook(req: NextRequest) {
  const event = req.body;

  switch (event.type) {
    case 'customer.subscription.created':
      // Update workspace subscription status
      break;
    case 'customer.subscription.deleted':
      // Handle subscription cancellation
      break;
  }
}
```

---

## 🔐 Authorization Patterns

### Protecting Server Actions
```typescript
export async function protectedAction(workspaceId: string) {
  const session = await getSession();
  if (!session?.user) throw new Error('Unauthorized');

  // Check workspace access
  const canAccess = await canAccessWorkspace(workspaceId);
  if (!canAccess) throw new Error('Access denied');

  // Check specific permission
  const workspace = await db.workspaceUser.findUnique({
    where: {
      workspaceId_userId: {
        workspaceId,
        userId: session.user.id,
      },
    },
  });

  if (!hasPermission(workspace.role, 'canManageTeam')) {
    throw new Error('Insufficient permissions');
  }

  // Proceed with action
}
```

### Client Component Authorization
```typescript
'use client';

import { useSession } from 'next-auth/react';
import { hasPermission } from '@/lib/auth-utils';

export function TeamManagement({ workspaceId }: { workspaceId: string }) {
  const { data: session } = useSession();

  if (!session?.user || !hasPermission(session.user.role, 'canManageTeam')) {
    return <div>Access denied</div>;
  }

  return <TeamMembersList />;
}
```

---

## 🧪 Testing Workflows

### Test Team Collaboration
1. Create workspace as OWNER
2. Invite 2 AGENTS
3. Create lead
4. Create conversation
5. Assign conversation to AGENT 1
6. AGENT 1 sends message
7. Verify AGENT 2 receives notification
8. Change lead status
9. Verify follow-up rule triggers

### Test Analytics
1. Create 10 leads with various statuses
2. Create follow-ups
3. Check daily snapshot in WorkspaceAnalytics
4. View dashboard charts
5. Verify metrics calculation

### Test Permissions
1. Login as AGENT
2. Try to access team management (should fail)
3. Try to access analytics (should fail)
4. Can access assigned leads (should pass)
5. Login as ADMIN
6. All above should pass for ADMIN

---

## 🐛 Debugging Tips

### Enable Database Logging
```typescript
// lib/db.ts
export const db = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});
```

### Check User Role in Session
```typescript
const session = await getSession();
console.log('User role:', session?.user?.role);
```

### Verify Workspace Access
```typescript
const canAccess = await canAccessWorkspace(workspaceId);
console.log('Can access:', canAccess);
```

### Debug Notifications
```typescript
const notifications = await db.notification.findMany({
  where: { userId: session.user.id },
  take: 10,
});
console.log('Latest notifications:', notifications);
```

---

## 📈 Performance Tuning

### Database Indexes
```prisma
// Already configured in schema, but verify with:
// prisma studio → Database → Show indexes
```

### Query Optimization
```typescript
// ✅ Good - Includes relations efficiently
const conversation = await db.conversation.findUnique({
  where: { id: conversationId },
  include: {
    messages: { take: 50 },
    lead: true,
    assignedTo: true,
  },
});

// ❌ Avoid - N+1 queries
const conversations = await db.conversation.findMany();
for (const conv of conversations) {
  // This triggers a new query for each conversation
  const messages = await db.conversationMessage.findMany({
    where: { conversationId: conv.id },
  });
}
```

### Caching Strategy
```typescript
// Use SWR in client components
import useSWR from 'swr';

export function useAnalytics(workspaceId: string) {
  const { data, error, isLoading } = useSWR(
    `/api/analytics/${workspaceId}`,
    fetch
  );
  
  return { data, error, isLoading };
}
```

---

## 🚀 Deployment Checklist

- [ ] Update `.env` with production values
- [ ] Run database migrations on production database
- [ ] Test all authentication flows
- [ ] Verify workspace isolation works
- [ ] Test team member invitations
- [ ] Check notification system
- [ ] Review analytics calculations
- [ ] Enable HTTPS
- [ ] Set up logging and monitoring
- [ ] Configure backups
- [ ] Test disaster recovery

---

## 📞 Common Issues & Solutions

### Issue: "Access denied" on team page
**Solution**: Verify user has OWNER or ADMIN role
```typescript
const workspace = await db.workspaceUser.findUnique({
  where: { workspaceId_userId: { workspaceId, userId } },
});
console.log('User role:', workspace.role);
```

### Issue: Notifications not showing
**Solution**: Check notification preferences and permissions
```typescript
// Verify notification was created
const notifications = await db.notification.count({
  where: { userId, workspaceId },
});
```

### Issue: Analytics showing zero data
**Solution**: Run seed and verify daily aggregation job
```bash
npm run db:seed
# Check if recordDailyAnalytics was executed
```

---

## 🎓 Learning Resources

- [Prisma Documentation](https://www.prisma.io/docs/)
- [NextAuth.js v5](https://authjs.dev/getting-started/installation)
- [Next.js 14 App Router](https://nextjs.org/docs/app)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Recharts Documentation](https://recharts.org/)

---

## 💡 Best Practices

1. **Always check authorization** before server actions
2. **Use database transactions** for multi-step operations
3. **Log important actions** to ActivityLog for audit trail
4. **Notify relevant users** when important events happen
5. **Handle errors gracefully** with user-friendly messages
6. **Test permission boundaries** thoroughly
7. **Keep API responses consistent** with error handling
8. **Implement rate limiting** on sensitive endpoints
9. **Cache expensive queries** appropriately
10. **Monitor performance** in production

---

**Next Steps**:
1. Run `npm run dev` to start
2. Explore `/dashboard/team` for team management
3. Check `/dashboard/analytics` for metrics
4. Create follow-up rules in the rules management page
5. Test team collaboration workflow

Happy building! 🚀
