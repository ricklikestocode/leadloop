import * as z from "zod"

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export const signupSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
})

export const createLeadSchema = z.object({
  name: z.string().min(2),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  company: z.string().optional().or(z.literal("")),
  status: z.string().default("NEW"),
  source: z.string().default("MANUAL"),
  value: z.number().optional().default(0),
})

export const updateLeadSchema = createLeadSchema.partial()

export const createFollowUpSchema = z.object({
  dueDate: z.date().or(z.string().transform((val) => new Date(val))),
  status: z.string().default("PENDING"),
  leadId: z.string().optional(),
})

export const updateFollowUpSchema = createFollowUpSchema.partial().extend({
  completedAt: z.date().optional(),
})

export const createConversationSchema = z.object({
  leadId: z.string().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  assignedToUserId: z.string().optional(),
})

export const assignConversationSchema = z.object({
  assignedToUserId: z.string().optional(),
})

export const createConversationMessageSchema = z.object({
  conversationId: z.string(),
  content: z.string().min(1),
})
export const workspaceSettingsSchema = z.object({
  businessType: z.string().optional().or(z.literal("")),
  businessTone: z.string().default("PROFESSIONAL"),
  pricingInfo: z.string().optional().or(z.literal("")),
  servicesInfo: z.string().optional().or(z.literal("")),
  conversionGoal: z.string().default("BOOK_CALL"),
  autoReplyEnabled: z.boolean().default(false),
  defaultAutoReplyText: z.string().optional(),
  businessDescription: z.string().optional().or(z.literal("")),
  tonePreference: z.string().optional().or(z.literal("")),
})

export const createFollowUpRuleSchema = z.object({
  name: z.string().min(2),
  triggerDays: z.number().min(1),
  condition: z.string().optional(),
  actionType: z.string().default("NOTIFICATION"),
})

export const updateFollowUpRuleSchema = createFollowUpRuleSchema.partial()

export const createNoteSchema = z.object({
  content: z.string().min(1),
  leadId: z.string().optional(),
})

export const inviteTeamMemberSchema = z.object({
  email: z.string().email(),
  role: z.string().default("AGENT"),
})

export const updateTeamMemberSchema = z.object({
  role: z.string(),
  status: z.string().optional(),
})
