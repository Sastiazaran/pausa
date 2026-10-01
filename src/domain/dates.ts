/**
 * Fechas de calendario local, guardadas como `YYYY-MM-DD`.
 *
 * Un gasto a las 23:50 pertenece a ese día en el teléfono, aunque UTC ya haya
 * cambiado de fecha.
 */

const MsPerDay = 86_400_000;

/** Formatea una fecha como día local `YYYY-MM-DD`. */
export function toDayKey(date: Date): string {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/** Interpreta un día `YYYY-MM-DD` como medianoche local. */
export function fromDayKey(dayKey: string): Date {
  const [year, month, day] = dayKey.split('-').map(Number);
  return new Date(year, month - 1, day);
}

/** Día local de `now`. */
export function todayKey(now: Date = new Date()): string {
  return toDayKey(now);
}

/** Día `amount` lugares después de `dayKey`. Un valor negativo retrocede. */
export function shiftDayKey(dayKey: string, amount: number): string {
  const date = fromDayKey(dayKey);
  date.setDate(date.getDate() + amount);
  return toDayKey(date);
}

/**
 * Días enteros de `from` a `to`.
 *
 * Se mide al mediodía para que un cambio de horario no sume o reste un día.
 */
export function daysBetween(from: string, to: string): number {
  const start = fromDayKey(from);
  const end = fromDayKey(to);
  start.setHours(12, 0, 0, 0);
  end.setHours(12, 0, 0, 0);
  return Math.round((end.getTime() - start.getTime()) / MsPerDay);
}

/** `YYYY-MM` del día, para agrupar el mes en curso. */
export function monthKey(dayKey: string): string {
  return dayKey.slice(0, 7);
}

/** Año y mes (0–11) de un día. */
export function monthParts(dayKey: string): { year: number; monthIndex: number } {
  const date = fromDayKey(dayKey);
  return { year: date.getFullYear(), monthIndex: date.getMonth() };
}

/** Fecha larga en español, sin año: “3 de octubre”. */
export function formatDay(dayKey: string): string {
  return new Intl.DateTimeFormat('es-MX', { day: 'numeric', month: 'long' }).format(fromDayKey(dayKey));
}

/** True solo si `value` es un día real en `YYYY-MM-DD`. */
export function isDayKey(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }
  return toDayKey(fromDayKey(value)) === value;
}
