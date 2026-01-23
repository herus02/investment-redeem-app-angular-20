import { Component, EventEmitter, Input, Output } from '@angular/core';

import { CommonModule } from '@angular/common';
import { formatCurrency } from '../../models/investment.model';

@Component({
  selector: 'app-error-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './error-modal.component.html',
  styleUrl: './error-modal.component.scss'
})
export class ErrorModalComponent {
  @Input() invalidAcoesDetails: Array<{ nome: string; saldoMaximo: number }> = [];
  @Output() close = new EventEmitter<void>();

  formatCurrency = formatCurrency;

  onClose(): void {
    this.close.emit();
  }
}
