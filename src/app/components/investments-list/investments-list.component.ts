import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
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

  constructor(
    private investmentService: InvestmentService,
    private router: Router
  ) {}

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

  onInvestmentClick(investment: Investment): void {
    if (investment.indicadorCarencia === 'N') {
      this.router.navigate(['/redeem', encodeURIComponent(investment.nome)]);
    }
  }

  isDisabled(investment: Investment): boolean {
    return investment.indicadorCarencia === 'S';
  }

  onView(investment: Investment): void {
    console.log('Visualizar investment:', investment);
  }

  onEdit(investment: Investment): void {
    console.log('Editar investment:', investment);
  }

  onDelete(investment: Investment): void {
    if (confirm(`Tem certeza que deseja excluir o investmento "${investment.nome}"?`)) {
      console.log('Exclusão não implementada');
    }
  }
}
