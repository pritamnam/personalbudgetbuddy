import { useCallback, useSyncExternalStore } from "react";

import { supabase } from "@/lib/supabase";

export const CATEGORIES = [
  "Food",
  "Travel",
  "Bills",
  "Shopping",
  "Health",
  "Entertainment",
  "Other",
] as const;

export type Category = (typeof CATEGORIES)[number];

export type Expense = {
  id: string;
  title: string;
  amount: number;
  category: Category;
  date: string; // yyyy-mm-dd
};

export type Budget = { category: Category; limit: number };

export type Goal = {
  id: string;
  name: string;
  target: number;
  saved: number;
  deadline?: string | undefined;
};

export type Task = {
  id: string;
  title: string;
  due: string;
  done: boolean;
};

export const uid = (): string =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : "xxxxxxxx-xxxx-4xxx-8xxx-xxxxxxxxxxxx".replace(/x/g, () => Math.floor(Math.random() * 16).toString(16));

const today = new Date();
const iso = (d: Date) => d.toISOString().slice(0, 10);
const daysAgo = (n: number) => iso(new Date(today.getTime() - n * 86400000));

export const seedExpenses: Expense[] = [
  { id: uid(), title: "Groceries", amount: 82.4, category: "Food", date: daysAgo(1) },
  { id: uid(), title: "Metro pass", amount: 45, category: "Travel", date: daysAgo(3) },
  { id: uid(), title: "Electricity bill", amount: 120.75, category: "Bills", date: daysAgo(5) },
  { id: uid(), title: "Coffee & lunch", amount: 28.9, category: "Food", date: daysAgo(6) },
  { id: uid(), title: "Sneakers", amount: 96, category: "Shopping", date: daysAgo(9) },
  { id: uid(), title: "Pharmacy", amount: 34.2, category: "Health", date: daysAgo(12) },
  { id: uid(), title: "Cinema night", amount: 24, category: "Entertainment", date: daysAgo(15) },
  { id: uid(), title: "Internet", amount: 55, category: "Bills", date: daysAgo(20) },
];

export const seedBudgets: Budget[] = [
  { category: "Food", limit: 400 },
  { category: "Travel", limit: 150 },
  { category: "Bills", limit: 300 },
  { category: "Shopping", limit: 200 },
  { category: "Health", limit: 120 },
  { category: "Entertainment", limit: 100 },
  { category: "Other", limit: 80 },
];

export const seedGoals: Goal[] = [
  { id: uid(), name: "Emergency fund", target: 5000, saved: 2150, deadline: "2026-12-31" },
  { id: uid(), name: "Trip to Japan", target: 3200, saved: 640, deadline: "2027-04-01" },
];

export const seedTasks: Task[] = [
  { id: uid(), title: "Pay credit card bill", due: daysAgo(-2), done: false },
  { id: uid(), title: "Review subscriptions", due: daysAgo(-6), done: false },
  { id: uid(), title: "Transfer to savings", due: daysAgo(-1), done: true },
];

export type FinanceData = {
  expenses: Expense[];
  budgets: Budget[];
  goals: Goal[];
  tasks: Task[];
};

const seedData = (): FinanceData => ({
  expenses: seedExpenses,
  budgets: seedBudgets,
  goals: seedGoals,
  tasks: seedTasks,
});

/* ------------------------------------------------------------------ */
/* Per-user cloud-backed store                                         */
/* ------------------------------------------------------------------ */

let state: FinanceData = seedData();
const serverState: FinanceData = seedData();
let currentUserId: string | null = null;
let ready = false;

const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

let saveTimer: ReturnType<typeof setTimeout> | undefined;
let syncedExpenseIds = new Set<string>();

const toRow = (e: Expense, userId: string) => ({
  id: e.id,
  user_id: userId,
  amount: e.amount,
  category: e.category,
  note: e.title,
  created_at: `${e.date}T12:00:00Z`,
});

type TxRow = { id: string; amount: number | string; category: string; note: string | null; created_at: string };
const fromRow = (r: TxRow): Expense => ({
  id: String(r.id),
  title: r.note ?? "",
  amount: Number(r.amount),
  category: (CATEGORIES as readonly string[]).includes(r.category) ? (r.category as Category) : "Other",
  date: r.created_at.slice(0, 10),
});

