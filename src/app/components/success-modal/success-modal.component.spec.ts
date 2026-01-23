import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SuccessModalComponent } from './success-modal.component';

describe('SuccessModalComponent', () => {
  let component: SuccessModalComponent;
  let fixture: ComponentFixture<SuccessModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuccessModalComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(SuccessModalComponent);
    component = fixture.componentInstance;
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

  it('should emit newRedeem event when onNewRedeem is called', () => {
    spyOn(component.newRedeem, 'emit');
    component.onNewRedeem();
    expect(component.newRedeem.emit).toHaveBeenCalled();
  });

  it('should display success message', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const title = compiled.querySelector('.modal-title-success');
    expect(title?.textContent).toContain('RESGATE EFETUADO COM SUCESSO!');
  });

  it('should display new redeem button', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const button = compiled.querySelector('.btn-new-redeem');
    expect(button?.textContent).toContain('NOVO RESGATE');
  });

  it('should call onNewRedeem when button is clicked', () => {
    spyOn(component, 'onNewRedeem');
    const compiled = fixture.nativeElement as HTMLElement;
    const button = compiled.querySelector('.btn-new-redeem') as HTMLButtonElement;
    button.click();
    expect(component.onNewRedeem).toHaveBeenCalled();
  });

  it('should call onClose when backdrop is clicked', () => {
    spyOn(component, 'onClose');
    const compiled = fixture.nativeElement as HTMLElement;
    const backdrop = compiled.querySelector('.modal-backdrop') as HTMLElement;
    backdrop.click();
    expect(component.onClose).toHaveBeenCalled();
  });
});
