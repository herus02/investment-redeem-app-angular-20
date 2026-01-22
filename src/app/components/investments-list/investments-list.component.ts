import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvestmentService } from '../../services/investment.service';
import { Investment, formatCurrency } from '../../models/investment.model';

@Component({
  selector: 'app-investments-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './investments-list.component.html',
  styleUrl: './investments-list.component.scss'
})
export class InvestmentsListComponent implements OnInit {
  investments: Investment[] = [];
  formatCurrency = formatCurrency;

  constructor(private investmentService: InvestmentService) {}

  ngOnInit(): void {
    this.loadInvestments();
  }

  loadInvestments(): void {
    this.investmentService.getInvestments().subscribe({
      next: (data) => {
        this.investments = data;
      },
      error: (error) => {
        console.error('Erro ao carregar investments:', error);
      }
    });
  }

  onView(investment: Investment): void {
    console.log('Visualizar investment:', investment);
    // TODO: Implementar navegação para detalhes
  }

  onEdit(investment: Investment): void {
    console.log('Editar investment:', investment);
    // TODO: Implementar edição
  }

  onDelete(investment: Investment): void {
    if (confirm(`Tem certeza que deseja excluir o investment "${investment.nome}"?`)) {
      this.investmentService.deleteInvestment(investment.id).subscribe({
        next: (success) => {
          if (success) {
            this.loadInvestments();
          }
        },
        error: (error) => {
          console.error('Erro ao excluir investment:', error);
        }
      });
    }
  }
}
