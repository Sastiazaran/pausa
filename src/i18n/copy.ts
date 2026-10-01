/**
 * Textos de la interfaz. La app es solo en español.
 */

import {
  AfterFeeling,
  BillCadence,
  ExpenseCategory,
  PurchaseKind,
  SatisfactionLevels,
  WishlistCategory,
  type AfterFeeling as AfterFeelingValue,
  type BillCadence as BillCadenceValue,
  type ExpenseCategory as ExpenseCategoryValue,
  type PurchaseKind as PurchaseKindValue,
  type SatisfactionLevel,
  type WishlistCategory as WishlistCategoryValue,
} from '@/domain/constants';
import { daysBetween } from '@/domain/dates';

export const Copy = {
  appName: 'Pausa',
  loading: 'Abriendo tu cartera…',
  errorTitle: 'No pude abrir los datos',
  tabs: {
    today: 'Hoy',
    movements: 'Movimientos',
    needs: 'Falta',
    prices: 'Precios',
  },
  today: {
    kicker: 'Antes de comprar',
    lead: 'Esto sigue pendiente. Si vas a gastar, míralo otra vez.',
    quiet: 'Nada vence en los próximos 7 días.',
    in: 'Entró',
    out: 'Salió',
    month: 'Este mes',
    bills: 'Por pagar',
    addBill: 'Nueva cuenta',
    pulseEmpty: 'Cuando anotes cómo se sintió un gasto, queda aquí.',
    pulseOne: '1 deseo no valió la pena este mes.',
    pulseMany: (count: number) => `${count} deseos no valieron la pena este mes.`,
  },
  movements: {
    title: 'Movimientos',
    lead: 'Lo que entra y lo que sale de la tarjeta.',
    empty: 'Todavía no hay movimientos. El primero puede ser chico.',
    add: 'Registrar',
    income: 'Entrada',
    expense: 'Salida',
    remove: 'Borrar',
  },
  form: {
    newMovement: 'Registrar',
    amount: 'Monto',
    amountHint: 'Escribe el monto en pesos.',
    note: 'Nota',
    notePlaceholder: 'Opcional',
    date: 'Fecha',
    dateHint: 'AAAA-MM-DD',
    category: 'Tipo de gasto',
    continue: 'Cómo se sintió',
    save: 'Guardar',
    back: 'Atrás',
    close: 'Cerrar',
    satisfaction: 'Qué cara le pones',
    worth: '¿Valió la pena?',
    yes: 'Sí',
    no: 'No',
    kind: '¿Necesidad o deseo?',
    after: 'Cómo te sientes después',
    needEmotion: 'Falta elegir cómo se sintió.',
  },
  wallet: {
    edit: 'La tarjeta',
    name: 'Nombre',
    starting: 'Saldo con el que empieza',
    startingHint: 'Lo que había antes del primer movimiento que anotes aquí.',
  },
  bills: {
    newTitle: 'Nueva cuenta',
    editTitle: 'La cuenta',
    name: 'Qué es',
    amount: 'Monto',
    cadence: 'Cada cuándo',
    next: 'Próxima fecha',
    remove: 'Quitar cuenta',
    savedQuiet: 'Si no aceptas avisos, igual aparece aquí al abrir la app.',
  },
  needs: {
    title: 'Lo que falta',
    lead: 'Primero se apartan las cuentas. Lo que sobra se reparte, necesidades primero.',
    budget: 'Presupuesto del mes',
    reserved: 'Apartado',
    free: 'Libre',
    add: 'Apuntar algo',
    waiting: 'En espera',
    partial: 'Alcanza una parte',
    funded: 'Alcanza',
    empty: 'Apunta lo que todavía quieres comprar.',
    newTitle: 'Algo que falta',
    editTitle: 'Lo que falta',
    name: 'Qué es',
    target: 'Cuánto cuesta',
    remove: 'Quitar',
  },
  prices: {
    title: 'Precios',
    lead: 'Referencia de PROFECO, levantada en tienda. No es el anaquel de hoy.',
    state: 'Entidad',
    search: 'Qué quieres comparar',
    searchPlaceholder: 'Leche, huevo, arroz…',
    suggestions: 'En el recorte',
    cheapest: 'Más barato',
    empty: 'Nada con ese nombre en el recorte de esta entidad.',
    missingState: 'Este recorte no trae esa entidad. Puedes consultar el archivo de PROFECO.',
    refresh: 'Consultar PROFECO',
    refreshing: 'Consultando…',
    refreshed: 'Estas cifras salen del archivo abierto. La fecha de cada una es la del levantamiento.',
    unavailable: 'No pude consultar el archivo de PROFECO. No inventé precios.',
    more: 'Hay más presentaciones. Escribe la marca o el tamaño.',
    mine: 'Lo anoté yo',
    mineLead: 'Un precio que viste tú, aparte del de PROFECO.',
    product: 'Producto',
    chain: 'Tienda',
    saveNote: 'Anotar precio',
    removeNote: 'Quitar',
    noNotes: 'Todavía no anotas un precio de esta búsqueda.',
  },
} as const;

