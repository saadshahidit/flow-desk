import { Component, OnInit, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { TaskService } from '../../core/services/task.service';
import { UserService } from '../../core/services/user.service';
import { Task } from '../../core/models/task.model';
import { User } from '../../core/models/user.model';
import { BadgeComponent } from '../../shared/components/badge/badge.component';
import { AvatarComponent } from '../../shared/components/avatar/avatar.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, BadgeComponent, AvatarComponent],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  tasks = signal<Task[]>([]);
  users = signal<User[]>([]);

  recentTasks = computed(() => this.tasks().slice(0, 6));
  doneTasks = computed(() => this.tasks().filter(t => t.status === 'Done').length);

  statusStats = computed(() => {
    const t = this.tasks();
    return [
      { label: 'Pending', count: t.filter(x => x.status === 'Pending').length },
      { label: 'Accepted', count: t.filter(x => x.status === 'Accepted').length },
      { label: 'In Progress', count: t.filter(x => x.status === 'In Progress').length },
      { label: 'Review', count: t.filter(x => x.status === 'Review').length },
      { label: 'Done', count: t.filter(x => x.status === 'Done').length },
    ];
  });

  memberWorkload = computed(() => {
    const members = this.users().filter(u => u.role === 'member');
    const tasksByMember = this.tasks().reduce((acc, t) => {
      if (t.assignedTo) acc[t.assignedTo._id] = (acc[t.assignedTo._id] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return members.map(m => ({ ...m, taskCount: tasksByMember[m._id] || 0 }))
      .sort((a, b) => b.taskCount - a.taskCount);
  });

  constructor(public auth: AuthService, private taskService: TaskService, private userService: UserService) {}

  ngOnInit(): void {
    this.taskService.getAll().subscribe(tasks => this.tasks.set(tasks));
    if (this.auth.isAdmin()) {
      this.userService.getAll().subscribe(users => this.users.set(users));
    }
  }
}
