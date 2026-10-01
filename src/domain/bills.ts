import { BillCadence, DueSoonDays, ReminderHour, type BillCadence as BillCadenceValue } from './constants';
import { daysBetween, fromDayKey } from './dates';

type Schedule = {
  amount: number;
  cadence: BillCadenceValue;
  nextDue: string;
};

/**
 * Cuántas veces cae el día de la semana de `dayKey` dentro de un mes.
 *
 * Una cuenta semanal se aparta por cada ocurrencia de ese día en el mes,
 * no solo por la próxima fecha guardada.
 */
export function weekdayOccurrencesInMonth(dayKey: string, year: number, monthIndex: number): number {
  const weekday = fromDayKey(dayKey).getDay();
  const cursor = new Date(year, monthIndex, 1);
  let count = 0;

  while (cursor.getMonth() === monthIndex) {
    if (cursor.getDay() === weekday) {
      count += 1;
    }
    cursor.setDate(cursor.getDate() + 1);
  }

  return count;
}

/**
 * Dinero que hay que dejar apartado este mes para las cuentas.
 *
 * La mensual cuenta una vez. La semanal cuenta cada vez que toca su día.
 */
export function monthlyReserve(bills: Schedule[], year: number, monthIndex: number): number {
  return bills.reduce((sum, bill) => {
    if (bill.cadence === BillCadence.Monthly) {
      return sum + bill.amount;
    }
    return sum + bill.amount * weekdayOccurrencesInMonth(bill.nextDue, year, monthIndex);
  }, 0);
}

/** Cuentas vencidas o que vencen dentro de `withinDays`, la más atrasada primero. */
export function reminderBills<T extends { nextDue: string }>(
  bills: T[],
  today: string,
  withinDays: number = DueSoonDays,
): T[] {
  return bills
    .filter((bill) => {
      const days = daysBetween(today, bill.nextDue);
      return days <= withinDays;
    })
    .sort((left, right) => left.nextDue.localeCompare(right.nextDue));
}

/**
 * Instante local del recordatorio: 9:00 del día anterior.
 * Null si ese momento ya pasó, para no programar una alarma muerta.
 */
export function reminderInstant(nextDue: string, now: Date = new Date()): Date | null {
  const due = fromDayKey(nextDue);
  const when = new Date(due.getFullYear(), due.getMonth(), due.getDate() - 1, ReminderHour, 0, 0, 0);
  if (when.getTime() <= now.getTime()) {
    return null;
  }
  return when;
}
