import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { Card, EmptyState, PageHeader, Progress } from "@/components/ui-kit";
import { useCurrency } from "@/lib/currency";
import { uid, useGoals, type Goal } from "@/lib/finance";

export const Route = createFileRoute("/_authenticated/goals")({
  head: () => ({
    meta: [
      { title: "Savings goals — SpendSmart" },
      { name: "description", content: "Define savings targets and track motivating progress." },
      { property: "og:title", content: "Savings goals — SpendSmart" },
      {
        property: "og:description",
        content: "Define savings targets and track motivating progress.",
      },
    ],
  }),
  component: GoalsPage,
});

function cheer(pct: number) {
  if (pct >= 100) return "Goal reached — time to celebrate!";
  if (pct >= 75) return "Almost there. Keep the streak alive.";
  if (pct >= 40) return "Solid momentum, over a third of the way.";
  if (pct > 0) return "Good start — small deposits add up.";
  return "Add your first deposit to get moving.";
}

function GoalsPage() {
  const { value: goals, setValue: setGoals } = useGoals();
  const { format: currency, symbol } = useCurrency();
  const [form, setForm] = useState({ name: "", target: "", saved: "", deadline: "" });

  function addGoal(event: React.FormEvent) {
    event.preventDefault();
    const target = Number(form.target);
    if (!form.name.trim() || !target || target <= 0) return;
    const goal: Goal = {
      id: uid(),
      name: form.name.trim(),
      target,
      saved: Number(form.saved) || 0,
      deadline: form.deadline || undefined,
    };
    setGoals((prev) => [goal, ...prev]);
    setForm({ name: "", target: "", saved: "", deadline: "" });
  }

  function deposit(id: string, amount: number) {
    setGoals((prev) =>
      prev.map((g) => (g.id === id ? { ...g, saved: Math.max(0, g.saved + amount) } : g)),
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader title="Savings goals" subtitle="Name the thing you are saving for, then chip away at it." />

      <Card>
        <h2 className="mb-4 text-lg font-semibold">New goal</h2>
        <form onSubmit={addGoal} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <input
            className="field lg:col-span-2"
            placeholder="Goal name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            className="field"
            type="number"
            min="0"
            placeholder={`Target (${symbol})`}
            value={form.target}
            onChange={(e) => setForm({ ...form, target: e.target.value })}
          />
          <input
            className="field"
            type="number"
            min="0"
            placeholder="Already saved"
            value={form.saved}
            onChange={(e) => setForm({ ...form, saved: e.target.value })}
          />
          <input
            className="field"
            type="date"
            value={form.deadline}
            onChange={(e) => setForm({ ...form, deadline: e.target.value })}
          />
          <button type="submit" className="btn-primary sm:col-span-2 lg:col-span-1">
            Add goal
          </button>
        </form>
      </Card>

      {goals.length === 0 ? (
        <EmptyState text="No savings goals yet." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {goals.map((g) => {
            const pct = g.target > 0 ? Math.min(100, (g.saved / g.target) * 100) : 0;
            return (
              <Card key={g.id} className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-semibold">{g.name}</h3>
                    <p className="text-xs text-muted-foreground">
                      {currency(g.saved)} of {currency(g.target)}
                      {g.deadline ? ` · by ${g.deadline}` : ""}
                    </p>
                  </div>
                  <span className="font-display text-xl font-semibold text-primary">
                    {Math.round(pct)}%
                  </span>
                </div>
                <Progress value={pct} tone={pct >= 100 ? "success" : "primary"} />
                <p className="text-sm text-muted-foreground">{cheer(pct)}</p>
                <div className="flex flex-wrap gap-2">
                  <button className="btn-ghost" onClick={() => deposit(g.id, 50)}>
                    + {symbol}50
                  </button>
                  <button className="btn-ghost" onClick={() => deposit(g.id, 100)}>
                    + {symbol}100
                  </button>
                  <button className="btn-ghost" onClick={() => deposit(g.id, -50)}>
                    − {symbol}50
                  </button>
                  <button
                    className="btn-ghost"
                    onClick={() => setGoals((prev) => prev.filter((x) => x.id !== g.id))}
                  >
                    Delete
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
