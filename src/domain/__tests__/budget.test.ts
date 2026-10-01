import { PurchaseKind } from '../constants';
import { pourBudget } from '../budget';

describe('reparto del presupuesto', () => {
  it('debería llenar primero la necesidad y dejar en espera lo que no alcanza', () => {
    const result = pourBudget(1000, 400, [
      { id: 'deseo', kind: PurchaseKind.Desire, target: 500, order: 0 },
      { id: 'necesidad', kind: PurchaseKind.Need, target: 300, order: 1 },
    ]);

    expect(result.free).toBe(600);
    expect(result.lines).toEqual([
      { id: 'necesidad', allocated: 300, waiting: false, partial: false },
      { id: 'deseo', allocated: 300, waiting: false, partial: true },
    ]);
  });

  it('debería dejar todo en espera cuando las cuentas se llevan el presupuesto', () => {
    const result = pourBudget(100, 100, [{ id: 'ropa', kind: PurchaseKind.Desire, target: 400, order: 0 }]);

    expect(result.free).toBe(0);
    expect(result.lines[0]).toMatchObject({ allocated: 0, waiting: true });
  });

  it('debería tratar un presupuesto negativo como cero', () => {
    const result = pourBudget(-10, 0, [{ id: 'a', kind: PurchaseKind.Need, target: 20, order: 0 }]);

    expect(result.free).toBe(0);
    expect(result.lines[0].waiting).toBe(true);
  });
});
