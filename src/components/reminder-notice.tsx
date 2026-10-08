import { Link } from "@tanstack/react-router";
import { Bell } from "lucide-react";
import { useTasks } from "@/lib/finance";
import { usePreferences } from "@/lib/preferences";
import { dueReminderCount } from "@/lib/notification-preferences";

export function ReminderNotice() {
  const { notifications } = usePreferences();
  const { value: tasks, ready } = useTasks();
  const date = new Date();
  const today = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  const count = dueReminderCount(tasks, today);
  if (!notifications || !ready || count === 0) return null;
  return <div role="status" className="mb-6 flex flex-wrap items-center gap-3 border-l-2 border-primary bg-secondary px-4 py-3 text-sm text-secondary-foreground"><Bell className="size-4 shrink-0" /><span>{count} {count === 1 ? "reminder is" : "reminders are"} due or overdue.</span><Link to="/reminders" className="ml-auto font-semibold underline underline-offset-4">View reminders</Link></div>;
}