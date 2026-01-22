export interface Investment {
  id: number;
  nome: string;
  objetivo: string;
  saldo: number;
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}
