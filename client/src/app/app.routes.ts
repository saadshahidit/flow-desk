import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./pages/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/auth/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'tasks',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/tasks/task-list/task-list.component').then(m => m.TaskListComponent)
  },
  {
    path: 'tasks/new',
    canActivate: [authGuard, adminGuard],
    loadComponent: () => import('./pages/tasks/task-form/task-form.component').then(m => m.TaskFormComponent)
  },
  {
    path: 'tasks/:id',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/tasks/task-detail/task-detail.component').then(m => m.TaskDetailComponent)
  },
  {
    path: 'tasks/:id/edit',
    canActivate: [authGuard, adminGuard],
    loadComponent: () => import('./pages/tasks/task-form/task-form.component').then(m => m.TaskFormComponent)
  },
  {
    path: 'members',
    canActivate: [authGuard, adminGuard],
    loadComponent: () => import('./pages/members/member-list/member-list.component').then(m => m.MemberListComponent)
  },
  { path: '**', redirectTo: '/dashboard' }
];
