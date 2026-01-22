import { formatCurrency } from './investment.model';

describe('formatCurrency', () => {
  it('should format currency in Brazilian format', () => {
    const result = formatCurrency(1234.56);
    expect(result).toContain('R$');
    expect(result).toContain('1.234,56');
  });

  it('should format large numbers correctly', () => {
    const result = formatCurrency(123800.45);
    expect(result).toContain('123.800,45');
  });

  it('should format small numbers correctly', () => {
    const result = formatCurrency(10.50);
    expect(result).toContain('10,50');
  });

  it('should format zero correctly', () => {
    const result = formatCurrency(0);
    expect(result).toContain('0,00');
  });
});
