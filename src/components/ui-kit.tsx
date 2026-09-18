import { useEffect, useState, type ReactNode } from "react";

export function useHydrated() {
  const [h, setH] = useState(false);
  useEffect(() => setH(true), []);
  return h;
}

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-3xl font-semibold sm:text-4xl">{title}</h1>
        {subtitle ? <p className="mt-2 max-w-xl text-sm text-muted-foreground">{subtitle}</p> : null}
      </div>
      {action}
    </header>
  );
}

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <section className={`card-surface p-5 sm:p-6 ${className}`}>{children}</section>;
}

export function StatCard({
  label,
  value,
  hint,
  tone = "default",
}: {
  label: string;
  value: string;
  hint?: string;
  tone?: "default" | "positive" | "negative";
}) {
  const toneClass =
    tone === "positive"
      ? "text-success"
      : tone === "negative"
        ? "text-destructive"
        : "text-foreground";
  return (
    <Card className="flex flex-col gap-1">
      <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <span className={`font-display text-2xl font-semibold sm:text-3xl ${toneClass}`}>{value}</span>
      {hint ? <span className="text-xs text-muted-foreground">{hint}</span> : null}
    </Card>
  );
}

export function Progress({
  value,
  tone = "primary",
}: {
  value: number;
  tone?: "primary" | "accent" | "danger" | "success";
}) {
  const pct = Math.max(0, Math.min(100, value));
  const bg =
    tone === "danger"
      ? "bg-destructive"
      : tone === "accent"
        ? "bg-accent"
        : tone === "success"
          ? "bg-success"
          : "bg-primary";
  return (
    <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
      <div
        className={`h-full rounded-full ${bg} transition-[width] duration-500`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

export function EmptyState({ text }: { text: string }) {
  return (
    <p className="rounded-lg border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">
      {text}
    </p>
  );
}
