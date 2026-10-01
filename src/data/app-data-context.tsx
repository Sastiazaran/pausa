import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';

import { walletBalance, monthFlow } from '@/domain/balance';
import { monthlyReserve, reminderBills } from '@/domain/bills';
import { pourBudget, type PourResult } from '@/domain/budget';
import {
  DefaultCity,
  DefaultMonthlyBudget,
  DefaultWalletName,
  SettingKey,
  WalletId,
  type AfterFeeling,
  type BillCadence,
  type ExpenseCategory,
  type MovementKind as MovementKindValue,
  type PurchaseKind,
  type SatisfactionLevel,
  type WishlistCategory,
} from '@/domain/constants';
import { monthKey, monthParts, todayKey } from '@/domain/dates';
import { unworthyDesires } from '@/domain/emotion';
import type { Bill, Movement, PriceNote, Wallet, WishlistItem } from '@/domain/types';
import { cancelReminder, scheduleBillReminder } from '@/data/notifications';

import {
  deleteBill,
  deleteMovement,
  deletePriceNote,
  deleteWishlist,
  insertBill,
  insertMovement,
  insertPriceNote,
  insertWishlist,
  loadSnapshot,
  openAppDatabase,
  saveSetting,
  saveWallet,
  updateBill,
  updateWishlist,
  type AppDatabase,
} from './local/db';

export const LoadStatus = {
  Loading: 'loading',
  Ready: 'ready',
  Error: 'error',
} as const;

export type LoadStatus = (typeof LoadStatus)[keyof typeof LoadStatus];

export type MovementDraft = {
  kind: MovementKindValue;
  amount: number;
  category: ExpenseCategory | null;
  note: string;
  occurredOn: string;
  satisfaction: SatisfactionLevel | null;
  worthIt: boolean | null;
  purchaseKind: PurchaseKind | null;
  afterFeeling: AfterFeeling | null;
};

export type BillDraft = {
  name: string;
  amount: number;
  cadence: BillCadence;
  nextDue: string;
};

export type WishlistDraft = {
  name: string;
  category: WishlistCategory;
  purchaseKind: PurchaseKind;
  targetAmount: number;
};

type AppData = {
  status: LoadStatus;
  error: string | null;
  today: string;
  wallet: Wallet;
  monthlyBudget: number;
  city: string;
  movements: Movement[];
  bills: Bill[];
  wishlist: WishlistItem[];
  priceNotes: PriceNote[];
  balance: number;
  monthIncome: number;
  monthExpense: number;
  reminders: Bill[];
  pour: PourResult;
  unworthy: number;
  saveMovement: (draft: MovementDraft) => Promise<void>;
  removeMovement: (id: string) => Promise<void>;
  saveBill: (draft: BillDraft, id?: string) => Promise<void>;
  removeBill: (id: string) => Promise<void>;
  saveWish: (draft: WishlistDraft, id?: string) => Promise<void>;
  removeWish: (id: string) => Promise<void>;
  setMonthlyBudget: (amount: number) => Promise<void>;
  setCity: (city: string) => Promise<void>;
  setWallet: (name: string, startingBalance: number) => Promise<void>;
  savePriceNote: (productName: string, chain: string, price: number) => Promise<void>;
  removePriceNote: (id: string) => Promise<void>;
};

const EmptyWallet: Wallet = { id: WalletId, name: DefaultWalletName, startingBalance: 0 };

const AppDataContext = createContext<AppData | null>(null);

