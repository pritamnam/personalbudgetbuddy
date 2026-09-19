import { useCallback, useEffect, useState } from "react";

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

export const uid = () => Math.random().toString(36).slice(2, 10);

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

export function useLocalState<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw) setValue(JSON.parse(raw) as T);
    } catch {
      /* ignore */
    }
    setReady(true);
  }, [key]);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* ignore */
    }
  }, [key, value, ready]);

  const reset = useCallback(() => setValue(initial), [initial]);
  return { value, setValue, ready, reset };
}

export const useExpenses = () => useLocalState<Expense[]>("pf.expenses", seedExpenses);
export const useBudgets = () => useLocalState<Budget[]>("pf.budgets", seedBudgets);
export const useGoals = () => useLocalState<Goal[]>("pf.goals", seedGoals);
export const useTasks = () => useLocalState<Task[]>("pf.tasks", seedTasks);

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

  const convert = <T>(key: string, map: (item: T) => T) => {
    try {
      const raw = window.localStorage.getItem(key);
      if (!raw) return;
      const items = JSON.parse(raw) as T[];
      if (!Array.isArray(items)) return;
      window.localStorage.setItem(key, JSON.stringify(items.map(map)));
    } catch {
      /* ignore */
    }
  };

  convert<Expense>("pf.expenses", (e) => ({ ...e, amount: round(e.amount) }));
  convert<Budget>("pf.budgets", (b) => ({ ...b, limit: round(b.limit) }));
  convert<Goal>("pf.goals", (g) => ({ ...g, target: round(g.target), saved: round(g.saved) }));
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
