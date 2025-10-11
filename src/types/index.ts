export type UserRole = 'admin' | 'staff' | 'partner' | 'client';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  organizationId: string;
  avatar?: string;
  isOnboarded?: boolean;
}

export interface Organization {
  id: string;
  name: string;
  domain: string;
  settings: {
    allowClientRegistration: boolean;
    requireDocumentApproval: boolean;
  };
}

export interface Client {
  id: string;
  name: string;
  email: string;
  organizationId: string;
  onboardedAt: Date;
  status: 'active' | 'inactive' | 'pending';
  avatar?: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  clientId: string;
  assignedTo: string[];
  status: 'not_started' | 'in_progress' | 'review' | 'completed' | 'overdue';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  startDate: Date;
  dueDate: Date;
  completionDate?: Date;
  progress: number;
  serviceType: string;
  isRecurring: boolean;
  recurringFrequency?: 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  tasks: Task[];
  documents: Document[];
  comments: Comment[];
}

export interface Task {
  id: string;
  serviceId: string;
  title: string;
  description: string;
  assignedTo?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'blocked';
  dueDate?: Date;
  completionDate?: Date;
  order: number;
  isRequired: boolean;
  estimatedHours?: number;
  actualHours?: number;
}

export interface ServiceTemplate {
  id: string;
  name: string;
  description: string;
  serviceType: string;
  estimatedDuration: number;
  tasks: Omit<Task, 'id' | 'serviceId'>[];
}

export interface Document {
  id: string;
  fileName: string;
  originalName: string;
  size: number;
  mimeType: string;
  uploadedAt: Date;
  uploadedBy: string;
  serviceId?: string;
  taskId?: string;
  isClientVisible: boolean;
  tags: string[];
  url: string;
}

export interface Comment {
  id: string;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: Date;
  serviceId?: string;
  taskId?: string;
  isInternal: boolean;
  attachments?: string[];
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  createdAt: Date;
  actionUrl?: string;
}

export interface DashboardStats {
  totalServices: number;
  activeServices: number;
  completedServices: number;
  overdue: number;
  totalClients: number;
  activeClients: number;
  totalDocuments: number;
  pendingTasks: number;
}