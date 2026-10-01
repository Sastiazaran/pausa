import * as SQLite from 'expo-sqlite';

import {
  AfterFeeling,
  BillCadence,
  DefaultCity,
  DefaultMonthlyBudget,
  DefaultWalletName,
  ExpenseCategory,
  MovementKind,
  PurchaseKind,
  SatisfactionLevels,
  SettingKey,
  WalletId,
  WishlistCategory,
  type AfterFeeling as AfterFeelingValue,
  type ExpenseCategory as ExpenseCategoryValue,
  type MovementKind as MovementKindValue,
  type PurchaseKind as PurchaseKindValue,
  type SatisfactionLevel,
} from '@/domain/constants';
import { shiftDayKey, todayKey } from '@/domain/dates';
import type { Bill, Movement, PriceNote, Wallet, WishlistItem } from '@/domain/types';

import { createId, nowIso } from './ids';

export type AppDatabase = SQLite.SQLiteDatabase;

const SchemaVersion = 1;

const CreateSchema = `
PRAGMA journal_mode = WAL;

CREATE TABLE IF NOT EXISTS wallet (
  id TEXT PRIMARY KEY NOT NULL,
  name TEXT NOT NULL,
  starting_balance REAL NOT NULL
);

CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY NOT NULL,
  value TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS movements (
  id TEXT PRIMARY KEY NOT NULL,
  kind TEXT NOT NULL,
  amount REAL NOT NULL,
  category TEXT,
  note TEXT NOT NULL,
  occurred_on TEXT NOT NULL,
  satisfaction INTEGER,
  worth_it INTEGER,
  purchase_kind TEXT,
  after_feeling TEXT,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS bills (
  id TEXT PRIMARY KEY NOT NULL,
  name TEXT NOT NULL,
  amount REAL NOT NULL,
  cadence TEXT NOT NULL,
  next_due TEXT NOT NULL,
  notification_id TEXT
);

CREATE TABLE IF NOT EXISTS wishlist (
  id TEXT PRIMARY KEY NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  purchase_kind TEXT NOT NULL,
  target_amount REAL NOT NULL,
  sort_order INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS price_notes (
  id TEXT PRIMARY KEY NOT NULL,
  product_name TEXT NOT NULL,
  chain TEXT NOT NULL,
  price REAL NOT NULL,
  noted_on TEXT NOT NULL,
  state TEXT NOT NULL
);
`;

export type Snapshot = {
  wallet: Wallet;
  monthlyBudget: number;
  city: string;
  movements: Movement[];
  bills: Bill[];
  wishlist: WishlistItem[];
  priceNotes: PriceNote[];
};

type MovementInput = {
  kind: MovementKindValue;
  amount: number;
  category: ExpenseCategoryValue | null;
  note: string;
  occurredOn: string;
  satisfaction: SatisfactionLevel | null;
  worthIt: boolean | null;
  purchaseKind: PurchaseKindValue | null;
  afterFeeling: AfterFeelingValue | null;
};

type BillInput = {
  name: string;
  amount: number;
  cadence: Bill['cadence'];
  nextDue: string;
  notificationId: string | null;
};

type WishlistInput = {
  name: string;
  category: WishlistItem['category'];
  purchaseKind: PurchaseKindValue;
  targetAmount: number;
};

type NoteInput = {
  productName: string;
  chain: string;
  price: number;
  notedOn: string;
  state: string;
};

type MovementRow = {
  id: string;
  kind: string;
  amount: number;
  category: string | null;
  note: string;
  occurred_on: string;
  satisfaction: number | null;
  worth_it: number | null;
  purchase_kind: string | null;
  after_feeling: string | null;
  created_at: string;
};

function includes<T extends string>(values: readonly T[], value: string | null): value is T {
  return value !== null && (values as readonly string[]).includes(value);
}

function mapMovement(row: MovementRow): Movement {
  return {
    id: row.id,
    kind: includes(Object.values(MovementKind), row.kind) ? row.kind : MovementKind.Expense,
    amount: row.amount,
    category: includes(Object.values(ExpenseCategory), row.category) ? row.category : null,
    note: row.note,
    occurredOn: row.occurred_on,
    satisfaction: includes(SatisfactionLevels.map(String), row.satisfaction === null ? null : String(row.satisfaction))
      ? (row.satisfaction as SatisfactionLevel)
      : null,
    worthIt: row.worth_it === null ? null : row.worth_it === 1,
    purchaseKind: includes(Object.values(PurchaseKind), row.purchase_kind) ? row.purchase_kind : null,
    afterFeeling: includes(Object.values(AfterFeeling), row.after_feeling) ? row.after_feeling : null,
    createdAt: row.created_at,
  };
}