export function AppDataProvider({ children }: { children: ReactNode }) {
  const database = useRef<AppDatabase | null>(null);
  const [status, setStatus] = useState<LoadStatus>(LoadStatus.Loading);
  const [error, setError] = useState<string | null>(null);
  const [wallet, setWalletState] = useState<Wallet>(EmptyWallet);
  const [monthlyBudget, setBudgetState] = useState(DefaultMonthlyBudget);
  const [city, setCityState] = useState(DefaultCity);
  const [movements, setMovements] = useState<Movement[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [priceNotes, setPriceNotes] = useState<PriceNote[]>([]);
  const reminded = useRef(false);

  useEffect(() => {
    let active = true;
    openAppDatabase()
      .then(async (db) => {
        database.current = db;
        const snapshot = await loadSnapshot(db);
        if (!active) {
          return;
        }
        setWalletState(snapshot.wallet);
        setBudgetState(snapshot.monthlyBudget);
        setCityState(snapshot.city);
        setMovements(snapshot.movements);
        setBills(snapshot.bills);
        setWishlist(snapshot.wishlist);
        setPriceNotes(snapshot.priceNotes);
        setStatus(LoadStatus.Ready);
      })
      .catch((caught: unknown) => {
        if (!active) {
          return;
        }
        setError(caught instanceof Error ? caught.message : 'No se pudo abrir la base');
        setStatus(LoadStatus.Error);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (status !== LoadStatus.Ready || reminded.current) {
      return;
    }
    reminded.current = true;
    const pending = bills.filter((bill) => !bill.notificationId);
    pending.forEach((bill) => {
      void scheduleBillReminder(bill).then(async (notificationId) => {
        const db = database.current;
        if (!db || !notificationId) {
          return;
        }
        await updateBill(db, bill.id, {
          name: bill.name,
          amount: bill.amount,
          cadence: bill.cadence,
          nextDue: bill.nextDue,
          notificationId,
        });
        setBills((current) => current.map((item) => (item.id === bill.id ? { ...item, notificationId } : item)));
      });
    });
  }, [status, bills]);

  const requireDb = useCallback(() => {
    const db = database.current;
    if (!db) {
      throw new Error('La base no está lista');
    }
    return db;
  }, []);

  const saveMovement = useCallback(
    async (draft: MovementDraft) => {
      const movement = await insertMovement(requireDb(), draft);
      setMovements((current) => [movement, ...current].sort((left, right) => right.occurredOn.localeCompare(left.occurredOn)));
    },
    [requireDb],
  );

  const removeMovement = useCallback(
    async (id: string) => {
      await deleteMovement(requireDb(), id);
      setMovements((current) => current.filter((item) => item.id !== id));
    },
    [requireDb],
  );

  const saveBill = useCallback(
    async (draft: BillDraft, id?: string) => {
      const db = requireDb();
      const previous = id ? bills.find((bill) => bill.id === id) : undefined;
      await cancelReminder(previous?.notificationId ?? null);
      const notificationId = await scheduleBillReminder(draft);
      const stored = { ...draft, notificationId };
      if (id) {
        await updateBill(db, id, stored);
        setBills((current) =>
          current
            .map((bill) => (bill.id === id ? { ...bill, ...stored } : bill))
            .sort((left, right) => left.nextDue.localeCompare(right.nextDue)),
        );
        return;
      }
      const created = await insertBill(db, stored);
      setBills((current) => [...current, created].sort((left, right) => left.nextDue.localeCompare(right.nextDue)));
    },
    [bills, requireDb],
  );

  const removeBill = useCallback(
    async (id: string) => {
      const previous = bills.find((bill) => bill.id === id);
      await cancelReminder(previous?.notificationId ?? null);
      await deleteBill(requireDb(), id);
      setBills((current) => current.filter((bill) => bill.id !== id));
    },
    [bills, requireDb],
  );

  const saveWish = useCallback(
    async (draft: WishlistDraft, id?: string) => {
      const db = requireDb();
      if (id) {
        await updateWishlist(db, id, draft);
        setWishlist((current) => current.map((item) => (item.id === id ? { ...item, ...draft } : item)));
        return;
      }
      const created = await insertWishlist(db, draft);
      setWishlist((current) => [...current, created]);
    },
    [requireDb],
  );

  const removeWish = useCallback(
    async (id: string) => {
      await deleteWishlist(requireDb(), id);
      setWishlist((current) => current.filter((item) => item.id !== id));
    },
    [requireDb],
  );

  const setMonthlyBudget = useCallback(
    async (amount: number) => {
      await saveSetting(requireDb(), SettingKey.MonthlyBudget, String(amount));
      setBudgetState(amount);
    },
    [requireDb],
  );

  const setCity = useCallback(
    async (next: string) => {
      await saveSetting(requireDb(), SettingKey.City, next);
      setCityState(next);
    },
    [requireDb],
  );

  const setWallet = useCallback(
    async (name: string, startingBalance: number) => {
      await saveWallet(requireDb(), name, startingBalance);
      setWalletState((current) => ({ ...current, name, startingBalance }));
    },
    [requireDb],
  );

  const savePriceNote = useCallback(
    async (productName: string, chain: string, price: number) => {
      const note = await insertPriceNote(requireDb(), {
        productName,
        chain,
        price,
        notedOn: todayKey(),
        state: city,
      });
      setPriceNotes((current) => [note, ...current]);
    },
    [city, requireDb],
  );

  const removePriceNote = useCallback(
    async (id: string) => {
      await deletePriceNote(requireDb(), id);
      setPriceNotes((current) => current.filter((note) => note.id !== id));
    },
    [requireDb],
  );

  const today = todayKey();
  const value = useMemo<AppData>(() => {
    const parts = monthParts(today);
    const flow = monthFlow(movements, monthKey(today));
    return {
      status,
      error,
      today,
      wallet,
      monthlyBudget,
      city,
      movements,
      bills,
      wishlist,
      priceNotes,
      balance: walletBalance(wallet.startingBalance, movements),
      monthIncome: flow.income,
      monthExpense: flow.expense,
      reminders: reminderBills(bills, today),
      pour: pourBudget(
        monthlyBudget,
        monthlyReserve(bills, parts.year, parts.monthIndex),
        wishlist.map((item) => ({
          id: item.id,
          kind: item.purchaseKind,
          target: item.targetAmount,
          order: item.sortOrder,
        })),
      ),
      unworthy: unworthyDesires(movements, monthKey(today)),
      saveMovement,
      removeMovement,
      saveBill,
      removeBill,
      saveWish,
      removeWish,
      setMonthlyBudget,
      setCity,
      setWallet,
      savePriceNote,
      removePriceNote,
    };
  }, [
    bills,
    city,
    error,
    monthlyBudget,
    movements,
    priceNotes,
    removeBill,
    removeMovement,
    removePriceNote,
    removeWish,
    saveBill,
    saveMovement,
    savePriceNote,
    saveWish,
    setCity,
    setMonthlyBudget,
    setWallet,
    status,
    today,
    wallet,
    wishlist,
  ]);

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData(): AppData {
  const value = useContext(AppDataContext);
  if (!value) {
    throw new Error('useAppData debe usarse dentro de AppDataProvider');
  }
  return value;
}
