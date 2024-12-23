import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TaskService, TaskPayload } from '../../../core/services/task.service';
import { UserService } from '../../../core/services/user.service';
import { Task } from '../../../core/models/task.model';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './task-form.component.html'
})
export class TaskFormComponent implements OnInit {
  isEdit = false;
  taskId = '';
  form: TaskPayload = { title: '', description: '', priority: 'Medium', dueDate: '', assignedTo: '' };
  members = signal<User[]>([]);
  loading = signal(false);
  error = signal('');

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private taskService: TaskService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.taskId = this.route.snapshot.paramMap.get('id') || '';
    this.isEdit = !!this.taskId;
    this.userService.getAll().subscribe(users => this.members.set(users.filter(u => u.role === 'member')));
    if (this.isEdit) {
      this.taskService.getById(this.taskId).subscribe((task: Task) => {
        this.form = {
          title: task.title,
          description: task.description,
          priority: task.priority,
          dueDate: task.dueDate ? task.dueDate.slice(0, 10) : '',
          assignedTo: task.assignedTo?._id || '',
        };
      });
    }
  }

  submit(): void {
    if (!this.form.title) return;
    this.loading.set(true);
    this.error.set('');
    const payload = { ...this.form };
    if (!payload.assignedTo) delete payload.assignedTo;
    if (!payload.dueDate) delete payload.dueDate;

    const req = this.isEdit
      ? this.taskService.update(this.taskId, payload)
      : this.taskService.create(payload);

    req.subscribe({
      next: (task) => this.router.navigate(['/tasks', task._id]),
      error: (err) => {
        this.error.set(err.error?.message || 'Failed to save task');
        this.loading.set(false);
      }
    });
  }
}
