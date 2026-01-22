import { TestBed } from '@angular/core/testing';
import { InvestmentService } from './investment.service';
import { Investment } from '../models/investment.model';

describe('InvestmentService', () => {
  let service: InvestmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InvestmentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return list of investments', (done) => {
    service.getInvestments().subscribe({
      next: (investments) => {
        expect(investments).toBeDefined();
        expect(Array.isArray(investments)).toBe(true);
        expect(investments.length).toBeGreaterThan(0);
        done();
      }
    });
  });

  it('should return investment by id', (done) => {
    service.getInvestmentById(1).subscribe({
      next: (investment) => {
        expect(investment).toBeDefined();
        expect(investment?.id).toBe(1);
        done();
      }
    });
  });

  it('should return undefined for non-existent id', (done) => {
    service.getInvestmentById(999).subscribe({
      next: (investment) => {
        expect(investment).toBeUndefined();
        done();
      }
    });
  });

  it('should delete investment successfully', (done) => {
    service.getInvestments().subscribe({
      next: (initialInvestments) => {
        const initialCount = initialInvestments.length;
        const idToDelete = initialInvestments[0].id;

        service.deleteInvestment(idToDelete).subscribe({
          next: (success) => {
            expect(success).toBe(true);

            service.getInvestments().subscribe({
              next: (updatedInvestments) => {
                expect(updatedInvestments.length).toBe(initialCount - 1);
                expect(updatedInvestments.find(inv => inv.id === idToDelete)).toBeUndefined();
                done();
              }
            });
          }
        });
      }
    });
  });

  it('should return false when deleting non-existent investment', (done) => {
    service.deleteInvestment(999).subscribe({
      next: (success) => {
        expect(success).toBe(false);
        done();
      }
    });
  });
});
