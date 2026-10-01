import { daysBetween, fromDayKey, monthKey, shiftDayKey, toDayKey, todayKey } from '../dates';

describe('días', () => {
  it('debería formatear una fecha local como YYYY-MM-DD', () => {
    expect(toDayKey(new Date(2026, 9, 1))).toBe('2026-10-01');
  });

  it('debería usar el día local y no el de UTC', () => {
    expect(todayKey(new Date(2026, 9, 1, 23, 50))).toBe('2026-10-01');
  });

  it('debería cruzar el fin de mes', () => {
    expect(shiftDayKey('2026-01-31', 1)).toBe('2026-02-01');
    expect(shiftDayKey('2026-03-01', -1)).toBe('2026-02-28');
  });

  it('debería contar cero cuando es el mismo día', () => {
    expect(daysBetween('2026-10-01', '2026-10-01')).toBe(0);
  });

  it('debería ser negativo cuando la fecha ya pasó', () => {
    expect(daysBetween('2026-10-05', '2026-10-03')).toBe(-2);
  });

  it('debería recortar el mes', () => {
    expect(monthKey('2026-10-03')).toBe('2026-10');
  });

  it('debería reconstruir el mismo día', () => {
    expect(toDayKey(fromDayKey('2026-02-01'))).toBe('2026-02-01');
  });
});
