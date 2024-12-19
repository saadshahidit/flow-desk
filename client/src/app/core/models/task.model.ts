export type TaskStatus = 'Pending' | 'Accepted' | 'In Progress' | 'Review' | 'Done';
export type TaskPriority = 'Low' | 'Medium' | 'High';

export interface Task {
  _id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  assignedTo?: { _id: string; name: string; email: string };
  createdBy: { _id: string; name: string; email: string };
  createdAt: string;
  updatedAt: string;
}
