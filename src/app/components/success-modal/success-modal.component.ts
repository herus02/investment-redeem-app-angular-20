import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-success-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './success-modal.component.html',
  styleUrl: './success-modal.component.scss'
})
export class SuccessModalComponent {
  @Output() close = new EventEmitter<void>();
  @Output() newRedeem = new EventEmitter<void>();

  onClose(): void {
    this.close.emit();
  }

  onNewRedeem(): void {
    this.newRedeem.emit();
  }
}
