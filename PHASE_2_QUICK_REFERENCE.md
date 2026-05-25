# Phase 2 Quick Reference Guide

## 🔗 Key Import Paths

```typescript
// Database
import { db } from "@/lib/db";

// Authentication & Authorization
import { getSession, canAccessWorkspace, hasPermission } from "@/lib/auth-utils";
import { authConfig } from "@/lib/auth";

// Validation
import { createLeadSchema, inviteTeamMemberSchema, ... } from "@/lib/validation";

// Constants & Enums
import { ROLES, PERMISSIONS, ACTION_TYPES, NOTIFICATION_TYPES } from "@/lib/constants";

// Utilities
import { formatDate, formatDateTime, getRelativeTime, generateSlug } from "@/lib/utils";

// Server Actions
import { createLead, updateLead, deleteLead } from "@/actions/leads";
import { inviteTeamMember, removeTeamMember, getTeamMembers } from "@/actions/team";
import { createConversation, sendMessage, assignConversation } from "@/actions/conversations";
import { createFollowUpRule, updateFollowUpRule, toggleFollowUpRule } from "@/actions/follow-up-rules";
import { getWorkspaceAnalytics, recordDailyAnalytics } from "@/actions/analytics";
import { createNotification, getNotifications, markNotificationAsRead } from "@/actions/notifications";

// Components
import { TeamMembersList } from "@/components/TeamMembersList";
import { AnalyticsDashboard } from "@/components/AnalyticsDashboard";
import { NotificationCenter } from "@/components/NotificationCenter";
import { DragDropPipeline } from "@/components/DragDropPipeline";
```

---

## 🔐 Permission Checks

### Server-Side
```typescript
// Check authorization
const session = await getSession();
if (!session?.user) throw new Error("Unauthorized");

// Check workspace access
const canAccess = await canAccessWorkspace(workspaceId);
if (!canAccess) throw new Error("Access denied");

// Check specific permission
if (!hasPermission(userRole, "canManageTeam")) {
  throw new Error("Insufficient permissions");
}
```

### Client-Side
```typescript
"use client";

import { useSession } from "next-auth/react";
import { hasPermission } from "@/lib/auth-utils";

export function AdminSection() {
  const { data: session } = useSession();
  
  if (!hasPermission(session?.user?.role, "canManageTeam")) {
    return <div>Access denied</div>;
  }
  
  return <YourComponent />;
}
```

---

## 👥 Team Management

### Invite Team Member
```typescript
await inviteTeamMember(workspaceId, {
  email: "user@company.com",
  role: "AGENT" // or ADMIN
});
```

### Get Team Members
```typescript
const { success, members } = await getTeamMembers(workspaceId);
if (success) {
  members.forEach(m => console.log(m.user.email, m.role));
}
```

### Update Member Role
```typescript
await updateTeamMember(workspaceId, userId, {
  role: "ADMIN"
});
```

### Remove Member
```typescript
await removeTeamMember(workspaceId, userId);
```

---

## 💬 Conversations

### Create Conversation
```typescript
const result = await createConversation(workspaceId, {
  leadId: lead.id,
  title: `Chat with ${lead.name}`,
  assignedToUserId: agentId,
});
```

### Send Message
```typescript
await sendMessage(conversationId, "Hello! How can I help?");
```

### Assign to Team Member
```typescript
await assignConversation(conversationId, {
  assignedToUserId: userId,
});
```

### Get Conversations
```typescript
const result = await getConversations(workspaceId, {
  status: "OPEN",
  limit: 50,
});
```

---

## 🤖 Follow-Up Rules

### Create Rule
```typescript
await createFollowUpRule(workspaceId, {
  name: "24h Follow-up",
  triggerType: "NO_REPLY_HOURS",
  triggerValue: 24,
  description: "Auto follow-up after 24 hours",
  isActive: true,
});
```

### Trigger Types
```typescript
"NO_REPLY_HOURS"      // Trigger after X hours
"STATUS_CHANGE"       // Trigger on status change
"DAYS_SINCE_CONTACT"  // Trigger after X days
```

### Toggle Rule
```typescript
await toggleFollowUpRule(ruleId, true); // Enable
await toggleFollowUpRule(ruleId, false); // Disable
```

### Delete Rule
```typescript
await deleteFollowUpRule(ruleId);
```

---

## 📊 Analytics

### Get Analytics
```typescript
const result = await getWorkspaceAnalytics(
  workspaceId,
  "2024-01-01", // from date
  "2024-01-31"  // to date
);

if (result.success) {
  const { summary, daily } = result.analytics;
  console.log("Total leads:", summary.totalLeads);
  console.log("Conversion rate:", summary.conversionRate);
}
```

### Record Daily Analytics
```typescript
// Should be called daily via cron job
await recordDailyAnalytics(workspaceId);
```

### Analytics Fields
```typescript
summary: {
  totalLeads: number;
  newLeads: number;
  wonLeads: number;
  lostLeads: number;
  totalConversations: number;
  messagesCount: number;
  followUpsSent: number;
  followupsCompleted: number;
  conversionRate: number;
}

daily: [
  {
    date: string;
    totalLeads: number;
    newLeads: number;
    leadsWon: number;
    followUpsSent: number;
  }
]
```

---

## 🔔 Notifications

### Create Notification
```typescript
await createNotification(
  workspaceId,
  userId,
  "NEW_MESSAGE", // Type
  "New message", // Title
  "John replied", // Message
  "/dashboard/conversations/123" // Action URL
);
```

