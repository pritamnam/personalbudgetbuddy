import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { Card, EmptyState, PageHeader } from "@/components/ui-kit";
import { uid, useTasks, type Task } from "@/lib/finance";

export const Route = createFileRoute("/_authenticated/reminders")({
  head: () => ({
    meta: [
      { title: "Reminders — SpendSmart" },
      { name: "description", content: "A simple to-do list for bills and money tasks." },
      { property: "og:title", content: "Reminders — SpendSmart" },
      { property: "og:description", content: "A simple to-do list for bills and money tasks." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RemindersPage,
});

function RemindersPage() {
  const { value: tasks, setValue: setTasks } = useTasks();
  const [form, setForm] = useState({ title: "", due: new Date().toISOString().slice(0, 10) });

  function add(event: React.FormEvent) {
    event.preventDefault();
    if (!form.title.trim()) return;
    const task: Task = { id: uid(), title: form.title.trim(), due: form.due, done: false };
    setTasks((prev) => [task, ...prev]);
    setForm({ ...form, title: "" });
  }

  const open = tasks.filter((t) => !t.done);
  const done = tasks.filter((t) => t.done);
  const todayIso = new Date().toISOString().slice(0, 10);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Financial reminders"
        subtitle="Bill payments, transfers, renewals — keep them off your mind and on the list."
      />

        <Card>
          <form onSubmit={add} className="grid gap-3 sm:grid-cols-[1fr_auto_auto]">
            <input
              className="field"
              placeholder="e.g. Pay electricity bill"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
            <input
              className="field"
              type="date"
              value={form.due}
              onChange={(e) => setForm({ ...form, due: e.target.value })}
            />
            <button className="btn-primary" type="submit">
              Add task
            </button>
          </form>
        </Card>

      <Card>
        <h2 className="mb-4 text-lg font-semibold">Open ({open.length})</h2>
        {open.length === 0 ? (
          <EmptyState text="Nothing pending. Nice." />
        ) : (
          <ul className="divide-y divide-border">
            {open.map((t) => (
              <li key={t.id} className="flex items-center gap-3 py-3">
                <input
                  type="checkbox"
                  className="size-4 accent-[var(--color-primary)]"
                  checked={t.done}
                  onChange={() =>
                    setTasks((prev) =>
                      prev.map((x) => (x.id === t.id ? { ...x, done: !x.done } : x)),
                    )
                  }
                />
                <div className="flex-1">
                  <p className="font-medium">{t.title}</p>
                  <p
                    className={`text-xs ${t.due < todayIso ? "text-destructive" : "text-muted-foreground"}`}
                  >
                    Due {t.due}
                    {t.due < todayIso ? " · overdue" : ""}
                  </p>
                </div>
                  <button
                    className="btn-ghost"
                    onClick={() => setTasks((prev) => prev.filter((x) => x.id !== t.id))}
                  >
                    Delete
                  </button>
              </li>
            ))}
          </ul>
        )}
      </Card>

      {done.length > 0 ? (
        <Card>
          <h2 className="mb-4 text-lg font-semibold">Completed ({done.length})</h2>
          <ul className="divide-y divide-border">
            {done.map((t) => (
              <li key={t.id} className="flex items-center gap-3 py-3">
                <input
                  type="checkbox"
                   className="size-4 accent-[var(--color-primary)]"
                  checked
                  onChange={() =>
                    setTasks((prev) =>
                      prev.map((x) => (x.id === t.id ? { ...x, done: false } : x)),
                    )
                  }
                />
                <span className="flex-1 text-sm text-muted-foreground line-through">{t.title}</span>
                  <button
                    className="btn-ghost"
                    onClick={() => setTasks((prev) => prev.filter((x) => x.id !== t.id))}
                  >
                    Delete
                  </button>
              </li>
            ))}
          </ul>
        </Card>
      ) : null}
    </div>
  );
}
