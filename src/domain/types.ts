import type {
  AfterFeeling,
  BillCadence,
  ExpenseCategory,
  MovementKind,
  PurchaseKind,
  SatisfactionLevel,
  WishlistCategory,
} from './constants';

export type Wallet = {
  id: string;
  name: string;
  startingBalance: number;
};

export type Movement = {
  id: string;
  kind: MovementKind;
  amount: number;
  category: ExpenseCategory | null;
  note: string;
  occurredOn: string;
  satisfaction: SatisfactionLevel | null;
  worthIt: boolean | null;
  purchaseKind: PurchaseKind | null;
  afterFeeling: AfterFeeling | null;
  createdAt: string;
};

export type Bill = {
  id: string;
  name: string;
  amount: number;
  cadence: BillCadence;
  /** Próxima fecha en que toca pagarlo, `YYYY-MM-DD`. */
  nextDue: string;
  notificationId: string | null;
};

export type WishlistItem = {
  id: string;
  name: string;
  category: WishlistCategory;
  purchaseKind: PurchaseKind;
  targetAmount: number;
  sortOrder: number;
};

/** Precio que ella anotó en tienda. No forma parte del archivo de PROFECO. */
export type PriceNote = {
  id: string;
  productName: string;
  chain: string;
  price: number;
  notedOn: string;
  state: string;
};