async function save() {
  const userId = currentUserId;
  if (!userId) return;
  const ids = new Set(state.expenses.map((e) => e.id));
  const removed = [...syncedExpenseIds].filter((id) => !ids.has(id));
  if (removed.length) {
    const { error } = await supabase.from("transactions").delete().in("id", removed);
    if (error) console.error("Delete transactions failed:", error.message);
  }
  if (state.expenses.length) {
    const { error } = await supabase.from("transactions").upsert(state.expenses.map((e) => toRow(e, userId)));
    if (error) console.error("Save transactions failed:", error.message);
  }
  syncedExpenseIds = ids;
  const { error } = await supabase.from("finance_data").upsert({
    user_id: userId,
    budgets: state.budgets,
    goals: state.goals,
    tasks: state.tasks,
    updated_at: new Date().toISOString(),
  });
  if (error) console.error("Save finance data failed:", error.message);
}

function scheduleSave() {
  if (!currentUserId) return;
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    void save();
  }, 400);
}

/** Load the signed-in user's data from Supabase (seeding a fresh account). */
export async function loadFinanceData(userId: string) {
  currentUserId = userId;
  ready = false;
  emit();

  const [tx, fd] = await Promise.all([
    supabase.from("transactions").select("id, amount, category, note, created_at").eq("user_id", userId).order("created_at", { ascending: false }),
    supabase.from("finance_data").select("budgets, goals, tasks").eq("user_id", userId).maybeSingle(),
  ]);
  if (tx.error) console.error("Load transactions failed:", tx.error.message);
  if (fd.error) console.error("Load finance data failed:", fd.error.message);

  const expenses = ((tx.data ?? []) as TxRow[]).map(fromRow);
  const row = fd.data as Partial<FinanceData> | null;
  syncedExpenseIds = new Set(expenses.map((e) => e.id));

  if (!row && expenses.length === 0) {
    state = seedData();
    await save();
  } else {
    state = {
      expenses,
      budgets: row?.budgets?.length ? row.budgets : seedBudgets,
      goals: row?.goals ?? [],
      tasks: row?.tasks ?? [],
    };
  }

  ready = true;
  emit();
}

/**
 * Load sample data for a guest visitor. Nothing is written to the cloud:
 * `currentUserId` stays null, so every save is a no-op.
 */
export function startGuestData() {
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = undefined;
  currentUserId = null;
  state = seedData();
  ready = true;
  emit();
}

/** Drop in-memory data on sign-out. */
export function clearFinanceData() {
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = undefined;
  currentUserId = null;
  state = seedData();
  ready = false;
  emit();
}

function setField<K extends keyof FinanceData>(
  key: K,
  updater: FinanceData[K] | ((prev: FinanceData[K]) => FinanceData[K]),
) {
  const next =
    typeof updater === "function"
      ? (updater as (prev: FinanceData[K]) => FinanceData[K])(state[key])
      : updater;
  state = { ...state, [key]: next };
  emit();
  scheduleSave();
}

function useField<K extends keyof FinanceData>(key: K) {
  const value = useSyncExternalStore(
    subscribe,
    () => state[key],
    () => serverState[key],
  );
  const isReady = useSyncExternalStore(
    subscribe,
    () => ready,
    () => false,
  );
  const setValue = useCallback(
    (updater: FinanceData[K] | ((prev: FinanceData[K]) => FinanceData[K])) =>
      setField(key, updater),
    [key],
  );
  return { value, setValue, ready: isReady };
}

export const useExpenses = () => useField("expenses");
export const useBudgets = () => useField("budgets");
export const useGoals = () => useField("goals");
export const useTasks = () => useField("tasks");

/**
 * Convert every stored money amount from one currency to another.
 * `rates` maps currency code -> units per 1 USD.
 */
export function convertStoredAmounts(from: string, to: string, rates: Record<string, number>) {
  const fromRate = rates[from];
  const toRate = rates[to];
  if (!fromRate || !toRate || from === to) return;
  const factor = toRate / fromRate;
  const round = (n: number) => Math.round(n * factor * 100) / 100;

  state = {
    expenses: state.expenses.map((e) => ({ ...e, amount: round(e.amount) })),
    budgets: state.budgets.map((b) => ({ ...b, limit: round(b.limit) })),
    goals: state.goals.map((g) => ({ ...g, target: round(g.target), saved: round(g.saved) })),
    tasks: state.tasks,
  };
  emit();
  scheduleSave();
}

export const monthKey = (d: string) => d.slice(0, 7);
export const thisMonth = iso(today).slice(0, 7);

export const chartColors = [
  "#2f7a6b",
  "#e0a13c",
  "#4a86c7",
  "#c76a9a",
  "#63a86a",
  "#8a7cc2",
  "#c9784a",
];
