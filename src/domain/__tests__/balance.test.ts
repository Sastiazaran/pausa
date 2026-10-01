import { formatMoney, parseAmount } from '../money';
import { monthFlow, walletBalance } from '../balance';
import { MovementKind } from '../constants';

describe('montos', () => {
  it('debería aceptar pesos con coma decimal', () => {
    expect(parseAmount('$1,200.50')).toBe(1200.5);
    expect(parseAmount('18,5')).toBe(18.5);
  });

  it('debería rechazar vacío, cero y texto', () => {
    expect(parseAmount('')).toBeNull();
    expect(parseAmount('0')).toBeNull();
    expect(parseAmount('abc')).toBeNull();
    expect(parseAmount('-20')).toBeNull();
  });

  it('debería incluir el monto en el texto de pesos', () => {
    expect(formatMoney(10)).toMatch(/10\.00/);
  });
});

describe('saldo', () => {
  it('debería sumar entradas y restar salidas', () => {
    const balance = walletBalance(100, [
      { kind: MovementKind.Income, amount: 50, occurredOn: '2026-10-01' },
      { kind: MovementKind.Expense, amount: 20, occurredOn: '2026-10-02' },
    ]);

    expect(balance).toBe(130);
  });

  it('debería quedarse en el saldo inicial cuando no hay movimientos', () => {
    expect(walletBalance(0, [])).toBe(0);
  });
});

describe('flujo del mes', () => {
  it('debería ignorar movimientos de otro mes', () => {
    const flow = monthFlow(
      [
        { kind: MovementKind.Income, amount: 1000, occurredOn: '2026-10-02' },
        { kind: MovementKind.Expense, amount: 40, occurredOn: '2026-10-03' },
        { kind: MovementKind.Expense, amount: 90, occurredOn: '2026-09-30' },
      ],
      '2026-10',
    );

    expect(flow).toEqual({ income: 1000, expense: 40 });
  });
});
