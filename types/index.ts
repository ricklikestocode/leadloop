import { Session } from "next-auth";

export interface ExtendedSession extends Session {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    workspaceId: string;
  };
}

export interface LeadWithNotes {
  id: string;
  name: string;
  company?: string | null;
  phone?: string | null;
  email?: string | null;
  source: string;
  status: string;
  priority: string;
  value?: number | null;
  followUpDate?: Date | null;
  lastContactedAt?: Date | null;
  notes?: string | null;
  createdAt: Date;
  updatedAt: Date;
  leadNotes: LeadNoteType[];
  followUps: FollowUpType[];
}

export interface LeadNoteType {
  id: string;
  leadId: string;
  userId: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  user?: {
    name: string;
  };
}

export interface FollowUpType {
  id: string;
  leadId: string;
  userId: string;
  dueDate: Date;
  completedAt?: Date | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DashboardStats {
  totalLeads: number;
  newLeads: number;
  contactedLeads: number;
  interestedLeads: number;
  wonLeads: number;
  lostLeads: number;
  overdueFollowUps: number;
  todayFollowUps: number;
}

export interface ActivityLogType {
  id: string;
  workspaceId: string;
  leadId?: string | null;
  userId: string;
  actionType: string;
  description: string;
  createdAt: Date;
  user: {
    name: string;
  };
}
