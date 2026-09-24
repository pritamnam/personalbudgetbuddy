import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense, useMemo } from "react";

import { Card, GuestBanner, PageHeader, StatCard, useHydrated } from "@/components/ui-kit";
import { useCurrency } from "@/lib/currency";
import { CATEGORIES, chartColors, monthKey, thisMonth, useBudgets, useExpenses } from "@/lib/finance";
import { useGuestMode } from "@/lib/guest";

const CategoryPie = lazy(() =>
  import("@/components/charts").then((module) => ({ default: module.CategoryPie })),
);
const BudgetBars = lazy(() =>
  import("@/components/charts").then((module) => ({ default: module.BudgetBars })),
);
const TrendLine = lazy(() =>
  import("@/components/charts").then((module) => ({ default: module.TrendLine })),
);

export const Route = createFileRoute("/_authenticated/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics — SpendSmart" },
      { name: "description", content: "Explore spending patterns, budget comparisons and monthly trends." },
      { property: "og:title", content: "Analytics — SpendSmart" },
      { property: "og:description", content: "Explore spending patterns, budget comparisons and monthly trends." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AnalyticsPage,
});

function ChartFallback() {
  return <div className="h-72 animate-pulse rounded-lg bg-muted" aria-hidden="true" />;
}

function AnalyticsPage() {
  const hydrated = useHydrated();
  const readOnly = useGuestMode();
  const { format: currency, code: currencyCode } = useCurrency();
  const { value: expenses } = useExpenses();
  const { value: budgets } = useBudgets();

  const monthExpenses = useMemo(
    () => expenses.filter((expense) => monthKey(expense.date) === thisMonth),
    [expenses],
  );
  const byCategory = useMemo(
    () =>
      CATEGORIES.map((category) => ({
        category,
        spent: monthExpenses
          .filter((expense) => expense.category === category)
          .reduce((sum, expense) => sum + expense.amount, 0),
        limit: budgets.find((budget) => budget.category === category)?.limit ?? 0,
      })).filter((row) => row.spent > 0 || row.limit > 0),
    [budgets, monthExpenses],
  );
  const trend = useMemo(() => {
    const now = new Date();
    return Array.from({ length: 6 }, (_, index) => {
      const date = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      return {
        label: date.toLocaleDateString(undefined, { month: "short" }),
        total: expenses
          .filter((expense) => monthKey(expense.date) === key)
          .reduce((sum, expense) => sum + expense.amount, 0),
      };
    });
  }, [expenses]);

  const spentThisMonth = monthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const averageExpense = monthExpenses.length > 0 ? spentThisMonth / monthExpenses.length : 0;
  const totalBudget = budgets.reduce((sum, budget) => sum + budget.limit, 0);
  const highestCategory = [...byCategory].sort((a, b) => b.spent - a.spent)[0];
  const pieRows = byCategory.filter((row) => row.spent > 0);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Financial analytics"
        subtitle="Compare this month’s spending, category mix and six-month trend."
      />
      {readOnly ? <GuestBanner /> : null}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Monthly spend" value={currency(spentThisMonth)} />
        <StatCard label="Average expense" value={currency(averageExpense)} />
        <StatCard label="Budget usage" value={totalBudget > 0 ? `${Math.round((spentThisMonth / totalBudget) * 100)}%` : "0%"} />
        <StatCard label="Top category" value={highestCategory?.spent ? highestCategory.category : "—"} hint={highestCategory?.spent ? currency(highestCategory.spent) : "No spending yet"} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="mb-4 text-lg font-semibold">Spending by category</h2>
          {hydrated && pieRows.length > 0 ? (
            <Suspense fallback={<ChartFallback />}>
              <CategoryPie labels={pieRows.map((row) => row.category)} data={pieRows.map((row) => Number(row.spent.toFixed(2)))} colors={chartColors.slice(0, pieRows.length)} currency={currencyCode} />
            </Suspense>
          ) : <ChartFallback />}
        </Card>
        <Card>
          <h2 className="mb-4 text-lg font-semibold">Budget vs spend</h2>
          {hydrated && byCategory.length > 0 ? (
            <Suspense fallback={<ChartFallback />}>
              <BudgetBars labels={byCategory.map((row) => row.category)} spent={byCategory.map((row) => Number(row.spent.toFixed(2)))} limits={byCategory.map((row) => row.limit)} currency={currencyCode} />
            </Suspense>
          ) : <ChartFallback />}
        </Card>
      </div>

      <Card>
        <h2 className="mb-4 text-lg font-semibold">Six-month spending trend</h2>
        {hydrated ? (
          <Suspense fallback={<ChartFallback />}>
            <TrendLine labels={trend.map((row) => row.label)} data={trend.map((row) => Number(row.total.toFixed(2)))} currency={currencyCode} />
          </Suspense>
        ) : <ChartFallback />}
      </Card>
    </div>
  );
}
