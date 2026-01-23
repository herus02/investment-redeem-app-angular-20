import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InvestmentsListComponent } from './investments-list.component';
import { InvestmentService } from '../../services/investment.service';
import { of, throwError } from 'rxjs';
import { Investment } from '../../models/investment.model';

describe('InvestmentsListComponent', () => {
  let component: InvestmentsListComponent;
  let fixture: ComponentFixture<InvestmentsListComponent>;
  let investmentService: jasmine.SpyObj<InvestmentService>;

  const mockInvestments: Investment[] = [
    {
      nome: 'INVESTIMENTO I',
      objetivo: 'Minha aposentadoria',
      saldoTotal: 39321.29,
      indicadorCarencia: 'N',
      acoes: [
        {
          id: '1',
          nome: 'Banco do Brasil (BBAS3)',
          percentual: 28.1
        }
      ]
    },
    {
      nome: 'INVESTIMENTO II',
      objetivo: 'Viajen dos sonhos',
      saldoTotal: 7300,
      indicadorCarencia: 'S',
      acoes: []
    }
  ];

  beforeEach(async () => {
    const serviceSpy = jasmine.createSpyObj('InvestmentService', [
      'getInvestments'
    ]);

    await TestBed.configureTestingModule({
      imports: [InvestmentsListComponent],
      providers: [
        { provide: InvestmentService, useValue: serviceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(InvestmentsListComponent);
    component = fixture.componentInstance;
    investmentService = TestBed.inject(InvestmentService) as jasmine.SpyObj<InvestmentService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load investments on init', () => {
    investmentService.getInvestments.and.returnValue(of(mockInvestments));

    fixture.detectChanges();

    expect(investmentService.getInvestments).toHaveBeenCalled();
    expect(component.investments).toEqual(mockInvestments);
  });

  it('should handle error when loading investments', () => {
    const consoleSpy = spyOn(console, 'error');
    investmentService.getInvestments.and.returnValue(
      throwError(() => new Error('Erro ao carregar'))
    );

    fixture.detectChanges();

    expect(consoleSpy).toHaveBeenCalled();
  });

  it('should call onView when view button is clicked', () => {
    investmentService.getInvestments.and.returnValue(of(mockInvestments));
    fixture.detectChanges();

    const consoleSpy = spyOn(console, 'log');
    component.onView(mockInvestments[0]);

    expect(consoleSpy).toHaveBeenCalledWith('Visualizar investment:', mockInvestments[0]);
  });

  it('should call onEdit when edit button is clicked', () => {
    investmentService.getInvestments.and.returnValue(of(mockInvestments));
    fixture.detectChanges();

    const consoleSpy = spyOn(console, 'log');
    component.onEdit(mockInvestments[0]);

    expect(consoleSpy).toHaveBeenCalledWith('Editar investment:', mockInvestments[0]);
  });

  it('should check if investment is disabled correctly', () => {
    expect(component.isDisabled(mockInvestments[0])).toBe(false);
    expect(component.isDisabled(mockInvestments[1])).toBe(true);
  });

  it('should handle investment click', () => {
    investmentService.getInvestments.and.returnValue(of(mockInvestments));
    fixture.detectChanges();

    expect(() => component.onInvestmentClick(mockInvestments[0])).not.toThrow();
  });

  it('should format currency correctly', () => {
    const formatted = component.formatCurrency(1234.56);
    expect(formatted).toContain('R$');
    expect(formatted).toContain('1.234,56');
  });

  it('should display saldoTotal correctly', () => {
    investmentService.getInvestments.and.returnValue(of(mockInvestments));
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const saldoCell = compiled.querySelector('tbody tr td:nth-child(4)');
    expect(saldoCell?.textContent).toContain('R$');
  });
});