### Get Notifications
```typescript
const result = await getNotifications(workspaceId);
if (result.success) {
  console.log("Unread:", result.unreadCount);
  console.log("Notifications:", result.notifications);
}
```

### Notification Types
```typescript
"NEW_MESSAGE"              // New message
"OVERDUE_FOLLOWUP"         // Follow-up overdue
"LEAD_ASSIGNED"            // Lead assigned
"TEAM_MEMBER_JOINED"       // Team member joined
"CONVERSATION_ASSIGNED"    // Conversation assigned
```

### Mark as Read
```typescript
// Single notification
await markNotificationAsRead(notificationId);

// All notifications
await markAllNotificationsAsRead(workspaceId);
```

### Delete Notification
```typescript
await deleteNotification(notificationId);
```

### Broadcast to Team
```typescript
await notifyTeamMembers(
  workspaceId,
  excludeUserId, // Don't notify this user
  "LEAD_ASSIGNED",
  "New Lead",
  "You have been assigned a new lead",
  "/dashboard/leads/123"
);
```

---

## 🔍 Utility Functions

### Date Formatting
```typescript
import { formatDate, formatDateTime, getRelativeTime } from "@/lib/utils";

formatDate("2024-01-15"); // "Jan 15, 2024"
formatDateTime("2024-01-15T10:30:00"); // "Jan 15, 2024 10:30 AM"
getRelativeTime("2024-01-15"); // "2h ago" or "Jan 15, 2024"
```

### Date Checks
```typescript
import { isOverdue, isToday, isTomorrow, isWithinDays } from "@/lib/utils";

isOverdue(date); // true if in past
isToday(date); // true if today
isTomorrow(date); // true if tomorrow
isWithinDays(date, 7); // true if within 7 days
```

### String Utilities
```typescript
import { truncate, generateSlug, classNames } from "@/lib/utils";

truncate("Long string here", 10); // "Long str..."
generateSlug("My Workspace"); // "my-workspace"
classNames("px-4", condition && "text-blue", false && "hidden"); // "px-4 text-blue"
```

---

## 🛣️ Common Workflows

### Create Lead & Conversation
```typescript
// 1. Create lead
const leadResult = await createLead({
  name: "John Doe",
  email: "john@company.com",
  source: "WHATSAPP",
  status: "NEW",
});

// 2. Create conversation
const convResult = await createConversation(workspaceId, {
  leadId: leadResult.lead.id,
  title: `Chat with ${leadResult.lead.name}`,
  assignedToUserId: agentId,
});

// 3. Send first message
await sendMessage(convResult.conversation.id, "Hello! How can I help?");

// 4. Create notification
await createNotification(
  workspaceId,
  agentId,
  "CONVERSATION_ASSIGNED",
  "New Conversation",
  "You have a new conversation",
  `/dashboard/conversations/${convResult.conversation.id}`
);
```

### Auto-Follow-Up Flow
```typescript
// 1. Create rule
const rule = await createFollowUpRule(workspaceId, {
  name: "24-hour follow-up",
  triggerType: "NO_REPLY_HOURS",
  triggerValue: 24,
  autoAssignToUserId: agentId,
  isActive: true,
});

// 2. In background job, check rule
const rules = await db.followUpRule.findMany({
  where: { workspaceId, isActive: true },
});

// 3. Create follow-up when triggered
await createFollowUp(leadId, {
  dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
  ruleId: rule.id,
});

// 4. Notify user
await createNotification(
  workspaceId,
  agentId,
  "OVERDUE_FOLLOWUP",
  "Follow-up Due",
  "You have an overdue follow-up"
);
```

---

## 🏗️ Database Queries

### Find Lead with Relations
```typescript
const lead = await db.lead.findUnique({
  where: { id: leadId },
  include: {
    leadNotes: { include: { user: true } },
    followUps: true,
    conversations: { include: { messages: true } },
  },
});
```

### Get Workspace Analytics
```typescript
const analytics = await db.workspaceAnalytics.findMany({
  where: {
    workspaceId,
    date: {
      gte: startDate,
      lte: endDate,
    },
  },
  orderBy: { date: "asc" },
});
```

### Count Team Members
```typescript
const count = await db.workspaceUser.count({
  where: { workspaceId, status: "ACTIVE" },
});
```

### Get Recent Activity
```typescript
const activities = await db.activityLog.findMany({
  where: { workspaceId },
  include: { user: { select: { name: true } } },
  orderBy: { createdAt: "desc" },
  take: 20,
});
```

---

## 🎯 Next Steps After Setup

1. **Database**: Run `npx prisma db push`
2. **Seed Data**: Run `npm run db:seed`
3. **Start Dev**: Run `npm run dev`
4. **Test Team**: Visit `/dashboard/team`
5. **Check Analytics**: Visit `/dashboard/analytics`
6. **View Notifications**: Visit `/dashboard/notifications`

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| `PHASE_2_UPGRADE.md` | Complete feature overview |
| `PHASE_2_IMPLEMENTATION_GUIDE.md` | Developer patterns |
| `DEPLOYMENT_GUIDE_PHASE2.md` | Production deployment |
| `PHASE_2_COMPLETE_SUMMARY.md` | Executive summary |
| `README.md` | Project overview |

---

## 🚀 Ready to Deploy?

See `DEPLOYMENT_GUIDE_PHASE2.md` for:
- Vercel deployment
- Heroku deployment
- AWS deployment
- Self-hosted setup
- Docker containerization
- Production checklist

---

**Quick Help**: Right-click any function and go to definition to see full implementation!
