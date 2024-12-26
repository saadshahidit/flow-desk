import { Component, OnInit, signal } from '@angular/core';
import { UserService } from '../../../core/services/user.service';
import { TaskService } from '../../../core/services/task.service';
import { User } from '../../../core/models/user.model';
import { Task } from '../../../core/models/task.model';
import { BadgeComponent } from '../../../shared/components/badge/badge.component';
import { AvatarComponent } from '../../../shared/components/avatar/avatar.component';

@Component({
  selector: 'app-member-list',
  standalone: true,
  imports: [BadgeComponent, AvatarComponent],
  templateUrl: './member-list.component.html'
})
export class MemberListComponent implements OnInit {
  users = signal<User[]>([]);
  tasks = signal<Task[]>([]);

  constructor(private userService: UserService, private taskService: TaskService) {}

  ngOnInit(): void {
    this.userService.getAll().subscribe(u => this.users.set(u));
    this.taskService.getAll().subscribe(t => this.tasks.set(t));
  }

  openTaskCount(userId: string): number {
    return this.tasks().filter(t => t.assignedTo?._id === userId && t.status !== 'Done').length;
  }

  toggleRole(user: User): void {
    const newRole = user.role === 'admin' ? 'member' : 'admin';
    this.userService.updateRole(user._id, newRole).subscribe(updated => {
      this.users.update(users => users.map(u => u._id === updated._id ? updated : u));
    });
  }

  remove(user: User): void {
    this.userService.delete(user._id).subscribe(() => {
      this.users.update(users => users.filter(u => u._id !== user._id));
    });
  }
}
