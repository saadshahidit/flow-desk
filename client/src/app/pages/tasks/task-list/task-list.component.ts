import { Component, OnInit, signal, computed } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { TaskService } from '../../../core/services/task.service';
import { Task, TaskStatus } from '../../../core/models/task.model';
import { BadgeComponent } from '../../../shared/components/badge/badge.component';
import { AvatarComponent } from '../../../shared/components/avatar/avatar.component';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [DatePipe, RouterLink, FormsModule, BadgeComponent, AvatarComponent],
  templateUrl: './task-list.component.html'
})
export class TaskListComponent implements OnInit {
  tasks = signal<Task[]>([]);
  filterStatus = signal('');
  filterPriority = signal('');
  search = signal('');
  statuses: TaskStatus[] = ['Pending', 'Accepted', 'In Progress', 'Review', 'Done'];

  filtered = computed(() => {
    const status = this.filterStatus();
    const priority = this.filterPriority();
    const q = this.search().toLowerCase();
    return this.tasks().filter(t => {
      const matchStatus = !status || t.status === status;
      const matchPriority = !priority || t.priority === priority;
      const matchSearch = !q || t.title.toLowerCase().includes(q);
      return matchStatus && matchPriority && matchSearch;
    });
  });

  constructor(public auth: AuthService, private taskService: TaskService) {}

  ngOnInit(): void {
    this.taskService.getAll().subscribe(tasks => this.tasks.set(tasks));
  }
}
