import { Acao, Investment, formatCurrency } from '../../models/investment.model';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, computed, signal } from '@angular/core';

import { CommonModule } from '@angular/common';
import { ErrorModalComponent } from '../error-modal/error-modal.component';
import { FormsModule } from '@angular/forms';
import { InvestmentService } from '../../services/investment.service';
import { SuccessModalComponent } from '../success-modal/success-modal.component';

interface RedeemValue {
  acaoId: string;
  value: number;
  formattedValue: string;
  hasError: boolean;
  errorMessage: string;
}

@Component({
  selector: 'app-redeem',
  standalone: true,
  imports: [CommonModule, FormsModule, SuccessModalComponent, ErrorModalComponent],
  templateUrl: './redeem.component.html',
  styleUrl: './redeem.component.scss'
})
export class RedeemComponent implements OnInit {
  investment: Investment | undefined;
  formatCurrency = formatCurrency;
  redeemValues = signal<Map<string, RedeemValue>>(new Map());
  showSuccessModal = signal(false);
  showErrorModal = signal(false);
  invalidAcoesDetails = signal<Array<{ nome: string; saldoMaximo: number }>>([]);
  
  totalRedeem = computed(() => {
    let total = 0;
    this.redeemValues().forEach((redeem) => {
      if (redeem.value > 0) {
        total += redeem.value;
      }
    });
    return total;
  });

  hasFilledFields = computed(() => {
    let hasFilled = false;
    this.redeemValues().forEach((redeem) => {
      if (redeem.value > 0) {
        hasFilled = true;
      }
    });
    return hasFilled;
  });

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private investmentService: InvestmentService
  ) {}

  ngOnInit(): void {
    const nome = this.route.snapshot.paramMap.get('nome');
    if (nome) {
      this.loadInvestment(decodeURIComponent(nome));
    }
  }

  loadInvestment(nome: string): void {
    this.investmentService.getInvestments().subscribe({
      next: (investments) => {
        this.investment = investments.find(inv => inv.nome === nome);
        if (this.investment) {
          this.initializeRedeemValues();
        }
      },
      error: (error) => {
        console.error('Erro ao carregar investimento:', error);
      }
    });
  }

  initializeRedeemValues(): void {
    if (!this.investment) return;
    
    const newMap = new Map<string, RedeemValue>();
    this.investment.acoes.forEach((acao) => {
      newMap.set(acao.id, {
        acaoId: acao.id,
        value: 0,
        formattedValue: '',
        hasError: false,
        errorMessage: ''
      });
    });
    this.redeemValues.set(newMap);
  }

  getSaldoAcumulado(acao: Acao): number {
    if (!this.investment) return 0;
    return (this.investment.saldoTotal * acao.percentual) / 100;
  }

  onRedeemValueChange(acaoId: string, event: Event): void {
    const input = event.target as HTMLInputElement;
    const inputValue = input.value;
    const digitsOnly = inputValue.replace(/[^\d]/g, '');
    
    if (digitsOnly === '') {
      const currentMap = new Map(this.redeemValues());
      const redeem = currentMap.get(acaoId)!;
      redeem.value = 0;
      redeem.formattedValue = '';
      redeem.hasError = false;
      redeem.errorMessage = '';
      currentMap.set(acaoId, redeem);
      this.redeemValues.set(currentMap);
      input.value = '';
      return;
    }
    
    const numericValue = parseFloat(digitsOnly) / 100;
    const formattedValue = this.formatCurrencyInput(numericValue);

    const saldoAcumulado = this.getSaldoAcumulado(
      this.investment!.acoes.find(a => a.id === acaoId)!
    );

    const currentMap = new Map(this.redeemValues());
    const redeem = currentMap.get(acaoId)!;
    
    redeem.value = numericValue;
    redeem.formattedValue = formattedValue;
    redeem.hasError = numericValue > saldoAcumulado;
    redeem.errorMessage = redeem.hasError 
      ? `O valor a resgatar não pode ser maior que R$ ${formatCurrency(saldoAcumulado)}`
      : '';

    currentMap.set(acaoId, redeem);
    this.redeemValues.set(currentMap);
    
    input.value = formattedValue;
  }

  formatCurrencyInput(value: number): string {
    if (value === 0) return '';
    return formatCurrency(value);
  }

  getRedeemValue(acaoId: string): RedeemValue {
    return this.redeemValues().get(acaoId) || {
      acaoId,
      value: 0,
      formattedValue: '',
      hasError: false,
      errorMessage: ''
    };
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  confirmRedeem(): void {
    if (!this.hasFilledFields() || !this.investment) return;
    
    const invalidAcoesDetailsList: Array<{ nome: string; saldoMaximo: number }> = [];
    this.redeemValues().forEach((redeem) => {
      if (redeem.value > 0 && redeem.hasError) {
        const acao = this.investment!.acoes.find(a => a.id === redeem.acaoId);
        if (acao) {
          const saldoMaximo = this.getSaldoAcumulado(acao);
          invalidAcoesDetailsList.push({
            nome: acao.nome,
            saldoMaximo: saldoMaximo
          });
        }
      }
    });

    if (invalidAcoesDetailsList.length > 0) {
      this.invalidAcoesDetails.set(invalidAcoesDetailsList);
      this.showErrorModal.set(true);
      return;
    }

    const redeemData = Array.from(this.redeemValues().values())
      .filter(r => r.value > 0 && !r.hasError)
      .map(r => ({
        acaoId: r.acaoId,
        acaoNome: this.investment!.acoes.find(a => a.id === r.acaoId)?.nome || '',
        value: r.value
      }));

    console.log('Dados do resgate:', {
      investment: this.investment.nome,
      redeems: redeemData,
      total: this.totalRedeem()
    });

    this.showSuccessModal.set(true);
  }

  closeSuccessModal(): void {
    this.showSuccessModal.set(false);
  }

  closeErrorModal(): void {
    this.showErrorModal.set(false);
  }

  startNewRedeem(): void {
    this.showSuccessModal.set(false);
    this.initializeRedeemValues();
  }
}