export const ExpenseCategoryLabel: Record<ExpenseCategoryValue, string> = {
  [ExpenseCategory.Food]: 'Comida',
  [ExpenseCategory.Grocery]: 'Súper',
  [ExpenseCategory.Clothes]: 'Ropa',
  [ExpenseCategory.NotNeeded]: 'No es necesario',
};

export const WishlistCategoryLabel: Record<WishlistCategoryValue, string> = {
  [WishlistCategory.Makeup]: 'Maquillaje',
  [WishlistCategory.Clothes]: 'Ropa',
  [WishlistCategory.Treats]: 'Gustitos',
  [WishlistCategory.Grocery]: 'Opciones de súper',
};

export const PurchaseKindLabel: Record<PurchaseKindValue, string> = {
  [PurchaseKind.Need]: 'Necesidad',
  [PurchaseKind.Desire]: 'Deseo',
};

export const AfterFeelingLabel: Record<AfterFeelingValue, string> = {
  [AfterFeeling.Calm]: 'Tranquila',
  [AfterFeeling.Guilty]: 'Culpable',
  [AfterFeeling.Happy]: 'Contenta',
  [AfterFeeling.Regret]: 'Arrepentida',
};

export const CadenceLabel: Record<BillCadenceValue, string> = {
  [BillCadence.Weekly]: 'Cada semana',
  [BillCadence.Monthly]: 'Cada mes',
};

export const SatisfactionLabel: Record<SatisfactionLevel, string> = {
  1: 'Nada',
  2: 'Poco',
  3: 'Regular',
  4: 'Bien',
  5: 'Me encantó',
};

export const ExpenseCategories = [
  ExpenseCategory.Food,
  ExpenseCategory.Grocery,
  ExpenseCategory.Clothes,
  ExpenseCategory.NotNeeded,
] as const;

export const WishlistCategories = [
  WishlistCategory.Makeup,
  WishlistCategory.Clothes,
  WishlistCategory.Treats,
  WishlistCategory.Grocery,
] as const;

export const AfterFeelings = [
  AfterFeeling.Calm,
  AfterFeeling.Guilty,
  AfterFeeling.Happy,
  AfterFeeling.Regret,
] as const;

export const PurchaseKinds = [PurchaseKind.Need, PurchaseKind.Desire] as const;

export const Cadences = [BillCadence.Weekly, BillCadence.Monthly] as const;

export { SatisfactionLevels };

/** “Hoy”, “Mañana”, “En 3 días” o “Ya pasó”. */
export function duePhrase(today: string, due: string): string {
  const days = daysBetween(today, due);
  if (days < 0) {
    return 'Ya pasó';
  }
  if (days === 0) {
    return 'Hoy';
  }
  if (days === 1) {
    return 'Mañana';
  }
  return `En ${days} días`;
}
