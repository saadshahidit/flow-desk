import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-avatar',
  standalone: true,
  template: `
    <span class="inline-flex items-center justify-center rounded-full bg-indigo-100 text-indigo-700 font-semibold"
      [class]="sizeClass">{{ initials }}</span>
  `
})
export class AvatarComponent {
  @Input() name = '';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';

  get initials(): string {
    return this.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  }

  get sizeClass(): string {
    return { sm: 'w-7 h-7 text-xs', md: 'w-9 h-9 text-sm', lg: 'w-12 h-12 text-base' }[this.size];
  }
}