export async function openAppDatabase(): Promise<AppDatabase> {
  const db = await SQLite.openDatabaseAsync('pausa.db');
  await db.execAsync(CreateSchema);
  const version = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
  if ((version?.user_version ?? 0) < SchemaVersion) {
    await db.execAsync(`PRAGMA user_version = ${SchemaVersion}`);
  }
  await seedIfEmpty(db);
  return db;
}

async function seedIfEmpty(db: AppDatabase): Promise<void> {
  const seeded = await db.getFirstAsync<{ value: string }>('SELECT value FROM settings WHERE key = ?', SettingKey.Seeded);
  if (seeded) {
    return;
  }

  const today = todayKey();
  const bills = [
    { name: 'Señora del servicio', amount: 1200, cadence: BillCadence.Monthly, nextDue: shiftDayKey(today, 3) },
    { name: 'La luz', amount: 450, cadence: BillCadence.Monthly, nextDue: shiftDayKey(today, 12) },
    { name: 'El agua', amount: 180, cadence: BillCadence.Monthly, nextDue: shiftDayKey(today, 5) },
    { name: 'El súper de la semana', amount: 900, cadence: BillCadence.Weekly, nextDue: shiftDayKey(today, 2) },
  ];
  const wishes = [
    { name: 'Opciones de súper', category: WishlistCategory.Grocery, purchaseKind: PurchaseKind.Need, targetAmount: 600 },
    { name: 'Maquillaje', category: WishlistCategory.Makeup, purchaseKind: PurchaseKind.Desire, targetAmount: 800 },
    { name: 'Ropa', category: WishlistCategory.Clothes, purchaseKind: PurchaseKind.Desire, targetAmount: 1500 },
    { name: 'Gustitos', category: WishlistCategory.Treats, purchaseKind: PurchaseKind.Desire, targetAmount: 400 },
  ];

  await db.withTransactionAsync(async () => {
    await db.runAsync('INSERT INTO wallet (id, name, starting_balance) VALUES (?, ?, ?)', WalletId, DefaultWalletName, 0);
    await db.runAsync('INSERT INTO settings (key, value) VALUES (?, ?)', SettingKey.MonthlyBudget, String(DefaultMonthlyBudget));
    await db.runAsync('INSERT INTO settings (key, value) VALUES (?, ?)', SettingKey.City, DefaultCity);
    await db.runAsync('INSERT INTO settings (key, value) VALUES (?, ?)', SettingKey.Seeded, '1');
    for (const bill of bills) {
      await db.runAsync(
        'INSERT INTO bills (id, name, amount, cadence, next_due, notification_id) VALUES (?, ?, ?, ?, ?, NULL)',
        createId(),
        bill.name,
        bill.amount,
        bill.cadence,
        bill.nextDue,
      );
    }
    for (let index = 0; index < wishes.length; index += 1) {
      const wish = wishes[index];
      await db.runAsync(
        'INSERT INTO wishlist (id, name, category, purchase_kind, target_amount, sort_order) VALUES (?, ?, ?, ?, ?, ?)',
        createId(),
        wish.name,
        wish.category,
        wish.purchaseKind,
        wish.targetAmount,
        index,
      );
    }
  });
}

export async function loadSnapshot(db: AppDatabase): Promise<Snapshot> {
  const wallet = await db.getFirstAsync<Wallet>('SELECT id, name, starting_balance AS startingBalance FROM wallet LIMIT 1');
  const settings = await db.getAllAsync<{ key: string; value: string }>('SELECT key, value FROM settings');
  const setting = (key: string, fallback: string) => settings.find((row) => row.key === key)?.value ?? fallback;
  const movements = await db.getAllAsync<MovementRow>('SELECT * FROM movements ORDER BY occurred_on DESC, created_at DESC');
  const bills = await db.getAllAsync<Bill>(
    'SELECT id, name, amount, cadence, next_due AS nextDue, notification_id AS notificationId FROM bills ORDER BY next_due ASC',
  );
  const wishlist = await db.getAllAsync<WishlistItem>(
    'SELECT id, name, category, purchase_kind AS purchaseKind, target_amount AS targetAmount, sort_order AS sortOrder FROM wishlist ORDER BY sort_order ASC',
  );
  const priceNotes = await db.getAllAsync<PriceNote>(
    'SELECT id, product_name AS productName, chain, price, noted_on AS notedOn, state FROM price_notes ORDER BY noted_on DESC',
  );

  return {
    wallet: wallet ?? { id: WalletId, name: DefaultWalletName, startingBalance: 0 },
    monthlyBudget: Number(setting(SettingKey.MonthlyBudget, String(DefaultMonthlyBudget))) || DefaultMonthlyBudget,
    city: setting(SettingKey.City, DefaultCity),
    movements: movements.map(mapMovement),
    bills,
    wishlist,
    priceNotes,
  };
}

