import { useLanguage } from "@/lib/language";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  BarChart3,
  Bell,
  LayoutDashboard,
  LogIn,
  Menu,
  PiggyBank,
  ReceiptText,
  WalletCards,
  Lightbulb,
  Settings,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const ITEMS = [
  { to: "/", label: "Advisory", icon: Lightbulb },
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/expenses", label: "Expenses", icon: ReceiptText },
  { to: "/budgets", label: "Budgets", icon: WalletCards },
  { to: "/goals", label: "Savings Goals", icon: PiggyBank },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/reminders", label: "Reminders", icon: Bell },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

export function FinanceNavigation({ onLogIn }: { onLogIn?: (() => void) | undefined }) {
  const { t, m, locale, date } = useLanguage();
  const { t } = useLanguage();
  const currentPath = useRouterState({ select: (router) => router.location.pathname });
  const isActive = (path: string) => currentPath === path;
  const activeItem = ITEMS.find((item) => isActive(item.to));

  return (
    <>
      <nav className="hidden items-center gap-1 2xl:flex" aria-label={t("Finance sections")}>
        {ITEMS.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            aria-current={isActive(item.to) ? "page" : undefined}
            className={cn(
              "rounded-md px-2.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              isActive(item.to) && "bg-secondary text-secondary-foreground",
            )}
          >
            {t(item.label)}
          </Link>
        ))}
        {onLogIn && <Button type="button" variant="ghost" size="sm" onClick={onLogIn} className="text-muted-foreground">{t("Log In")}</Button>}
      </nav>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="outline"
            size="sm"
             className="max-w-40 gap-2 2xl:hidden"
            aria-label={`${t("Open navigation menu")}${activeItem ? `, ${t("Current section")}: ${t(activeItem.label)}` : ""}`}
          >
            <Menu aria-hidden="true" />
            <span className="max-w-28 truncate">{activeItem?.label ?? t("Menu")}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 p-1.5">
          {ITEMS.map((item) => (
            <DropdownMenuItem key={item.to} asChild>
              <Link
                to={item.to}
                aria-current={isActive(item.to) ? "page" : undefined}
                className={cn(
                  "flex w-full cursor-pointer items-center gap-3 rounded-sm px-2.5 py-2.5 font-medium",
                  isActive(item.to) && "bg-secondary text-secondary-foreground",
                )}
              >
                <item.icon aria-hidden="true" />
                <span>{t(item.label)}</span>
              </Link>
            </DropdownMenuItem>
          ))}
          {onLogIn && <DropdownMenuItem onSelect={onLogIn} className="cursor-pointer gap-3 px-2.5 py-2.5 font-medium"><LogIn aria-hidden="true" /><span>{t("Log In")}</span></DropdownMenuItem>}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
