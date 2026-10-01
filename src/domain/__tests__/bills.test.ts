import { BillCadence } from '../constants';
import { monthlyReserve, reminderBills, reminderInstant, weekdayOccurrencesInMonth } from '../bills';

describe('cuentas por vencer', () => {
  const bills = [
    { id: 'hoy', nextDue: '2026-10-01' },
    { id: 'semana', nextDue: '2026-10-08' },
    { id: 'lejos', nextDue: '2026-10-09' },
    { id: 'atrasada', nextDue: '2026-09-28' },
  ];

  it('debería incluir la de hoy, la de 7 días y la atrasada', () => {
    expect(reminderBills(bills, '2026-10-01').map((bill) => bill.id)).toEqual(['atrasada', 'hoy', 'semana']);
  });

  it('debería dejar fuera la que vence en 8 días', () => {
    expect(reminderBills(bills, '2026-10-01').some((bill) => bill.id === 'lejos')).toBe(false);
  });
});

describe('apartado del mes', () => {
  it('debería contar los domingos de febrero 2026', () => {
    expect(weekdayOccurrencesInMonth('2026-02-01', 2026, 1)).toBe(4);
  });

  it('debería apartar la mensual una vez y la semanal por cada ocurrencia', () => {
    const reserve = monthlyReserve(
      [
        { amount: 1200, cadence: BillCadence.Monthly, nextDue: '2026-02-10' },
        { amount: 100, cadence: BillCadence.Weekly, nextDue: '2026-02-01' },
      ],
      2026,
      1,
    );

    expect(reserve).toBe(1600);
  });
});

describe('alarma', () => {
  it('debería avisar a las 9 del día anterior', () => {
    const when = reminderInstant('2026-10-05', new Date(2026, 9, 1, 8, 0, 0));

    expect(when).toEqual(new Date(2026, 9, 4, 9, 0, 0, 0));
  });

  it('debería no programar una alarma que ya pasó', () => {
    expect(reminderInstant('2026-10-02', new Date(2026, 9, 2, 12, 0, 0))).toBeNull();
  });
});
