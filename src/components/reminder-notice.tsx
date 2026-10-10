import { Link } from "@tanstack/react-router";
import { Bell } from "lucide-react";
import { useTasks } from "@/lib/finance";
import { usePreferences } from "@/lib/preferences";
import { dueReminderCount } from "@/lib/notification-preferences";
import { useLanguage } from "@/lib/language";

export function ReminderNotice() {
  const { t, m } = useLanguage();
  const { notifications } = usePreferences();
  const { value: tasks, ready } = useTasks();
  const date = new Date();
  const today = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  const count = dueReminderCount(tasks, today);
  if (!notifications || !ready || count === 0) return null;
  return <div role="status" className="mb-6 flex flex-wrap items-center gap-3 border-l-2 border-primary bg-secondary px-4 py-3 text-sm text-secondary-foreground"><Bell className="size-4 shrink-0" /><span>{m("dueReminders", {count})}</span><Link to="/reminders" className="ml-auto font-semibold underline underline-offset-4">{t("View reminders")}</Link></div>;
}