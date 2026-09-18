import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { Card, EmptyState, PageHeader } from "@/components/ui-kit";
import { useCurrency } from "@/lib/currency";
import {
  CATEGORIES,
  useExpenses,
  uid,
  type Category,
  type Expense,
} from "@/lib/finance";

export const Route = createFileRoute("/expenses")({
  head: () => ({
    meta: [
      { title: "Expenses — Ledgerly" },
      { name: "description", content: "Add, edit and delete daily expenses by category." },
      { property: "og:title", content: "Expenses — Ledgerly" },
      {
        property: "og:description",
        content: "Add, edit and delete daily expenses by category.",
      },
    ],
  }),
  component: ExpensesPage,
});

const emptyForm = {
  title: "",
  amount: "",
  category: "Food" as Category,
  date: new Date().toISOString().slice(0, 10),
};

function ExpensesPage() {
  const { value: expenses, setValue: setExpenses } = useExpenses();
  const { format: currency, symbol } = useCurrency();
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"All" | Category>("All");

  const visible = useMemo(
    () =>
      [...expenses]
        .filter((e) => filter === "All" || e.category === filter)
        .sort((a, b) => b.date.localeCompare(a.date)),
    [expenses, filter],
  );

  const total = visible.reduce((s, e) => s + e.amount, 0);

  function submit(event: React.FormEvent) {
    event.preventDefault();
    const amount = Number(form.amount);
    if (!form.title.trim() || !amount || amount <= 0) return;
    const entry: Expense = {
      id: editingId ?? uid(),
      title: form.title.trim(),
      amount,
      category: form.category,
      date: form.date,
    };
    setExpenses((prev) =>
      editingId ? prev.map((e) => (e.id === editingId ? entry : e)) : [entry, ...prev],
    );
    setEditingId(null);
    setForm({ ...emptyForm, date: form.date });
  }

  function edit(e: Expense) {
    setEditingId(e.id);
    setForm({ title: e.title, amount: String(e.amount), category: e.category, date: e.date });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Expenses"
        subtitle="Log what you spend and keep every category honest."
      />

      <Card>
        <h2 className="mb-4 text-lg font-semibold">
          {editingId ? "Edit expense" : "Add an expense"}
        </h2>
        <form onSubmit={submit} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <input
            className="field lg:col-span-2"
            placeholder="What did you buy?"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <input
            className="field"
            type="number"
            min="0"
            step="0.01"
            placeholder={`Amount (${symbol})`}
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
          />
          <select
            className="field"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value as Category })}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <input
            className="field"
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
          />
          <div className="flex gap-2 sm:col-span-2 lg:col-span-5">
            <button type="submit" className="btn-primary">
              {editingId ? "Save changes" : "Add expense"}
            </button>
            {editingId ? (
              <button
                type="button"
                className="btn-ghost"
                onClick={() => {
                  setEditingId(null);
                  setForm(emptyForm);
                }}
              >
                Cancel
              </button>
            ) : null}
          </div>
        </form>
      </Card>

      <Card>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold">
            {visible.length} entries · {currency(total)}
          </h2>
          <select
            className="field max-w-45"
            value={filter}
            onChange={(e) => setFilter(e.target.value as "All" | Category)}
          >
            <option value="All">All categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {visible.length === 0 ? (
          <EmptyState text="No expenses yet. Add your first one above." />
        ) : (
          <ul className="divide-y divide-border">
            {visible.map((e) => (
              <li key={e.id} className="flex flex-wrap items-center gap-3 py-3">
                <div className="min-w-40 flex-1">
                  <p className="font-medium">{e.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {e.category} · {e.date}
                  </p>
                </div>
                <span className="font-display text-lg font-semibold">{currency(e.amount)}</span>
                <div className="flex gap-2">
                  <button className="btn-ghost" onClick={() => edit(e)}>
                    Edit
                  </button>
                  <button
                    className="btn-ghost"
                    onClick={() => setExpenses((prev) => prev.filter((x) => x.id !== e.id))}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
