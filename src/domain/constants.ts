/**
 * Valores persistidos y reglas fijas.
 *
 * Los identificadores viven aquí para que la base, la interfaz y las pruebas
 * hablen el mismo vocabulario. Las etiquetas en español están en `src/i18n/copy.ts`.
 */

export const MovementKind = {
  Income: 'income',
  Expense: 'expense',
} as const;

export type MovementKind = (typeof MovementKind)[keyof typeof MovementKind];

export const ExpenseCategory = {
  Food: 'comida',
  Grocery: 'super',
  Clothes: 'ropa',
  NotNeeded: 'no-necesario',
} as const;

export type ExpenseCategory = (typeof ExpenseCategory)[keyof typeof ExpenseCategory];

export const WishlistCategory = {
  Makeup: 'maquillaje',
  Clothes: 'ropa',
  Treats: 'gustitos',
  Grocery: 'super',
} as const;

export type WishlistCategory = (typeof WishlistCategory)[keyof typeof WishlistCategory];

export const PurchaseKind = {
  Need: 'necesidad',
  Desire: 'deseo',
} as const;

export type PurchaseKind = (typeof PurchaseKind)[keyof typeof PurchaseKind];

export const AfterFeeling = {
  Calm: 'tranquila',
  Guilty: 'culpable',
  Happy: 'contenta',
  Regret: 'arrepentida',
} as const;

export type AfterFeeling = (typeof AfterFeeling)[keyof typeof AfterFeeling];

export const BillCadence = {
  Weekly: 'weekly',
  Monthly: 'monthly',
} as const;

export type BillCadence = (typeof BillCadence)[keyof typeof BillCadence];

/** Caras de satisfacción, de la más baja a la más alta. */
export const SatisfactionLevels = [1, 2, 3, 4, 5] as const;

export type SatisfactionLevel = (typeof SatisfactionLevels)[number];

/** Días hacia adelante que la portada trata como “ya viene”. */
export const DueSoonDays = 7;

/** Presupuesto mensual sugerido la primera vez que abre la app. */
export const DefaultMonthlyBudget = 8000;

export const DefaultWalletName = 'Mi tarjeta';

export const WalletId = 'local-wallet';

/** Hora local del recordatorio, el día anterior al vencimiento. */
export const ReminderHour = 9;

export const SettingKey = {
  Seeded: 'seeded',
  MonthlyBudget: 'monthlyBudget',
  City: 'city',
} as const;

export const DefaultCity = 'Ciudad de México';

/**
 * Entidades con precios de súper en el archivo de julio 2026.
 * La app también puede consultar en vivo cualquiera de estas.
 */
export const ProfecoStates = [
  'Aguascalientes',
  'Baja California',
  'Baja California Sur',
  'Campeche',
  'Chiapas',
  'Chihuahua',
  'Ciudad de México',
  'Coahuila',
  'Durango',
  'Estado de México',
  'Guanajuato',
  'Guerrero',
  'Jalisco',
  'Michoacán',
  'Morelos',
  'Nuevo León',
  'Oaxaca',
  'Puebla',
  'Querétaro',
  'Quintana Roo',
  'San Luis Potosí',
  'Sinaloa',
  'Sonora',
  'Tabasco',
  'Tamaulipas',
  'Tlaxcala',
  'Veracruz',
  'Yucatán',
  'Zacatecas',
] as const;

export const PriceSuggestions = ['Leche', 'Huevo', 'Tortilla', 'Arroz', 'Frijol', 'Aceite'] as const;

/** Marca que PROFECO usa cuando el producto no trae marca. */
export const Unbranded = 'S/M';
