import { Request } from 'express';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: 'admin' | 'member';
  };
}

export type TaskStatus = 'Pending' | 'Accepted' | 'In Progress' | 'Review' | 'Done';
export type TaskPriority = 'Low' | 'Medium' | 'High';
export type UserRole = 'admin' | 'member';
