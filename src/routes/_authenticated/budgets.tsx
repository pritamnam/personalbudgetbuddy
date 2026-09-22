import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";

import { Card, GuestBanner, PageHeader, Progress, StatCard } from "@/components/ui-kit";
import { useCurrency } from "@/lib/currency";
import { useGuestMode } from "@/lib/guest";
import { CATEGORIES, monthKey, thisMonth, useBudgets, useExpenses } from "@/lib/finance";

export const Route = createFileRoute("/_authenticated/budgets")({
  head: () => ({
    meta: [
      { title: "Budgets — SpendSmart" },
      { name: "description", content: "Set monthly budgets per category and watch usage live." },
      { property: "og:title", content: "Budgets — SpendSmart" },
      {
        property: "og:description",
        content: "Set monthly budgets per category and watch usage live.",
      },
    ],
  }),
  component: BudgetsPage,
});

function BudgetsPage() {
  const { value: budgets, setValue: setBudgets } = useBudgets();
  const { value: expenses } = useExpenses();
  const { format: currency, symbol } = useCurrency();
  const readOnly = useGuestMode();

  const spentByCategory = useMemo(() => {
    const map = new Map<string, number>();
    expenses
      .filter((e) => monthKey(e.date) === thisMonth)
      .forEach((e) => map.set(e.category, (map.get(e.category) ?? 0) + e.amount));
    return map;
  }, [expenses]);

  const totalBudget = budgets.reduce((s, b) => s + b.limit, 0);
  const totalSpent = CATEGORIES.reduce((s, c) => s + (spentByCategory.get(c) ?? 0), 0);
  const remaining = totalBudget - totalSpent;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Budget planning"
        subtitle="Set a monthly ceiling per category. Bars turn amber near the limit and red once you pass it."
      />

      {readOnly ? <GuestBanner /> : null}

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Monthly budget" value={currency(totalBudget)} />
        <StatCard label="Spent this month" value={currency(totalSpent)} />
        <StatCard
          label="Remaining"
          value={currency(remaining)}
          tone={remaining < 0 ? "negative" : "positive"}
        />
      </div>

      <Card className="space-y-6">
        {CATEGORIES.map((category) => {
          const limit = budgets.find((b) => b.category === category)?.limit ?? 0;
          const spent = spentByCategory.get(category) ?? 0;
          const pct = limit > 0 ? (spent / limit) * 100 : 0;
          const tone = pct >= 100 ? "danger" : pct >= 80 ? "accent" : "primary";
          return (
            <div key={category} className="space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-medium">{category}</p>
                  <p className="text-xs text-muted-foreground">
                    {currency(spent)} of {currency(limit)} · {Math.round(pct)}% used
                  </p>
                </div>
                <label className="flex items-center gap-2 text-xs text-muted-foreground">
                  Monthly limit ({symbol})
                  <input
                    className="field max-w-30 disabled:cursor-not-allowed disabled:opacity-60"
                    type="number"
                    min="0"
                    step="10"
                    disabled={readOnly}
                    title={readOnly ? "Sign in to set your own budgets" : undefined}
                    value={limit}
                    onChange={(e) => {
                      const next = Number(e.target.value) || 0;
                      setBudgets((prev) => {
                        const exists = prev.some((b) => b.category === category);
                        return exists
                          ? prev.map((b) => (b.category === category ? { ...b, limit: next } : b))
                          : [...prev, { category, limit: next }];
                      });
                    }}
                  />
                </label>
              </div>
              <Progress value={pct} tone={tone} />
            </div>
          );
        })}
      </Card>
    </div>
  );
}
