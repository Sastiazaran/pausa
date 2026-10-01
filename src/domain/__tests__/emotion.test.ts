import { MovementKind, PurchaseKind } from '../constants';
import { unworthyDesires } from '../emotion';

describe('deseos que no valieron', () => {
  it('debería contar solo deseos de este mes marcados como que no', () => {
    const count = unworthyDesires(
      [
        {
          kind: MovementKind.Expense,
          occurredOn: '2026-10-02',
          purchaseKind: PurchaseKind.Desire,
          worthIt: false,
        },
        {
          kind: MovementKind.Expense,
          occurredOn: '2026-10-03',
          purchaseKind: PurchaseKind.Desire,
          worthIt: true,
        },
        {
          kind: MovementKind.Expense,
          occurredOn: '2026-10-04',
          purchaseKind: PurchaseKind.Need,
          worthIt: false,
        },
        {
          kind: MovementKind.Income,
          occurredOn: '2026-10-01',
          purchaseKind: null,
          worthIt: null,
        },
        {
          kind: MovementKind.Expense,
          occurredOn: '2026-09-30',
          purchaseKind: PurchaseKind.Desire,
          worthIt: false,
        },
      ],
      '2026-10',
    );

    expect(count).toBe(1);
  });
});
