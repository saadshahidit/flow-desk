import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-badge',
  standalone: true,
  imports: [CommonModule],
  template: `<span [class]="classes" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">{{ label }}</span>`
})
export class BadgeComponent {
  @Input() label = '';
  @Input() variant: 'status' | 'priority' | 'role' = 'status';
  @Input() value = '';

  get classes(): string {
    if (this.variant === 'status') {
      const map: Record<string, string> = {
        'Pending': 'bg-gray-100 text-gray-700',
        'Accepted': 'bg-blue-100 text-blue-700',
        'In Progress': 'bg-yellow-100 text-yellow-700',
        'Review': 'bg-purple-100 text-purple-700',
        'Done': 'bg-green-100 text-green-700',
      };
      return map[this.value] || 'bg-gray-100 text-gray-700';
    }
    if (this.variant === 'priority') {
      const map: Record<string, string> = {
        'High': 'bg-red-100 text-red-700',
        'Medium': 'bg-orange-100 text-orange-700',
        'Low': 'bg-green-100 text-green-700',
      };
      return map[this.value] || 'bg-gray-100 text-gray-700';
    }
    if (this.variant === 'role') {
      return this.value === 'admin' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-600';
    }
    return 'bg-gray-100 text-gray-700';
  }
}
