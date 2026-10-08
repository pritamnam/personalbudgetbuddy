import { createFileRoute } from "@tanstack/react-router";
import { Bell, Globe2, Moon, Monitor, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { CurrencySelect } from "@/lib/currency";
import { usePreferences, type Theme } from "@/lib/preferences";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [
    { title: "Settings — SpendSmart" },
    { name: "description", content: "Choose your currency, appearance and in-app reminder preferences in SpendSmart." },
    { property: "og:title", content: "Settings — SpendSmart" },
    { property: "og:description", content: "Personalize your currency, theme and reminder notifications." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: SettingsPage,
});

const THEMES: { value: Theme; label: string; icon: typeof Sun }[] = [
  { value: "light", label: "Light", icon: Sun }, { value: "dark", label: "Dark", icon: Moon }, { value: "system", label: "System", icon: Monitor },
];

function SettingsPage() {
  const { theme, setTheme, notifications, setNotifications } = usePreferences();
  return <div className="mx-auto max-w-3xl">
    <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary">Make it yours</p>
    <h1 className="text-3xl font-semibold sm:text-4xl">Settings</h1>
    <p className="mt-3 text-muted-foreground">Your preferences, remembered on this device.</p>
    <div className="mt-10 divide-y divide-border border-y border-border">
      <section className="grid gap-5 py-8 sm:grid-cols-[1fr_auto] sm:items-center">
        <div><h2 className="flex items-center gap-2 font-sans text-lg font-semibold"><Globe2 className="size-5 text-primary" />Currency</h2><p className="mt-2 text-sm text-muted-foreground">A consistent currency for expenses, budgets and savings.</p></div>
        <CurrencySelect />
      </section>
      <section className="py-8">
        <h2 className="font-sans text-lg font-semibold">Appearance</h2><p className="mt-2 text-sm text-muted-foreground">Light, dark, or matched to your device.</p>
        <div role="group" aria-label="Theme" className="mt-5 grid max-w-md grid-cols-3 gap-2">{THEMES.map(({ value, label, icon: Icon }) => <Button key={value} variant={theme === value ? "secondary" : "outline"} aria-pressed={theme === value} onClick={() => setTheme(value)} className="h-12 gap-2"><Icon /><span>{label}</span></Button>)}</div>
      </section>
      <section className="flex items-start justify-between gap-5 py-8">
        <div><h2 className="flex items-center gap-2 font-sans text-lg font-semibold"><Bell className="size-5 text-primary" />Notifications</h2><label htmlFor="reminder-notifications" className="mt-3 block text-sm font-medium">Due reminder alerts</label><p className="mt-2 max-w-md text-sm text-muted-foreground">Show due and overdue reminders while you’re using SpendSmart. No emails or background notifications.</p></div>
        <Switch id="reminder-notifications" checked={notifications} onCheckedChange={setNotifications} className="mt-1" />
      </section>
    </div>
  </div>;
}