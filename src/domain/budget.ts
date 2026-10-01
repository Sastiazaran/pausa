import { PurchaseKind, type PurchaseKind as PurchaseKindValue } from './constants';

export type PourItem = {
  id: string;
  kind: PurchaseKindValue;
  target: number;
  order: number;
};

export type PourLine = {
  id: string;
  allocated: number;
  /** No le alcanzó nada. */
  waiting: boolean;
  /** Le alcanzó una parte del precio. */
  partial: boolean;
};

export type PourResult = {
  /** Lo que queda después de apartar las cuentas, antes de repartir. */
  free: number;
  reserve: number;
  lines: PourLine[];
};

/**
 * Reparte el presupuesto que sobra después de las cuentas.
 *
 * Primero las necesidades, en el orden en que las apuntó. El dinero se vacía
 * de arriba hacia abajo hasta que se acaba; lo que no alcanza queda en espera.
 */
export function pourBudget(budget: number, reserve: number, items: PourItem[]): PourResult {
  const safeBudget = Math.max(0, budget);
  const safeReserve = Math.max(0, reserve);
  const free = Math.max(0, safeBudget - safeReserve);
  let left = free;

  const sorted = [...items].sort((leftItem, rightItem) => {
    if (leftItem.kind !== rightItem.kind) {
      return leftItem.kind === PurchaseKind.Need ? -1 : 1;
    }
    return leftItem.order - rightItem.order;
  });

  const lines = sorted.map((item) => {
    const target = Math.max(0, item.target);
    const allocated = Math.min(target, left);
    left -= allocated;
    return {
      id: item.id,
      allocated,
      waiting: allocated === 0 && target > 0,
      partial: allocated > 0 && allocated < target,
    };
  });

  return { free, reserve: safeReserve, lines };
}
