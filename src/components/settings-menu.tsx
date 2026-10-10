import { useLanguage } from "@/lib/language";
import { Link } from "@tanstack/react-router";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SettingsMenu() {
  const { t, m, locale, date } = useLanguage();
  return (
    <Button variant="ghost" size="icon" asChild>
      <Link to="/settings" aria-label={t("Settings")} title={t("Settings")} activeProps={{ className: "bg-secondary text-secondary-foreground" }}><Settings /></Link>
    </Button>
  );
}
