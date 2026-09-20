import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

import { Card } from "@/components/ui-kit";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SpendSmart — Track expenses, budgets and savings goals" },
      {
        name: "description",
        content:
          "SpendSmart keeps your spending, monthly budgets, savings goals and bill reminders in one private account.",
      },
      { property: "og:title", content: "SpendSmart — Track expenses, budgets and savings goals" },
      {
        property: "og:description",
        content:
          "SpendSmart keeps your spending, monthly budgets, savings goals and bill reminders in one private account.",
      },
    ],
  }),
  component: Landing,
});

const FEATURES = [
  { title: "Expense tracking", text: "Log daily spending by category and edit anything in seconds." },
  { title: "Monthly budgets", text: "Set limits per category and watch progress bars as the month runs." },
  { title: "Savings goals", text: "Set targets, add deposits and see how close you are." },
  { title: "Bill reminders", text: "Keep a to-do list of payments so nothing slips past the due date." },
];

function Landing() {
  const { session, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && session) void navigate({ to: "/dashboard", replace: true });
  }, [session, loading, navigate]);

  return (
    <div className="space-y-12">
      <section className="mx-auto max-w-2xl text-center">
        <h1 className="font-display text-4xl font-semibold sm:text-5xl">
          Every rupee, dollar and euro — in one calm place.
        </h1>
        <p className="mt-4 text-base text-muted-foreground">
          Track spending, plan budgets and grow savings goals. Create a free account and your data
          is saved privately to you, on any device.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/auth" className="btn-primary">
            Create free account
          </Link>
          <Link to="/auth" className="btn-ghost">
            Sign in
          </Link>
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-2">
        {FEATURES.map((f) => (
          <Card key={f.title} className="space-y-2">
            <h2 className="text-lg font-semibold">{f.title}</h2>
            <p className="text-sm text-muted-foreground">{f.text}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
