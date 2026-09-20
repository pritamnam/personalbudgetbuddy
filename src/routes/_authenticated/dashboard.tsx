import { createFileRoute, Link } from "@tanstack/react-router";
import { lazy, Suspense, useMemo } from "react";

import { Card, PageHeader, Progress, StatCard, useHydrated } from "@/components/ui-kit";
import { useCurrency } from "@/lib/currency";
import {
  CATEGORIES,
  chartColors,
  monthKey,
  thisMonth,
  useBudgets,
  useExpenses,
  useGoals,
  useTasks,
} from "@/lib/finance";

const CategoryPie = lazy(() =>
  import("@/components/charts").then((m) => ({ default: m.CategoryPie })),
);
const BudgetBars = lazy(() =>
  import("@/components/charts").then((m) => ({ default: m.BudgetBars })),
);
const TrendLine = lazy(() => import("@/components/charts").then((m) => ({ default: m.TrendLine })));

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — SpendSmart Personal Finance Tracker" },
      {
        name: "description",
        content:
          "See spending by category, budget usage, savings progress and upcoming bills at a glance.",
      },
      { property: "og:title", content: "Dashboard — SpendSmart Personal Finance Tracker" },
      {
        property: "og:description",
        content:
          "See spending by category, budget usage, savings progress and upcoming bills at a glance.",
      },
    ],
  }),
  component: Dashboard,
});

const ChartFallback = () => (
  <div className="h-72 animate-pulse rounded-lg bg-muted" aria-hidden="true" />
);

function Dashboard() {
  const hydrated = useHydrated();
  const { format: currency, code: currencyCode } = useCurrency();
  const { value: expenses } = useExpenses();
  const { value: budgets } = useBudgets();
  const { value: goals } = useGoals();
  const { value: tasks } = useTasks();

  const monthExpenses = useMemo(
    () => expenses.filter((e) => monthKey(e.date) === thisMonth),
    [expenses],
  );
  const spentThisMonth = monthExpenses.reduce((s, e) => s + e.amount, 0);
  const totalBudget = budgets.reduce((s, b) => s + b.limit, 0);
  const savedTotal = goals.reduce((s, g) => s + g.saved, 0);
  const targetTotal = goals.reduce((s, g) => s + g.target, 0);
  const openTasks = tasks.filter((t) => !t.done);

  const byCategory = useMemo(
    () =>
      CATEGORIES.map((c) => ({
        category: c,
        spent: monthExpenses.filter((e) => e.category === c).reduce((s, e) => s + e.amount, 0),
        limit: budgets.find((b) => b.category === c)?.limit ?? 0,
      })).filter((r) => r.spent > 0 || r.limit > 0),
    [monthExpenses, budgets],
  );

  const trend = useMemo(() => {
    const months: string[] = [];
    const now = new Date();
    for (let i = 5; i >= 0; i -= 1) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push(d.toISOString().slice(0, 7));
    }
    return months.map((m) => ({
      label: new Date(`${m}-01`).toLocaleDateString(undefined, { month: "short" }),
      total: expenses.filter((e) => monthKey(e.date) === m).reduce((s, e) => s + e.amount, 0),
    }));
  }, [expenses]);

  const pieRows = byCategory.filter((r) => r.spent > 0);
  const budgetUsage = totalBudget > 0 ? (spentThisMonth / totalBudget) * 100 : 0;

  return (
    <div className="space-y-10">
      <PageHeader
        title="Your money, this month"
        subtitle="A live view of spending, budgets, savings and the bills waiting on you."
        action={
          <Link to="/expenses" className="btn-primary">
            Add expense
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Spent this month" value={currency(spentThisMonth)} hint={`${monthExpenses.length} entries`} />
        <StatCard
          label="Budget left"
          value={currency(totalBudget - spentThisMonth)}
          hint={`${Math.round(budgetUsage)}% of ${currency(totalBudget)} used`}
          tone={totalBudget - spentThisMonth < 0 ? "negative" : "positive"}
        />
        <StatCard
          label="Saved so far"
          value={currency(savedTotal)}
          hint={targetTotal ? `of ${currency(targetTotal)} in goals` : "no goals yet"}
        />
        <StatCard label="Open reminders" value={String(openTasks.length)} hint="bills & money tasks" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="mb-4 text-lg font-semibold">Spending by category</h2>
          {hydrated && pieRows.length > 0 ? (
            <Suspense fallback={<ChartFallback />}>
              <CategoryPie
                labels={pieRows.map((r) => r.category)}
                data={pieRows.map((r) => Number(r.spent.toFixed(2)))}
                colors={chartColors.slice(0, pieRows.length)}
                currency={currencyCode}
              />
            </Suspense>
          ) : (
            <ChartFallback />
          )}
        </Card>

        <Card>
          <h2 className="mb-4 text-lg font-semibold">Budget vs spend</h2>
          {hydrated && byCategory.length > 0 ? (
            <Suspense fallback={<ChartFallback />}>
              <BudgetBars
                labels={byCategory.map((r) => r.category)}
                spent={byCategory.map((r) => Number(r.spent.toFixed(2)))}
                limits={byCategory.map((r) => r.limit)}
                currency={currencyCode}
              />
            </Suspense>
          ) : (
            <ChartFallback />
          )}
        </Card>
      </div>

      <Card>
        <h2 className="mb-4 text-lg font-semibold">Six-month spending trend</h2>
        {hydrated ? (
          <Suspense fallback={<ChartFallback />}>
            <TrendLine
              labels={trend.map((t) => t.label)}
              data={trend.map((t) => Number(t.total.toFixed(2)))}
              currency={currencyCode}
            />
          </Suspense>
        ) : (
          <ChartFallback />
        )}
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Savings goals</h2>
            <Link to="/goals" className="btn-ghost">
              Manage
            </Link>
          </div>
          {goals.length === 0 ? (
            <p className="text-sm text-muted-foreground">No goals yet.</p>
          ) : (
            goals.slice(0, 3).map((g) => {
              const pct = g.target > 0 ? Math.min(100, (g.saved / g.target) * 100) : 0;
              return (
                <div key={g.id} className="space-y-1.5">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{g.name}</span>
                    <span className="text-muted-foreground">
                      {currency(g.saved)} / {currency(g.target)}
                    </span>
                  </div>
                  <Progress value={pct} tone={pct >= 100 ? "success" : "primary"} />
                </div>
              );
            })
          )}
        </Card>

        <Card className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Upcoming reminders</h2>
            <Link to="/reminders" className="btn-ghost">
              Open list
            </Link>
          </div>
          {openTasks.length === 0 ? (
            <p className="text-sm text-muted-foreground">All caught up.</p>
          ) : (
            <ul className="space-y-2">
              {openTasks.slice(0, 5).map((t) => (
                <li key={t.id} className="flex items-center justify-between gap-3 text-sm">
                  <span className="font-medium">{t.title}</span>
                  <span className="text-xs text-muted-foreground">{t.due}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
