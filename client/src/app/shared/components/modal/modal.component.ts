import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="open" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/40" (click)="close.emit()"></div>
      <div class="relative bg-white rounded-xl shadow-xl w-full max-w-lg p-6 z-10">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900">{{ title }}</h3>
          <button (click)="close.emit()" class="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
        </div>
        <ng-content></ng-content>
      </div>
    </div>
  `
})
export class ModalComponent {
  @Input() open = false;
  @Input() title = '';
  @Output() close = new EventEmitter<void>();
}
