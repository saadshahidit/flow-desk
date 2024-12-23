import { Component, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { TaskService } from '../../../core/services/task.service';
import { ActivityService } from '../../../core/services/activity.service';
import { UserService } from '../../../core/services/user.service';
import { Task, TaskStatus } from '../../../core/models/task.model';
import { Activity } from '../../../core/models/activity.model';
import { User } from '../../../core/models/user.model';
import { BadgeComponent } from '../../../shared/components/badge/badge.component';
import { AvatarComponent } from '../../../shared/components/avatar/avatar.component';
import { ModalComponent } from '../../../shared/components/modal/modal.component';

@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [DatePipe, RouterLink, FormsModule, BadgeComponent, AvatarComponent, ModalComponent],
  templateUrl: './task-detail.component.html'
})
export class TaskDetailComponent implements OnInit {
  task = signal<Task | null>(null);
  activities = signal<Activity[]>([]);
  members = signal<User[]>([]);
  selectedAssignee = '';
  confirmDelete = false;
  statuses: TaskStatus[] = ['Pending', 'Accepted', 'In Progress', 'Review', 'Done'];

  constructor(
    public auth: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private taskService: TaskService,
    private activityService: ActivityService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.taskService.getById(id).subscribe(task => {
      this.task.set(task);
      this.selectedAssignee = task.assignedTo?._id || '';
    });
    this.activityService.getByTask(id).subscribe(a => this.activities.set(a));
    if (this.auth.isAdmin()) {
      this.userService.getAll().subscribe(users => this.members.set(users.filter(u => u.role === 'member')));
    }
  }

  setStatus(status: TaskStatus): void {
    const id = this.task()!._id;
    this.taskService.updateStatus(id, status).subscribe(task => {
      this.task.set(task);
      this.activityService.getByTask(id).subscribe(a => this.activities.set(a));
    });
  }

  assign(): void {
    const id = this.task()!._id;
    this.taskService.assign(id, this.selectedAssignee).subscribe(task => this.task.set(task));
  }

  deleteTask(): void {
    this.taskService.delete(this.task()!._id).subscribe(() => this.router.navigate(['/tasks']));
  }
}
