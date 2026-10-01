import { MovementKind, type MovementKind as MovementKindValue } from './constants';

type Flow = {
  kind: MovementKindValue;
  amount: number;
  occurredOn: string;
};

/** Saldo de la tarjeta: lo que puso al empezar, más entradas, menos salidas. */
export function walletBalance(startingBalance: number, movements: Flow[]): number {
  return movements.reduce((sum, movement) => {
    const signed = movement.kind === MovementKind.Income ? movement.amount : -movement.amount;
    return sum + signed;
  }, startingBalance);
}

/** Suma de entradas y de salidas cuya fecha cae en `month` (`YYYY-MM`). */
export function monthFlow(movements: Flow[], month: string): { income: number; expense: number } {
  return movements.reduce(
    (totals, movement) => {
      if (!movement.occurredOn.startsWith(month)) {
        return totals;
      }
      if (movement.kind === MovementKind.Income) {
        return { ...totals, income: totals.income + movement.amount };
      }
      return { ...totals, expense: totals.expense + movement.amount };
    },
    { income: 0, expense: 0 },
  );
}
