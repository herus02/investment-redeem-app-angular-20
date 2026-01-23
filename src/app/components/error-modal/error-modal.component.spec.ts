import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorModalComponent } from './error-modal.component';
import { formatCurrency } from '../../models/investment.model';

describe('ErrorModalComponent', () => {
  let component: ErrorModalComponent;
  let fixture: ComponentFixture<ErrorModalComponent>;

  const mockInvalidAcoesDetails = [
    {
      nome: 'BANCO DO BRASIL (BBAS3)',
      saldoMaximo: 10897.32
    },
    {
      nome: 'VALE (VALE3)',
      saldoMaximo: 76897.34
    }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ErrorModalComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ErrorModalComponent);
    component = fixture.componentInstance;
    component.invalidAcoesDetails = mockInvalidAcoesDetails;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit close event when onClose is called', () => {
    spyOn(component.close, 'emit');
    component.onClose();
    expect(component.close.emit).toHaveBeenCalled();
  });

  it('should display error title', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const title = compiled.querySelector('.error-title');
    expect(title?.textContent).toContain('Você preencheu um ou mais campos com valor acima do permitido:');
  });

  it('should display invalid acoes details', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const errorMessages = compiled.querySelectorAll('.error-message');
    expect(errorMessages.length).toBe(2);
    expect(errorMessages[0].textContent).toContain('BANCO DO BRASIL (BBAS3)');
    expect(errorMessages[0].textContent).toContain(formatCurrency(10897.32));
  });

  it('should display correct button', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const button = compiled.querySelector('.btn-correct');
    expect(button?.textContent).toContain('CORRIGIR');
  });

  it('should call onClose when button is clicked', () => {
    spyOn(component, 'onClose');
    const compiled = fixture.nativeElement as HTMLElement;
    const button = compiled.querySelector('.btn-correct') as HTMLButtonElement;
    button.click();
    expect(component.onClose).toHaveBeenCalled();
  });

  it('should call onClose when backdrop is clicked', () => {
    spyOn(component, 'onClose');
    const compiled = fixture.nativeElement as HTMLElement;
    const backdrop = compiled.querySelector('.modal-backdrop') as HTMLElement;
    backdrop.click();
    expect(component.onClose).toHaveBeenCalled();
  });

  it('should handle empty invalidAcoesDetails', () => {
    component.invalidAcoesDetails = [];
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const errorMessages = compiled.querySelectorAll('.error-message');
    expect(errorMessages.length).toBe(0);
  });
});
