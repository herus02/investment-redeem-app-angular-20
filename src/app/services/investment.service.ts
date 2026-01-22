import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Investment } from '../models/investment.model';

@Injectable({
  providedIn: 'root'
})
export class InvestmentService {
  private investments: Investment[] = [
    {
      id: 1,
      nome: 'INVESTMENT I',
      objetivo: 'Aposentadoria',
      saldo: 39258.24
    },
    {
      id: 2,
      nome: 'INVESTMENT II',
      objetivo: 'Viagem dos sonhos',
      saldo: 10320.00
    },
    {
      id: 3,
      nome: 'INVESTMENT III',
      objetivo: 'Abrir meu próprio negócio',
      saldo: 123800.45
    }
  ];

  getInvestments(): Observable<Investment[]> {
    return of(this.investments);
  }

  getInvestmentById(id: number): Observable<Investment | undefined> {
    const investment = this.investments.find(inv => inv.id === id);
    return of(investment);
  }

  deleteInvestment(id: number): Observable<boolean> {
    const index = this.investments.findIndex(inv => inv.id === id);
    if (index > -1) {
      this.investments.splice(index, 1);
      return of(true);
    }
    return of(false);
  }
}