export async function insertMovement(db: AppDatabase, input: MovementInput): Promise<Movement> {
  const movement: Movement = { id: createId(), createdAt: nowIso(), ...input };
  await db.runAsync(
    `INSERT INTO movements (id, kind, amount, category, note, occurred_on, satisfaction, worth_it, purchase_kind, after_feeling, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    movement.id,
    movement.kind,
    movement.amount,
    movement.category,
    movement.note,
    movement.occurredOn,
    movement.satisfaction,
    movement.worthIt === null ? null : movement.worthIt ? 1 : 0,
    movement.purchaseKind,
    movement.afterFeeling,
    movement.createdAt,
  );
  return movement;
}

export async function deleteMovement(db: AppDatabase, id: string): Promise<void> {
  await db.runAsync('DELETE FROM movements WHERE id = ?', id);
}

export async function insertBill(db: AppDatabase, input: BillInput): Promise<Bill> {
  const bill: Bill = { id: createId(), ...input };
  await db.runAsync(
    'INSERT INTO bills (id, name, amount, cadence, next_due, notification_id) VALUES (?, ?, ?, ?, ?, ?)',
    bill.id,
    bill.name,
    bill.amount,
    bill.cadence,
    bill.nextDue,
    bill.notificationId,
  );
  return bill;
}

export async function updateBill(db: AppDatabase, id: string, input: BillInput): Promise<void> {
  await db.runAsync(
    'UPDATE bills SET name = ?, amount = ?, cadence = ?, next_due = ?, notification_id = ? WHERE id = ?',
    input.name,
    input.amount,
    input.cadence,
    input.nextDue,
    input.notificationId,
    id,
  );
}

export async function deleteBill(db: AppDatabase, id: string): Promise<void> {
  await db.runAsync('DELETE FROM bills WHERE id = ?', id);
}

export async function insertWishlist(db: AppDatabase, input: WishlistInput): Promise<WishlistItem> {
  const last = await db.getFirstAsync<{ sortOrder: number }>('SELECT MAX(sort_order) AS sortOrder FROM wishlist');
  const item: WishlistItem = { id: createId(), sortOrder: (last?.sortOrder ?? -1) + 1, ...input };
  await db.runAsync(
    'INSERT INTO wishlist (id, name, category, purchase_kind, target_amount, sort_order) VALUES (?, ?, ?, ?, ?, ?)',
    item.id,
    item.name,
    item.category,
    item.purchaseKind,
    item.targetAmount,
    item.sortOrder,
  );
  return item;
}

export async function updateWishlist(db: AppDatabase, id: string, input: WishlistInput): Promise<void> {
  await db.runAsync(
    'UPDATE wishlist SET name = ?, category = ?, purchase_kind = ?, target_amount = ? WHERE id = ?',
    input.name,
    input.category,
    input.purchaseKind,
    input.targetAmount,
    id,
  );
}

export async function deleteWishlist(db: AppDatabase, id: string): Promise<void> {
  await db.runAsync('DELETE FROM wishlist WHERE id = ?', id);
}

export async function saveSetting(db: AppDatabase, key: string, value: string): Promise<void> {
  await db.runAsync(
    'INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value',
    key,
    value,
  );
}

export async function saveWallet(db: AppDatabase, name: string, startingBalance: number): Promise<void> {
  await db.runAsync('UPDATE wallet SET name = ?, starting_balance = ? WHERE id = ?', name, startingBalance, WalletId);
}

export async function insertPriceNote(db: AppDatabase, input: NoteInput): Promise<PriceNote> {
  const note: PriceNote = { id: createId(), ...input };
  await db.runAsync(
    'INSERT INTO price_notes (id, product_name, chain, price, noted_on, state) VALUES (?, ?, ?, ?, ?, ?)',
    note.id,
    note.productName,
    note.chain,
    note.price,
    note.notedOn,
    note.state,
  );
  return note;
}

export async function deletePriceNote(db: AppDatabase, id: string): Promise<void> {
  await db.runAsync('DELETE FROM price_notes WHERE id = ?', id);
}
