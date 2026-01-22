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
    }
  ];

  beforeEach(async () => {
    const serviceSpy = jasmine.createSpyObj('InvestmentService', [
      'getInvestments',
      'deleteInvestment'
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

  it('should delete investment when confirmed', () => {
    investmentService.getInvestments.and.returnValue(of(mockInvestments));
    investmentService.deleteInvestment.and.returnValue(of(true));
    investmentService.getInvestments.and.returnValue(of([mockInvestments[1]]));

    fixture.detectChanges();

    spyOn(window, 'confirm').and.returnValue(true);
    component.onDelete(mockInvestments[0]);

    expect(investmentService.deleteInvestment).toHaveBeenCalledWith(1);
  });

  it('should not delete investment when not confirmed', () => {
    investmentService.getInvestments.and.returnValue(of(mockInvestments));
    fixture.detectChanges();

    spyOn(window, 'confirm').and.returnValue(false);
    component.onDelete(mockInvestments[0]);

    expect(investmentService.deleteInvestment).not.toHaveBeenCalled();
  });

  it('should format currency correctly', () => {
    const formatted = component.formatCurrency(1234.56);
    expect(formatted).toContain('R$');
    expect(formatted).toContain('1.234,56');
  });
});
