import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { InvestmentService } from './services/investment.service';
import { of } from 'rxjs';

describe('App', () => {
  beforeEach(async () => {
    const investmentServiceSpy = jasmine.createSpyObj('InvestmentService', ['getInvestments']);
    investmentServiceSpy.getInvestments.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        { provide: InvestmentService, useValue: investmentServiceSpy }
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render investments list component', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-investments-list')).toBeTruthy();
  });
});
