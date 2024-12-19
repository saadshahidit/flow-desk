import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Task, TaskStatus } from '../models/task.model';

export interface TaskPayload {
  title: string;
  description: string;
  priority: string;
  dueDate?: string;
  assignedTo?: string;
}

@Injectable({ providedIn: 'root' })
export class TaskService {
  private url = `${environment.apiUrl}/tasks`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Task[]> {
    return this.http.get<Task[]>(this.url);
  }

  getById(id: string): Observable<Task> {
    return this.http.get<Task>(`${this.url}/${id}`);
  }

  create(payload: TaskPayload): Observable<Task> {
    return this.http.post<Task>(this.url, payload);
  }

  update(id: string, payload: Partial<TaskPayload>): Observable<Task> {
    return this.http.put<Task>(`${this.url}/${id}`, payload);
  }

  assign(id: string, assignedTo: string): Observable<Task> {
    return this.http.patch<Task>(`${this.url}/${id}/assign`, { assignedTo });
  }

  updateStatus(id: string, status: TaskStatus): Observable<Task> {
    return this.http.patch<Task>(`${this.url}/${id}/status`, { status });
  }

  delete(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.url}/${id}`);
  }
}
