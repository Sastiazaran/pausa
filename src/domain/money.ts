/**
 * Pesos mexicanos.
 *
 * Los montos se guardan como número con centavos. El texto que escribe ella
 * acepta `$`, coma decimal y coma de miles.
 */

/** Lee un monto escrito a mano. Devuelve null si no es un precio usable. */
export function parseAmount(raw: string): number | null {
  let cleaned = raw.replace(/[$\s]/g, '');
  if (cleaned.includes(',') && cleaned.includes('.')) {
    cleaned = cleaned.replace(/,/g, '');
  } else if (cleaned.includes(',')) {
    cleaned = cleaned.replace(',', '.');
  }

  if (!/^\d+(\.\d{1,2})?$/.test(cleaned)) {
    return null;
  }

  const value = Number(cleaned);
  if (!Number.isFinite(value) || value <= 0 || value > 1_000_000_000) {
    return null;
  }

  return Math.round(value * 100) / 100;
}

/** Formatea un monto como pesos, por ejemplo `$1,200.00`. */
export function formatMoney(amount: number): string {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}
