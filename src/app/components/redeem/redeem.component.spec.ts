import { ActivatedRoute, Router } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Investment, formatCurrency } from '../../models/investment.model';
import { of, throwError } from 'rxjs';

import { InvestmentService } from '../../services/investment.service';
import { RedeemComponent } from './redeem.component';

describe('RedeemComponent', () => {
  let component: RedeemComponent;
  let fixture: ComponentFixture<RedeemComponent>;
  let investmentService: jasmine.SpyObj<InvestmentService>;
  let router: jasmine.SpyObj<Router>;
  let activatedRoute: jasmine.SpyObj<ActivatedRoute>;

  const mockInvestment: Investment = {
    nome: 'INVESTIMENTO III',
    objetivo: 'Abrir meu próprio negócio',
    saldoTotal: 123800.45,
    indicadorCarencia: 'N',
    acoes: [
      {
        id: '1',
        nome: 'BANCO DO BRASIL (BBAS3)',
        percentual: 28.1
      },
      {
        id: '2',
        nome: 'VALE (VALE3)',
        percentual: 20.71
      },
      {
        id: '3',
        nome: 'PETROBRAS (PETRA)',
        percentual: 21.63
      }
    ]
  };

  const mockInvestments: Investment[] = [
    mockInvestment,
    {
      nome: 'INVESTIMENTO I',
      objetivo: 'Minha aposentadoria',
      saldoTotal: 39321.29,
      indicadorCarencia: 'N',
      acoes: []
    }
  ];

  beforeEach(async () => {
    const serviceSpy = jasmine.createSpyObj('InvestmentService', ['getInvestments']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const routeSpy = jasmine.createSpyObj('ActivatedRoute', [], {
      snapshot: {
        paramMap: {
          get: jasmine.createSpy('get').and.returnValue(encodeURIComponent('INVESTIMENTO III'))
        }
      }
    });

    await TestBed.configureTestingModule({
      imports: [RedeemComponent],
      providers: [
        { provide: InvestmentService, useValue: serviceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: routeSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RedeemComponent);
    component = fixture.componentInstance;
    investmentService = TestBed.inject(InvestmentService) as jasmine.SpyObj<InvestmentService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    activatedRoute = TestBed.inject(ActivatedRoute) as jasmine.SpyObj<ActivatedRoute>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load investment on init', () => {
    investmentService.getInvestments.and.returnValue(of(mockInvestments));

    fixture.detectChanges();

    expect(investmentService.getInvestments).toHaveBeenCalled();
    expect(component.investment).toEqual(mockInvestment);
  });

  it('should initialize redeem values for all acoes', () => {
    investmentService.getInvestments.and.returnValue(of(mockInvestments));

    fixture.detectChanges();

    expect(component.redeemValues().size).toBe(3);
    mockInvestment.acoes.forEach((acao) => {
      const redeem = component.getRedeemValue(acao.id);
      expect(redeem.acaoId).toBe(acao.id);
      expect(redeem.value).toBe(0);
      expect(redeem.formattedValue).toBe('');
      expect(redeem.hasError).toBe(false);
    });
  });

  it('should calculate saldo acumulado correctly', () => {
    investmentService.getInvestments.and.returnValue(of(mockInvestments));

    fixture.detectChanges();

    const acao1 = mockInvestment.acoes[0];
    const saldoAcumulado = component.getSaldoAcumulado(acao1);
    const expected = (mockInvestment.saldoTotal * acao1.percentual) / 100;
    expect(saldoAcumulado).toBe(expected);
  });

  it('should return 0 for saldo acumulado if investment is undefined', () => {
    const acao = mockInvestment.acoes[0];
    const saldoAcumulado = component.getSaldoAcumulado(acao);
    expect(saldoAcumulado).toBe(0);
  });

  it('should format currency input correctly', () => {
    expect(component.formatCurrencyInput(0)).toBe('');
    expect(component.formatCurrencyInput(500)).toContain('R$');
    expect(component.formatCurrencyInput(2614.13)).toContain('2.614,13');
  });

  it('should handle empty input value', () => {
    investmentService.getInvestments.and.returnValue(of(mockInvestments));
    fixture.detectChanges();

    const acaoId = mockInvestment.acoes[0].id;
    const input = document.createElement('input');
    input.value = '';

    component.onRedeemValueChange(acaoId, { target: input } as any);

    const redeem = component.getRedeemValue(acaoId);
    expect(redeem.value).toBe(0);
    expect(redeem.formattedValue).toBe('');
    expect(redeem.hasError).toBe(false);
  });

  it('should format and validate input value correctly', () => {
    investmentService.getInvestments.and.returnValue(of(mockInvestments));
    fixture.detectChanges();

    const acaoId = mockInvestment.acoes[0].id;
    const input = document.createElement('input');
    input.value = '50000';

    component.onRedeemValueChange(acaoId, { target: input } as any);

    const redeem = component.getRedeemValue(acaoId);
    expect(redeem.value).toBe(500);
    expect(redeem.formattedValue).toContain('R$');
    expect(redeem.hasError).toBe(false);
  });

  it('should show error when value exceeds saldo acumulado', () => {
    investmentService.getInvestments.and.returnValue(of(mockInvestments));
    fixture.detectChanges();

    const acao = mockInvestment.acoes[0];
    const saldoAcumulado = component.getSaldoAcumulado(acao);
    const input = document.createElement('input');
    const valueExceeding = (saldoAcumulado + 1000) * 100;
    input.value = valueExceeding.toString();

    component.onRedeemValueChange(acao.id, { target: input } as any);

    const redeem = component.getRedeemValue(acao.id);
    expect(redeem.hasError).toBe(true);
    expect(redeem.errorMessage).toContain('O valor a resgatar não pode ser maior que R$');
    expect(redeem.errorMessage).toContain(formatCurrency(saldoAcumulado));
  });

  it('should calculate total redeem correctly', () => {
    investmentService.getInvestments.and.returnValue(of(mockInvestments));
    fixture.detectChanges();

    const acao1Id = mockInvestment.acoes[0].id;
    const acao2Id = mockInvestment.acoes[1].id;

    const input1 = document.createElement('input');
    input1.value = '50000';
    component.onRedeemValueChange(acao1Id, { target: input1 } as any);

    const input2 = document.createElement('input');
    input2.value = '100000';
    component.onRedeemValueChange(acao2Id, { target: input2 } as any);

    expect(component.totalRedeem()).toBe(1500);
  });

  it('should return false for hasFilledFields when no values are entered', () => {
    investmentService.getInvestments.and.returnValue(of(mockInvestments));
    fixture.detectChanges();

    expect(component.hasFilledFields()).toBe(false);
  });

  it('should return true for hasFilledFields when at least one value is entered', () => {
    investmentService.getInvestments.and.returnValue(of(mockInvestments));
    fixture.detectChanges();

    const acaoId = mockInvestment.acoes[0].id;
    const input = document.createElement('input');
    input.value = '50000';
    component.onRedeemValueChange(acaoId, { target: input } as any);

    expect(component.hasFilledFields()).toBe(true);
  });

  it('should navigate back when goBack is called', () => {
    component.goBack();

    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should not confirm redeem if no fields are filled', () => {
    investmentService.getInvestments.and.returnValue(of(mockInvestments));
    fixture.detectChanges();

    const consoleSpy = spyOn(console, 'log');
    component.confirmRedeem();

    expect(consoleSpy).not.toHaveBeenCalled();
  });

  it('should confirm redeem with correct data', () => {
    investmentService.getInvestments.and.returnValue(of(mockInvestments));
    fixture.detectChanges();

    const acao1Id = mockInvestment.acoes[0].id;
    const acao2Id = mockInvestment.acoes[1].id;

    const input1 = document.createElement('input');
    input1.value = '50000';
    component.onRedeemValueChange(acao1Id, { target: input1 } as any);

    const input2 = document.createElement('input');
    input2.value = '100000';
    component.onRedeemValueChange(acao2Id, { target: input2 } as any);

    const consoleSpy = spyOn(console, 'log');
    component.confirmRedeem();

    expect(consoleSpy).toHaveBeenCalled();
    const callArgs = consoleSpy.calls.mostRecent().args[1] as {
      investment: string;
      redeems: Array<{ acaoId: string; acaoNome: string; value: number }>;
      total: number;
    };
    expect(callArgs.investment).toBe(mockInvestment.nome);
    expect(callArgs.redeems.length).toBe(2);
    expect(callArgs.total).toBe(1500);
  });

  it('should show error modal when confirm redeem with invalid values', () => {
    investmentService.getInvestments.and.returnValue(of(mockInvestments));
    fixture.detectChanges();

    const acao = mockInvestment.acoes[0];
    const saldoAcumulado = component.getSaldoAcumulado(acao);
    const input = document.createElement('input');
    const valueExceeding = (saldoAcumulado + 1000) * 100;
    input.value = valueExceeding.toString();
    component.onRedeemValueChange(acao.id, { target: input } as any);

    const consoleSpy = spyOn(console, 'log');
    component.confirmRedeem();

    expect(consoleSpy).not.toHaveBeenCalled();
    expect(component.showErrorModal()).toBe(true);
    expect(component.invalidAcoesDetails().length).toBeGreaterThan(0);
    expect(component.invalidAcoesDetails()[0].nome).toBe(acao.nome);
    expect(component.invalidAcoesDetails()[0].saldoMaximo).toBe(saldoAcumulado);
  });

  it('should show success modal when confirm redeem with valid values', () => {
    investmentService.getInvestments.and.returnValue(of(mockInvestments));
    fixture.detectChanges();

    const acaoId = mockInvestment.acoes[0].id;
    const input = document.createElement('input');
    input.value = '50000';
    component.onRedeemValueChange(acaoId, { target: input } as any);

    const consoleSpy = spyOn(console, 'log');
    component.confirmRedeem();

    expect(consoleSpy).toHaveBeenCalled();
    expect(component.showSuccessModal()).toBe(true);
  });

  it('should close success modal', () => {
    component.showSuccessModal.set(true);
    component.closeSuccessModal();
    expect(component.showSuccessModal()).toBe(false);
  });

  it('should close error modal', () => {
    component.showErrorModal.set(true);
    component.closeErrorModal();
    expect(component.showErrorModal()).toBe(false);
  });

  it('should start new redeem and reset values', () => {
    investmentService.getInvestments.and.returnValue(of(mockInvestments));
    fixture.detectChanges();

    const acaoId = mockInvestment.acoes[0].id;
    const input = document.createElement('input');
    input.value = '50000';
    component.onRedeemValueChange(acaoId, { target: input } as any);

    component.showSuccessModal.set(true);
    component.startNewRedeem();

    expect(component.showSuccessModal()).toBe(false);
    const redeem = component.getRedeemValue(acaoId);
    expect(redeem.value).toBe(0);
    expect(redeem.formattedValue).toBe('');
  });

  it('should handle error when loading investment', () => {
    const consoleSpy = spyOn(console, 'error');
    investmentService.getInvestments.and.returnValue(
      throwError(() => new Error('Erro ao carregar'))
    );

    fixture.detectChanges();

    expect(consoleSpy).toHaveBeenCalled();
  });

  it('should handle investment not found', () => {
    investmentService.getInvestments.and.returnValue(of(mockInvestments));
    (activatedRoute.snapshot.paramMap.get as jasmine.Spy).and.returnValue(
      encodeURIComponent('INVESTIMENTO INEXISTENTE')
    );

    fixture.detectChanges();

    expect(component.investment).toBeUndefined();
  });

  it('should get redeem value for non-existent acao', () => {
    const redeem = component.getRedeemValue('non-existent');
    expect(redeem.acaoId).toBe('non-existent');
    expect(redeem.value).toBe(0);
    expect(redeem.formattedValue).toBe('');
    expect(redeem.hasError).toBe(false);
  });

  it('should handle input with only non-digit characters', () => {
    investmentService.getInvestments.and.returnValue(of(mockInvestments));
    fixture.detectChanges();

    const acaoId = mockInvestment.acoes[0].id;
    const input = document.createElement('input');
    input.value = 'abc';

    component.onRedeemValueChange(acaoId, { target: input } as any);

    const redeem = component.getRedeemValue(acaoId);
    expect(redeem.value).toBe(0);
    expect(redeem.formattedValue).toBe('');
  });

  it('should calculate total as 0 when all values are 0', () => {
    investmentService.getInvestments.and.returnValue(of(mockInvestments));
    fixture.detectChanges();

    expect(component.totalRedeem()).toBe(0);
  });
});
