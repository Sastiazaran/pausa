import { MovementKind, PurchaseKind, type MovementKind as MovementKindValue, type PurchaseKind as PurchaseKindValue } from './constants';

type Felt = {
  kind: MovementKindValue;
  occurredOn: string;
  purchaseKind: PurchaseKindValue | null;
  worthIt: boolean | null;
};

/**
 * Deseos de ese mes que ella marcó como que no valieron la pena.
 *
 * Una necesidad, una entrada o un deseo que sí valió no entran en la cuenta.
 */
export function unworthyDesires(movements: Felt[], month: string): number {
  return movements.filter(
    (movement) =>
      movement.kind === MovementKind.Expense &&
      movement.occurredOn.startsWith(month) &&
      movement.purchaseKind === PurchaseKind.Desire &&
      movement.worthIt === false,
  ).length;
}
